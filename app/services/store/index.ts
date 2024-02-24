import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SubredditFavorite = {
  id?: string;
  name: string;
  icon?: string | null;
  title?: string | null;
  description?: string | null;
};

interface FavoriteState {
  favorites: SubredditFavorite[];
  addToFavorites: (entry: SubredditFavorite) => void;
  removeFromFavorite: (entry: SubredditFavorite) => void;
}

const createSubredditSlice: StateCreator<FavoriteState> = (set) => ({
  favorites: [],
  addToFavorites: (entry) =>
    set((state) => ({
      favorites: [...state.favorites, entry],
    })),
  removeFromFavorite: (entry) =>
    set((state) => ({
      favorites: state.favorites.filter((e) => e.name !== entry.name),
    })),
});

interface SettingsState {
  useLowRes: boolean;
  setUseLowRes: (entry: boolean) => void;
}

const createSettingsSlice: StateCreator<SettingsState> = (set) => ({
  useLowRes: false,
  setUseLowRes: (entry) => set(() => ({ useLowRes: entry })),
});

type SavedPost = {
  kind: 't3';
  data: {
    id: string;
  };
};

interface SavedPostState {
  savedPosts: SavedPost[];
  addToSavedPosts: (entry: SavedPost) => void;
  removeFromSavedPosts: (entry: SavedPost) => void;
}

const createSavedPostSlice: StateCreator<SavedPostState> = (set) => ({
  savedPosts: [],
  addToSavedPosts: (entry) =>
    set((state) => ({
      savedPosts: [entry, ...state.savedPosts],
    })),
  removeFromSavedPosts: (entry) =>
    set((state) => ({
      savedPosts: state.savedPosts.filter((e) => e.data.id !== entry.data.id),
    })),
});

export const useStore = create<FavoriteState & SettingsState & SavedPostState>()(
  persist(
    (...a) => ({
      ...createSubredditSlice(...a),
      ...createSettingsSlice(...a),
      ...createSavedPostSlice(...a),
    }),

    {
      name: 'favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
