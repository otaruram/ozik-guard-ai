import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Building2,
  Terminal,
  FileSearch,
  Minus,
} from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Skema Biaya & Kalkulator ROI Audit ESG : OzikSustain" },
      {
        name: "description",
        content:
          "Skema biaya transparan untuk audit kepatuhan PDD dan izin lingkungan bagi UMKM, perusahaan menengah, dan integrasi API korporasi.",
      },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    code: "TIER-01 // RETAIL & UMKM",
    name: "Pay-Per-Audit (Eceran)",
    price: "Rp 140.000",
    usd: "Setara $9 / dokumen",
    tagline: "Tanpa langganan bulanan. Bayar hanya ketika Anda butuh lencana verifikasi untuk tender.",
    features: [
      "Bonus 3 Kredit Penuh saat Registrasi Baru",
      "1 Kredit = 1 Audit Dokumen PDD Menyeluruh",
      "Sitasi Hukum Deterministik (Pasal.id)",
      "Penyensoran Otomatis Identitas (UU PDP)",
      "Unduh Laporan Resmi Format PDF",
      "Lencana QR Kriptografi Publik (SHA-256)",
    ],
    cta: "Daftar & Klaim 3 Kredit Gratis",
    to: "/auth",
    highlighted: false,
  },
  {
    code: "TIER-02 // VENDOR MENENGAH",
    name: "SME Eco-Basic",
    price: "Rp 750.000",
    usd: "Setara $49 / bulan",
    tagline: "Untuk pengembang proyek energi terbarukan dan konsultan dengan volume audit rutin.",
    features: [
      "10 Kredit Audit Penuh setiap Bulan",
      "Akses Penuh Workspace Drill-Down Interaktif",
      "Kalibrasi Prioritas oleh Auditor Pakar (HITL)",
      "Akses Kunci REST API Standar (60 req/menit)",
      "Manajemen Histori & Penyimpanan Sertifikat",
      "Notifikasi Perubahan Regulasi ESDM & LHK",
    ],
    cta: "Mulai Paket SME Eco-Basic",
    to: "/auth",
    highlighted: true,
  },
  {
    code: "TIER-03 // BUMN & KORPORASI",
    name: "Enterprise API",
    price: "Rp 15.500.000",
    usd: "Setara $999 / bulan",
    tagline: "Integrasi sistem backend-to-backend ke ERP/SAP untuk menyaring ratusan vendor sekaligus.",
    features: [
      "Kuota Audit Massal & Konkurensi Tinggi",
      "Integrasi Langsung Endpoint REST API",
      "Opsi Deployment Private VPC / On-Premise",
      "Kustomisasi Ambang Skor & Bobot Risiko",
      "Laporan Whitelabel & Dedicated Account Manager",
      "Jaminan Ketersediaan Layanan (SLA 99.9%)",
    ],
    cta: "Uji Spesifikasi REST API",
    to: "/playground",
    highlighted: false,
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Ekstraksi Dokumen In-Memory (Zero Data Retention)",
    tier1: "Termasuk",
    tier2: "Termasuk",
    tier3: "Dedicated VPC",
  },
  {
    feature: "Penyensoran Otomatis NIK & NIB (UU PDP No. 27/2022)",
    tier1: "Otomatis",
    tier2: "Otomatis",
    tier3: "Kustomisasi Entitas",
  },
  {
    feature: "Pencocokan Vektor Hukum IndoBERT (Pasal.id)",
    tier1: "Penuh",
    tier2: "Penuh",
    tier3: "Penuh + Regulasi Internal",
  },
  {
    feature: "Kalibrasi Auditor Pakar (Human-in-the-Loop)",
    tier1: "Standar (1x24 Jam)",
    tier2: "Prioritas (< 6 Jam)",
    tier3: "SLA Khusus & Reviewer Internal",
  },
  {
    feature: "Segel Kriptografi HMAC-SHA256 & QR Badge Publik",
    tier1: "Tersedia",
    tier2: "Tersedia",
    tier3: "Whitelabel Badge",
  },
  {
    feature: "Akses Kunci REST API Terprogram",
    tier1: "3 Kredit Uji Coba",
    tier2: "60 Request / Menit",
    tier3: "Tanpa Batas (Custom Rate)",
  },
];

