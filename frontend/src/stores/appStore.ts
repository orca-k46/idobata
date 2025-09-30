import { create } from 'zustand';
import { Team } from '../types/team';
import { Document } from '../types/document';

interface User {
  id: string;
  name: string;
  email?: string;
  profileImage?: string;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Teams state
  teams: Team[];
  currentTeam: Team | null;

  // Documents state
  recentDocuments: Document[];
  currentDocument: Document | null;

  // UI state
  sidebarOpen: boolean;
  darkMode: boolean;

  // Search state
  searchQuery: string;
  searchResults: Document[];
  isSearching: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setTeams: (teams: Team[]) => void;
  setCurrentTeam: (team: Team | null) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  setRecentDocuments: (documents: Document[]) => void;
  setCurrentDocument: (document: Document | null) => void;
  addRecentDocument: (document: Document) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Document[]) => void;
  setIsSearching: (searching: boolean) => void;
  clearSearch: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  teams: [],
  currentTeam: null,
  recentDocuments: [],
  currentDocument: null,
  sidebarOpen: true,
  darkMode: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  // Actions
  setUser: (user) => set({ user }),

  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

  setTeams: (teams) => set({ teams }),

  setCurrentTeam: (team) => set({ currentTeam: team }),

  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),

  updateTeam: (id, updates) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team._id === id ? { ...team, ...updates } : team
      ),
      currentTeam:
        state.currentTeam?._id === id
          ? { ...state.currentTeam, ...updates }
          : state.currentTeam,
    })),

  removeTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((team) => team._id !== id),
      currentTeam: state.currentTeam?._id === id ? null : state.currentTeam,
    })),

  setRecentDocuments: (documents) => set({ recentDocuments: documents }),

  setCurrentDocument: (document) => set({ currentDocument: document }),

  addRecentDocument: (document) =>
    set((state) => {
      const filtered = state.recentDocuments.filter(
        (doc) => doc._id !== document._id
      );
      return {
        recentDocuments: [document, ...filtered].slice(0, 10), // Keep only 10 recent documents
      };
    }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setDarkMode: (dark) => set({ darkMode: dark }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSearchResults: (results) => set({ searchResults: results }),

  setIsSearching: (searching) => set({ isSearching: searching }),

  clearSearch: () =>
    set({
      searchQuery: '',
      searchResults: [],
      isSearching: false,
    }),
}));

// Selectors for common derived state
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTeams = () => useAppStore((state) => state.teams);
export const useCurrentTeam = () => useAppStore((state) => state.currentTeam);
export const useRecentDocuments = () => useAppStore((state) => state.recentDocuments);
export const useCurrentDocument = () => useAppStore((state) => state.currentDocument);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useDarkMode = () => useAppStore((state) => state.darkMode);
export const useSearchState = () =>
  useAppStore((state) => ({
    query: state.searchQuery,
    results: state.searchResults,
    isSearching: state.isSearching,
  }));

// Actions
export const useAppActions = () =>
  useAppStore((state) => ({
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated,
    setTeams: state.setTeams,
    setCurrentTeam: state.setCurrentTeam,
    addTeam: state.addTeam,
    updateTeam: state.updateTeam,
    removeTeam: state.removeTeam,
    setRecentDocuments: state.setRecentDocuments,
    setCurrentDocument: state.setCurrentDocument,
    addRecentDocument: state.addRecentDocument,
    setSidebarOpen: state.setSidebarOpen,
    toggleSidebar: state.toggleSidebar,
    setDarkMode: state.setDarkMode,
    toggleDarkMode: state.toggleDarkMode,
    setSearchQuery: state.setSearchQuery,
    setSearchResults: state.setSearchResults,
    setIsSearching: state.setIsSearching,
    clearSearch: state.clearSearch,
  }));