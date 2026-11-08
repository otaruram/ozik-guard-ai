import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Globe,
  Scale,
  Code2,
  QrCode,
  CheckCircle2,
  Search,
  Loader2,
  Lock,
  FileSearch,
  Fingerprint,
  Compass,
  EyeOff,
  Activity,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const SAMPLE_CLAUSES = [
  {
    id: "KLAUSUL-04.2",
    status: "HIGH_RISK",
    riskLabel: "Risiko Tinggi • Pelanggaran Izin",
    rawText:
      "Pembangunan fasilitas PLTS Terapung berkapasitas 15 MWp pada area waduk akan langsung dimulai paralel sambil menunggu pengajuan dokumen UKL-UPL kepada instansi daerah.",
    maskedEntity: "PT Nusantara Solar Mandiri (NIB: 9120******481)",
    lawRef: "UU No. 32 Tahun 2009 • Pasal 36 Ayat (1) & Pasal 109",
    similarity: "96.4%",
    analysis:
      "Konstruksi fisik sebelum terbitnya persetujuan lingkungan (AMDAL/UKL-UPL) merupakan pelanggaran pidana administratif dan materiil.",
    revision:
      "Pelaksanaan konstruksi fisik fasilitas PLTS Terapung 15 MWp wajib dilaksanakan setelah diterbitkannya Persetujuan Lingkungan (UKL-UPL/AMDAL) yang sah sesuai UU No. 32/2009 dan PP No. 22/2021.",
  },
  {
    id: "KLAUSUL-07.1",
    status: "MEDIUM_RISK",
    riskLabel: "Risiko Sedang • Klaim Karbon",
    rawText:
      "Seluruh reduksi emisi sebesar 21.400 tCO2e per tahun dari proyek ini akan diklaim langsung sebagai kredit karbon komersial di pasar internasional tanpa registrasi SRN PPI.",
    maskedEntity: "Ir. Hendra Wijaya (NIK: 3174**********02)",
    lawRef: "Perpres No. 98 Tahun 2021 • Pasal 47 & Pasal 54",
    similarity: "92.8%",
    analysis:
      "Perdagangan karbon lintas negara wajib tercatat pada Sistem Registri Nasional Pengendalian Perubahan Iklim (SRN PPI) dan memperoleh otorisasi Menteri LHK.",
    revision:
      "Reduksi emisi sebesar 21.400 tCO2e/tahun wajib diverifikasi oleh lembaga independen, dicatatkan pada SRN PPI Kementerian LHK, serta mengikuti mekanisme otorisasi Nilai Ekonomi Karbon sesuai Perpres No. 98/2021.",
  },
  {
    id: "KLAUSUL-09.4",
    status: "COMPLIANT",
    riskLabel: "Patuh • Standar Interkoneksi",
    rawText:
      "Sistem inverter PLTS Atap dilengkapi fitur anti-islanding otomatis dan sinkronisasi frekuensi 50 Hz sesuai pedoman distribusi tenaga listrik PLN.",
    maskedEntity: "Divisi Teknis Transmisi (ID: T-8821)",
    lawRef: "Permen ESDM No. 2 Tahun 2024 • Pasal 5 Ayat (2)",
    similarity: "98.1%",
    analysis:
      "Spesifikasi teknis proteksi jaringan dan keandalan instalasi telah memenuhi ketentuan keselamatan ketenagalistrikan nasional.",
    revision:
      "Klausul telah sesuai dengan regulasi teknis Permen ESDM No. 2 Tahun 2024. Tidak diperlukan perubahan redaksional.",
  },
] as const;

const PIPELINE_STAGES = [
  {
    step: "01",
    code: "IN-MEMORY PARSER & UU PDP",
    title: "Ekstraksi Dokumen Tanpa Jejak & Redaksi Data Pribadi",
    desc: "Dokumen PDD dibaca langsung di memori volatil (RAM) tanpa disimpan ke diska permanen. Algoritma penyensoran otomatis mendeteksi dan menyamarkan NIK, nama penanggung jawab, serta nomor NIB sebelum teks dikirim ke mesin analisis.",
    metricLabel: "Retensi Dokumen Mentah",
    metricValue: "0 Byte",
    lawTag: "UU PDP No. 27 Tahun 2022",
  },
  {
    step: "02",
    code: "SPATIAL & GEOMETRY VERIFICATION",
    title: "Validasi Poligon Lahan, Iradiasi & Kawasan Lindung",
    desc: "Koordinat proyek yang tercantum dalam dokumen disilangkan dengan peta kawasan hutan lindung, lahan gambut, dan data potensi iradiasi surya untuk mendeteksi klaim kapasitas energi yang tidak realistis (greenwashing).",
    metricLabel: "Presisi Poligon Spasial",
    metricValue: "10 Meter",
    lawTag: "Inpres Moratorium & Tata Ruang",
  },
  {
    step: "03",
    code: "INDOBERT SEMANTIC LEGAL RAG",
    title: "Pencocokan Vektor Hukum Berbasis Sintaksis Indonesia",
    desc: "Setiap klausa dokumen diubah menjadi representasi vektor menggunakan IndoBERT yang dilatih khusus pada korpus hukum Indonesia, lalu dicocokkan secara deterministik terhadap ribuan pasal aktif di database Pasal.id.",
    metricLabel: "Dimensi Vektor Hukum",
    metricValue: "768-Dim",
    lawTag: "Korpus Terindeks Pasal.id",
  },
  {
    step: "04",
    code: "HITL CALIBRATION & HMAC-SHA256",
    title: "Adjudikasi Pakar Hukum & Segel Kriptografi Publik",
    desc: "Auditor manusia (Human-in-the-Loop) meninjau hasil anotasi AI untuk mencegah bias mesin. Laporan yang disetujui dikunci dengan hash kriptografi HMAC-SHA256 dan diterbitkan sebagai QR Badge yang dapat diverifikasi publik.",
    metricLabel: "Integritas Sertifikat",
    metricValue: "SHA-256",
    lawTag: "Buku Besar Verifikasi Publik",
  },
] as const;

