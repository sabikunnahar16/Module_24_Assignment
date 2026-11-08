import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY, useFavoriteStore } from './store/favoriteStore';

const USERS_API = 'https://jsonplaceholder.typicode.com/users';

const LOCALIZED_PROFILES = {
  1: {
    name: 'আয়েশা রহমান',
    username: 'ayesha.rahman',
    address: { suite: 'ফ্ল্যাট ৪বি', street: 'গুলশান এভিনিউ', city: 'ঢাকা', zipcode: '1212', country: 'বাংলাদেশ' },
  },
  2: {
    name: 'রাফি হাসান',
    username: 'rafi.hasan',
    address: { suite: 'বাড়ি ১২', street: 'জিইসি মোড়', city: 'চট্টগ্রাম', zipcode: '4000', country: 'বাংলাদেশ' },
  },
  3: {
    name: 'নুসরাত জাহান',
    username: 'nusrat.jahan',
    address: { suite: 'বাড়ি ৮', street: 'শাহ মখদুম অ্যাভিনিউ', city: 'রাজশাহী', zipcode: '6000', country: 'বাংলাদেশ' },
  },
  4: {
    name: 'তানভীর আহমেদ',
    username: 'tanvir.ahmed',
    address: { suite: 'অ্যাপার্টমেন্ট ৫এ', street: 'বনানী রোড ১১', city: 'ঢাকা', zipcode: '1213', country: 'বাংলাদেশ' },
  },
  5: {
    name: 'সুমাইয়া আক্তার',
    username: 'sumaiya.akter',
    address: { suite: 'বাড়ি ২১', street: 'জুবিলি রোড', city: 'সিলেট', zipcode: '3100', country: 'বাংলাদেশ' },
  },
  6: {
    name: 'ওমর ফারুক',
    username: 'omar.faruk',
    address: { suite: 'Unit 8', street: 'George Street', city: 'Sydney', zipcode: '2000', country: 'Australia' },
  },
  7: {
    name: 'মেহজাবিন চৌধুরী',
    username: 'mehjabin.chowdhury',
    address: { suite: 'Apt 12', street: 'Baker Street', city: 'London', zipcode: 'NW1 6XE', country: 'United Kingdom' },
  },
  8: {
    name: 'ইমরান কবির',
    username: 'imran.kabir',
    address: { suite: 'Apt 4C', street: '5th Avenue', city: 'New York', zipcode: '10001', country: 'United States' },
  },
  9: {
    name: 'ফারহানা নাজ',
    username: 'farhana.naz',
    address: { suite: 'Block B, 3rd Floor', street: 'Gulberg Main Boulevard', city: 'Lahore', zipcode: '54660', country: 'Pakistan' },
  },
  10: {
    name: 'সাদিয়া ইসলাম',
    username: 'sadia.islam',
    address: { suite: 'Floor 2', street: 'Orchard Road', city: 'Singapore', zipcode: '238823', country: 'Singapore' },
  },
};

