# Entity Relationship Diagram (ERD)
## Aplikasi Tata Usaha SD

---

## users
Menyimpan akun pengguna sistem.

- id (UUID, PK)
- name
- email (unique)
- password_hash
- role (ADMIN_TU | BENDAHARA | YAYASAN)
- is_active
- created_at

---

## classes
Master tingkat kelas.

- id (UUID, PK)
- name (contoh: Kelas 1)
- level (1–6)
- is_active
- created_at

---

## students
Data siswa.

- id (UUID, PK)
- nis (unique)
- name
- class_id (FK → classes.id)
- spp_category (REGULER | SUBSIDI)
- is_active
- created_at

Catatan:
- spp_category hanya untuk SPP
- Tidak berlaku surut

---

## academic_years
Manajemen tahun ajaran.

- id (UUID, PK)
- name (contoh: 2025/2026)
- is_active (hanya satu TRUE)
- created_at

---

## fee_types
Master kewajiban pembayaran.

- id (UUID, PK)
- name (SPP, Buku, dll)
- type (RUTIN | NON_RUTIN)
- is_spp (boolean)
- is_active
- created_at

---

## spp_rates
Nominal SPP per kelas dan kategori.

- id (UUID, PK)
- class_id (FK → classes.id)
- category (REGULER | SUBSIDI)
- amount
- academic_year_id (FK → academic_years.id)
- is_active
- created_at

---

## payments
Data transaksi pembayaran.

- id (UUID, PK)
- student_id (FK → students.id)
- fee_type_id (FK → fee_types.id)
- academic_year_id (FK → academic_years.id)
- month (1–12, NULL untuk non-rutin)
- amount_paid
- payment_date
- created_by (FK → users.id)
- created_at

Aturan unik:
- student_id + fee_type_id + month + academic_year_id
(Untuk pembayaran rutin/SPP pada bulan yang sama)

---

## receipts
Header kwitansi.

- id (UUID, PK)
- receipt_number (MINF-YYYYMM-XXXX)
- student_id (FK → students.id)
- receipt_date
- total_amount
- created_by (FK → users.id)
- created_at

---

## receipt_items
Relasi kwitansi dan transaksi.

- id (UUID, PK)
- receipt_id (FK → receipts.id)
- payment_id (FK → payments.id)

---

## Relasi Utama

users → payments  
users → receipts  

classes → students  
students → payments  

academic_years → payments  
academic_years → spp_rates  

fee_types → payments  

payments → receipt_items → receipts

---

## Logika Sistem

### Status Lunas SPP
amount_paid >= spp_rates.amount

### Tunggakan
- Hanya untuk:
  - fee_types.is_spp = TRUE
  - fee_types.type = RUTIN
- Dihitung per bulan
- Tahun ajaran aktif

---

Dokumen ini menjadi dasar implementasi database dan logika bisnis aplikasi.
