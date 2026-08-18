import { useState, useEffect } from "react";
import { Loader2, Building2, ShieldCheck, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export function KycQueueTab() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetKycQueue();
      setQueue(res.queue || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const filtered = queue.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.company?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const totalPages = Math.ceil(filtered.length / 10);

  const maskNib = (nib: string | null) => {
    if (!nib) return "-";
    if (nib.length <= 4) return "****";
    return nib.substring(0, 3) + "****" + nib.substring(nib.length - 3);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="border-4 border-emerald-950 bg-white shadow-[8px_8px_0_rgba(2,44,34,1)]">
        <div className="p-6 border-b-4 border-emerald-950 bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Antrean KYC (FIFO)
            </h2>
            <p className="text-white/60 font-bold text-xs mt-1">Daftar user yang telah menyelesaikan form KYC. Urutan: Dokumen terlama di atas.</p>
          </div>
          <Input
            placeholder="Cari nama/perusahaan..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-64 border-2 border-white/30 bg-emerald-900 text-white placeholder:text-white/40 rounded-none font-bold focus-visible:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-emerald-50 border-b-4 border-emerald-950">
                <th className="p-4 text-left text-xs font-black uppercase tracking-wider text-emerald-950/60">Nama</th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wider text-emerald-950/60">Perusahaan</th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wider text-emerald-950/60">NIB (Masked)</th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wider text-emerald-950/60">Industri</th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-wider text-emerald-950/60">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-950" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-emerald-950/60 font-bold">Belum ada data KYC.</td>
                </tr>
              ) : paginated.map((row) => (
                <tr key={row.id} className="border-b-2 border-emerald-950/20 hover:bg-emerald-50">
                  <td className="p-4 font-bold text-emerald-950 text-sm">{row.name}</td>
                  <td className="p-4 text-sm">
                    <span className="flex items-center gap-2 font-bold text-emerald-950">
                      <Building2 className="w-4 h-4 text-emerald-600" /> {row.company || "-"}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono font-bold text-emerald-950/70">
                    <span className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-yellow-500" /> {maskNib(row.nib)}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-emerald-950/80">{row.industry || "-"}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-emerald-600 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t-4 border-emerald-950 flex items-center justify-between bg-emerald-50">
            <span className="text-sm font-bold text-emerald-950/70">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="rounded-none border-2 border-emerald-950 font-black uppercase text-xs"
              >
                Prev
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="rounded-none border-2 border-emerald-950 font-black uppercase text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
