import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  UserX,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useEmployeeStore } from '@/features/employee/store/useEmployeeStore'
import { DeleteEmployeeDialog } from '@/features/employee/components/DeleteEmployeeDialog'

function renderFullName(emp) {
  return `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Tanpa Nama'
}

export function EmployeeTable() {
  const navigate = useNavigate()

  const {
    listEmployee,
    total,
    page,
    selectedDepartment,
    isLoading,
    hasError,
    onGetListEmployee,
    onSetPage,
    onOpenForm,
  } = useEmployeeStore(
    useShallow((state) => ({
      listEmployee: state.listEmployee,
      total: state.total,
      page: state.page,
      selectedDepartment: state.selectedDepartment,
      isLoading: state.isLoading,
      hasError: state.hasError,
      onGetListEmployee: state.onGetListEmployee,
      onSetPage: state.onSetPage,
      onOpenForm: state.onOpenForm,
    }))
  )

  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Derived state: dihitung dengan useMemo, bukan disimpan di store
  const filteredEmployees = useMemo(() => {
    if (!selectedDepartment || selectedDepartment === 'all') {
      return listEmployee
    }
    return listEmployee.filter(
      (emp) =>
        emp.company?.department?.toLowerCase() ===
        selectedDepartment.toLowerCase()
    )
  }, [listEmployee, selectedDepartment])

  const totalPages = Math.max(1, Math.ceil(total / 10))

  const handleRetry = () => {
    onGetListEmployee()
  }

  const handlePrevPage = () => {
    if (page > 1) {
      onSetPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      onSetPage(page + 1)
    }
  }

  const handleViewDetail = (id) => {
    navigate(`/employee/${id}`)
  }

  const handleEdit = (employee) => {
    onOpenForm(employee)
  }

  const handleDeletePrompt = (employee) => {
    setEmployeeToDelete(employee)
    setIsDeleteDialogOpen(true)
  }

  // Early return: state loading (Shadcn Skeleton)
  if (isLoading) {
    return (
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departemen</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-44" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Early return: state error dengan tombol "Coba Lagi"
  if (hasError) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-8 text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h3 className="text-lg font-semibold text-foreground">
          Gagal Memuat Data Karyawan
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Terjadi kesalahan saat berkomunikasi dengan server. Silakan periksa
          koneksi internet Anda atau coba muat ulang.
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

  // Early return: empty state jika data kosong
  if (filteredEmployees.length === 0) {
    return (
      <div className="rounded-md border bg-card p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
        <UserX className="h-12 w-12 text-muted-foreground/60" />
        <h3 className="text-lg font-semibold text-foreground">
          Tidak Ada Data Karyawan
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {selectedDepartment !== 'all'
            ? `Tidak ada data karyawan pada departemen "${selectedDepartment}". Coba ganti filter departemen atau kata kunci pencarian.`
            : 'Tidak ditemukan data karyawan yang sesuai.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departemen</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((emp) => {
              const fullName = renderFullName(emp)
              const department = emp.company?.department || '-'
              const title = emp.company?.title || '-'
              const avatarUrl =
                emp.image ||
                `https://dummyjson.com/icon/${encodeURIComponent(emp.firstName || 'user')}/128`

              return (
                <TableRow key={emp.id} className="hover:bg-muted/40">
                  <TableCell>
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="h-10 w-10 rounded-full object-cover bg-muted border"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {fullName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">
                    {emp.email || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {department}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">
                    {title}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetail(emp.id)}
                        title="Lihat Detail"
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(emp)}
                        title="Ubah Data"
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4 text-blue-500 hover:text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePrompt(emp)}
                        title="Hapus Karyawan"
                        className="h-8 w-8 text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Menampilkan{' '}
          <strong className="text-foreground">
            {filteredEmployees.length}
          </strong>{' '}
          dari <strong className="text-foreground">{total}</strong> total
          karyawan (Halaman {page} dari {totalPages})
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={page <= 1}
            className="flex items-center gap-1 text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>

          <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="flex items-center gap-1 text-xs"
          >
            Berikutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DeleteEmployeeDialog
        employee={employeeToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  )
}

export default EmployeeTable

