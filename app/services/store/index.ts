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

export enum DataUsage {
  All,
  Reduced,
  None,
}
interface SettingsState {
  dataUsage: DataUsage;
  setDataUsage: (entry: DataUsage) => void;
}

const createSettingsSlice: StateCreator<SettingsState> = (set) => ({
  dataUsage: DataUsage.All,
  setDataUsage: (entry) => set(() => ({ dataUsage: entry })),
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

type ColorScheme = 'os' | 'dark' | 'light' | 'amoled';

interface ColorSchemeState {
  colorScheme: ColorScheme;
  updateColorScheme: (entry: ColorScheme) => void;
}

const createColorSchemeSlice: StateCreator<ColorSchemeState> = (set) => ({
  colorScheme: 'os',
  updateColorScheme: (entry) => set(() => ({ colorScheme: entry })),
});

export const useStore = create<FavoriteState & SettingsState & SavedPostState & ColorSchemeState>()(
  persist(
    (...a) => ({
      ...createSubredditSlice(...a),
      ...createSettingsSlice(...a),
      ...createSavedPostSlice(...a),
      ...createColorSchemeSlice(...a),
    }),

    {
      name: 'favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
