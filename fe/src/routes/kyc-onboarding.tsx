import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Building2, Hash, Factory, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/kyc-onboarding" as any)({
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
      <div className="min-h-screen bg-emerald-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-950" />
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
    setIndustry("Energi Terbarukan & PLTS");
    setCompany("PT. Solusi Hijau Nusantara");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !nib || !industry) return;
    setSubmitting(true);
    try {
      await api.submitKyc({ company, nib, industry });
      toast.success("✅ KYC Berhasil! (Simulasi: Auto-Approved)", {
        description: "Di tahap produksi, data ini akan menunggu verifikasi admin terlebih dahulu.",
        duration: 6000,
      });
      setTimeout(() => navigate({ to: "/dashboard" }), 1500);
    } catch (err) {
      toast.error("Gagal mengirim data KYC.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 flex items-center justify-center p-4 selection:bg-emerald-950 selection:text-white">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-950 text-white mb-6 border-4 border-emerald-950 shadow-[8px_8px_0_rgba(16,185,129,1)]">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-emerald-950 mb-2">
            Verifikasi Identitas
          </h1>
          <p className="text-emerald-950/70 font-bold text-sm max-w-md mx-auto">
            Lengkapi data perusahaan Anda untuk mendapatkan akses penuh ke OzikSustain.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 border-4 border-yellow-400 bg-yellow-50 mb-6 shadow-[4px_4px_0_rgba(234,179,8,0.5)]">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black uppercase text-yellow-800">Mode Simulasi (Demo)</p>
            <p className="text-[11px] font-bold text-yellow-700 mt-1">
              Saat ini KYC bersifat <strong>Auto-Approve</strong>. Di tahap produksi sesungguhnya, data ini akan diverifikasi oleh tim Admin terlebih dahulu sebelum akun diaktifkan.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="border-4 border-emerald-950 bg-white p-8 shadow-[8px_8px_0_rgba(2,44,34,1)] relative">
          <Button
            type="button"
            variant="outline"
            onClick={handleAutoFill}
            className="absolute top-6 right-6 h-8 px-3 rounded-none border-2 border-emerald-950 text-[10px] font-black uppercase tracking-widest bg-yellow-400 hover:bg-yellow-500 text-emerald-950 shadow-[2px_2px_0_rgba(2,44,34,1)]"
          >
            <Sparkles className="w-3 h-3 mr-1.5" /> Auto Fill Demo
          </Button>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="font-bold text-emerald-950 uppercase text-xs flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Nama Perusahaan
              </Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder="PT. Inovasi Hijau Indonesia"
                className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0 h-12"
              />
              <p className="text-[10px] font-bold text-emerald-950/50 mt-1">Nama ini akan muncul pada Badge Sertifikasi publik.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-bold text-emerald-950 uppercase text-xs flex items-center gap-2">
                  <Hash className="w-4 h-4" /> NIB / Izin Usaha
                </Label>
                <Input
                  value={nib}
                  onChange={(e) => setNib(e.target.value)}
                  required
                  placeholder="13 Digit NIB"
                  className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0 h-12"
                />
              </div>
              <div>
                <Label className="font-bold text-emerald-950 uppercase text-xs flex items-center gap-2">
                  <Factory className="w-4 h-4" /> Jenis Industri
                </Label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  placeholder="Misal: Manufaktur"
                  className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0 h-12"
                />
              </div>
            </div>

            <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 p-3 border-l-4 border-emerald-600">
              Nomor NIB bersifat <strong>rahasia</strong> dan tidak akan ditampilkan pada QR Code publik ataupun Badge sertifikasi.
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-none bg-emerald-950 hover:bg-emerald-900 text-white font-black uppercase tracking-widest text-sm border-4 border-emerald-950 shadow-[6px_6px_0_rgba(16,185,129,1)] transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
              {submitting ? "Memverifikasi..." : "Submit & Verifikasi KYC"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
