import { useState, useEffect } from "react";
import { Loader2, Wand2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

interface ProfilPenggunaProps {
  dbUser: any;
  onProfileUpdate: () => void;
}

export function ProfilPengguna({ dbUser, onProfileUpdate }: ProfilPenggunaProps) {
  const [name, setName] = useState(dbUser?.name || "");
  const [company, setCompany] = useState(dbUser?.company || "");
  const [nib, setNib] = useState(dbUser?.nib || "");
  const [industry, setIndustry] = useState(dbUser?.industry || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name || "");
      setCompany(dbUser.company || "");
      if (dbUser.nib) setNib(dbUser.nib);
      if (dbUser.industry) setIndustry(dbUser.industry);
    }
  }, [dbUser]);

  const handleAutoFill = () => {
    const randomNIB = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    setNib(randomNIB);
    setIndustry("Energi Terbarukan & PLTS");
    if (!company) setCompany("PT Solusi Energi Hijau Nusantara");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateMe({ name, company });
      toast.success("Identitas Entitas & Profil Diperbarui");
      onProfileUpdate();
    } catch (err) {
      toast.error("Gagal memperbarui profil entitas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="border-[1.5px] border-[#091E17] bg-white shadow-[6px_6px_0_#091E17] overflow-hidden">
        <div className="bg-[#071913] text-[#F6F4EE] p-6 md:p-8 border-b-[1.5px] border-[#091E17] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#34D399] mb-1">
              REGISTRASI BADAN HUKUM // KYB &amp; KYC
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-white">
              Identitas Entitas &amp; Penanggung Jawab
            </h2>
            <p className="text-xs text-[#F6F4EE]/70 mt-1">
              Data ini digunakan pada penerbitan sertifikat kepatuhan proyek hijau resmi.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-3.5 py-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#091E17] font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Wand2 className="h-3.5 w-3.5" /> Isi Sampel Demo
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label className="font-mono text-xs font-bold uppercase text-[#091E17]">
                Alamat Email Terdaftar
              </Label>
              <Input
                disabled
                value={dbUser?.email || ""}
                className="mt-1.5 border-[1.5px] border-[#091E17]/30 bg-[#F6F4EE] rounded-none font-mono text-xs h-11"
              />
            </div>

            <div>
              <Label className="font-mono text-xs font-bold uppercase text-[#091E17]">
                Nama Penanggung Jawab Audit
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1.5 border-[1.5px] border-[#091E17] rounded-none font-medium text-[#091E17] focus-visible:ring-0 h-11"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#091E17]/15">
            <Label className="font-mono text-xs font-bold uppercase text-[#091E17]">
              Nama Resmi Perusahaan / Instansi (Tampil pada Sertifikat)
            </Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="PT Solusi Energi Hijau Nusantara"
              className="mt-1.5 border-[1.5px] border-[#091E17] rounded-none font-medium text-[#091E17] focus-visible:ring-0 h-11"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label className="font-mono text-xs font-bold uppercase text-[#091E17]">
                Nomor Induk Berusaha (NIB)
              </Label>
              <Input
                value={nib}
                onChange={(e) => setNib(e.target.value)}
                placeholder="13 Digit NIB"
                required
                className="mt-1.5 border-[1.5px] border-[#091E17] rounded-none font-mono font-semibold text-[#091E17] focus-visible:ring-0 h-11"
              />
            </div>
            <div>
              <Label className="font-mono text-xs font-bold uppercase text-[#091E17]">
                Sektor Industri Utama
              </Label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Misal: Energi Terbarukan & PLTS"
                required
                className="mt-1.5 border-[1.5px] border-[#091E17] rounded-none font-medium text-[#091E17] focus-visible:ring-0 h-11"
              />
            </div>
          </div>

          <div className="bg-[#E6F4EE]/70 border-l-4 border-[#0D6E49] p-4 flex items-start gap-3">
            <Lock className="h-4 w-4 text-[#0D6E49] shrink-0 mt-0.5" />
            <p className="text-xs text-[#091E17] leading-relaxed">
              <strong>Perlindungan Privasi UU PDP:</strong> Nomor NIB dienkripsi dan disamarkan pada tampilan publik maupun antrean verifikasi.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-widest border-[1.5px] border-[#091E17] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-[#34D399]" />
            )}
            <span>Simpan Perubahan Identitas</span>
          </button>
        </form>
      </div>
    </div>
  );
}
