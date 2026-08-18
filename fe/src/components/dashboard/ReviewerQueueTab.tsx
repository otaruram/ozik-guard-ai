import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Eye, AlertTriangle } from "lucide-react";
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
      toast.error(err.message || "Gagal mengambil antrean review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const filtered = queue.filter(q => 
    q.projectName?.toLowerCase().includes(search.toLowerCase()) ||
    q.authorName?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="border-4 border-emerald-950 bg-emerald-950 p-8 shadow-[8px_8px_0_rgba(2,44,34,0.3)] text-white">
        <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
          <Eye className="h-8 w-8" />
          Reviewer Queue
        </h2>
        <p className="mt-2 text-white/70 font-bold text-sm">Tinjau hasil AI dan berikan keputusan final (Hit-in-the-Loop).</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-950/50" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari dokumen atau pengunggah..." 
            className="pl-12 h-14 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0 shadow-[4px_4px_0_rgba(2,44,34,1)]" 
          />
        </div>
        <Button onClick={fetchQueue} variant="outline" className="h-14 border-4 border-emerald-950 rounded-none font-black uppercase tracking-widest text-xs hover:bg-emerald-950 hover:text-white shadow-[4px_4px_0_rgba(2,44,34,1)]">
          Refresh Queue
        </Button>
      </div>

      <div className="border-4 border-emerald-950 bg-white shadow-[8px_8px_0_rgba(2,44,34,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-950 text-white border-b-4 border-emerald-950">
                <th className="p-4 font-black text-xs uppercase tracking-widest">Nama Proyek</th>
                <th className="p-4 font-black text-xs uppercase tracking-widest">Pengunggah</th>
                <th className="p-4 font-black text-xs uppercase tracking-widest">Tanggal</th>
                <th className="p-4 font-black text-xs uppercase tracking-widest">Skor AI</th>
                <th className="p-4 font-black text-xs uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-emerald-950/60 font-bold">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-950" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-emerald-950/60 font-bold">Belum ada dokumen yang menunggu review.</td>
                </tr>
              ) : paginated.map((row) => (
                <tr key={row.id} className="border-b-2 border-emerald-950/20 hover:bg-emerald-50">
                  <td className="p-4 font-bold text-emerald-950 text-sm">
                    {row.projectName}
                    {row.feasibilityScore < 60 && (
                      <Badge className="ml-2 bg-red-100 text-red-700 border-red-300 rounded-none text-[9px] px-1 uppercase font-black">High Risk</Badge>
                    )}
                  </td>
                  <td className="p-4 font-bold text-emerald-950/70 text-sm">{row.authorName}</td>
                  <td className="p-4 font-bold text-emerald-950/70 text-sm">{new Date(row.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="p-4 font-black text-emerald-950 text-sm">{row.feasibilityScore}/100</td>
                  <td className="p-4 text-right">
                    <Link to="/review/$id" params={{ id: row.id }}>
                      <Button size="sm" className="rounded-none bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-black text-[10px] uppercase border-2 border-emerald-950 shadow-[2px_2px_0_rgba(2,44,34,1)]">
                        Mulai Review
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {Math.ceil(filtered.length / 10) > 1 && (
          <div className="p-4 border-t-4 border-emerald-950 flex items-center justify-between bg-emerald-50">
            <span className="text-sm font-bold text-emerald-950/70">
              Halaman {currentPage} dari {Math.ceil(filtered.length / 10)}
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
                disabled={currentPage === Math.ceil(filtered.length / 10)}
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(filtered.length / 10), p + 1))}
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
