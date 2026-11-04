# HRLite — Aplikasi Manajemen Karyawan

Aplikasi web modern manajemen data karyawan berbasis **React 19**, **Vite**, **Tailwind CSS**, **Zustand v5**, **Shadcn/UI**, dan **DummyJSON API**.

---

## 🚀 Panduan Memulai (Getting Started)

Aplikasi ini dapat dijalankan menggunakan **bun** maupun **npm**:

### Menggunakan Bun (Direkomendasikan)
```bash
# 1. Install dependencies
bun install

# 2. Jalankan development server
bun dev
```

### Menggunakan NPM
```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Build untuk produksi
npm run build

# 4. Cek linting & formatting
npm run lint
npm run format:check
```

Aplikasi dapat diakses pada browser di: `http://localhost:5173/` (atau port yang ditunjuk oleh Vite).

---

## 📦 Tech Stack
- **Framework & Runtime**: React 19, Vite, Bun / Node.js
- **State Management**: Zustand v5 (dengan `persist` middleware dan `useShallow`)
- **Styling**: Tailwind CSS, Lucide React (ikon)
- **UI Components**: Shadcn UI (Radix UI Primitives, Table, Dialog, Alert Dialog, Select, Skeleton, Badge, Card, Button, Input)
- **Notifications**: Sonner
- **Charts**: Recharts (Visualisasi Dashboard)
- **Routing**: React Router DOM (v7) dengan Lazy Loading / Code Splitting

---

## ✅ Daftar Fitur yang Selesai

### Level 1 — Dasar (Wajib)
- [x] **Halaman List Karyawan (`/employee`)**:
  - Tabel interaktif (Shadcn Table) dengan kolom: Foto, Nama Lengkap, Email, Departemen (`company.department`), Jabatan (`company.title`), dan Aksi (Lihat Detail, Ubah, Hapus).
  - Pagination 10 data per halaman dengan state halaman aktif dikelola di Zustand store.
  - State Loading (Shadcn Skeleton), State Error dengan tombol "Coba Lagi", dan Empty State saat data kosong.
- [x] **Pencarian (Search)**:
  - Input pencarian real-time dengan debounce 500ms via custom hook `src/hooks/useDebounce.js`.
  - Kata kunci pencarian (`keyword`) disimpan di store; setiap pergantian keyword otomatis mereset halaman ke halaman 1.
- [x] **Halaman Detail Karyawan (`/employee/:id`)**:
  - Profil lengkap karyawan: Foto profil, Data Pribadi (usia, jenis kelamin, email, telepon), Info Perusahaan (nama perusahaan, departemen, jabatan), dan Alamat Lengkap.
  - State detail disimpan di store sebagai `selectedEmployee`.
  - Penanganan khusus jika ID karyawan tidak ditemukan atau gagal dimuat.

### Level 2 — Menengah (Wajib)
- [x] **Form Tambah & Ubah Karyawan**:
  - Shadcn Dialog + Formulir dengan validasi lengkap:
    - Nama depan wajib diisi (minimal 3 karakter).
    - Email valid dengan format regex standar.
    - Usia berupa angka dalam rentang 18–65 tahun.
    - Departemen wajib dipilih melalui komponen Shadcn Select.
  - Status buka/tutup modal (`isFormOpen`) dan data yang sedang diedit (`editingEmployee`) dikelola penuh di store.
  - Feedback notifikasi sukses/gagal menggunakan Shadcn Sonner.
- [x] **Hapus Karyawan dengan Optimistic Update**:
  - Konfirmasi penghapusan menggunakan Shadcn AlertDialog untuk mencegah ketidaksengajaan.
  - Urutan **Optimistic Update**:
    1. Menyimpan salinan `listEmployee` dan `total` sebelumnya.
    2. Menghapus item dari `listEmployee` dan mengurangi `total` secara instan pada UI.
    3. Memanggil API `deleteEmployeeApi`.
    4. Jika request API gagal, state dikembalikan (*rollback*) ke kondisi semula dan melempar error untuk memicu notifikasi kegagalan Sonner.
