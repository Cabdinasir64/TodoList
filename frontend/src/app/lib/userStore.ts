import { create } from 'zustand';

interface UserState {
    username: string;
    setUser: (name: string) => void;
    logout: () => void;
}

export const useStore = create<UserState>((set) => ({
    username: '',
    setUser: (name) => set({ username: name }),
    logout: () => set({ username: '' }),
}));
