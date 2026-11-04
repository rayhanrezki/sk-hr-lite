import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { useCommonStore } from '@/store/useCommonStore'
import { cn } from '@/lib/utils'

export function MainLayout() {
  const isSidebarOpen = useCommonStore((state) => state.isSidebarOpen)

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          isSidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