- [x] **Filter Departemen**:
  - Filter tabel berdasarkan departemen via Shadcn Select.
  - Nilai filter aktif disimpan di store sebagai `selectedDepartment`.
  - **Derived State**: Daftar data hasil filter dihitung secara efisien di komponen menggunakan `useMemo`, **bukan** disimpan sebagai state baru di store.

### Level 3 — Bonus (Opsional)
- [x] **Dashboard Analitik (`/dashboard`)**:
  - 4 Kartu Metrik Ringkasan: Total Karyawan, Jumlah Departemen, Rata-rata Usia Karyawan, dan Status Koneksi.
  - Visualisasi Grafik Batang (Bar Chart) sebaran jumlah karyawan per departemen dengan Recharts.
  - Seluruh data dan kalkulasi agregasi dikelola khusus oleh `useDashboardStore`.
- [x] **Dark Mode Terintegrasi**:
  - Toggle tema (terang/gelap) tersimpan di global store `useCommonStore`.
  - Di-persist ke `localStorage` dengan nama key `hrlite-common` menggunakan middleware `persist` Zustand.
  - Menggunakan opsi `partialize` sehingga hanya nilai `theme` yang tersimpan, sedangkan status `isSidebarOpen` kembali ke default saat aplikasi dibuka.
- [x] **Sinkronisasi Dua Arah URL Query String**:
  - Sinkronisasi otomatis dua arah antara URL dan Zustand store:
    - `page` (`?page=2`)
    - `keyword` (`?q=john`)
    - `selectedDepartment` (`?dept=Engineering`)
  - Navigasi link/bookmark langsung menginisialisasi state aplikasi secara presisi.

---

## 🧠 Keputusan Desain State Management (Zustand)

Sesuai prinsip arsitektur terisolasi dan spesifikasi studi kasus, state dibagi ke dalam tingkatan yang tepat:

### 1. Store Fitur (`useEmployeeStore`, `useDashboardStore`)
- **Alasan**: State ini spesifik mengatur alur kerja bisnis satu fitur tertentu dan tidak diperlukan oleh fitur lain.
  - `useEmployeeStore` (`features/employee/store/useEmployeeStore.js`): Menyimpan `listEmployee`, `total`, `page`, `keyword`, `selectedDepartment`, `selectedEmployee`, `editingEmployee`, `isFormOpen`, `isLoading`, dan `hasError`.
  - `useDashboardStore` (`features/dashboard/store/useDashboardStore.js`): Menyimpan metrik ringkasan karyawan global dan data agregasi per departemen untuk visualisasi bagan.
- **Isolasi State**: Memastikan modularitas dan performa, di mana perubahan data karyawan tidak memicu re-render yang tidak perlu pada modul lain.

### 2. Global Store (`useCommonStore`)
- **Alasan**: Menyimpan state yang benar-benar digunakan lintas fitur dan memengaruhi keseluruhan shell aplikasi.
  - `theme` (`'light'` / `'dark'`): Memerlukan persistensi ke `localStorage` agar preferensi pengguna tetap tersimpan saat halaman dimuat ulang.
  - `isSidebarOpen`: Mengontrol layout navigasi utama di seluruh halaman.
- Menggunakan middleware `persist` dengan opsi `partialize` untuk membatasi hanya `theme` yang disimpan secara permanen.

### 3. Local State (`useState`)
- **Alasan**: Digunakan untuk state yang sifatnya sementara (*ephemeral*), privat pada satu komponen, dan tidak bernilai bagi komponen lain.
  - Nilai teks input pencarian sebelum selesai di-debounce (`searchInput` di `EmployeeModule`).
  - Form field values dan state validasi error internal pada form dialog.
  - Target karyawan untuk dialog konfirmasi hapus (`employeeToDelete`).

