import { useState, useEffect } from "react";
import { Loader2, Building2, ShieldCheck, Hash } from "lucide-react";
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

  useEffect(() => {
    fetchQueue();
  }, []);

  const filtered = queue.filter(
    (u) =>
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
      <div className="border-[1.5px] border-[#091E17] bg-white shadow-[4px_4px_0_#091E17] sm:shadow-[6px_6px_0_#091E17]">
        <div className="p-4 sm:p-6 border-b-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#34D399] mb-1">
              REGISTRI ENTITAS TERDAFTAR // FIFO QUEUE
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
              Antrean Verifikasi Badan Usaha (KYC)
            </h2>
          </div>
          <Input
            placeholder="Cari nama atau badan usaha..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64 border border-[#F6F4EE]/30 bg-[#091E17] text-white placeholder:text-[#F6F4EE]/40 rounded-none font-mono text-xs focus-visible:ring-0 h-10"
          />
        </div>

        <div className="sm:hidden px-3.5 py-1.5 bg-[#F6F4EE] border-b border-[#091E17]/15 font-mono text-[10px] text-[#4A5D54]">
          Geser tabel ke samping untuk melihat detail entitas &rarr;
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F6F4EE] border-b-[1.5px] border-[#091E17] font-mono text-xs uppercase text-[#091E17]">
                <th className="p-4">Penanggung Jawab</th>
                <th className="p-4">Badan Usaha</th>
                <th className="p-4">NIB (Tersensor UU PDP)</th>
                <th className="p-4">Sektor Industri</th>
                <th className="p-4">Status</th>
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
                    Belum terdapat data pengajuan KYC.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F6F4EE]/60">
                    <td className="p-4 font-semibold text-[#091E17]">{row.name}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-2 font-medium text-[#091E17]">
                        <Building2 className="w-4 h-4 text-[#0D6E49]" /> {row.company || "-"}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#4A5D54]">
                      <span className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-[#D97706]" /> {maskNib(row.nib)}
                      </span>
                    </td>
                    <td className="p-4 text-[#4A5D54]">{row.industry || "-"}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#0D6E49] bg-[#E6F4EE] text-[#0D6E49] font-mono text-[10px] font-bold uppercase">
                        <ShieldCheck className="w-3 h-3" /> Terverifikasi
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t-[1.5px] border-[#091E17] flex items-center justify-between bg-[#F6F4EE] font-mono text-xs">
            <span className="text-[#4A5D54]">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-[#091E17] bg-white font-bold uppercase disabled:opacity-40 cursor-pointer"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-[#091E17] bg-white font-bold uppercase disabled:opacity-40 cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
