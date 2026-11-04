import { BASE_URL } from '@/config'

export async function getEmployeesApi({
  limit = 10,
  skip = 0,
  keyword = '',
} = {}) {
  const url = keyword?.trim()
    ? `${BASE_URL}/users/search?q=${encodeURIComponent(keyword.trim())}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/users?limit=${limit}&skip=${skip}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Gagal memuat data karyawan')
  }
  return response.json()
}

export async function getEmployeeDetailApi(id) {
  const response = await fetch(`${BASE_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error('Data karyawan tidak ditemukan')
  }
  return response.json()
}

export async function createEmployeeApi(payload) {
  const response = await fetch(`${BASE_URL}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('Gagal menambahkan karyawan')
  }
  return response.json()
}

export async function updateEmployeeApi(id, payload) {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('Gagal memperbarui karyawan')
  }
  return response.json()
}

export async function deleteEmployeeApi(id) {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Gagal menghapus karyawan')
  }
  return response.json()
}
