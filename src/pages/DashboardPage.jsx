import { lazy } from 'react'

const DashboardModule = lazy(
  () => import('@/features/dashboard/components/index')
)

export const dashboardRoutes = [
  {
    path: '/dashboard',
    element: <DashboardModule />,
  },
]

export default dashboardRoutes

