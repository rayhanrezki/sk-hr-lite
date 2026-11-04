import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEmployeeStore } from '@/features/employee/store/useEmployeeStore'

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Services',
  'Support',
  'Business Development',
  'Product Management',
  'Legal',
  'Research and Development',
  'Accounting',
  'Training',
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function EmployeeFormContent({ editingEmployee, onClose, onCreate, onUpdate }) {
  const isEditMode = Boolean(editingEmployee)

  const [formData, setFormData] = useState({
    firstName: editingEmployee?.firstName || '',
    lastName: editingEmployee?.lastName || '',
    email: editingEmployee?.email || '',
    age: editingEmployee?.age ? String(editingEmployee.age) : '',
    department: editingEmployee?.company?.department || '',
    title: editingEmployee?.company?.title || '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.firstName || formData.firstName.trim().length < 3) {
      newErrors.firstName = 'Nama depan wajib diisi minimal 3 karakter'
    }

    if (!formData.email || !EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid'
    }

    const ageNum = Number(formData.age)
    if (!formData.age || isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      newErrors.age = 'Usia harus berupa angka antara 18 hingga 65 tahun'
    }

    if (!formData.department) {
      newErrors.department = 'Departemen wajib dipilih'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditMode) {
        await onUpdate(editingEmployee.id, formData)
        toast.success(`Data karyawan ${formData.firstName} berhasil diperbarui`)
      } else {
        await onCreate(formData)
        toast.success(
          `Karyawan baru ${formData.firstName} berhasil ditambahkan`
        )
      }
    } catch {
      toast.error(
        isEditMode ? 'Gagal memperbarui karyawan' : 'Gagal menambahkan karyawan'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditMode ? 'Ubah Data Karyawan' : 'Tambah Karyawan Baru'}
        </DialogTitle>
        <DialogDescription>
          {isEditMode
            ? 'Perbarui detail data karyawan di bawah ini.'
            : 'Isi formulir berikut untuk menambahkan karyawan baru ke sistem.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Nama Depan <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="cth. John"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Nama Belakang
            </label>
            <Input
              placeholder="cth. Doe"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            placeholder="cth. john.doe@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Usia (18-65) <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              min="18"
              max="65"
              placeholder="cth. 28"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
            />
            {errors.age && (
              <p className="text-xs text-destructive">{errors.age}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Jabatan
            </label>
            <Input
              placeholder="cth. Software Engineer"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">
            Departemen <span className="text-destructive">*</span>
          </label>
          <Select
            value={formData.department}
            onValueChange={(val) => handleChange('department', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Departemen" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-xs text-destructive">{errors.department}</p>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Menyimpan...'
              : isEditMode
                ? 'Simpan Perubahan'
                : 'Tambah Karyawan'}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export function EmployeeFormDialog() {
  const {
    isFormOpen,
    editingEmployee,
    onCloseForm,
    onCreateEmployee,
    onUpdateEmployee,
  } = useEmployeeStore(
    useShallow((state) => ({
      isFormOpen: state.isFormOpen,
      editingEmployee: state.editingEmployee,
      onCloseForm: state.onCloseForm,
      onCreateEmployee: state.onCreateEmployee,
      onUpdateEmployee: state.onUpdateEmployee,
    }))
  )

  const handleOpenChange = (open) => {
    if (!open) {
      onCloseForm()
    }
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isFormOpen && (
          <EmployeeFormContent
            key={editingEmployee ? editingEmployee.id : 'create-new'}
            editingEmployee={editingEmployee}
            onClose={onCloseForm}
            onCreate={onCreateEmployee}
            onUpdate={onUpdateEmployee}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeFormDialog
