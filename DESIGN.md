# DESIGN.md — OzikSustain Design Direction & Antislop Specification

## 1. Brand Identity & Creative Soul
- **Product Name**: OzikSustain
- **Category**: Enterprise & SME Greentech / Legaltech Compliance Engine (Indonesia)
- **Role**: "Hakim Digital" (Digital Adjudicator) untuk audit dokumen lingkungan (Project Design Document / PDD, AMDAL, UKL-UPL) terhadap regulasi nasional (UU No. 32/2009, Permen ESDM, Perpres No. 98/2021, UU PDP No. 27/2022) menggunakan IndoBERT Semantic RAG, pengawasan pakar (Human-in-the-Loop), dan segel kriptografi HMAC-SHA256.
- **Aesthetic Archetype**: ** Sovereign Legal Gazette × Field Cartography Instrument**
  Menggabungkan kewibawaan lembaran negara / dokumen hukum resmi (tipografi serif editorial yang tajam, garis batas presisi 1px, penomoran pasal terstruktur) dengan instrumen pemetaan spasial & terminal kriptografi modern (data monospaced tabular, radar telemetri, visualisasi vektor real-time).

---

## 2. Antislop Filter Compliance (`antislop.ai.id`)
Desain ini tunduk secara ketat pada aturan **Antislop**:
1. **Hard Gates**:
   - **Zero Unmotivated Neon/Purple Gradients**: Dilarang menggunakan gradasi ungu/indigo/biru-neon atau bola blur dekoratif tanpa fungsi.
   - **Zero Emoji Icons**: Dilarang menggunakan emoji (`🚀`, `🔥`, `📋`, `🔍`, `🌱`, `🔴`, `🟢`, `🔒`) sebagai pengganti ikon UI atau bullet list. Gunakan ikon vektor presisi (`lucide-react` stroke 1.75px) atau indikator geometri/tipografi.
   - **Zero Em-Dash Abuse & AI Copy Clichés**: Tidak ada kalimat pembuka generik ala LLM, tidak ada hiperbola kosong, dan tidak ada pencampuran Bahasa Indonesia & Bahasa Inggris yang tidak konsisten. Gunakan Bahasa Indonesia baku-teknis yang lugas, terukur, dan spesifik domain hukum/energi.
   - **Zero Dead Interactions**: Setiap tombol, tautan, filter, tab, dan formulir wajib memiliki fungsi nyata (navigasi rute, pemanggilan API, modal, salin ke papan klip, atau simulasi interaktif). Tidak boleh ada `href="#"`.
   - **No Cookie-Cutter Bento / Symmetrical Card Grids**: Hindari grid kartu 3-kolom atau 4-kolom yang identik tanpa hierarki. Gunakan tata letak asimetris editorial, tabel spesifikasi teknis, dan panel instrumen berlapis.

2. **Liveliness Toolkit (Energy, Rhythm, Motion)**:
   - **Energy (7/10 — Authoritative & Kinetic)**: Kontras tinggi antara kertas arsip hangat (`#F6F4EE`) dan tinta hutan pekat (`#091E17`), diperkuat aksen oker emas (`#D97706`) dan klorofil (`#0D6E49`).
   - **Rhythm (Editorial Cadence)**: Pergantian irama visual antara bagian terang (kertas arsip dengan garis grid arsitektural), bagian gelap (terminal telemetri IndoBERT & kriptografi `#071913`), serta komponen interaktif langsung di halaman utama.
   - **Motion (Purposeful Instrument Choreography)**:
     - Animasi pemindaian klausul dokumen secara real-time (scanning beam, redaksi PII otomatis, dan pencocokan vektor Pasal.id).
     - Animasi radar spasial & gelombang telemetri SVG.
     - Transisi masuk bertahap (`staggered reveal`) dan umpan balik mikro yang presisi pada setiap interaksi.

---

## 3. Color Tokens (OKLCH & Hex Equivalents)
- **Background Primary (Warm Archival Paper)**: `#F6F4EE` (`oklch(0.968 0.011 92)`)
- **Background Elevated / Surface**: `#FFFFFF` (`oklch(1 0 0)`)
- **Background Secondary (Stone Parchment)**: `#ECE9DF` (`oklch(0.932 0.014 90)`)
- **Surface Dark (Deep Canopy Ink)**: `#071913` (`oklch(0.195 0.032 168)`)
- **Surface Dark Elevated**: `#0C261E` (`oklch(0.245 0.042 168)`)
- **Foreground Primary (Forest Ink)**: `#091E17` (`oklch(0.21 0.035 168)`)
- **Foreground Muted**: `#4A5D54` (`oklch(0.46 0.025 165)`)
- **Primary Brand Accent (Chlorophyll Emerald)**: `#0D6E49` (`oklch(0.48 0.115 162)`)
- **Highlight Signal (Surveyor Ochre / Amber)**: `#D97706` (`oklch(0.66 0.165 62)`)
- **Semantic Status**:
  - **Compliant / Verified**: `#0D6E49` (Surface `#E6F4EE`, Border `#86EFAC`)
  - **Medium Risk / Warning**: `#B45309` (Surface `#FEF3C7`, Border `#FCD34D`)
  - **High Risk / Violation**: `#B91C1C` (Surface `#FEE2E2`, Border `#FCA5A5`)
- **Border Hairline**: `#D5D1C5` (`1px solid`) untuk pemisah struktural, dan `#091E17` (`1.5px solid`) untuk bingkai instrumen aktif.

---

## 4. Typography System
- **Display / Editorial Headlines (`--font-display`)**: `'Fraunces'` atau `'Instrument Serif'`, memberi bobot layaknya dokumen konstitusi dan jurnal ilmiah.
- **UI & Technical Body (`--font-sans`)**: `'Plus Jakarta Sans'`, bersih, modern, dan sangat terbaca untuk antarmuka SaaS padat data.
- **Telemetry, Hash & Legal Citations (`--font-mono`)**: `'JetBrains Mono'`, wajib dengan `font-variant-numeric: tabular-nums` untuk skor kelayakan, nomor pasal, NIB, waktu eksekusi, dan hash SHA-256.

