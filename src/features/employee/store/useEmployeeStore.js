import { create } from 'zustand'
import {
  getEmployeesApi,
  getEmployeeDetailApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from '@/features/employee/api/employeeApi'

export const useEmployeeStore = create((set, get) => ({
  listEmployee: [],
  total: 0,
  page: 1,
  keyword: '',
  selectedDepartment: 'all',
  selectedEmployee: null,
  editingEmployee: null,
  isFormOpen: false,
  isLoading: false,
  hasError: false,

  onGetListEmployee: async () => {
    const { page, keyword } = get()
    set(() => ({ isLoading: true, hasError: false }))

    try {
      const skip = (page - 1) * 10
      const data = await getEmployeesApi({ limit: 10, skip, keyword })
      set(() => ({
        listEmployee: data.users || [],
        total: data.total || 0,
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

  onGetEmployeeDetail: async (id) => {
    set(() => ({ isLoading: true, hasError: false, selectedEmployee: null }))

    // Cek apakah ada di listEmployee terlebih dahulu (misal untuk data yang baru ditambahkan secara lokal)
    const localEmployee = get().listEmployee.find(
      (emp) => String(emp.id) === String(id)
    )

    try {
      if (localEmployee && (Number(id) > 208 || isNaN(Number(id)))) {
        set(() => ({
          selectedEmployee: localEmployee,
          isLoading: false,
          hasError: false,
        }))
        return
      }

      const data = await getEmployeeDetailApi(id)
      set(() => ({
        selectedEmployee: data,
        isLoading: false,
        hasError: false,
      }))
    } catch (err) {
      if (localEmployee) {
        set(() => ({
          selectedEmployee: localEmployee,
          isLoading: false,
          hasError: false,
        }))
        return
      }
      set(() => ({
        selectedEmployee: null,
        isLoading: false,
        hasError: true,
      }))
      throw err
    }
  },

  onSetPage: (page) => {
    set(() => ({ page }))
    get().onGetListEmployee()
  },

  onSetKeyword: (keyword) => {
    set(() => ({ keyword, page: 1 }))
    get().onGetListEmployee()
  },

  onSetSelectedDepartment: (dept) => {
    set(() => ({ selectedDepartment: dept }))
  },

  onOpenForm: (employee = null) => {
    set(() => ({
      isFormOpen: true,
      editingEmployee: employee || null,
    }))
  },

  onCloseForm: () => {
    set(() => ({
      isFormOpen: false,
      editingEmployee: null,
    }))
  },

  onCreateEmployee: async (payload) => {
    const defaultImage = `https://dummyjson.com/icon/${encodeURIComponent(payload.firstName || 'user')}/128`
    const bodyPayload = {
      firstName: payload.firstName,
      lastName: payload.lastName || '',
      email: payload.email,
      age: Number(payload.age),
      image: payload.image || defaultImage,
      company: {
        department: payload.department,
        title: payload.title || 'Staff',
        name: payload.companyName || 'HRLite Corp',
      },
    }

    let createdId = Date.now()
    try {
      const response = await createEmployeeApi(bodyPayload)
      if (response && response.id) {
        createdId = response.id
      }
    } catch {
      // Fallback ID jika API mock gagal
      createdId = Date.now()
    }

    const newEmployee = {
      ...bodyPayload,
      id: createdId,
    }

    set((state) => ({
      listEmployee: [newEmployee, ...state.listEmployee],
      total: state.total + 1,
      isFormOpen: false,
      editingEmployee: null,
    }))

    return newEmployee
  },

  onUpdateEmployee: async (id, payload) => {
    const isLocalNewItem = Number(id) > 208 || isNaN(Number(id))

    if (!isLocalNewItem) {
      try {
        await updateEmployeeApi(id, payload)
      } catch (error) {
        // Abaikan jika server mock tidak mengenal ID atau gagal
        console.warn('API update failed, updating store directly:', error)
      }
    }

    set((state) => ({
      listEmployee: state.listEmployee.map((item) => {
        if (String(item.id) === String(id)) {
          return {
            ...item,
            ...payload,
            company: {
              ...(item.company || {}),
              ...(payload.company || {}),
              department: payload.department || item.company?.department,
              title: payload.title || item.company?.title,
            },
          }
        }
        return item
      }),
      selectedEmployee:
        state.selectedEmployee &&
        String(state.selectedEmployee.id) === String(id)
          ? {
              ...state.selectedEmployee,
              ...payload,
              company: {
                ...(state.selectedEmployee.company || {}),
                ...(payload.company || {}),
                department:
                  payload.department ||
                  state.selectedEmployee.company?.department,
                title: payload.title || state.selectedEmployee.company?.title,
              },
            }
          : state.selectedEmployee,
      isFormOpen: false,
      editingEmployee: null,
    }))
  },

  onDeleteEmployee: async (id) => {
    // 1. Simpan salinan listEmployee dan total sebelum diubah
    const previousListEmployee = [...get().listEmployee]
    const previousTotal = get().total

    // 2. Langsung hapus item dari listEmployee dan kurangi total, sehingga UI berubah seketika
    set((state) => ({
      listEmployee: state.listEmployee.filter(
        (emp) => String(emp.id) !== String(id)
      ),
      total: Math.max(0, state.total - 1),
    }))

    // 3. Panggil deleteEmployeeApi
    try {
      const isServerItem = Number(id) <= 208 && !isNaN(Number(id))
      if (isServerItem) {
        await deleteEmployeeApi(id)
      }
    } catch (error) {
      // 4. Jika API gagal, kembalikan state ke salinan pada langkah 1 (rollback) dan lempar error
      set(() => ({
        listEmployee: previousListEmployee,
        total: previousTotal,
      }))
      throw error
    }
  },
}))
