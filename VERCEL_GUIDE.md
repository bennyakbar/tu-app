# Panduan Deploy Gratis ke Vercel

Aplikasi ini dapat di-online-kan secara **GRATIS** menggunakan **Vercel** (untuk aplikasi) dan **Vercel Postgres** (untuk database).

## Langkah 1: Push ke GitHub (Sudah Anda lakukan)
Pastikan kode terbaru sudah ada di repository GitHub Anda.

## Langkah 2: Buat Project di Vercel
1. Buka [vercel.com](https://vercel.com) dan Login pakai GitHub.
2. Klik **"Add New..."** -> **"Project"**.
3. Pilih repository `tu-app` Anda dan klik **"Import"**.

## Langkah 3: Tambahkan Database (Vercel Postgres)
1. Di halaman konfigurasi project (sebelum Deploy), scroll ke bawah atau lihat menu kiri.
2. Atau setelah "Deploy" (yang mungkin error dulu), masuk ke Dashboard Project -> tab **Storage**.
3. Klik **"Create Database"** -> Pilih **Postgres**.
4. Beri nama (misal: `tu-db`) dan region (pilih `Singapore` agar cepat dari Indonesia).
5. Klik **Create**.
6. Vercel akan otomatis menambahkan Environment Variable (`POSTGRES_URL`, dll) ke project Anda.

## Langkah 4: Konfigurasi Environment Variable
Masuk ke **Settings** -> **Environment Variables**.
Pastikan variabel berikut ada. Jika belum, tambahkan manual:

1. **DATABASE_URL**
   - Value: Copy dari value `POSTGRES_PRISMA_URL` (atau `POSTGRES_URL_NON_POOLING` jika gagal migrasi).
   - *Tips: Vercel Postgres otomatis membuat variable ini, tapi prisma butuh nama `DATABASE_URL`.*
   
2. **SESSION_SECRET**
   - Value: Isi dengan string acak yang panjang (contoh: `rahasia_sekolah_123_abc_...`).

## Langkah 5: Setup Build Command (Migrasi Database)
Agar database terbentuk otomatis saat deploy:
1. Masuk ke **Settings** -> **General**.
2. Di bagian **Build & Development Settings**.
3. Ubah **Build Command** menjadi:
   ```bash
   prisma generate && prisma migrate deploy && next build
   ```
   *(Ini akan menjalankan update database setiap kali Anda push kode baru).*

## Langkah 6: Redeploy
1. Masuk ke tab **Deployments**.
2. Klik titik tiga pada deployment terakhir -> **Redeploy**.
3. Tunggu hingga sukses.

## Langkah 7: Masukkan Data Awal (Admin)
Karena database kosong di awal, Anda perlu user Admin.
Cara termudah adalah menjalankan Seed dari lokal komputer Anda:

1. Di komputer lokal, buka file `.env`.
2. Ubah `DATABASE_URL` sementara menjadi URL database Vercel (bisa dilihat di Dashboard Vercel -> Storage -> .env.local).
3. Jalankan perintah:
   ```bash
   npm run seed
   ```
4. Setelah sukses, kembalikan `.env` lokal ke semula (localhost).

Sekarang aplikasi sudah online dan bisa login dengan `admin@sekolah.id`.
