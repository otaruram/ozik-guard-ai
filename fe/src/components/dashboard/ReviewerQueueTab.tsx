import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Search, Eye, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ReviewerQueueTab() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>("/reviewer/queue");
      setQueue(res.audits || []);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengambil antrean tinjauan pakar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const filtered = queue.filter(
    (q) =>
      q.projectName?.toLowerCase().includes(search.toLowerCase()) ||
      q.authorName?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="border-[1.5px] border-[#091E17] bg-[#071913] p-6 md:p-8 shadow-[6px_6px_0_#D97706] text-[#F6F4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#34D399] mb-1">
            KALIBRASI AUDITOR MANUSIA // HUMAN-IN-THE-LOOP
          </div>
          <h2 className="font-editorial text-2xl font-semibold text-white flex items-center gap-2.5">
            <Eye className="h-6 w-6 text-[#FBBF24]" />
            Antrean Adjudikasi Pakar Hukum
          </h2>
          <p className="mt-1 text-xs text-[#F6F4EE]/75">
            Tinjau hasil anotasi AI dan berikan keputusan akhir sebelum segel HMAC-SHA256 diterbitkan.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchQueue}
          className="px-4 py-2.5 border border-[#F6F4EE]/30 bg-[#0C261E] hover:bg-[#091E17] text-white font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Muat Ulang Antrean
        </button>
      </div>

      <div className="relative max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5D54]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama berkas proyek atau pemohon..."
          className="pl-10 h-11 border-[1.5px] border-[#091E17] bg-white rounded-none font-medium text-[#091E17] focus-visible:ring-0 shadow-[3px_3px_0_#091E17]"
        />
      </div>

      <div className="border-[1.5px] border-[#091E17] bg-white shadow-[6px_6px_0_#091E17]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#071913] text-[#F6F4EE] border-b-[1.5px] border-[#091E17] font-mono text-xs uppercase">
                <th className="p-4">Nama Berkas Proyek</th>
                <th className="p-4">Pemohon</th>
                <th className="p-4">Tanggal Masuk</th>
                <th className="p-4">Skor AI</th>
                <th className="p-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#091E17]/15 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#091E17]" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center font-mono text-[#4A5D54]">
                    Tidak ada dokumen yang menunggu tinjauan pakar saat ini.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F6F4EE]/60">
                    <td className="p-4 font-semibold text-[#091E17]">
                      {row.projectName}
                      {row.feasibilityScore < 60 && (
                        <span className="ml-2 bg-[#FEE2E2] text-[#B91C1C] border border-[#B91C1C] font-mono text-[9px] px-1.5 py-0.5 uppercase font-bold">
                          Risiko Tinggi
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[#4A5D54]">{row.authorName}</td>
                    <td className="p-4 font-mono text-[#4A5D54]">
                      {new Date(row.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#091E17] tabular-nums">
                      {row.feasibilityScore}/100
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to="/review/$id"
                        params={{ id: row.id }}
                        className="inline-block px-3.5 py-1.5 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#091E17] font-mono text-[10px] font-bold uppercase border border-[#091E17]"
                      >
                        Inspeksi &amp; Putuskan
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
