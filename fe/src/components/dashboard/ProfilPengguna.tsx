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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name || "");
      setCompany(dbUser.company || "");
    }
  }, [dbUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateMe({ name, company });
      toast.success("Profil berhasil diperbarui!");
      onProfileUpdate();
    } catch (err) {
      toast.error("Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-4 border-emerald-950 bg-white p-8 shadow-[8px_8px_0_rgba(2,44,34,1)]">
        <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-950 mb-6">Profil Pengguna</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label className="font-bold text-emerald-950 uppercase text-xs">Email Pengguna</Label>
            <Input disabled value={dbUser?.email || ""} className="mt-1 border-4 border-emerald-950/20 bg-gray-50 rounded-none font-bold" />
          </div>
          <div>
            <Label className="font-bold text-emerald-950 uppercase text-xs">Nama Lengkap</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0" />
          </div>
          <div>
            <Label className="font-bold text-emerald-950 uppercase text-xs">Perusahaan / Instansi</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0" />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full h-12 mt-4 rounded-none bg-emerald-950 hover:bg-emerald-900 text-white font-black uppercase tracking-widest text-xs border-2 border-emerald-950">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Simpan Perubahan"}
          </Button>
        </form>
      </div>
    </div>
  );
}
