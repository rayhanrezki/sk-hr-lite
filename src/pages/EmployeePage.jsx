import { lazy } from 'react'

const EmployeeModule = lazy(
  () => import('@/features/employee/components/index')
)
const EmployeeDetail = lazy(
  () => import('@/features/employee/components/EmployeeDetail')
)

export const employeeRoutes = [
  {
    path: '/employee',
    element: <EmployeeModule />,
  },
  {
    path: '/employee/:id',
    element: <EmployeeDetail />,
  },
]

export default employeeRoutes
