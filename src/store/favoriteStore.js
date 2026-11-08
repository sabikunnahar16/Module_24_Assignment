import { create } from 'zustand';

const STORAGE_KEY = 'peoplehub-favorites';

function getStoredFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const useFavoriteStore = create((set) => ({
  favorites: getStoredFavorites(),
  addFavorite: (user) =>
    set((state) => ({
      favorites: state.favorites.some((favorite) => favorite.id === user.id)
        ? state.favorites
        : [...state.favorites, user],
    })),
  removeFavorite: (userId) =>
    set((state) => ({
      favorites: state.favorites.filter((favorite) => favorite.id !== userId),
    })),
}));

export { STORAGE_KEY };
