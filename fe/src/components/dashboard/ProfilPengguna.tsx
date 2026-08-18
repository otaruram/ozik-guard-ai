import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  const [nib, setNib] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name || "");
      setCompany(dbUser.company || "");
    }
  }, [dbUser]);

  const handleAutoFill = () => {
    const randomNIB = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    setNib(randomNIB);
    setIndustry("Energi Terbarukan & PLTS");
    if (!company) setCompany("PT. Solusi Hijau Nusantara");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateMe({ name, company });
      toast.success("Profil & Data KYC berhasil diperbarui!");
      onProfileUpdate();
    } catch (err) {
      toast.error("Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-4 border-emerald-950 bg-white p-8 shadow-[8px_8px_0_rgba(2,44,34,1)] relative">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAutoFill}
          className="absolute top-8 right-8 h-8 px-3 rounded-none border-2 border-emerald-950 text-[10px] font-black uppercase tracking-widest bg-yellow-400 hover:bg-yellow-500 text-emerald-950 shadow-[2px_2px_0_rgba(2,44,34,1)]"
        >
          Auto Fill Demo
        </Button>

        <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-950 mb-1">Profil & KYC</h2>
        <p className="text-xs font-bold text-emerald-950/60 mb-6">Lengkapi data untuk sertifikasi Green Badge.</p>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label className="font-bold text-emerald-950 uppercase text-xs">Email Pengguna</Label>
            <Input disabled value={dbUser?.email || ""} className="mt-1 border-4 border-emerald-950/20 bg-gray-50 rounded-none font-bold" />
          </div>
          <div>
            <Label className="font-bold text-emerald-950 uppercase text-xs">Nama Penanggung Jawab</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0" />
          </div>
          <div className="pt-4 mt-4 border-t-2 border-dashed border-emerald-950/20">
            <Label className="font-bold text-emerald-950 uppercase text-xs">Nama Perusahaan (Tampil di Badge)</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="PT. Inovasi Hijau" className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-bold text-emerald-950 uppercase text-xs">NIB / Izin Usaha</Label>
              <Input value={nib} onChange={(e) => setNib(e.target.value)} placeholder="13 Digit NIB" required className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0" />
            </div>
            <div>
              <Label className="font-bold text-emerald-950 uppercase text-xs">Jenis Industri</Label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Misal: Manufaktur" required className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-yellow-600 bg-yellow-50 p-2 border-l-4 border-yellow-400 mt-2">
            Info: Nomor NIB bersifat rahasia dan tidak akan ditampilkan pada QR Code publik.
          </div>
          
          <Button type="submit" disabled={loading} className="w-full h-12 mt-4 rounded-none bg-emerald-950 hover:bg-emerald-900 text-white font-black uppercase tracking-widest text-xs border-2 border-emerald-950">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Simpan Profil & KYC"}
          </Button>
        </form>
      </div>
    </div>
  );
}
