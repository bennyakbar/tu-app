# Roadmap Pengembangan Fitur Akuntansi

Berdasarkan analisis alur kerja Tata Usaha sekolah, berikut adalah fitur-fitur "Mandatory Accounting" yang disarankan untuk melengkapi sistem ini:

## 1. Laporan Tunggakan (Piutang / Account Receivable) 🔴 **CRITICAL**
Saat ini sistem hanya mencatat pembayaran yang masuk (Cash Basis). Sekolah perlu tahu potensi pendapatan yang belum masuk.

*   **Fitur**:
    *   Dashboard total tunggakan per kelas.
    *   List "Siswa yang belum lunas SPP bulan X".
    *   Cetak Surat Tagihan otomatis.
*   **Manfaat**: Memudahkan penagihan ke wali murid.

## 2. Buku Kas Umum (BKU) & Tutup Buku 📒
Untuk pertanggungjawaban fisik uang.

*   **Fitur**:
    *   Tabel mutasi: Tanggal | Uraian | Debet (Masuk) | Kredit (Keluar) | Saldo.
    *   Rekap Harian (Untuk setoran ke Yayasan).
    *   Fitur "Tutup Buku" bulanan (Lock data agar tidak bisa diedit lagi).
*   **Manfaat**: Audit trail yang jelas dan mencegah manipulasi data historis.

## 3. Manajemen Pengeluaran (Expense) 💸
Untuk menghitung Real Cashflow.

*   **Fitur**:
    *   Input Biaya Operasional (Listrik, ATK, Honor, dll).
    *   Kategori Pengeluaran (Chart of Accounts sederhana).
*   **Manfaat**: Mengetahui Sisa Kas (Balance) yang sebenarnya.

## 4. Jurnal Umum (General Ledger) 📊 *Advanced*
Jika sekolah menggunakan standar akuntansi double-entry (Debet/Kredit akun).

*   **Rekomendasi**: Untuk aplikasi TU sederhana, fitur ini mungkin terlalu kompleks (overkill). Biasanya cukup sampai **BKU** saja.

---

## Rekomendasi Langkah Selanjutnya:
Saya sarankan prioritas pengembangan pada **Laporan Tunggakan**, karena datanya sudah ada (Siswa & Tarif SPP). Apakah Anda setuju fitur ini kita bangun selanjutnya?
