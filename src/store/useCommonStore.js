import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCommonStore = create(
  persist(
    (set) => ({
      theme: 'light',
      isSidebarOpen: true,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      onToggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      toggleSidebar: () =>
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),

      onToggleSidebar: () =>
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),

      onSetSidebarOpen: (isOpen) =>
        set(() => ({
          isSidebarOpen: isOpen,
        })),
    }),
    {
      name: 'hrlite-common',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
