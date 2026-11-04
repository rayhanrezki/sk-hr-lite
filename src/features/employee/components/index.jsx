import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { Search, Plus, Filter, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
import { useEmployeeStore } from '@/features/employee/store/useEmployeeStore'
import { EmployeeTable } from '@/features/employee/components/EmployeeTable'
import { EmployeeFormDialog } from '@/features/employee/components/EmployeeFormDialog'

const DEPARTMENTS = [
  'All',
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

export function EmployeeModule() {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    page,
    keyword,
    selectedDepartment,
    onGetListEmployee,
    onSetKeyword,
    onSetPage,
    onSetSelectedDepartment,
    onOpenForm,
  } = useEmployeeStore(
    useShallow((state) => ({
      page: state.page,
      keyword: state.keyword,
      selectedDepartment: state.selectedDepartment,
      onGetListEmployee: state.onGetListEmployee,
      onSetKeyword: state.onSetKeyword,
      onSetPage: state.onSetPage,
      onSetSelectedDepartment: state.onSetSelectedDepartment,
      onOpenForm: state.onOpenForm,
    }))
  )

  // State lokal input pencarian sebelum di-debounce, diinisialisasi dari query param jika ada
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('q') || keyword
  )
  const debouncedSearch = useDebounce(searchInput, 500)
  const isInitializedRef = useRef(false)

  // 1. Inisialisasi dari URL Query String ke Store saat mount awal
  useEffect(() => {
    const urlPage = Number(searchParams.get('page')) || 1
    const urlKeyword = searchParams.get('q') || ''
    const urlDept = searchParams.get('dept') || 'all'

    // Terapkan ke store saat mount
    useEmployeeStore.setState({
      page: urlPage,
      keyword: urlKeyword,
      selectedDepartment: urlDept,
    })

    onGetListEmployee()
    isInitializedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. Sinkronkan nilai debounce ke store keyword (mereset page ke 1)
  useEffect(() => {
    if (!isInitializedRef.current) return
    if (debouncedSearch !== keyword) {
      onSetKeyword(debouncedSearch)
    }
  }, [debouncedSearch, keyword, onSetKeyword])

  // 3. Sinkronkan perubahan store ke URL query string (dua arah)
  useEffect(() => {
    if (!isInitializedRef.current) return

    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (keyword) params.set('q', keyword)
    if (selectedDepartment && selectedDepartment !== 'all') {
      params.set('dept', selectedDepartment)
    }

    setSearchParams(params, { replace: true })
  }, [page, keyword, selectedDepartment, setSearchParams])

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleDepartmentChange = (dept) => {
    onSetSelectedDepartment(dept === 'All' ? 'all' : dept)
  }

  const handleResetFilter = () => {
    setSearchInput('')
    onSetKeyword('')
    onSetSelectedDepartment('all')
    onSetPage(1)
  }

  const handleOpenAddForm = () => {
    onOpenForm()
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Karyawan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data staf, pantau struktur tim, dan lakukan pembaruan
            karyawan.
          </p>
        </div>

        <Button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 self-start sm:self-auto shadow"
        >
          <Plus className="h-4 w-4" />
          Tambah Karyawan
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama karyawan (debounce 500ms)..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-9 bg-card"
          />
        </div>

        <div className="w-full sm:w-56">
          <Select
            value={selectedDepartment === 'all' ? 'All' : selectedDepartment}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger className="bg-card">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Pilih Departemen" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === 'All' ? 'Semua Departemen' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(searchInput || selectedDepartment !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilter}
            className="text-xs text-muted-foreground flex items-center gap-1 self-start sm:self-center"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Main Table */}
      <EmployeeTable />

      {/* Form Dialog (Create & Edit) */}
      <EmployeeFormDialog />
    </div>
  )
}

export default EmployeeModule