function PricingPage() {
  const [docCount, setDocCount] = useState(12);

  // Traditional manual legal consultant cost in Indonesia: ~Rp 15.000.000 per PDD audit
  const manualCostIDR = docCount * 15000000;
  const ozikCostIDR = docCount <= 10 ? 750000 : docCount * 140000;
  const savingsIDR = manualCostIDR - ozikCostIDR;
  const timeSavedDays = docCount * 14;

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid text-[#091E17] pb-24">
      {/* Header Banner */}
      <div className="border-b-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] py-14 md:py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#FBBF24]">
              STRUKTUR BIAYA &amp; EFISIENSI PENGADAAN HIJAU
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              Demokratisasi Biaya Audit Kepatuhan Lingkungan
            </h1>
            <p className="text-sm sm:text-base text-[#F6F4EE]/75 leading-relaxed">
              Memangkas biaya audit konsultan manual dari puluhan juta rupiah dan waktu tunggu berminggu-minggu menjadi evaluasi deterministik berbiaya terukur.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-12 space-y-20">
        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`border-[1.5px] border-[#091E17] p-7 md:p-8 flex flex-col justify-between ${
                p.highlighted
                  ? "bg-[#091E17] text-[#F6F4EE] shadow-[8px_8px_0_#D97706] lg:-translate-y-2"
                  : "bg-white text-[#091E17] shadow-[5px_5px_0_#091E17]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] mb-4">
                  <span className={p.highlighted ? "text-[#FBBF24]" : "text-[#0D6E49]"}>
                    {p.code}
                  </span>
                  {p.highlighted && (
                    <span className="bg-[#FBBF24] text-[#091E17] px-2 py-0.5 font-bold uppercase">
                      PALING BANYAK DIPILIH
                    </span>
                  )}
                </div>
                <h2 className="font-editorial text-2xl font-semibold">{p.name}</h2>
                <div className="mt-4 pb-4 border-b border-current/15">
                  <div className="font-mono text-3xl md:text-4xl font-bold tracking-tight tabular-nums">
                    {p.price}
                  </div>
                  <div
                    className={`font-mono text-xs mt-1 ${
                      p.highlighted ? "text-[#F6F4EE]/70" : "text-[#4A5D54]"
                    }`}
                  >
                    {p.usd}
                  </div>
                </div>
                <p
                  className={`mt-4 text-xs leading-relaxed ${
                    p.highlighted ? "text-[#F6F4EE]/80" : "text-[#4A5D54]"
                  }`}
                >
                  {p.tagline}
                </p>

                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs font-medium">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          p.highlighted ? "text-[#34D399]" : "text-[#0D6E49]"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  to={p.to}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 font-mono text-xs font-bold uppercase tracking-widest border-[1.5px] transition-all ${
                    p.highlighted
                      ? "bg-[#FBBF24] text-[#091E17] border-[#FBBF24] hover:bg-[#F59E0B]"
                      : "bg-[#091E17] text-[#F6F4EE] border-[#091E17] hover:bg-[#0D6E49]"
                  }`}
                >
                  {p.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive ROI & Cost Efficiency Calculator */}
        <section className="border-[1.5px] border-[#091E17] bg-white shadow-[6px_6px_0_#091E17] overflow-hidden">
          <div className="bg-[#071913] text-[#F6F4EE] px-6 md:px-8 py-4 border-b-[1.5px] border-[#091E17] flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-widest">
              <Calculator className="h-4 w-4 text-[#FBBF24]" />
              SIMULATOR EFISIENSI BIAYA &amp; WAKTU AUDIT (TANGIBLE ROI)
            </div>
            <span className="font-mono text-[10px] text-[#34D399]">ESTIMASI REAL-TIME</span>
          </div>

          <div className="p-6 md:p-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <h3 className="font-editorial text-2xl md:text-3xl font-semibold text-[#091E17]">
                Hitung Penghematan Anggaran Kepatuhan Rantai Pasok Anda
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5D54] leading-relaxed">
                Geser jumlah dokumen vendor atau PDD yang dievaluasi setiap bulan untuk membandingkan biaya konsultasi hukum lingkungan konvensional dengan mesin adjudikasi OzikSustain.
              </p>

              <div className="bg-[#F6F4EE] border-[1.5px] border-[#091E17] p-5 space-y-4">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold uppercase text-[#091E17]">
                    VOLUME DOKUMEN PDD / BULAN:
                  </span>
                  <span className="text-2xl font-bold text-[#0D6E49] tabular-nums">
                    {docCount} Dokumen
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={docCount}
                  onChange={(e) => setDocCount(Number(e.target.value))}
                  className="w-full accent-[#091E17] cursor-pointer h-2 bg-[#ECE9DF]"
                />
                <div className="flex justify-between font-mono text-[10px] text-[#4A5D54]">
                  <span>1 Dokumen (UMKM)</span>
                  <span>25 Dokumen (Menengah)</span>
                  <span>100 Dokumen (Enterprise)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4 font-mono">
              <div className="border-[1.5px] border-[#091E17] bg-[#F6F4EE] p-5 space-y-2">
                <span className="text-[10px] uppercase text-[#4A5D54] block">
                  BIAYA KONSULTAN MANUAL (EST.)
                </span>
                <div className="text-xl font-bold text-[#B91C1C] line-through tabular-nums">
                  Rp {manualCostIDR.toLocaleString("id-ID")}
                </div>
                <span className="text-[11px] text-[#4A5D54] block">
                  Waktu tunggu: ~{timeSavedDays} hari kerja
                </span>
              </div>

              <div className="border-[1.5px] border-[#091E17] bg-[#E6F4EE] p-5 space-y-2">
                <span className="text-[10px] uppercase text-[#0D6E49] font-bold block">
                  BIAYA OZIKSUSTAIN
                </span>
                <div className="text-xl font-bold text-[#091E17] tabular-nums">
                  Rp {ozikCostIDR.toLocaleString("id-ID")}
                </div>
                <span className="text-[11px] text-[#0D6E49] font-bold block">
                  Selesai dalam &lt; 1 Hari Kerja (HITL)
                </span>
              </div>

              <div className="sm:col-span-2 border-[1.5px] border-[#091E17] bg-[#091E17] text-[#F6F4EE] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase text-[#FBBF24] font-bold block">
                    ESTIMASI PENGHEMATAN ANGGARAN
                  </span>
                  <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
                    Rp {savingsIDR.toLocaleString("id-ID")}
                  </div>
                </div>
                <Link
                  to="/audit"
                  className="px-4 py-2.5 bg-[#FBBF24] text-[#091E17] text-xs font-bold uppercase tracking-wider hover:bg-[#F59E0B] transition-colors shrink-0 text-center"
                >
                  Coba Gratis Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Specification Comparison Table */}
        <section className="space-y-6">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D6E49] mb-1">
              MATRIKS SPESIFIKASI TEKNIS
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#091E17]">
              Perbandingan Parameter Antar Paket
            </h3>
          </div>

          <div className="border-[1.5px] border-[#091E17] bg-white shadow-[6px_6px_0_#091E17] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#071913] text-[#F6F4EE] border-b-[1.5px] border-[#091E17] font-mono text-xs uppercase">
                  <th className="p-4">Kapabilitas &amp; Parameter</th>
                  <th className="p-4">Pay-Per-Audit</th>
                  <th className="p-4 text-[#FBBF24]">SME Eco-Basic</th>
                  <th className="p-4">Enterprise API</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#091E17]/15 text-xs">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-[#F6F4EE]/60">
                    <td className="p-4 font-semibold text-[#091E17]">{row.feature}</td>
                    <td className="p-4 font-mono text-[#4A5D54]">{row.tier1}</td>
                    <td className="p-4 font-mono font-bold text-[#0D6E49] bg-[#E6F4EE]/30">
                      {row.tier2}
                    </td>
                    <td className="p-4 font-mono font-semibold text-[#091E17]">{row.tier3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