### 4. Derived State (`useMemo`)
- **Alasan**: Daftar karyawan yang telah terfilter berdasarkan departemen dihitung langsung dari `listEmployee` dan `selectedDepartment` menggunakan `useMemo`. Menyimpan hasil filter sebagai state terpisah di Zustand merupakan *anti-pattern* karena dapat menimbulkan inkonsistensi (*out-of-sync*) data saat terjadi operasi CRUD.

### 5. Penggunaan Selector & `useShallow`
- Setiap komponen **hanya membaca state yang dibutuhkan** melalui selector.
- Di Zustand v5, pemanggilan beberapa state/action dalam bentuk objek dibungkus dengan `useShallow` (`import { useShallow } from 'zustand/react/shallow'`) untuk mencegah referensi objek baru di setiap siklus render yang berpotensi memicu *infinite loop*.

---

## 🛠️ Kendala yang Ditemui & Solusi Implementasi

1. **Karakteristik DummyJSON (Mock Backend Tidak Menyimpan Mutasi)**:
   - *Kendala*: API publik DummyJSON selalu mengembalikan ID baru saat POST (misal ID 209+), dan tidak menyimpan perubahan data (PUT/DELETE untuk ID lokal akan menghasilkan 404).
   - *Solusi*: Mengimplementasikan sinkronisasi state lokal pada Zustand store. Untuk ID baru yang dihasilkan secara lokal, operasi view detail, edit, dan delete diproses langsung di store tanpa gagal karena keterbatasan backend mock.
2. **Pencegahan Cascading Renders pada Form Edit**:
   - *Kendala*: ESLint React 19 menandai `setState` dalam `useEffect` saat membuka form dialog sebagai potensi *cascading render*.
   - *Solusi*: Menerapkan pattern React modern dengan memberikan `key={editingEmployee?.id || 'new'}` pada komponen form. Komponen form mereset dan menginisialisasi `useState` secara deklaratif pada saat mount tanpa membutuhkan side-effect `setState`.
3. **Sinkronisasi Dua Arah URL Query Params Tanpa Infinite Loop**:
   - *Kendala*: Mengikat store dan URL query string rentan memicu loop navigasi jika tidak ditangani dengan hati-hati.
   - *Solusi*: Menginisialisasi store dan input pencarian terlebih dahulu pada mount awal via `useRef(isInitializedRef)`, lalu melakukan *replace state* pada URL query params hanya jika state store berubah.

---

## 📁 Struktur Direktori

```
src/
├── assets/
├── components/
│   ├── layout/
│   │   ├── MainLayout.jsx
│   │   └── Sidebar.jsx
│   └── ui/                     # Komponen Shadcn UI
│       ├── alert-dialog.jsx
│       ├── badge.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       ├── input.jsx
│       ├── select.jsx
│       ├── skeleton.jsx
│       ├── sonner.jsx
│       └── table.jsx
├── core/
├── features/
│   ├── employee/
│   │   ├── api/
│   │   │   └── employeeApi.js
│   │   ├── components/
│   │   │   ├── index.jsx       # Halaman utama modul employee
│   │   │   ├── EmployeeTable.jsx
│   │   │   ├── EmployeeDetail.jsx
│   │   │   ├── EmployeeFormDialog.jsx
│   │   │   └── DeleteEmployeeDialog.jsx
│   │   └── store/
│   │       └── useEmployeeStore.js
│   └── dashboard/
│       ├── api/
│       │   └── dashboardApi.js
│       ├── components/
│       │   └── index.jsx       # Halaman utama modul dashboard
│       └── store/
│           └── useDashboardStore.js
├── hooks/
│   └── useDebounce.js
├── lib/
│   └── utils.js
├── pages/
│   ├── DashboardPage.jsx       # Lazy route export
│   └── EmployeePage.jsx        # Lazy route export
├── store/
│   └── useCommonStore.js
├── App.jsx
├── config.js                   # BASE_URL DummyJSON
├── index.css                   # Konfigurasi Tailwind CSS & Theme
└── main.jsx
```

---

## 📜 Lisensi
Dikembangkan sebagai bagian dari uji teknis Frontend Developer HRLite.
