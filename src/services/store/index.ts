import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SUBREDDITS } from './fixtures';

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
  updateFavorite: (entry: SubredditFavorite) => void;
}

const createSubredditSlice: StateCreator<FavoriteState> = (set) => ({
  favorites: SUBREDDITS,
  addToFavorites: (entry) =>
    set((state) => ({
      favorites: [...state.favorites, entry],
    })),
  removeFromFavorite: (entry) =>
    set((state) => ({
      favorites: state.favorites.filter((e) => e.name !== entry.name),
    })),
  updateFavorite: (entry) =>
    set((state) => {
      const index = state.favorites.findIndex((e) => e.name === entry.name);
      const favorites = [...state.favorites];
      favorites[index] = entry;
      return {
        favorites: favorites,
      };
    }),
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

interface BlockedSubredditState {
  blockedSubreddits: string[];
  addToBlockedSubreddits: (entry: string) => void;
  removeFromBlockedSubreddits: (entry: string) => void;
}

const createBlockSubredditSlice: StateCreator<BlockedSubredditState> = (set) => ({
  blockedSubreddits: [],
  addToBlockedSubreddits: (entry: string) =>
    set((state) => ({
      blockedSubreddits: [entry, ...state.blockedSubreddits],
    })),

  removeFromBlockedSubreddits: (entry: string) =>
    set((state) => ({
      blockedSubreddits: state.blockedSubreddits.filter((e) => e !== entry),
    })),
});

interface BlockedUserState {
  blockedUsers: string[];
  addToBlockedUsers: (entry: string) => void;
  removeFromBlockedUsers: (entry: string) => void;
}

const createBlockUsersSlice: StateCreator<BlockedUserState> = (set) => ({
  blockedUsers: [],
  addToBlockedUsers: (entry: string) =>
    set((state) => ({
      blockedUsers: [entry, ...state.blockedUsers],
    })),

  removeFromBlockedUsers: (entry: string) =>
    set((state) => ({
      blockedUsers: state.blockedUsers.filter((e) => e !== entry),
    })),
});

interface VideoStartSoundState {
  videoStartSound: boolean;
  updateVideoStartSound: (entry: boolean) => void;
}

const createVideoStartSoundSlice: StateCreator<VideoStartSoundState> = (set) => ({
  videoStartSound: false,
  updateVideoStartSound: (entry) => set(() => ({ videoStartSound: entry })),
});

type State = FavoriteState &
  SettingsState &
  SavedPostState &
  ColorSchemeState &
  BlockedSubredditState &
  BlockedUserState &
  VideoStartSoundState;

export const useStore = create<State>()(
  persist(
    (...a) => ({
      ...createSubredditSlice(...a),
      ...createSettingsSlice(...a),
      ...createSavedPostSlice(...a),
      ...createColorSchemeSlice(...a),
      ...createBlockSubredditSlice(...a),
      ...createBlockUsersSlice(...a),
      ...createVideoStartSoundSlice(...a),
    }),

    {
      name: 'storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          (persistedState as State).favorites = [
            ...new Set([...SUBREDDITS, ...(persistedState as State).favorites]),
          ];
        }
        return persistedState as State;
      },
    }
  )
);