function UserAvatar({ user, large = false }) {
  return (
    <div className={`avatar ${large ? 'avatar-large' : ''}`} aria-hidden="true">
      {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
    </div>
  );
}

function UserCard({ user, isFavorite, onDetails, onToggleFavorite }) {
  return (
    <article className="user-card">
      <div className="card-top">
        <UserAvatar user={user} />
        <button
          className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          onClick={() => onToggleFavorite(user)}
          aria-label={`${isFavorite ? 'Remove' : 'Add'} ${user.name} ${isFavorite ? 'from' : 'to'} favorites`}
        >
          <span>{isFavorite ? '★' : '☆'}</span>
          {isFavorite ? 'Favorited' : 'Favorite'}
        </button>
      </div>
      <h2>{user.name}</h2>
      <p className="username">@{user.username}</p>
      <div className="contact-row">
        <span className="contact-icon">✉</span>
        <span>{user.email}</span>
      </div>
      <div className="contact-row">
        <span className="contact-icon">☎</span>
        <span>{user.phone}</span>
      </div>
      <button className="details-button" onClick={() => onDetails(user)}>
        View details <span>→</span>
      </button>
    </article>
  );
}

function DetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-button" onClick={onClose} aria-label="Close user details">×</button>
        <UserAvatar user={user} large />
        <p className="eyebrow">USER PROFILE</p>
        <h2 id="details-title">{user.name}</h2>
        <p className="username">@{user.username}</p>
        <div className="detail-list">
          <div><span>Email</span><strong>{user.email}</strong></div>
          <div><span>Phone</span><strong>{user.phone}</strong></div>
          <div><span>Website</span><strong>{user.website}</strong></div>
          <div><span>Company</span><strong>{user.company.name}</strong></div>
          <div><span>Address</span><strong>{user.address.suite}, {user.address.street}, {user.address.city}, {user.address.zipcode}</strong></div>
          <div><span>Country</span><strong>{user.address.country}</strong></div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setStatus('loading');
        const response = await fetch(USERS_API);
        if (!response.ok) throw new Error('Unable to fetch users.');
        const apiUsers = await response.json();
        setUsers(apiUsers.map((user) => ({
          ...user,
          ...LOCALIZED_PROFILES[user.id],
          address: { ...user.address, ...LOCALIZED_PROFILES[user.id].address },
        })));
        setStatus('success');
      } catch (fetchError) {
        setError(fetchError.message);
        setStatus('error');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const displayedUsers = useMemo(
    () => (showFavoritesOnly ? favorites : users),
    [favorites, showFavoritesOnly, users],
  );

  const toggleFavorite = (user) => {
    if (favorites.some((favorite) => favorite.id === user.id)) {
      removeFavorite(user.id);
    } else {
      addFavorite(user);
    }
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-mark">P</span>
          <span>People<span className="brand-accent">Hub</span></span>
        </a>
        <div className="nav-stats">
          <span><strong>{users.length}</strong> Total users</span>
          <button className="favorite-count" onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
            <strong>★ {favorites.length}</strong> Favorites
          </button>
        </div>
      </nav>

      <main className="main-content">
        <header className="hero">
          <div>
            <p className="eyebrow">PEOPLE DIRECTORY</p>
            <h1>Meet your <em>community.</em></h1>
            <p className="hero-copy">Browse your people, discover their details, and save the ones you want to keep close.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="art-dot dot-one" /><span className="art-dot dot-two" /><span className="art-dot dot-three" />
            <div className="art-card"><span>✦</span><b>10</b><small>PEOPLE</small></div>
          </div>
        </header>

        <section className="directory-header">
          <div>
            <h2>{showFavoritesOnly ? 'Your favorites' : 'All people'}</h2>
            <p>{showFavoritesOnly ? 'The people you marked as favorites.' : 'A little bit about everyone.'}</p>
          </div>
          <button className={`filter-button ${showFavoritesOnly ? 'active' : ''}`} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
            <span>★</span> {showFavoritesOnly ? 'Show everyone' : 'Show favorites'}
          </button>
        </section>

        {status === 'loading' && (
          <div className="state-message"><div className="spinner" /><p>Finding your people...</p></div>
        )}
        {status === 'error' && (
          <div className="state-message error-state"><p>{error}</p><button onClick={() => window.location.reload()}>Try again</button></div>
        )}
        {status === 'success' && displayedUsers.length === 0 && (
          <div className="state-message"><p>No favorites yet. Tap the star on a person to save them here.</p></div>
        )}
        {status === 'success' && displayedUsers.length > 0 && (
          <section className="user-grid" aria-label="User directory">
            {displayedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isFavorite={favorites.some((favorite) => favorite.id === user.id)}
                onDetails={setSelectedUser}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </section>
        )}
      </main>
      <footer><span>PeopleHub</span> · Built with React, Zustand &amp; a little curiosity.</footer>
      <DetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}

export default App;
