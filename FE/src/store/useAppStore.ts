import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  activeMenu: 'dashboard',
  setActiveMenu: (menu) => set({ activeMenu: menu }),
}));

export default useAppStore;