# <img src="./public/logos/cashmap_logo.png" alt="CashMap Logo" width="40" height="40" align="center"> CashMap - Smart Financial Intelligence

**CashMap** adalah aplikasi manajemen keuangan modern yang dirancang untuk memberikan kendali penuh atas arus kas pribadi Anda. Dengan antarmuka yang bersih dan fitur pelacakan *real-time*, CashMap membantu pengguna memetakan setiap rupiah, mengelola berbagai dompet digital, dan menganalisis kebiasaan belanja secara cerdas.

---

## ✨ Fitur Unggulan

* **Multi-Wallet Management**: Kelola berbagai akun bank (BCA, Mandiri) dan e-wallet (GoPay, OVO, Dana) dalam satu dashboard terpusat.
* **Visual Cashflow Analysis**: Lihat rasio pemasukan vs pengeluaran secara instan melalui grafik interaktif (Pie Chart).
* **Recent Transactions History**: Pantau riwayat transaksi terakhir lengkap dengan kategori dan deskripsi detail.
* **Secure Authentication**: Perlindungan data pengguna dengan login aman via Google OAuth dan sistem kredensial terenkripsi.
* **Responsive UI/UX**: Pengalaman pengguna yang mulus baik di desktop maupun perangkat mobile menggunakan Tailwind CSS.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan teknologi mutakhir untuk menjamin performa dan skalabilitas:

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Database**: [PostgreSQL](https://www.postgresql.org/) hosted on **Supabase**
* **ORM**: [Prisma](https://www.prisma.io/)
* **Authentication**: [NextAuth.js](https://next-auth.js.org/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏗️ Standar Pengembangan & Infrastruktur

CashMap dikembangkan dengan mengikuti standar industri untuk memastikan kualitas kode dan kemudahan skalabilitas:

## 📡 Dokumentasi API (Endpoints)

Guna memenuhi standar **RESTful API**, CashMap menyediakan beberapa *endpoint* utama untuk manajemen data transaksi:

| Method | Endpoint | Deskripsi | Format Response |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/expenses` | Mengambil seluruh riwayat transaksi pengguna | JSON |
| **POST** | `/api/expenses` | Menambahkan catatan pengeluaran baru | JSON |
| **PUT** | `/api/expenses/[id]` | Memperbarui data transaksi berdasarkan ID | JSON |
| **DELETE** | `/api/expenses/[id]` | Menghapus data transaksi dari database | JSON |

### 📥 Contoh Response (Success)
**a. GET /api/expenses**
* **Fungsi:** Mendapatkan semua daftar riwayat pengeluaran.
* **Success Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
        "id": "clt1",
        "amount": 50000,
        "category": "Food",
        "description": "Nasi Padang"
    }
  ]
}
```

**b. GET /api/expenses/:id**
* **Fungsi:** Mendapatkan rincian pengeluaran berdasarkan ID.
* **Success Response (200 OK):**
```JSON
{
  "status": "success",
  "data":
    {
        "id": "clt1",
        "amount": 50000,
        "category": "Food"
    }
}
```
* **Error Response (404 Not Found):**
```JSON
{
    "status": "error",
    "message": "Expense ID not found"
}
```

**c. POST /api/expenses**
* **Fungsi: Menambahkan catatan pengeluaran baru.**
* **Request Body: { "amount": 25000, "category": "Transport" }**
* **Success Response (201 Created):**
```JSON
{
  "status": "success",
  "data":
    {
        "id": "clt2",
        "amount": 25000,
        "category": "Transport"
    }
}
```

**d. PUT /api/expenses/:id**
* **Fungsi: Memperbarui data pengeluaran berdasarkan ID.**
* **Request Body: { "amount": 30000 }**
* **Success Response (200 OK):**
```JSON
{
    "status": "success",
    "message": "Updated successfully"
}
```

**e. DELETE /api/expenses/:id**
* **Fungsi: Menghapus data pengeluaran berdasarkan ID.**
* **Success Response (200 OK):**
```JSON
{
    "status": "success",
    "message": "Deleted successfully"
}
```


### 🐳 Containerization dengan Docker
Proyek ini telah dikontainerisasi menggunakan Docker untuk menjamin lingkungan pengembangan yang konsisten.
* **Port Default**: `8000`
* **Perintah Jalankan**:
    ```bash
    docker-compose up --build
    ```

### ⚙️ Otomatisasi CI/CD & Continuous Security (CS)
[![CI and Security Scan](https://github.com/craten54/Expense_Tracker/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/craten54/Expense_Tracker/actions/workflows/main.yml)
Kami mengintegrasikan **GitHub Actions** untuk menjaga integritas aplikasi di setiap perubahan kode:
* **Continuous Integration (CI)**: Menjalankan unit testing dan validasi struktur kode secara otomatis pada setiap *push* atau *pull request*.
* **Continuous Security (CS)**: Pemindaian keamanan otomatis untuk mendeteksi kerentanan pada dependensi pihak ketiga (Security Vulnerability Scanning).

### 🌿 Git Workflow & Conventions
Pengembangan dilakukan menggunakan standarisasi branch `main`, `develop`, dan `feature` dengan konvensi commit:
* `feat`: Menambah fitur baru.
* `fix`: Perbaikan bug atau error.
* `docs`: Pembaruan dokumentasi.

---

## 🚀 Instalasi Lokal

1.  **Clone Repositori**:
    ```bash
    git clone [https://github.com/craten54/CashMap.git](https://github.com/craten54/CashMap.git)
    cd CashMap
    ```
2.  **Instal Dependensi**:
    ```bash
    npm install
    ```
3.  **Konfigurasi Environment**:
    Buat file `.env` di root folder dan isi dengan variabel berikut:
    ```env
    DATABASE_URL="your_postgresql_url"
    DIRECT_URL="your_direct_url"
    NEXTAUTH_SECRET="your_secret"
    NEXTAUTH_URL="http://localhost:3000"
    GOOGLE_CLIENT_ID="your_google_id"
    GOOGLE_CLIENT_SECRET="your_google_secret"
    ```
4.  **Singkronisasi Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```
5.  **Jalankan Aplikasi**:
    ```bash
    npm run dev
    ```

---

## 👤 Author
**Stan Fredheric**
*Informatics Engineering Student - Padjadjaran University*