import { create } from 'zustand';

interface MobileMenuStore {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
}

export const useMobileMenuStore = create<MobileMenuStore>((set) => ({
    isMobileMenuOpen: false,
    setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));