function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F4EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#091E17]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#4A5D54]">
            Memuat Instrumen OzikSustain...
          </span>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="bg-[#F6F4EE] min-h-screen text-[#091E17] selection:bg-[#091E17] selection:text-[#F6F4EE]">
      <HeroSection />
      <LiveBenchmarkBar />
      <InteractivePipelineSection />
      <CapabilitiesMatrixSection />
      <VerificationLedgerSection />
      <PricingLedgerSection />
      <EditorialFooter />
    </div>
  );
}

function HeroSection() {
  const [activeClauseIdx, setActiveClauseIdx] = useState(0);
  const [copiedRev, setCopiedRev] = useState(false);
  const activeClause = SAMPLE_CLAUSES[activeClauseIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveClauseIdx((prev) => (prev + 1) % SAMPLE_CLAUSES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const copyRevision = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRev(true);
    setTimeout(() => setCopiedRev(false), 1800);
  };

  return (
    <section className="relative border-b-[1.5px] border-[#091E17] bg-[#F6F4EE] bg-archival-grid overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Editorial Authority (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 animate-reveal-up">
            <div className="inline-flex items-center gap-3 border-[1.5px] border-[#091E17] bg-white px-3.5 py-1.5 shadow-[3px_3px_0_#091E17]">
              <span className="h-2 w-2 bg-[#0D6E49]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#091E17]">
                INSTRUMEN ADJUDIKASI ESG & REGULASI LINGKUNGAN
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[62px] font-semibold tracking-tight text-[#091E17] leading-[1.05]">
                Audit Kepatuhan Hukum &amp; Spasial Proyek Hijau{" "}
                <span className="italic font-normal text-[#0D6E49] underline decoration-[#D97706] decoration-2 underline-offset-8">
                  Secara Deterministik.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#4A5D54] leading-relaxed max-w-2xl font-normal">
                OzikSustain membedah dokumen <strong className="font-semibold text-[#091E17]">Project Design Document (PDD)</strong>, AMDAL, dan UKL-UPL vendor dalam hitungan detik. Memadukan pencarian vektor <strong className="font-semibold text-[#091E17]">IndoBERT</strong> atas ribuan pasal regulasi nasional, verifikasi spasial satelit, tinjauan pakar hukum, hingga segel kriptografi <span className="font-mono text-sm text-[#091E17] bg-[#ECE9DF] px-1.5 py-0.5">HMAC-SHA256</span>.
              </p>
            </div>

            {/* Primary Action Cluster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/audit"
                className="inline-flex items-center justify-center gap-3 border-[1.5px] border-[#091E17] bg-[#091E17] px-7 py-4 text-xs font-bold uppercase tracking-widest text-[#F6F4EE] shadow-[5px_5px_0_#D97706] transition-all hover:-translate-y-0.5 hover:bg-[#0D6E49]"
              >
                <FileSearch className="h-4 w-4 text-[#FBBF24]" />
                Uji Coba Audit PDD Gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/regulasi"
                className="inline-flex items-center justify-center gap-2.5 border-[1.5px] border-[#091E17] bg-white px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#091E17] shadow-[4px_4px_0_#091E17] transition-all hover:-translate-y-0.5 hover:bg-[#ECE9DF]"
              >
                <Scale className="h-4 w-4 text-[#0D6E49]" />
                Eksplorasi Direktori Pasal.id
              </Link>
            </div>

            {/* Editorial Visual Banner Card with Generated Topographic Art */}
            <div className="border-[1.5px] border-[#091E17] bg-white p-3 shadow-[4px_4px_0_#091E17]">
              <div className="grid sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 relative h-44 sm:h-40 overflow-hidden border border-[#091E17] bg-[#071913]">
                  <img
                    src="/images/hero-topography.png"
                    alt="Ilustrasi Topografi dan Pemetaan Spasial PLTS Nusantara"
                    className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  {/* Animated Topographic Radar Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#071913]/80 via-transparent to-transparent flex flex-col justify-between p-2.5">
                    <div className="flex items-center justify-between font-mono text-[9px] text-[#F6F4EE]/90">
                      <span className="bg-[#071913]/80 px-1.5 py-0.5 border border-[#F6F4EE]/20">
                        LAT -0.7893° S
                      </span>
                      <span className="text-[#34D399] flex items-center gap-1 bg-[#071913]/80 px-1.5 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-ping" />
                        SAT-LOCK
                      </span>
                    </div>
                    <div className="font-mono text-[9px] text-[#FBBF24] bg-[#071913]/85 px-2 py-1 border-l-2 border-[#FBBF24]">
                      IRADIASI: 4.82 kWh/m²/hari • ZONA AMAN
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-7 px-2 py-1 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0D6E49]">
                      ARSITEKTUR DUAL-TRACK AUDIT
                    </span>
                    <span className="font-mono text-[10px] text-[#4A5D54]">FIG. 01 // 2026</span>
                  </div>
                  <h2 className="font-editorial text-lg font-semibold text-[#091E17] leading-snug">
                    Menggabungkan Kecerdasan Vektor Hukum &amp; Bukti Spasial Lapangan
                  </h2>
                  <p className="text-xs text-[#4A5D54] leading-relaxed">
                    Bukan sekadar kalkulator emisi pasif. Sistem memeriksa kesesuaian klaim teknis proyek terhadap kawasan hutan lindung, baku mutu lingkungan, dan kewajiban perdagangan karbon nasional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Adjudication Terminal (5 Cols) */}
          <div className="lg:col-span-5 border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] shadow-[8px_8px_0_#091E17] relative overflow-hidden">
            {/* Scanning Beam Animation */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#34D399]/10 via-[#34D399]/5 to-transparent animate-scan-beam z-0" />

            {/* Terminal Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#F6F4EE]/15 bg-[#0C261E] px-4 py-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#34D399]" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#F6F4EE]">
                  SIMULATOR INSPEKSI KLAUSUL PDD
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#FBBF24] border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-2 py-0.5">
                LIVE DEMO
              </span>
            </div>

            {/* Interactive Clause Selector Tabs */}
            <div className="relative z-10 grid grid-cols-3 border-b border-[#F6F4EE]/15 bg-[#091E17]">
              {SAMPLE_CLAUSES.map((item, idx) => {
                const isSelected = idx === activeClauseIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveClauseIdx(idx)}
                    className={`px-3 py-2.5 text-left font-mono text-[10px] transition-colors border-r last:border-r-0 border-[#F6F4EE]/15 cursor-pointer ${
                      isSelected
                        ? "bg-[#F6F4EE] text-[#091E17] font-bold"
                        : "text-[#F6F4EE]/70 hover:bg-[#0C261E] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.id}</span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.status === "HIGH_RISK"
                            ? "bg-[#EF4444]"
                            : item.status === "MEDIUM_RISK"
                            ? "bg-[#F59E0B]"
                            : "bg-[#10B981]"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Clause Inspection Body */}
            <div className="relative z-10 p-5 space-y-4">
              {/* Redaction & Risk Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider border ${
                    activeClause.status === "HIGH_RISK"
                      ? "bg-[#7F1D1D]/60 text-[#FCA5A5] border-[#EF4444]"
                      : activeClause.status === "MEDIUM_RISK"
                      ? "bg-[#78350F]/60 text-[#FCD34D] border-[#F59E0B]"
                      : "bg-[#064E3B]/60 text-[#6EE7B7] border-[#10B981]"
                  }`}
                >
                  {activeClause.riskLabel}
                </span>
                <span className="font-mono text-[10px] text-[#34D399]">
                  VEC SIMILARITY: {activeClause.similarity}
                </span>
              </div>

              {/* Extracted Clause Box */}
              <div className="border border-[#F6F4EE]/20 bg-[#091E17]/90 p-3.5 space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#F6F4EE]/60">
                  <span>KUTIPAN DOKUMEN PDD</span>
                  <span className="inline-flex items-center gap-1 text-[#FBBF24]">
                    <EyeOff className="h-3 w-3" /> {activeClause.maskedEntity}
                  </span>
                </div>
                <p className="font-serif text-xs sm:text-sm italic leading-relaxed text-[#F6F4EE]/95">
                  "{activeClause.rawText}"
                </p>
              </div>

              {/* Matched Regulation Citation */}
              <div className="border-l-2 border-[#FBBF24] bg-[#0C261E] pl-3.5 py-2 pr-3 space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#FBBF24]">
                  RUJUKAN HUKUM PASAL.ID
                </div>
                <div className="font-mono text-xs font-bold text-white">
                  {activeClause.lawRef}
                </div>
                <p className="text-xs text-[#F6F4EE]/75 leading-relaxed">
                  {activeClause.analysis}
                </p>
              </div>

              {/* Suggested Revision with Copy Action */}
              <div className="border border-[#34D399]/30 bg-[#064E3B]/30 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#34D399]">
                    REKOMENDASI REDAKSI HUKUM AI
                  </span>
                  <button
                    type="button"
                    onClick={() => copyRevision(activeClause.revision)}
                    className="inline-flex items-center gap-1 border border-[#34D399]/40 bg-[#071913] px-2 py-1 font-mono text-[10px] text-[#34D399] hover:bg-[#34D399] hover:text-[#071913] transition-colors cursor-pointer"
                  >
                    {copiedRev ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedRev ? "Tersalin" : "Salin Draf"}
                  </button>
                </div>
                <p className="font-serif text-xs leading-relaxed text-[#E6F4EE]">
                  "{activeClause.revision}"
                </p>
              </div>

              {/* Bottom Terminal Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-[#F6F4EE]/15 font-mono text-[10px] text-[#F6F4EE]/60">
                <span>HASH: 8f94e2a0...c41b</span>
                <Link
                  to="/audit"
                  className="text-[#FBBF24] font-bold hover:underline inline-flex items-center gap-1"
                >
                  Unggah Dokumen Anda <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveBenchmarkBar() {
  const metrics = [
    {
      code: "M-01",
      label: "Kecepatan Audit Dokumen PDD",
      value: "< 30 Detik",
      note: "Dibandingkan 14–21 hari kerja audit manual",
    },
    {
      code: "M-02",
      label: "Model Bahasa Vektor Hukum",
      value: "IndoBERT",
      note: "Terlatih khusus sintaksis regulasi Indonesia",
    },
    {
      code: "M-03",
      label: "Perlindungan Privasi Dokumen",
      value: "UU PDP Ready",
      note: "Auto-masking NIK & NIB + Zero RAM Retention",
    },
    {
      code: "M-04",
      label: "Keaslian Lencana Sertifikasi",
      value: "HMAC-SHA256",
      note: "Dapat diverifikasi publik via QR & Hash",
    },
  ];

  return (
    <section className="border-b-[1.5px] border-[#091E17] bg-white">
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#091E17]/20">
        {metrics.map((m) => (
          <div key={m.code} className="p-6 md:p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#4A5D54] mb-3">
              <span>INDIKATOR // {m.code}</span>
              <span className="h-1.5 w-1.5 bg-[#0D6E49]" />
            </div>
            <div>
              <div className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-[#091E17] tabular-nums">
                {m.value}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-[#091E17]">
                {m.label}
              </div>
              <p className="mt-1 text-xs text-[#4A5D54] leading-relaxed">{m.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InteractivePipelineSection() {
  const [activeStage, setActiveStage] = useState(0);
  const current = PIPELINE_STAGES[activeStage];

  return (
    <section id="arsitektur" className="py-20 md:py-28 border-b-[1.5px] border-[#091E17] bg-[#F6F4EE]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b-[1.5px] border-[#091E17] pb-8">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D6E49] mb-2">
              ARSITEKTUR PEMROSESAN // 04 TAHAP DETERMINISTIK
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-[#091E17]">
              Cara Kerja Mesin Drill-Down OzikSustain
            </h2>
          </div>
          <p className="text-sm text-[#4A5D54] max-w-md leading-relaxed">
            Setiap dokumen melewati empat gerbang verifikasi berurutan sebelum diizinkan memperoleh lencana kepatuhan kriptografi. Klik setiap tahapan untuk melihat telemetri pemrosesan.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Step Selector List (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isSelected = idx === activeStage;
              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`w-full text-left p-5 border-[1.5px] border-[#091E17] transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#091E17] text-[#F6F4EE] shadow-[5px_5px_0_#D97706] -translate-y-0.5"
                      : "bg-white text-[#091E17] hover:bg-[#ECE9DF]"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1.5">
                    <span className={isSelected ? "text-[#FBBF24]" : "text-[#0D6E49]"}>
                      TAHAP {stage.step} // {stage.code}
                    </span>
                    <span className="opacity-70">{stage.metricValue}</span>
                  </div>
                  <h3 className="font-editorial text-lg font-semibold leading-snug">
                    {stage.title}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Right: Interactive Stage Visualizer (7 Cols) */}
          <div className="lg:col-span-7 border-[1.5px] border-[#091E17] bg-white shadow-[6px_6px_0_#091E17] flex flex-col justify-between overflow-hidden">
            <div className="border-b-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#FBBF24] border border-[#FBBF24]/40 px-2 py-0.5">
                  STAGE {current.step}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-[#F6F4EE]/90">
                  {current.code}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#34D399]">{current.lawTag}</span>
            </div>

            {/* Dynamic Stage Illustration / Diagram */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6 bg-[#F6F4EE]/50">
              {activeStage === 0 && (
                <div className="border-[1.5px] border-[#091E17] bg-white p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#091E17]/15 pb-2.5 font-mono text-[11px] text-[#4A5D54]">
                    <span>PIPELINE PENYENSORAN OTOMATIS (UU PDP)</span>
                    <span className="text-[#0D6E49] font-bold">RAM BUFFER ONLY</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="border border-[#B91C1C]/40 bg-[#FEE2E2]/40 p-3.5 space-y-1.5">
                      <div className="text-[10px] font-bold text-[#B91C1C] uppercase">
                        SEBELUM MASKING (INPUT MENTAH)
                      </div>
                      <p className="text-[#091E17] leading-relaxed">
                        Pemohon: <span className="bg-[#FCA5A5] px-1 font-bold">Budi Santoso</span>
                        <br />
                        NIK: <span className="bg-[#FCA5A5] px-1 font-bold">3201140908850003</span>
                        <br />
                        NIB: <span className="bg-[#FCA5A5] px-1 font-bold">9120301842910</span>
                      </p>
                    </div>
                    <div className="border border-[#0D6E49]/40 bg-[#E6F4EE]/60 p-3.5 space-y-1.5">
                      <div className="text-[10px] font-bold text-[#0D6E49] uppercase">
                        SESUDAH MASKING (DIKIRIM KE AI)
                      </div>
                      <p className="text-[#091E17] leading-relaxed">
                        Pemohon: <span className="bg-[#091E17] text-[#FBBF24] px-1">[REDACTED_PERSON]</span>
                        <br />
                        NIK: <span className="bg-[#091E17] text-[#FBBF24] px-1">[REDACTED_NIK_PDP]</span>
                        <br />
                        NIB: <span className="bg-[#091E17] text-[#FBBF24] px-1">9120******910</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeStage === 1 && (
                <div className="border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] p-5 relative overflow-hidden">
                  <div className="grid sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-5 flex items-center justify-center">
                      <img
                        src="/images/spatial-layers.png"
                        alt="Diagram Lapisan Spasial"
                        className="h-40 w-full object-contain border border-[#F6F4EE]/20 bg-[#091E17]"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="sm:col-span-7 font-mono text-xs space-y-2.5">
                      <div className="text-[#FBBF24] text-[10px] font-bold uppercase">
                        TELEMETRI GEOSPASIAL &amp; OVERLAY KAWASAN
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between border-b border-[#F6F4EE]/15 pb-1">
                          <span className="text-[#F6F4EE]/60">Koordinat Poligon:</span>
                          <span className="text-[#34D399]">-2.5489° S, 112.9483° E</span>
                        </div>
                        <div className="flex justify-between border-b border-[#F6F4EE]/15 pb-1">
                          <span className="text-[#F6F4EE]/60">Tumpang Tindih Hutan Lindung:</span>
                          <span className="text-[#34D399]">0.00% (CLEAR)</span>
                        </div>
                        <div className="flex justify-between border-b border-[#F6F4EE]/15 pb-1">
                          <span className="text-[#F6F4EE]/60">Moratorium Gambut Primer:</span>
                          <span className="text-[#34D399]">Di Luar Area (VALID)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#F6F4EE]/60">Potensi Surya Tahunan:</span>
                          <span className="text-[#FBBF24]">1.760 kWh/kWp</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStage === 2 && (
                <div className="border-[1.5px] border-[#091E17] bg-white p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#4A5D54] border-b border-[#091E17]/15 pb-2">
                    <span>PENCOCOKAN VEKTOR INDOBERT (COSINE SIMILARITY)</span>
                    <span className="text-[#0D6E49]">TOP-K = 3 PASAL</span>
                  </div>
                  {[
                    { law: "UU No. 32 Tahun 2009 Pasal 36 (Izin Lingkungan)", score: 96 },
                    { law: "Perpres No. 98 Tahun 2021 Pasal 47 (Nilai Ekonomi Karbon)", score: 91 },
                    { law: "Permen ESDM No. 2 Tahun 2024 Pasal 5 (PLTS Atap)", score: 88 },
                  ].map((item) => (
                    <div key={item.law} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-[#091E17]">{item.law}</span>
                        <span className="font-bold text-[#0D6E49]">{item.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#ECE9DF] border border-[#091E17]/30">
                        <div
                          className="h-full bg-[#0D6E49] transition-all duration-500"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeStage === 3 && (
                <div className="border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] p-5 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-[#34D399]">
                    <span>SEGEL KRIPTOGRAFI &amp; OTORISASI REVIEWER</span>
                    <span>STATUS: VERIFIED</span>
                  </div>
                  <div className="p-3 bg-[#091E17] border border-[#34D399]/30 text-[11px] break-all text-[#F6F4EE]/90">
                    HMAC_SHA256(&quot;OZK-2026-PDD&quot;) ={" "}
                    <span className="text-[#FBBF24]">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#F6F4EE]/70">
                    <span>Auditor Pakar: Disetujui (HITL Sign-off)</span>
                    <Link to="/verify/$id" params={{ id: "sample-verified-hash" }} className="text-[#FBBF24] underline">
                      Lihat Contoh Sertifikat
                    </Link>
                  </div>
                </div>
              )}

              {/* Description & Footer */}
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl font-semibold text-[#091E17]">
                  {current.title}
                </h3>
                <p className="text-sm text-[#4A5D54] leading-relaxed">{current.desc}</p>
                <div className="pt-4 border-t border-[#091E17]/15 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#4A5D54] block">
                      TOLOK UKUR TEKNIS
                    </span>
                    <span className="font-mono text-lg font-bold text-[#091E17]">
                      {current.metricLabel}: {current.metricValue}
                    </span>
                  </div>
                  <Link
                    to="/audit"
                    className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-[#091E17] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#F6F4EE] hover:bg-[#0D6E49] transition-colors"
                  >
                    Coba Mesin Ini Sekarang <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesMatrixSection() {
  return (
    <section id="fitur" className="py-20 md:py-28 border-b-[1.5px] border-[#091E17] bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-3xl mb-14">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D6E49] mb-2">
            SPESIFIKASI KAPABILITAS INTI // ENTERPRISE &amp; UMKM
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-[#091E17]">
            Dirancang Sebagai Hakim Digital Rantai Pasok Berkelanjutan
          </h2>
          <p className="mt-4 text-base text-[#4A5D54] leading-relaxed">
            Menjembatani kebutuhan korporasi besar (B2G/Enterprise) dalam menyaring ratusan pemasok bebas greenwashing dengan kebutuhan UMKM untuk memperoleh sertifikasi hijau secara terjangkau.
          </p>
        </div>

        {/* Asymmetric Editorial Grid (8/4 then 4/8) */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Module 1: 7 cols */}
          <div className="lg:col-span-7 instrument-card p-7 md:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#4A5D54] mb-6 border-b border-[#091E17]/15 pb-3">
                <span>MODUL 01 // RAG REGULASI DETERMINISTIK</span>
                <span className="font-bold text-[#0D6E49]">PASAL.ID INTEGRATED</span>
              </div>
              <h3 className="font-editorial text-2xl md:text-3xl font-semibold text-[#091E17] mb-3">
                Sitasi Hukum Presisi Tanpa Halusinasi Pasal
              </h3>
              <p className="text-sm text-[#4A5D54] leading-relaxed mb-6">
                Model bahasa umum sering mengarang nomor ayat atau mencampuradukkan regulasi yang sudah dicabut. OzikSustain mengunci ruang pencarian menggunakan vektor IndoBERT pada pasal aktif (UU No. 32/2009, PP No. 22/2021, Perpres No. 98/2021, dan Permen ESDM) serta langsung menyusun draf kalimat perbaikan yang sah secara hukum.
              </p>
            </div>
            <div className="bg-[#F6F4EE] border border-[#091E17] p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="font-mono text-xs text-[#091E17]">
                <span className="text-[#4A5D54] block text-[10px]">CAKUPAN KORPUS HUKUM</span>
                <strong>4 Pilar Skor: Legal (40) • Teknis (30) • Sosial (15) • Transparansi (15)</strong>
              </div>
              <Link
                to="/regulasi"
                className="font-mono text-xs font-bold uppercase tracking-wider text-[#0D6E49] hover:underline inline-flex items-center gap-1"
              >
                Buka Direktori Regulasi <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Module 2: 5 cols */}
          <div className="lg:col-span-5 border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] p-7 md:p-9 shadow-[4px_4px_0_#091E17] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#F6F4EE]/60 mb-6 border-b border-[#F6F4EE]/15 pb-3">
                <span>MODUL 02 // GEOSPASIAL</span>
                <span className="text-[#FBBF24] font-bold">ANTI-GREENWASHING</span>
              </div>
              <Compass className="h-9 w-9 text-[#34D399] mb-4" />
              <h3 className="font-editorial text-2xl font-semibold text-white mb-3">
                Deteksi Konflik Tata Ruang &amp; Deforestasi
              </h3>
              <p className="text-sm text-[#F6F4EE]/75 leading-relaxed mb-6">
                Memvalidasi klaim lokasi proyek energi terbarukan dan kehutanan terhadap batas kawasan lindung, wilayah konsesi, serta kelayakan teknis iradiasi surya di lokasi terkait.
              </p>
            </div>
            <div className="border-t border-[#F6F4EE]/15 pt-4 font-mono text-xs text-[#34D399] flex items-center justify-between">
              <span>VERIFIKASI KOORDINAT &amp; LAHAN</span>
              <span>OTOMATIS</span>
            </div>
          </div>

          {/* Module 3: 5 cols */}
          <div className="lg:col-span-5 instrument-card p-7 md:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#4A5D54] mb-6 border-b border-[#091E17]/15 pb-3">
                <span>MODUL 03 // HUMAN-IN-THE-LOOP</span>
                <span className="font-bold text-[#D97706]">EXPERT SIGN-OFF</span>
              </div>
              <ShieldCheck className="h-9 w-9 text-[#091E17] mb-4" />
              <h3 className="font-editorial text-2xl font-semibold text-[#091E17] mb-3">
                Kalibrasi Auditor Pakar Sebelum Penerbitan Sertifikat
              </h3>
              <p className="text-sm text-[#4A5D54] leading-relaxed">
                Menghindari risiko keputusan mesin buta (garbage-in, garbage-out). Tim reviewer hukum meninjau ringkasan temuan AI melalui antarmuka khusus sebelum memberikan persetujuan akhir, meminta revisi, atau menolak dokumen.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#091E17]/15 font-mono text-xs text-[#4A5D54] flex justify-between">
              <span>AKUNTABILITAS ENTERPRISE</span>
              <span className="font-bold text-[#091E17]">3 STATUS VERDIK</span>
            </div>
          </div>

          {/* Module 4: 7 cols */}
          <div className="lg:col-span-7 instrument-card p-7 md:p-9 flex flex-col justify-between bg-[#F6F4EE]">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#4A5D54] mb-6 border-b border-[#091E17]/15 pb-3">
                <span>MODUL 04 // OPEN API &amp; PUBLIC BADGE</span>
                <span className="font-bold text-[#0D6E49]">ERP / E-PROCUREMENT READY</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="font-editorial text-2xl md:text-3xl font-semibold text-[#091E17]">
                  Integrasi REST API &amp; Lencana QR Anti-Manipulasi
                </h3>
                <QrCode className="h-10 w-10 text-[#091E17] shrink-0" />
              </div>
              <p className="text-sm text-[#4A5D54] leading-relaxed mb-6">
                Sematkan lencana verifikasi langsung pada dokumen tender atau situs perusahaan Anda. Bagi instansi pemerintah dan korporasi, hubungkan endpoint REST API kami ke sistem ERP untuk memindai ratusan dokumen vendor secara konkuren.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/playground"
                className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-[#091E17] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F6F4EE] hover:bg-[#0D6E49] transition-colors"
              >
                <Code2 className="h-4 w-4 text-[#FBBF24]" /> Dokumentasi &amp; Sandbox API
              </Link>
              <a
                href="#verify"
                className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#091E17] hover:bg-[#ECE9DF] transition-colors"
              >
                <Fingerprint className="h-4 w-4 text-[#0D6E49]" /> Uji Verifikasi Hash
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VerificationLedgerSection() {
  const [auditId, setAuditId] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const target = auditId.trim() || "OZK-2026-SAMPLE-VERIFIED";
    navigate({ to: "/verify/$id", params: { id: target } });
  };

  return (
    <section id="verify" className="py-20 md:py-24 border-b-[1.5px] border-[#091E17] bg-[#071913] bg-canopy-grid text-[#F6F4EE]">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="border-[1.5px] border-[#F6F4EE]/30 bg-[#091E17] p-8 md:p-12 shadow-[8px_8px_0_#D97706]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F6F4EE]/15 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center border border-[#34D399] bg-[#064E3B]/50 text-[#34D399]">
                <Fingerprint className="h-6 w-6" />
              </div>
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#34D399]">
                  BUKU BESAR VERIFIKASI PUBLIK // SHA-256
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white">
                  Periksa Keaslian Sertifikat Hijau Vendor
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAuditId("OZK-2026-SAMPLE-VERIFIED")}
              className="border border-[#FBBF24] bg-[#FBBF24]/10 px-3.5 py-2 font-mono text-xs font-bold text-[#FBBF24] hover:bg-[#FBBF24] hover:text-[#091E17] transition-colors cursor-pointer"
            >
              Isi Sampel ID Terverifikasi
            </button>
          </div>

          <p className="text-sm sm:text-base text-[#F6F4EE]/80 leading-relaxed mb-8 max-w-3xl">
            Masukkan <strong className="text-white">ID Audit</strong> atau kode hash <strong className="text-white">HMAC-SHA256</strong> yang tertera pada lencana QR dokumen vendor untuk memeriksa integritas skor kepatuhan dan memastikan laporan tidak dimanipulasi.
          </p>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="
                absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#F6F4EE]/50
              " />
              <input
                type="text"
                value={auditId}
                onChange={(e) => setAuditId(e.target.value)}
                placeholder="Masukkan Audit ID atau SHA-256 Hash (mis. OZK-2026-SAMPLE-VERIFIED)"
                className="w-full h-14 pl-12 pr-4 bg-[#071913] border-[1.5px] border-[#F6F4EE]/40 font-mono text-sm text-white placeholder:text-[#F6F4EE]/40 focus:outline-none focus:border-[#FBBF24]"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#091E17] font-mono text-xs font-bold uppercase tracking-widest border-[1.5px] border-[#091E17] transition-transform hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              Verifikasi Sertifikat
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#F6F4EE]/60">
            <span>PROTOKOL: HMAC-SHA256 LEDGER VERIFICATION</span>
            <span> PERLINDUNGAN IDENTITAS: TERENKRIPSI UU PDP</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingLedgerSection() {
  const tiers = [
    {
      code: "TIER-01 // RETAIL & UMKM",
      name: "Pay-Per-Audit",
      price: "Rp 140.000",
      usdEquiv: "Setara $9 / dokumen",
      desc: "Dirancang untuk vendor UMKM yang membutuhkan sertifikasi kepatuhan resmi saat mengikuti tender pengadaan hijau tanpa beban langganan bulanan.",
      features: [
        "1 Kredit Audit Dokumen PDD Penuh",
        "Laporan PDF Resmi + Rekomendasi Pasal.id",
        "Kalibrasi Reviewer Pakar (HITL)",
        "Lencana QR Kriptografi Publik (SHA-256)",
      ],
      ctaLabel: "Mulai dengan 3 Kredit Gratis",
      ctaLink: "/auth",
      highlighted: false,
    },
    {
      code: "TIER-02 // VENDOR MENENGAH",
      name: "SME Eco-Basic",
      price: "Rp 750.000",
      usdEquiv: "Setara $49 / bulan",
      desc: "Untuk perusahaan pengembang energi terbarukan dan konsultan lingkungan dengan kebutuhan evaluasi dokumen rutin setiap bulan.",
      features: [
        "10 Kredit Audit Penuh per Bulan",
        "Akses Penuh Workspace Drill-Down Interaktif",
        "Penyensoran Otomatis Data Pribadi (UU PDP)",
        "Prioritas Antrean Verifikasi Reviewer",
        "Akses Kunci API Standar (60 req/menit)",
      ],
      ctaLabel: "Aktifkan Paket SME",
      ctaLink: "/auth",
      highlighted: true,
    },
    {
      code: "TIER-03 // KORPORASI & B2G",
      name: "Enterprise API",
      price: "Kustom / SLA",
      usdEquiv: "Mulai $999 / bulan",
      desc: "Integrasi langsung ke sistem e-Procurement atau ERP BUMN dan kementerian untuk menyaring ratusan dokumen vendor secara otomatis.",
      features: [
        "Kapasitas Audit Massal via REST API",
        "Deployment Private VPC / On-Premise",
        "Kustomisasi Parameter Ambang Risiko ESG",
        "Dukungan Teknis & SLA Khusus 99.9%",
      ],
      ctaLabel: "Buka Spesifikasi API",
      ctaLink: "/playground",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 border-b-[1.5px] border-[#091E17] bg-[#F6F4EE]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D6E49] mb-2">
              SKEMA INVESTASI &amp; AKSES // TANPA BIAYA TERSEMBUNYI
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-[#091E17]">
              Terjangkau bagi UMKM, Tangguh untuk Korporasi
            </h2>
          </div>
          <Link
            to="/pricing"
            className="font-mono text-xs font-bold uppercase tracking-widest text-[#091E17] underline underline-offset-4 hover:text-[#0D6E49]"
          >
            Lihat Perbandingan Lengkap Skema Harga &rarr;
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`border-[1.5px] border-[#091E17] p-7 md:p-8 flex flex-col justify-between transition-transform ${
                t.highlighted
                  ? "bg-[#091E17] text-[#F6F4EE] shadow-[8px_8px_0_#D97706] lg:-translate-y-2"
                  : "bg-white text-[#091E17] shadow-[5px_5px_0_#091E17]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] mb-4">
                  <span className={t.highlighted ? "text-[#FBBF24]" : "text-[#0D6E49]"}>
                    {t.code}
                  </span>
                  {t.highlighted && (
                    <span className="bg-[#FBBF24] text-[#091E17] px-2 py-0.5 font-bold uppercase">
                      DIREKOMENDASIKAN
                    </span>
                  )}
                </div>
                <h3 className="font-editorial text-2xl font-semibold">{t.name}</h3>
                <div className="mt-4 pb-4 border-b border-current/15">
                  <div className="font-mono text-3xl md:text-4xl font-bold tracking-tight tabular-nums">
                    {t.price}
                  </div>
                  <div className={`font-mono text-xs mt-1 ${t.highlighted ? "text-[#F6F4EE]/70" : "text-[#4A5D54]"}`}>
                    {t.usdEquiv}
                  </div>
                </div>
                <p className={`mt-4 text-xs leading-relaxed ${t.highlighted ? "text-[#F6F4EE]/80" : "text-[#4A5D54]"}`}>
                  {t.desc}
                </p>
                <ul className="mt-6 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs font-medium">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          t.highlighted ? "text-[#34D399]" : "text-[#0D6E49]"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  to={t.ctaLink}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 font-mono text-xs font-bold uppercase tracking-widest border-[1.5px] transition-all ${
                    t.highlighted
                      ? "bg-[#FBBF24] text-[#091E17] border-[#FBBF24] hover:bg-[#F59E0B]"
                      : "bg-[#091E17] text-[#F6F4EE] border-[#091E17] hover:bg-[#0D6E49]"
                  }`}
                >
                  {t.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialFooter() {
  return (
    <footer className="bg-[#071913] text-[#F6F4EE] pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-12 pb-12 border-b border-[#F6F4EE]/15">
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center bg-[#F6F4EE] p-1.5 border border-[#F6F4EE]">
                <img src="/logo.png" alt="OzikSustain" className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <div>
                <span className="font-editorial text-xl font-bold tracking-tight text-white block leading-none">
                  OzikSustain
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#34D399]">
                  DIGITAL ESG &amp; LEGAL ADJUDICATOR
                </span>
              </div>
            </Link>
            <p className="text-xs text-[#F6F4EE]/70 leading-relaxed max-w-sm">
              Platform agregator kepatuhan hukum lingkungan dan kelayakan spasial energi terbarukan berbasis IndoBERT Semantic RAG serta segel kriptografi HMAC-SHA256.
            </p>
            <div className="font-mono text-[11px] text-[#FBBF24]">
              Didukung Mesin Vektor Hukum Pasal.id &amp; Arsitektur Zero Data Retention
            </div>
            <div className="pt-2">
              <a
                href="https://github.com/otaruram/ozik-guard-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#F6F4EE]/30 bg-[#091E17] hover:bg-[#0D6E49] text-white font-mono text-xs transition-colors"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>github.com/otaruram/ozik-guard-ai</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Modul Utama
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F6F4EE]/75">
              <li>
                <Link to="/audit" className="hover:text-[#FBBF24] transition-colors">
                  Simulasi Audit PDD
                </Link>
              </li>
              <li>
                <Link to="/regulasi" className="hover:text-[#FBBF24] transition-colors">
                  Direktori Hukum Hijau
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#FBBF24] transition-colors">
                  Skema Harga &amp; Kredit
                </Link>
              </li>
              <li>
                <Link to="/playground" className="hover:text-[#FBBF24] transition-colors">
                  Dokumentasi REST API
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Akses &amp; Verifikasi
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F6F4EE]/75">
              <li>
                <Link to="/auth" className="hover:text-[#FBBF24] transition-colors">
                  Masuk / Daftar Workspace
                </Link>
              </li>
              <li>
                <Link
                  to="/verify/$id"
                  params={{ id: "OZK-2026-SAMPLE-VERIFIED" }}
                  className="hover:text-[#FBBF24] transition-colors"
                >
                  Cek Sertifikat Publik
                </Link>
              </li>
              <li>
                <Link
                  to="/page/$id"
                  params={{ id: "pln-sustainaction" }}
                  className="hover:text-[#FBBF24] transition-colors"
                >
                  PLN SustainAction 2026
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              Tata Kelola &amp; Privasi
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F6F4EE]/75">
              <li>
                <Link to="/page/$id" params={{ id: "privasi" }} className="hover:text-[#FBBF24] transition-colors">
                  Kebijakan Privasi &amp; UU PDP
                </Link>
              </li>
              <li>
                <Link to="/page/$id" params={{ id: "disclaimer" }} className="hover:text-[#FBBF24] transition-colors">
                  Ketentuan Layanan &amp; Hak Cipta
                </Link>
              </li>
              <li>
                <Link to="/page/$id" params={{ id: "kontak" }} className="hover:text-[#FBBF24] transition-colors">
                  Hubungi Tim Adjudikasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#F6F4EE]/60">
          <p>© 2026 OzikSustain. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-2 text-[#34D399]">
            <ShieldCheck className="h-4 w-4" />
            <span>TERINTEGRASI KORPUS HUKUM PASAL.ID</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
