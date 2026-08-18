import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { Search, ChevronLeft, ChevronRight, Trash2, ShieldCheck, Copy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface HistoriAuditProps {
  history: any[];
  loading: boolean;
  refreshHistory: () => void;
}

export function HistoriAudit({ history, loading, refreshHistory }: HistoriAuditProps) {
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const qrRef = useRef<SVGSVGElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      await api.deleteAudit(selectedProject.id);
      setDeleteOpen(false);
      refreshHistory();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus audit");
    }
  };

  const downloadSVG = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR-${selectedProject?.code}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPNG = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${selectedProject?.code}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const mappedHistory = history.map((item) => ({
    id: item.id,
    name: item.projectName,
    date: new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    score: item.feasibilityScore,
    status: item.reviewStatus === 'APPROVED' ? 'Verified Compliant' : (item.reviewStatus === 'REJECTED' ? 'Rejected' : (item.reviewStatus === 'NEEDS_REVISION' ? 'Needs Revision (Reviewer)' : (item.feasibilityScore >= 80 ? 'Pending Review' : (item.feasibilityScore >= 60 ? 'Pending Review (Medium Risk)' : 'Pending Review (High Risk)')))),
    color: item.reviewStatus === 'APPROVED' ? 'emerald' : (item.feasibilityScore >= 80 ? 'emerald' : (item.feasibilityScore >= 60 ? 'yellow' : 'red')),
    reviewStatus: item.reviewStatus,
    code: `OZK-${item.id.substring(0, 8).toUpperCase()}`,
  }));

  const totalPages = Math.ceil(mappedHistory.length / itemsPerPage);
  const paginatedHistory = mappedHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const embedCode = `<script src="https://oziksustain.id/badge.js" data-id="${selectedProject?.code}"></script>`;

  return (
    <>
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-950/50" />
          <Input 
            placeholder="Cari histori dokumen..." 
            className="pl-12 h-14 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0 shadow-[4px_4px_0_rgba(2,44,34,1)]" 
          />
        </div>
        <div className="flex gap-2">
          {["All", "High Score", "Revision"].map(f => (
            <Button key={f} variant="outline" className="h-14 border-4 border-emerald-950 rounded-none font-black uppercase tracking-widest text-xs hover:bg-emerald-950 hover:text-white shadow-[4px_4px_0_rgba(2,44,34,1)]">
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="border-4 border-emerald-950 bg-white shadow-[8px_8px_0_rgba(2,44,34,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-950 text-white border-b-4 border-emerald-950">
                <th className="p-4 font-black text-xs uppercase tracking-widest">Nama Proyek / PDD</th>
                <th className="p-4 font-black text-xs uppercase tracking-widest">Tanggal</th>
                <th className="p-4 font-black text-xs uppercase tracking-widest">Score</th>
                <th className="p-4 font-black text-xs uppercase tracking-widest">Status</th>
                <th className="p-4 font-black text-xs uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-emerald-950/60 font-bold">Memuat data histori...</td>
                </tr>
              ) : mappedHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-emerald-950/60 font-bold">Belum ada histori audit proyek.</td>
                </tr>
              ) : paginatedHistory.map((row) => (
                <tr key={row.id} className="border-b-2 border-emerald-950/20 hover:bg-emerald-50">
                  <td className="p-4 font-bold text-emerald-950 text-sm">{row.name}</td>
                  <td className="p-4 font-bold text-emerald-950/70 text-sm">{row.date}</td>
                  <td className="p-4 font-black text-emerald-950 text-sm">{row.score}/100</td>
                  <td className="p-4">
                    <Badge variant="outline" className={cn(
                      "rounded-none border-2 font-black uppercase text-[10px]",
                      row.color === 'emerald' ? "border-emerald-600 bg-emerald-50 text-emerald-700" :
                      row.color === 'yellow' ? "border-yellow-600 bg-yellow-50 text-yellow-700" :
                      "border-red-600 bg-red-50 text-red-700"
                    )}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <Link to="/workspace/$id" params={{ id: row.id }}>
                      <Button size="sm" className="rounded-none bg-emerald-950 hover:bg-emerald-900 text-white font-black text-[10px] uppercase border-2 border-emerald-950">Laporan</Button>
                    </Link>
                    {row.reviewStatus === 'APPROVED' && (
                      <Button size="sm" variant="outline" onClick={() => { setSelectedProject(row); setBadgeOpen(true); }} className="rounded-none font-black text-[10px] uppercase border-2 border-emerald-950 hover:bg-emerald-50">Badge</Button>
                    )}
                    {row.reviewStatus !== 'APPROVED' && (
                      <Button size="sm" variant="outline" className="rounded-none font-black text-[10px] uppercase border-2 border-emerald-950 hover:bg-emerald-50 text-emerald-950/50 cursor-not-allowed">Pending Badge</Button>
                    )}
                    <Button size="icon" variant="destructive" onClick={() => { setSelectedProject(row); setDeleteOpen(true); }} className="h-8 w-8 rounded-none bg-red-50 text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[2px_2px_0_rgba(220,38,38,0.2)] hover:shadow-none">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button 
                variant="outline" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="rounded-none border-2 border-emerald-950 font-black uppercase text-xs"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>

      <Dialog open={badgeOpen} onOpenChange={setBadgeOpen}>
        <DialogContent className="border-4 border-emerald-950 rounded-none shadow-[8px_8px_0_rgba(2,44,34,1)] md:shadow-[12px_12px_0_rgba(2,44,34,1)] p-0 max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <div className="bg-emerald-950 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-emerald-950 gap-3">
            <div>
              <DialogTitle className="text-lg md:text-xl font-black uppercase tracking-widest text-white mb-1">
                Lencana Verifikasi Proyek Hijau
              </DialogTitle>
              <DialogDescription className="text-white/70 font-bold text-xs">
                Verified Green Project Badge untuk {selectedProject?.name}
              </DialogDescription>
            </div>
            <Badge className="bg-white text-emerald-950 border-2 border-transparent font-black uppercase text-[10px] md:text-xs rounded-none px-2 md:px-3 py-1">
              Status: Aktif & Terverifikasi
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 border-b-4 md:border-b-0 md:border-r-4 border-emerald-950 bg-emerald-50 flex flex-col items-center justify-center">
              <div className="border-4 border-emerald-950 bg-white shadow-[6px_6px_0_rgba(2,44,34,1)] p-4 max-w-[240px] w-full flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-emerald-950 text-white p-1.5 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="font-black text-emerald-950 uppercase text-sm tracking-widest">OzikSustain</span>
                </div>
                
                <div className="border-4 border-emerald-950 p-2 mb-4 w-32 h-32 flex items-center justify-center relative bg-white">
                   <QRCodeSVG 
                     value={`https://oziksustain.my.id/verify/${selectedProject?.id}`} 
                     size={110} 
                     bgColor={"#ffffff"} 
                     fgColor={"#022c22"} 
                     level={"Q"} 
                     ref={qrRef}
                   />
                </div>

                <div className="w-full text-center border-t-4 border-emerald-950 pt-3 mt-1">
                  <div className="font-black uppercase text-emerald-950 text-[10px] mb-1">ID: {selectedProject?.code}</div>
                  <div className="font-bold text-emerald-950/70 text-[9px] uppercase">Skor: {selectedProject?.score}/100</div>
                  <div className="font-bold text-emerald-950/70 text-[9px] uppercase mt-0.5">Berlaku: Aug 2027</div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-6 bg-white flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="font-black uppercase tracking-widest text-emerald-950 border-b-4 border-emerald-950 pb-2 mb-3 text-sm">A. Unduh Gambar QR</h3>
                <div className="flex gap-3">
                  <Button onClick={downloadPNG} className="flex-1 rounded-none border-4 border-yellow-400 bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-black uppercase text-xs h-12 shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                    Download PNG
                  </Button>
                  <Button onClick={downloadSVG} variant="outline" className="flex-1 rounded-none border-4 border-emerald-950 font-black text-emerald-950 uppercase text-[10px] h-10 hover:bg-emerald-50">
                    Download SVG
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-black uppercase tracking-widest text-emerald-950 border-b-4 border-emerald-950 pb-2 mb-3 text-sm">B. Integrasi Website (Embed)</h3>
                <div className="bg-emerald-50 border-4 border-emerald-950 p-3 mb-3">
                  <code className="text-[10px] font-bold text-emerald-950 break-all select-all">
                    {embedCode}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-none border-4 border-emerald-950 font-black text-emerald-950 uppercase text-[10px] h-10 hover:bg-emerald-950 hover:text-white transition-all shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none" onClick={() => navigator.clipboard.writeText(embedCode)}>
                    <Copy className="h-3 w-3 mr-2" /> Kode Embed
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-none border-4 border-emerald-950 font-black text-emerald-950 uppercase text-[10px] h-10 hover:bg-emerald-950 hover:text-white transition-all shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none" onClick={() => navigator.clipboard.writeText(`https://oziksustain.my.id/verify/${selectedProject?.id}`)}>
                    <Copy className="h-3 w-3 mr-2" /> URL Verifikasi
                  </Button>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 border-2 border-emerald-950 border-dashed">
                <p className="text-[10px] font-bold text-emerald-950 leading-relaxed">
                  📌 <span className="font-black">PENTING:</span> Lencana membuktikan proyek bebas dari greenwashing & lulus audit spasial/hukum.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-4 border-emerald-950 rounded-none shadow-[16px_16px_0_rgba(2,44,34,1)] p-0 gap-0 sm:max-w-md bg-white">
          <div className="p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-wide text-emerald-950 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                Hapus Permanen
              </DialogTitle>
              <DialogDescription className="text-emerald-950/70 font-bold mt-2">
                Apakah Anda yakin ingin menghapus laporan audit <span className="text-emerald-950 font-black">{selectedProject?.name}</span>? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan dihapus secara permanen.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-8 gap-3 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                className="rounded-none border-4 border-emerald-950 font-black uppercase tracking-widest text-emerald-950 hover:bg-emerald-50 h-12"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="rounded-none border-4 border-red-600 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(220,38,38,0.3)] h-12"
              >
                Ya, Hapus
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
