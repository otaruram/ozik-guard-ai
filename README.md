# OzikSustain — Digital ESG & Legal Adjudicator

> **Hakim Digital Kepatuhan Hukum Lingkungan & Adjudikasi Spasial Energi Terbarukan**  
> Menggabungkan Ekstraksi Dokumen PDD *In-Memory*, Sensor PII Otomatis Sesuai UU PDP No. 27/2022, IndoBERT Semantic RAG pada Korpus Pasal.id, Penyelarasan Timbal-Balik Pakar (*Human-in-the-Loop*), serta Segel Kriptografi HMAC-SHA256.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Indonesia Regulation](https://img.shields.io/badge/legal%20corpus-UU%2032%2F2009%20%7C%20Perpres%2098%2F2021-emerald)]()
[![Data Privacy](https://img.shields.io/badge/privacy-UU%20PDP%20No.%2027%2F2022-amber)]()

---

## 📌 Ringkasan Proyek

**OzikSustain** dirancang untuk menyelesaikan hambatan audit kelayakan hukum dan tata ruang proyek energi baru terbarukan (EBT) di Indonesia. Proses audit manual dokumen *Project Design Document* (PDD) konvensional rata-rata memakan waktu 4–8 minggu dengan biaya puluhan hingga ratusan juta rupiah per proyek. OzikSustain mengotomasi verifikasi kepatuhan hukum hingga ke tingkat ayat dan klausa dalam hitungan detik dengan akurasi semantik tinggi dan audit trail yang dapat diverifikasi secara publik.

### 4 Pilar Utama Adjudikasi OzikSustain

1. **Zero Data Retention & Perlindungan Privasi (UU PDP No. 27/2022)**: Berkas PDF PDD diekstrak murni di memori RAM tanpa disimpan di disk penyimpanan server. Identitas pribadi (NIK, NIB, nama penanggung jawab) disensor secara otomatis sebelum masuk ke pipa inferensi.
2. **Verifikasi Koordinat Geospasial (GIS Validation)**: Pencocokan koordinat batas konsesi proyek terhadap zona lindung, batas hutan adat, dan sempadan air.
3. **IndoBERT Semantic RAG Engine**: Model transformer IndoBERT yang dilatih pada yurisprudensi Indonesia (UU 32/2009, Perpres 98/2021 tentang NEK, Permen ESDM 2/2024, PP 22/2021) menghitung kemiripan kosinus (*cosine similarity*) terhadap klausul PDD dan mendeteksi anomali kepatuhan.
4. **Human-in-the-Loop (HITL) & Segel Kriptografi HMAC-SHA256**: Setiap hasil rekomendasi hukum AI divalidasi oleh pakar terakreditasi melalui meja kerja adjudikasi. Sertifikat digital diterbitkan dengan QR code dan kode hash kriptografi yang tidak dapat dipalsukan dan dapat diaudit oleh publik di `/verify/$id`.

---

## 🏛️ Arsitektur Desain Antislop

Aplikasi ini dibangun dengan mematuhi prinsip **[Antislop Design Framework](https://www.antislop.ai.id)**:

- **Konsep Estetika**: *Sovereign Legal Gazette × Field Cartography Instrument*.
- **Palet Warna**:
  - *Archival Warm Paper* (`#F6F4EE` & `#EFECE4`)
  - *Deep Canopy Ink* (`#071913` & `#091E17`)
  - *Chlorophyll Emerald* (`#0D6E49` / `#34D399`)
  - *Surveyor Ochre* (`#D97706` / `#FBBF24`)
- **Tipografi**: `Fraunces` (Display editorial berwibawa), `Plus Jakarta Sans` (Teks regulasi & UI), `JetBrains Mono` (Telemetri geospasial, pasal hukum, dan hash kriptografi).
- **Zero Slop**: Bebas gradien ungu/neon klise, tanpa emoji di UI, seluruh tautan berfungsi penuh, dan terintegrasi dengan data realistis.

---

## 📂 Struktur Repositori

```
ozik-guard-ai/
├── fe/                             # Frontend (TanStack Start, React 19, Tailwind CSS v4, Vite)
│   ├── public/
│   │   └── images/                 # Aset ilustrasi editorial kustom (Topografi, Spasial, Auth)
│   ├── src/
│   │   ├── components/             # Komponen UI instrumen, SiteHeader, AuditWorkspace
│   │   │   └── dashboard/          # Panel Dashboard: KPI, Histori, Paket, Profil, KYC & Reviewer Queue
│   │   ├── routes/                 # File-based routing TanStack:
│   │   │   ├── index.tsx           # Editorial Hero, Simulator Klausul, & Pipeline Interaktif
│   │   │   ├── audit.tsx           # Uji Coba PDD Sandbox & Demo 1-Klik PLTS Cirata
│   │   │   ├── regulasi.tsx        # Direktori Hukum IndoBERT & Pencarian Pasal JDIH
│   │   │   ├── pricing.tsx         # Skema Biaya & Kalkulator ROI Interaktif
│   │   │   ├── playground.tsx      # Dokumentasi API interaktif (cURL, Node.js, Go)
│   │   │   ├── auth.tsx            # Gerbang Masuk OAuth & SSO Korporasi
│   │   │   ├── kyc-onboarding.tsx  # Pendaftaran Entitas Badan Usaha & Demo NIB
│   │   │   ├── dashboard.tsx       # Meja Kerja Korporasi Terpadu
│   │   │   ├── verify.$id.tsx      # Ledger Verifikasi Kriptografi Sertifikat Publik
│   │   │   └── review.$id.tsx      # Meja Kerja Adjudikasi Pakar (HITL)
│   │   └── styles.css              # Token warna OKLCH, Grid Archival, & Animasi Scan-Beam
├── backend/                        # Backend Go (Gin, Supabase, In-Memory PDF Parser, HMAC Engine)
│   ├── cmd/
│   ├── handlers/
│   ├── models/
│   └── services/
└── DESIGN.md                       # Dokumentasi resmi Design System & Token Antislop
```

---

## 🛠️ Panduan Menjalankan Secara Lokal

### Prasyarat

- **Node.js** v20+ atau v22+
- **Go** v1.21+ (untuk menjalankan modul backend lokal)
- **npm** atau **pnpm**

### 1. Menjalankan Frontend

```bash
# Pindah ke direktori frontend
cd fe

# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Akses antarmuka web di: `http://localhost:3000`

### 2. Memeriksa Tipe Data & Build Produksi

```bash
# Validasi TypeScript
npx tsc --noEmit

# Build bundel produksi
npm run build
```

---

## 🔗 Tautan & Referensi

- **Repository GitHub**: [https://github.com/otaruram/ozik-guard-ai](https://github.com/otaruram/ozik-guard-ai)
- **Design Framework**: [Antislop Design System](https://www.antislop.ai.id)
- **Kompetisi / Agenda**: PLN SustainAction 2026
- **Korpus Regulasi**: UU Lingkungan Hidup No. 32/2009, Perpres No. 98/2021, UU Perlindungan Data Pribadi No. 27/2022

---

## 📄 Lisensi

Hak Cipta © 2026 **OzikSustain Team**. Proyek ini didistribusikan di bawah lisensi MIT.
