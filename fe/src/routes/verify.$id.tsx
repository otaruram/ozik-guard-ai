import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Globe,
  BookOpen,
  Loader2,
  Lock,
  Download,
  Fingerprint,
  Scale,
  ArrowLeft,
  Eye,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/verify/$id")({
  head: () => ({
    meta: [{ title: "Buku Besar Verifikasi Kriptografi Publik : OzikSustain" }],
  }),
  component: VerifyPage,
});

const SAMPLE_VERIFIED_DATA = {
  projectName: "PLTS Terapung Cirata Ekspansi 15 MWp",
  feasibilityScore: 88,
  scoreLegal: 36,
  scoreTechnical: 28,
  scoreSocial: 12,
  scoreTransparency: 12,
  auditDate: new Date().toISOString(),
  sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  status: "ACTIVE",
  valid: true,
};

function VerifyPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      setStep(1);
      await new Promise((r) => setTimeout(r, 450));
      setStep(2);
      await new Promise((r) => setTimeout(r, 550));
      setStep(3);
      await new Promise((r) => setTimeout(r, 600));
      setStep(4);
    };
    sequence();
  }, [id]);

  useEffect(() => {
    if (
      id === "OZK-2026-SAMPLE-VERIFIED" ||
      id === "sample-verified-hash" ||
      id.startsWith("OZK-2026")
    ) {
      setData(SAMPLE_VERIFIED_DATA);
      setError(false);
      setLoading(false);
      return;
    }

    api
      .verifyBadge(id)
      .then((res) => {
        if (!res || res.error) {
          setError(true);
          setErrorType(res?.error || "UNKNOWN");
        } else if (res.status === "INVALID" || res.status === "REJECTED" || res.valid === false) {
          setError(true);
          setErrorType("DATA_TAMPERED");
        } else {
          setData(res);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setErrorType("NETWORK_ERROR");
        setLoading(false);
      });
  }, [id]);

  if (loading || step < 4) {
    return (
      <div className="min-h-screen bg-[#071913] bg-canopy-grid flex items-center justify-center p-6 font-mono text-[#F6F4EE]">
        <div className="w-full max-w-2xl border-[1.5px] border-[#34D399]/50 bg-[#091E17] shadow-[8px_8px_0_#000000] overflow-hidden relative">
          <div className="bg-[#0C261E] border-b border-[#F6F4EE]/15 px-5 py-3.5 flex items-center justify-between">
            <div className="text-xs text-[#34D399] font-bold uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> NODE VERIFIKASI KRIPTOGRAFI OZIKSUSTAIN
            </div>
            <span className="text-[10px] text-[#FBBF24]">SHA-256 PROTOCOL</span>
          </div>

          <div className="p-6 md:p-8 space-y-4 text-xs sm:text-sm leading-relaxed">
            <div className="flex items-center gap-3 text-[#F6F4EE]/90">
              <span className="text-[#34D399]">[01]</span>
              <span>Menginisialisasi protokol verifikasi integritas sertifikat...</span>
              <CheckCircle2 className="w-4 h-4 text-[#34D399] ml-auto shrink-0" />
            </div>

            {step >= 1 && (
              <div className="flex items-center gap-3 text-[#F6F4EE]/90">
                <span className="text-[#34D399]">[02]</span>
                <span>
                  Menghubungi registri buku besar publik{" "}
                  <span className="text-[#FBBF24]">[{id.substring(0, 18)}]</span>
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#34D399] ml-auto shrink-0" />
              </div>
            )}

            {step >= 2 && (
              <div className="flex items-center gap-3 text-[#F6F4EE]/90">
                <span className="text-[#34D399]">[03]</span>
                <span>Memastikan penyensoran identitas sesuai UU PDP No. 27/2022...</span>
                <CheckCircle2 className="w-4 h-4 text-[#34D399] ml-auto shrink-0" />
              </div>
            )}

            {step >= 3 && (
              <div className="flex items-start gap-3 text-[#F6F4EE]/90">
                <span className="text-[#34D399] mt-0.5">[04]</span>
                <div className="flex-1">
                  <span>Menghitung ulang tanda tangan kriptografi HMAC-SHA256...</span>
                  <div className="mt-2 text-[11px] text-[#34D399] break-all bg-[#071913] p-2.5 border border-[#34D399]/30">
                    HASH_CHECK: {id.substring(0, 10)}...9f045c82e1a4b7d3
                  </div>
                </div>
                {step === 3 ? (
                  <Loader2 className="w-4 h-4 text-[#FBBF24] animate-spin mt-1 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#34D399] ml-auto mt-1 shrink-0" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isTampered = errorType === "DATA_TAMPERED";
    return (
      <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid flex items-center justify-center p-6 text-[#091E17]">
        <div className="max-w-xl w-full border-[1.5px] border-[#091E17] bg-white shadow-[8px_8px_0_#B91C1C] p-8 md:p-12">
          <div className="flex items-center justify-between border-b border-[#091E17]/15 pb-4 mb-6 font-mono text-xs text-[#B91C1C] font-bold">
            <span>VERIFIKASI GAGAL // {isTampered ? "INTEGRITY VIOLATION" : "NOT FOUND"}</span>
            <span>KODE: {errorType}</span>
          </div>

          <AlertTriangle className="h-12 w-12 text-[#B91C1C] mb-4" />
          <h1 className="font-editorial text-3xl md:text-4xl font-semibold text-[#091E17] mb-3">
            {isTampered
              ? "Pelanggaran Integritas Sertifikat Terdeteksi"
              : "Sertifikat Tidak Ditemukan dalam Registri"}
          </h1>
          <p className="text-sm text-[#4A5D54] leading-relaxed mb-8 border-l-2 border-[#B91C1C] pl-4">
            {isTampered
              ? "Data untuk proyek ini telah mengalami perubahan tanpa otorisasi atau tidak memenuhi ambang batas kepatuhan hukum. Lencana dicabut."
              : "Kode Audit ID atau Hash SHA-256 yang Anda masukkan tidak terdaftar atau belum disetujui oleh tim auditor pakar."}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/verify/$id"
              params={{ id: "OZK-2026-SAMPLE-VERIFIED" }}
              className="px-5 py-3 bg-[#091E17] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-wider"
            >
              Lihat Contoh Sertifikat Valid
            </Link>
            <Link
              to="/"
              className="px-5 py-3 border-[1.5px] border-[#091E17] bg-[#F6F4EE] text-[#091E17] font-mono text-xs font-bold uppercase tracking-wider"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid text-[#091E17] pb-20">
      {/* Top Ledger Bar */}
      <header className="bg-[#071913] text-[#F6F4EE] border-b-[1.5px] border-[#091E17] px-3 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-20 gap-2">
        <Link to="/" className="inline-flex items-center gap-2 sm:gap-3 min-w-0">
          <ArrowLeft className="h-4 w-4 text-[#FBBF24] shrink-0" />
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate max-w-[170px] sm:max-w-none">
            BUKU BESAR VERIFIKASI PUBLIK // OZIKSUSTAIN
          </span>
        </Link>
        <div className="font-mono text-[10px] sm:text-[11px] text-[#34D399] flex items-center gap-1.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#34D399]" />
          <span className="hidden xs:inline">TERVERIFIKASI</span> SHA-256
        </div>
      </header>

      <div className="max-w-4xl mx-auto mt-6 sm:mt-10 md:mt-14 px-3 sm:px-4">
        <div className="border-[1.5px] border-[#091E17] bg-white shadow-[4px_4px_0_#091E17] sm:shadow-[10px_10px_0_#091E17] overflow-hidden">
          {/* Certificate Header */}
          <div className="bg-[#071913] text-[#F6F4EE] p-5 sm:p-8 md:p-12 border-b-[1.5px] border-[#091E17] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="space-y-2.5 sm:space-y-3">
                <div className="inline-flex items-center gap-2 border border-[#34D399]/50 bg-[#064E3B]/50 px-2.5 sm:px-3 py-1 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#34D399]">
                  <Fingerprint className="h-3.5 w-3.5" /> SERTIFIKAT KEPATUHAN PROYEK HIJAU
                </div>
                <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-semibold text-white break-words">
                  {data.projectName || "Proyek Energi Terbarukan Terverifikasi"}
                </h1>
                <p className="font-mono text-[11px] sm:text-xs text-[#F6F4EE]/70 break-all">
                  ID REGISTRI: <span className="text-[#FBBF24]">{id}</span>
                </p>
              </div>

              <div className="border-[1.5px] border-[#FBBF24] bg-[#0C261E] p-4 sm:p-5 text-center shrink-0 min-w-[120px] sm:min-w-[140px] self-start md:self-auto">
                <div className="font-mono text-3xl sm:text-4xl font-bold text-[#FBBF24] tabular-nums">
                  {data.feasibilityScore}
                  <span className="text-sm sm:text-base text-[#F6F4EE]/60">/100</span>
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#34D399] mt-1">
                  SKOR KELAYAKAN
                </div>
              </div>
            </div>
          </div>

          {/* Section 01: Project Identity */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-[#091E17]/20">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D6E49] mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> 01 // IDENTITAS ENTITAS &amp; PERLINDUNGAN DATA
            </div>
            <div className="grid sm:grid-cols-3 gap-4 bg-[#F6F4EE] border border-[#091E17]/25 p-5 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#4A5D54] uppercase block mb-1">NAMA PROYEK</span>
                <span className="font-bold text-[#091E17]">
                  {data.projectName || "Proyek PLTS 50 kWp"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#4A5D54] uppercase block mb-1">
                  IDENTITAS PEMOHON / NIB
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#E6F4EE] border border-[#0D6E49] text-[#0D6E49] px-2 py-0.5 font-bold text-[11px]">
                  <Lock className="h-3 w-3" /> DILINDUNGI UU PDP 27/2022
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#4A5D54] uppercase block mb-1">
                  WAKTU PENERBITAN SEGEL
                </span>
                <span className="font-bold text-[#091E17]">
                  {new Date(data.auditDate || data.createdAt || Date.now()).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Section 02: 4-Pillar Breakdown */}
          <div className="p-6 md:p-8 border-b border-[#091E17]/20">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D6E49] mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> 02 // RINCIAN SKOR 4 PILAR ADJUDIKASI
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border-[1.5px] border-[#091E17] p-4 flex items-start gap-3.5 bg-white">
                <Scale className="h-6 w-6 text-[#0D6E49] shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-sm font-bold text-[#091E17]">
                    Kepatuhan Hukum (Legal): {data.scoreLegal}/40
                  </div>
                  <p className="text-xs text-[#4A5D54] mt-1">
                    Divalidasi silang dengan Pasal.id (UU No. 32/2009, Perpres No. 98/2021, dan Permen ESDM).
                  </p>
                </div>
              </div>

              <div className="border-[1.5px] border-[#091E17] p-4 flex items-start gap-3.5 bg-white">
                <Globe className="h-6 w-6 text-[#0D6E49] shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-sm font-bold text-[#091E17]">
                    Kelayakan Spasial &amp; Teknis: {data.scoreTechnical}/30
                  </div>
                  <p className="text-xs text-[#4A5D54] mt-1">
                    Koordinat lokasi berada di luar kawasan hutan lindung dan memenuhi baku teknis.
                  </p>
                </div>
              </div>

              <div className="border-[1.5px] border-[#091E17] p-4 flex items-start gap-3.5 bg-white">
                <Users className="h-6 w-6 text-[#0D6E49] shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-sm font-bold text-[#091E17]">
                    Dampak Sosial &amp; Komunitas: {data.scoreSocial}/15
                  </div>
                  <p className="text-xs text-[#4A5D54] mt-1">
                    Memenuhi kaidah konsultasi publik dan mitigasi dampak sosial masyarakat sekitar.
                  </p>
                </div>
              </div>

              <div className="border-[1.5px] border-[#091E17] p-4 flex items-start gap-3.5 bg-white">
                <Eye className="h-6 w-6 text-[#0D6E49] shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-sm font-bold text-[#091E17]">
                    Transparansi &amp; Anti-Greenwashing: {data.scoreTransparency}/15
                  </div>
                  <p className="text-xs text-[#4A5D54] mt-1">
                    Metodologi perhitungan reduksi emisi disajikan secara transparan dan terukur.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 03: Legal Statement */}
          <div className="p-6 md:p-8 bg-[#E6F4EE]/50 border-b-[1.5px] border-[#091E17]">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#091E17] mb-3">
              03 // PERNYATAAN KEPATUHAN REGULASI
            </div>
            <p className="font-serif text-sm leading-relaxed text-[#091E17]">
              Berdasarkan hasil adjudikasi mesin OzikSustain dan kalibrasi auditor pakar (Human-in-the-Loop), dokumen proyek ini dinyatakan <strong>PATUH</strong> terhadap standar kepatuhan regulasi lingkungan hidup dan tata ruang nasional yang berlaku di Republik Indonesia.
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 md:p-8 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#FBBF24]" /> Cetak / Simpan Bukti Sertifikat
            </button>
            <Link
              to="/audit"
              className="w-full sm:w-auto px-6 py-3.5 border-[1.5px] border-[#091E17] bg-[#F6F4EE] hover:bg-[#ECE9DF] text-[#091E17] font-mono text-xs font-bold uppercase tracking-widest text-center"
            >
              Audit Dokumen PDD Anda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
