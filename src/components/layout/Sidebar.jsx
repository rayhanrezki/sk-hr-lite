import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { useCommonStore } from '@/store/useCommonStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const isSidebarOpen = useCommonStore((state) => state.isSidebarOpen)
  const toggleSidebar = useCommonStore((state) => state.toggleSidebar)
  const theme = useCommonStore((state) => state.theme)
  const toggleTheme = useCommonStore((state) => state.toggleTheme)

  const handleToggleSidebar = () => {
    toggleSidebar()
  }

  const handleToggleTheme = () => {
    toggleTheme()
  }

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/employee',
      label: 'Karyawan',
      icon: Users,
    },
  ]

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen border-r bg-card transition-all duration-300 flex flex-col justify-between',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div>
        <div className="flex h-16 items-center justify-between border-b px-4">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                HR
              </div>
              <span className="font-semibold text-lg tracking-tight">
                HRLite
              </span>
            </div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              HR
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSidebar}
            aria-label="Toggle Sidebar"
            className={cn(!isSidebarOpen && 'hidden')}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        {!isSidebarOpen && (
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              aria-label="Open Sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        <nav className="space-y-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    !isSidebarOpen && 'justify-center px-2'
                  )
                }
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-3">
        <Button
          variant="outline"
          size={isSidebarOpen ? 'default' : 'icon'}
          onClick={handleToggleTheme}
          className={cn('w-full flex items-center justify-center gap-2')}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 text-amber-500" />
              {isSidebarOpen && <span>Mode Terang</span>}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              {isSidebarOpen && <span>Mode Gelap</span>}
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

export default Sidebar
