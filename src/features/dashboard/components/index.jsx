import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import {
  Users,
  Building,
  Hourglass,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStore } from '@/features/dashboard/store/useDashboardStore'
import { useCommonStore } from '@/store/useCommonStore'

export function DashboardModule() {
  const {
    totalEmployee,
    totalDepartment,
    averageAge,
    listDepartmentStats,
    isLoading,
    hasError,
    onGetDashboardSummary,
  } = useDashboardStore(
    useShallow((state) => ({
      totalEmployee: state.totalEmployee,
      totalDepartment: state.totalDepartment,
      averageAge: state.averageAge,
      listDepartmentStats: state.listDepartmentStats,
      isLoading: state.isLoading,
      hasError: state.hasError,
      onGetDashboardSummary: state.onGetDashboardSummary,
    }))
  )

  const theme = useCommonStore((state) => state.theme)

  useEffect(() => {
    onGetDashboardSummary()
  }, [onGetDashboardSummary])

  const handleRetry = () => {
    onGetDashboardSummary()
  }

  // Early return: state loading (Shadcn Skeleton)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Early return: state error dengan tombol "Coba Lagi"
  if (hasError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h3 className="text-lg font-semibold text-foreground">
          Gagal Memuat Data Dashboard
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Tidak dapat mengambil ringkasan data statistik karyawan dari server.
        </p>
        <Button
          onClick={handleRetry}
          variant="outline"
          className="mt-2 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Karyawan',
      value: totalEmployee,
      description: 'Karyawan aktif terdaftar',
      icon: Users,
    },
    {
      title: 'Jumlah Departemen',
      value: totalDepartment,
      description: 'Divisi operasional aktif',
      icon: Building,
    },
    {
      title: 'Rata-rata Usia',
      value: `${averageAge} thn`,
      description: 'Rentang usia produktif tim',
      icon: Hourglass,
    },
    {
      title: 'Status Sinkronisasi',
      value: 'Online',
      description: 'Data real-time DummyJSON',
      icon: TrendingUp,
    },
  ]

  const chartBarColor = theme === 'dark' ? '#38bdf8' : '#2563eb'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Ringkasan Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ikhtisar metrik karyawan, sebaran departemen, dan demografi tim.
        </p>
      </div>

      {/* Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Grafik Batang Karyawan Per Departemen */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            Sebaran Karyawan per Departemen
          </CardTitle>
          <CardDescription>
            Jumlah staf yang bertugas di masing-masing departemen perusahaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={listDepartmentStats}
                margin={{ top: 10, right: 20, left: -10, bottom: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="department"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={60}
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-popover p-2 shadow-md text-xs">
                          <p className="font-semibold text-popover-foreground">
                            {data.department}
                          </p>
                          <p className="text-primary mt-1">
                            {data.count} Karyawan
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={chartBarColor}
                  radius={[4, 4, 0, 0]}
                  name="Jumlah Karyawan"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardModule
