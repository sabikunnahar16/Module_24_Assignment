import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY, useFavoriteStore } from './store/favoriteStore';

const USERS_API = 'https://jsonplaceholder.typicode.com/users';

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
          <div><span>Address</span><strong>{user.address.suite}, {user.address.street}, {user.address.city}</strong></div>
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
        setUsers(await response.json());
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
