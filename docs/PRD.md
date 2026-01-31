# Product Requirement Document (PRD)
## Aplikasi Tata Usaha Sekolah Dasar

---

## 1. Ringkasan Produk
Aplikasi web ringan untuk membantu Tata Usaha Sekolah Dasar dalam mengelola data siswa, pembayaran SPP dan kewajiban lain, serta laporan administrasi secara terstruktur, aman, dan mudah digunakan oleh pengguna non-teknis.

---

## 2. Target Pengguna
- Admin Tata Usaha
- Bendahara
- Yayasan (monitoring)

Jumlah pengguna aktif: 1–3 orang  
Perangkat: Laptop / PC  
Browser: Chrome / Edge

---

## 3. Tujuan Produk
- Mengurangi pencatatan manual
- Mempermudah pengelolaan pembayaran siswa
- Menyediakan transparansi keuangan kepada bendahara dan yayasan
- Mempercepat pembuatan laporan bulanan

---

## 4. Ruang Lingkup

### Termasuk
- Login dan manajemen user berbasis role
- Manajemen data siswa
- Pembayaran SPP dan kewajiban lain
- Pengelolaan kategori siswa (Reguler / Subsidi untuk SPP)
- Kwitansi pembayaran (PDF)
- Dashboard monitoring
- Laporan dan export Excel

### Tidak Termasuk
- Akuntansi penuh
- Multi sekolah
- Payment gateway
- Aplikasi mobile native
- Mode offline

---

## 5. Role & Hak Akses

### Admin TU
- Kelola master data
- Kelola siswa
- Input pembayaran
- Generate kwitansi
- Akses seluruh laporan

### Bendahara
- Melihat dashboard pembayaran
- Melihat daftar tunggakan
- Export laporan ke Excel
- Tidak dapat mengubah data

### Yayasan
- Melihat dashboard agregat
- Monitoring pemasukan dan tunggakan
- View-only (tanpa export)

---

## 6. Kategori & Kewajiban Pembayaran

### Kategori Siswa
- Reguler
- Subsidi

Catatan:
- Subsidi tetap memiliki nominal (>0)
- Kategori hanya berlaku untuk SPP
- Tidak berlaku surut

---

### Jenis Kewajiban
1. Rutin
   - Contoh: SPP Bulanan
   - Memiliki status tunggakan
   - Dihitung per bulan

2. Non-Rutin
   - Contoh: Buku, Seragam, Kegiatan Tahunan
   - Sekali bayar
   - Tidak dihitung sebagai tunggakan

---

### SPP
- Nominal berbeda per:
  - Tingkat kelas
  - Kategori siswa (Reguler / Subsidi)
- Pembayaran harus lunas penuh
- Tunggakan dihitung per bulan
- Berlaku hanya untuk tahun ajaran aktif

---

## 7. Pembayaran

- Satu siswa hanya boleh memiliki satu pembayaran SPP per bulan
- Pembayaran non-rutin tidak menggunakan bulan
- Pembayaran yang sudah memiliki kwitansi tidak dapat dihapus

---

## 8. Kwitansi

### Fitur
- Generate kwitansi satu transaksi
- Generate kwitansi multi transaksi

### Format
- PDF
- Logo sekolah wajib
- Nomor otomatis:
  MINF-YYYYMM-XXXX

### Aturan
- Kwitansi bersifat read-only
- Bisa dicetak ulang
- Tidak mengubah data transaksi

---

## 9. Dashboard

### Bendahara
- Total pemasukan SPP bulan berjalan
- Total tunggakan SPP
- Jumlah siswa sudah / belum bayar
- Daftar siswa menunggak
- Export Excel

### Yayasan
- Total pemasukan SPP
- Grafik sudah bayar vs belum
- Monitoring agregat
- View-only

---

## 10. Non-Functional Requirements
- Waktu muat < 3 detik
- Bahasa Indonesia formal
- UI sederhana dan jelas
- Aman untuk koneksi lambat
- Data tersimpan konsisten

---

## 11. Batasan
- Digunakan oleh satu sekolah
- Satu tahun ajaran aktif
- Penambahan fitur dilakukan bertahap
- Kwitansi dan laporan hanya bisa diakses saat online (karena web app)

---

Dokumen ini menjadi acuan utama pengembangan dan deployment aplikasi.
