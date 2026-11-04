import { create } from 'zustand'
import { getDashboardDataApi } from '@/features/dashboard/api/dashboardApi'

export const useDashboardStore = create((set) => ({
  totalEmployee: 0,
  totalDepartment: 0,
  averageAge: 0,
  listDepartmentStats: [],
  isLoading: false,
  hasError: false,

  onGetDashboardSummary: async () => {
    set(() => ({ isLoading: true, hasError: false }))

    try {
      const data = await getDashboardDataApi()
      const users = data.users || []

      const totalEmployee = data.total || users.length
      const deptCounts = {}
      let totalAge = 0
      let validAgeCount = 0

      users.forEach((user) => {
        const dept = user.company?.department || 'Other'
        deptCounts[dept] = (deptCounts[dept] || 0) + 1

        if (user.age) {
          totalAge += Number(user.age)
          validAgeCount += 1
        }
      })

      const listDepartmentStats = Object.keys(deptCounts).map((dept) => ({
        department: dept,
        count: deptCounts[dept],
      }))

      // Sort descending by count
      listDepartmentStats.sort((a, b) => b.count - a.count)

      const totalDepartment = Object.keys(deptCounts).length
      const averageAge =
        validAgeCount > 0 ? Math.round((totalAge / validAgeCount) * 10) / 10 : 0

      set(() => ({
        totalEmployee,
        totalDepartment,
        averageAge,
        listDepartmentStats,
        isLoading: false,
        hasError: false,
      }))
    } catch {
      set(() => ({
        isLoading: false,
        hasError: true,
      }))
    }
  },
}))
