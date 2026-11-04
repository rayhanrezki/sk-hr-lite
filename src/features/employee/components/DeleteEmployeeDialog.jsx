import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useEmployeeStore } from '@/features/employee/store/useEmployeeStore'

export function DeleteEmployeeDialog({ employee, isOpen, onOpenChange }) {
  const onDeleteEmployee = useEmployeeStore((state) => state.onDeleteEmployee)

  const handleConfirmDelete = async () => {
    if (!employee) return

    try {
      onOpenChange(false)
      await onDeleteEmployee(employee.id)
      toast.success(
        `Karyawan ${employee.firstName} ${employee.lastName} berhasil dihapus`
      )
    } catch {
      toast.error('Gagal menghapus karyawan. Data telah dikembalikan.')
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!employee) {
    return null
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Karyawan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data{' '}
            <strong className="text-foreground">
              {employee.firstName} {employee.lastName}
            </strong>
            ? Tindakan ini dapat dibatalkan jika terjadi kesalahan pada server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus Karyawan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteEmployeeDialog
