# Aplikasi Tata Usaha (TU) Sekolah

Aplikasi manajemen pembayaran SPP dan keuangan sekolah berbasis web modern.

## Fitur Utama
- 📚 **Manajemen Siswa**: Data siswa, kelas, kenaikan kelas, import batch Excel.
- 💰 **Manajemen Pembayaran**: Pembayaran SPP dan Non-SPP.
- 🧾 **Kwitansi Digital**: Cetak kwitansi otomatis (PDF A5 Landscape).
- 📊 **Laporan Visual**: Grafik tren pemasukan dan komposisi biaya.
- 📋 **Laporan Tunggakan**: Cek siswa yang belum bayar SPP.
- 📥 **Export Excel**: Laporan keuangan detail.
- 👥 **Multi-Role**: Admin TU, Bendahara, Yayasan.

## Teknologi
- Framework: **Next.js 16** (App Router)
- Database: **PostgreSQL** + **Prisma ORM**
- Styling: **Tailwind CSS**
- Charts: **Recharts**
- PDF: **@react-pdf/renderer**

---

## 🚀 Cara Menjalankan

### Opsi A: Deploy ke Cloud (Vercel) — Tanpa Install
Lihat panduan lengkap: [VERCEL_GUIDE.md](./VERCEL_GUIDE.md)

### Opsi B: Instalasi Lokal (Windows / Linux / Mac)

#### Prasyarat
- **Node.js 20+**: [Download](https://nodejs.org)
- **PostgreSQL 14+**: [Download](https://www.postgresql.org/download/) atau gunakan Docker
- **Git**: [Download](https://git-scm.com)

#### Langkah Instalasi

```bash
# 1. Clone Repository
git clone https://github.com/bennyakbar/tu-app.git
cd tu-app

# 2. Install Dependencies
npm install

# 3. Setup Environment
# Salin file .env.example ke .env
cp .env.example .env   # Linux/Mac
copy .env.example .env # Windows CMD

# Edit .env sesuai konfigurasi database Anda:
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tu_db"
# SESSION_SECRET="rahasia_panjang_acak"

# 4. Setup Database
npx prisma migrate dev --name init
npm run seed

# 5. Jalankan Server Development
npm run dev
```

Buka browser: **http://localhost:3000**

---

## 🔑 Login Default

Setelah menjalankan `npm run seed`, gunakan akun berikut:

| Role | Email | Password |
|------|-------|----------|
| Admin TU | `admin@sekolah.id` | `admin123` |
| Bendahara | `bendahara@sekolah.id` | `bendahara123` |
| Yayasan | `yayasan@sekolah.id` | `yayasan123` |

---

## 📁 Struktur Project

```
tu-app/
├── prisma/           # Database schema & migrations
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities (auth, prisma, utils)
│   └── app/actions/  # Server Actions
├── .env.example      # Template environment variables
├── VERCEL_GUIDE.md   # Panduan deploy ke Vercel
└── ACCOUNTING_ROADMAP.md # Roadmap fitur akuntansi
```

---

## 📝 Catatan untuk Windows

1. Gunakan **PowerShell** atau **Git Bash** (bukan CMD) untuk perintah terminal.
2. Pastikan PostgreSQL service berjalan (cek di Services atau `pg_ctl status`).
3. Jika error `bcrypt`, jalankan: `npm rebuild bcrypt --build-from-source`

---

## 📄 Lisensi
MIT License
