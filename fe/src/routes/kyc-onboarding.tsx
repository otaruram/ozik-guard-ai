import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Hash,
  Factory,
  Loader2,
  Wand2,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/kyc-onboarding")({
  head: () => ({
    meta: [{ title: "Registrasi Entitas & KYC : OzikSustain" }],
  }),
  component: KycOnboarding,
});

function KycOnboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [nib, setNib] = useState("");
  const [industry, setIndustry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F4EE] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#091E17]" />
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/auth" });
    return null;
  }

  const handleAutoFill = () => {
    const randomNIB = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    setNib(randomNIB);
    setIndustry("Energi Terbarukan & Pembangkit Listrik Tenaga Surya");
    setCompany("PT Solusi Energi Hijau Nusantara");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !nib || !industry) return;
    setSubmitting(true);
    try {
      await api.submitKyc({ company, nib, industry });
      toast.success("Verifikasi Identitas Entitas Berhasil", {
        description:
          "Profil perusahaan Anda telah diaktifkan. Mengalihkan ke Workspace Utama...",
        duration: 5000,
      });
      setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    } catch (err) {
      toast.error("Gagal menyimpan data verifikasi KYC.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid text-[#091E17] flex flex-col justify-between p-4 sm:p-8">
      <div className="mx-auto w-full max-w-2xl flex items-center justify-between border-b border-[#091E17]/15 pb-4">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="h-9 w-9 border border-[#091E17] bg-white p-1">
            <img src="/logo.png" alt="OzikSustain" className="h-full w-full object-contain" />
          </div>
          <span className="font-editorial text-lg font-bold">OzikSustain</span>
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#0D6E49] font-bold">
          TAHAP AKHIR // REGISTRASI ENTITAS (KYB/KYC)
        </span>
      </div>

      <div className="w-full max-w-2xl mx-auto my-8">
        <div className="border-[1.5px] border-[#091E17] bg-white shadow-[8px_8px_0_#091E17] overflow-hidden">
          {/* Dark Header */}
          <div className="bg-[#071913] text-[#F6F4EE] p-6 sm:p-8 border-b-[1.5px] border-[#091E17] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#34D399] mb-1">
                VERIFIKASI BADAN USAHA &amp; IZIN OPERASIONAL
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-white">
                Kelengkapan Identitas Pemohon
              </h1>
              <p className="text-xs text-[#F6F4EE]/70 mt-1">
                Diperlukan untuk pencetakan sertifikat kepatuhan resmi dan pelacakan histori audit.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="inline-flex items-center gap-2 border border-[#FBBF24] bg-[#FBBF24] px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#091E17] hover:bg-[#F59E0B] transition-colors cursor-pointer shrink-0"
            >
              <Wand2 className="h-3.5 w-3.5" /> Isi Sampel Demo
            </button>
          </div>

          {/* Info Notice */}
          <div className="bg-[#FEF3C7] border-b border-[#091E17]/20 px-6 sm:px-8 py-3.5 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-[#B45309] shrink-0 mt-0.5" />
            <p className="text-xs text-[#78350F] leading-relaxed">
              <strong>Mode Evaluasi Instan:</strong> Pengajuan identitas saat ini disetujui otomatis untuk keperluan demonstrasi. Pada lingkungan produksi, nomor NIB divalidasi silang oleh tim kepatuhan.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <Label className="font-mono text-xs font-bold uppercase tracking-wider text-[#091E17] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0D6E49]" /> Nama Resmi Badan Usaha / Instansi
              </Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder="Contoh: PT Solusi Energi Hijau Nusantara"
                className="border-[1.5px] border-[#091E17] rounded-none font-medium text-[#091E17] focus-visible:ring-0 h-12 bg-[#F6F4EE]/40"
              />
              <p className="font-mono text-[11px] text-[#4A5D54]">
                Nama badan usaha dicantumkan pada dokumen PDF laporan audit.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="font-mono text-xs font-bold uppercase tracking-wider text-[#091E17] flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#0D6E49]" /> Nomor Induk Berusaha (NIB)
                </Label>
                <Input
                  value={nib}
                  onChange={(e) => setNib(e.target.value)}
                  required
                  placeholder="13 Digit Nomor NIB"
                  className="border-[1.5px] border-[#091E17] rounded-none font-mono font-semibold text-[#091E17] focus-visible:ring-0 h-12 bg-[#F6F4EE]/40"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs font-bold uppercase tracking-wider text-[#091E17] flex items-center gap-2">
                  <Factory className="w-4 h-4 text-[#0D6E49]" /> Sektor Industri Utama
                </Label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  placeholder="Contoh: Energi Terbarukan & PLTS"
                  className="border-[1.5px] border-[#091E17] rounded-none font-medium text-[#091E17] focus-visible:ring-0 h-12 bg-[#F6F4EE]/40"
                />
              </div>
            </div>

            <div className="bg-[#E6F4EE]/60 border-l-4 border-[#0D6E49] p-4 flex items-start gap-3">
              <Lock className="h-4 w-4 text-[#0D6E49] shrink-0 mt-0.5" />
              <p className="text-xs text-[#091E17] leading-relaxed">
                <strong>Jaminan Kerahasiaan UU PDP No. 27/2022:</strong> Nomor Induk Berusaha (NIB) Anda disamarkan secara otomatis pada antrean admin dan tidak pernah ditampilkan pada halaman verifikasi QR publik.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-widest border-[1.5px] border-[#091E17] shadow-[4px_4px_0_#D97706] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-[#34D399]" />
              )}
              <span>{submitting ? "Memvalidasi Data Entitas..." : "Simpan & Buka Workspace Audit"}</span>
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl text-center font-mono text-[10px] text-[#4A5D54] uppercase tracking-widest">
        SISTEM REGISTRASI ENTITAS TERVERIFIKASI // OZIKSUSTAIN
      </div>
    </div>
  );
}
