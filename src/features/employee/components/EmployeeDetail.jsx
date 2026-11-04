import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  User,
  AlertCircle,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useEmployeeStore } from '@/features/employee/store/useEmployeeStore'
import { EmployeeFormDialog } from '@/features/employee/components/EmployeeFormDialog'

function formatAddress(address) {
  if (!address) return 'Alamat tidak tersedia'
  if (typeof address === 'string') return address
  const parts = [
    address.address,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Alamat tidak tersedia'
}

export function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    selectedEmployee,
    isLoading,
    hasError,
    onGetEmployeeDetail,
    onOpenForm,
  } = useEmployeeStore(
    useShallow((state) => ({
      selectedEmployee: state.selectedEmployee,
      isLoading: state.isLoading,
      hasError: state.hasError,
      onGetEmployeeDetail: state.onGetEmployeeDetail,
      onOpenForm: state.onOpenForm,
    }))
  )

  useEffect(() => {
    if (id) {
      onGetEmployeeDetail(id).catch(() => {})
    }
  }, [id, onGetEmployeeDetail])

  const handleBack = () => {
    navigate('/employee')
  }

  const handleEdit = () => {
    if (selectedEmployee) {
      onOpenForm(selectedEmployee)
    }
  }

  // Early return: state loading (Shadcn Skeleton)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Early return: state error / kondisi ID tidak ditemukan
  if (hasError || !selectedEmployee) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-xl font-semibold text-foreground">
          Karyawan Tidak Ditemukan
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Data karyawan dengan ID #{id} tidak ditemukan di sistem atau telah
          dihapus.
        </p>
        <Button onClick={handleBack} variant="outline" className="mt-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Karyawan
        </Button>
      </div>
    )
  }

  const fullName =
    `${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`.trim()
  const avatarUrl =
    selectedEmployee.image ||
    `https://dummyjson.com/icon/${encodeURIComponent(selectedEmployee.firstName || 'user')}/128`

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="w-fit flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Karyawan
        </Button>

        <Button
          onClick={handleEdit}
          size="sm"
          className="w-fit flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Ubah Data Karyawan
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-6">
          <img
            src={avatarUrl}
            alt={fullName}
            className="h-24 w-24 rounded-full border-2 border-border object-cover bg-muted shadow-sm"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
            }}
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl font-bold">{fullName}</CardTitle>
              {selectedEmployee.company?.department && (
                <Badge variant="secondary">
                  {selectedEmployee.company.department}
                </Badge>
              )}
            </div>
            <CardDescription className="text-base text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {selectedEmployee.company?.title || 'Karyawan'}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Pribadi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Data Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Usia
              </span>
              <span className="font-medium">
                {selectedEmployee.age ? `${selectedEmployee.age} Tahun` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Jenis Kelamin</span>
              <span className="font-medium capitalize">
                {selectedEmployee.gender || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </span>
              <span className="font-medium">
                {selectedEmployee.email || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telepon
              </span>
              <span className="font-medium">
                {selectedEmployee.phone || '-'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Info Perusahaan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Info Perusahaan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Nama Perusahaan</span>
              <span className="font-medium">
                {selectedEmployee.company?.name || 'HRLite Corp'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Departemen</span>
              <span className="font-medium">
                {selectedEmployee.company?.department || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Jabatan / Role</span>
              <span className="font-medium">
                {selectedEmployee.company?.title ||
                  selectedEmployee.role ||
                  'Staff'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Info Alamat */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Alamat Lengkap
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground leading-relaxed">
              {formatAddress(selectedEmployee.address)}
            </p>
          </CardContent>
        </Card>
      </div>

      <EmployeeFormDialog />
    </div>
  )
}

export default EmployeeDetail
