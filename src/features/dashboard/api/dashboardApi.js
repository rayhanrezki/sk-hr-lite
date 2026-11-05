import { BASE_URL } from '@/config'

export async function getDashboardDataApi() {
  // Ambil seluruh users untuk menghitung ringkasan statistik perusahaan
  const response = await fetch(`${BASE_URL}/users?limit=0`)
  if (!response.ok) {
    throw new Error('Gagal memuat ringkasan dashboard')
  }
  return response.json()
}

