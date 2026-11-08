import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ShieldCheck,
  Copy,
  AlertTriangle,
  Check,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";

interface HistoriAuditProps {
  history: any[];
  loading: boolean;
  refreshHistory: () => void;
}

export function HistoriAudit({ history, loading, refreshHistory }: HistoriAuditProps) {
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "HIGH_SCORE" | "REVISION">("ALL");
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedVerifyUrl, setCopiedVerifyUrl] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      await api.deleteAudit(selectedProject.id);
      setDeleteOpen(false);
      toast.success("Rekaman audit berhasil dihapus.");
      refreshHistory();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus rekaman audit.");
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
    date: new Date(item.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    score: item.feasibilityScore,
    status:
      item.reviewStatus === "APPROVED"
        ? "Disetujui (Verified)"
        : item.reviewStatus === "REJECTED"
        ? "Ditolak (Pelanggaran)"
        : item.reviewStatus === "NEEDS_REVISION"
        ? "Perlu Revisi"
        : "Menunggu Tinjauan Pakar",
    color:
      item.reviewStatus === "APPROVED"
        ? "emerald"
        : item.reviewStatus === "REJECTED"
        ? "red"
        : item.feasibilityScore >= 80
        ? "emerald"
        : item.feasibilityScore >= 60
        ? "yellow"
        : "red",
    reviewStatus: item.reviewStatus,
    code: `OZK-${item.id.substring(0, 8).toUpperCase()}`,
  }));

  const filteredHistory = mappedHistory.filter((row) => {
    const matchesQuery =
      !searchQuery.trim() ||
      row.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterMode === "ALL"
        ? true
        : filterMode === "HIGH_SCORE"
        ? row.score >= 75 || row.reviewStatus === "APPROVED"
        : row.reviewStatus === "NEEDS_REVISION" ||
          row.reviewStatus === "REJECTED" ||
          row.score < 60;
    return matchesQuery && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / itemsPerPage));
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const embedCode = `<script src="https://oziksustain.id/badge.js" data-id="${selectedProject?.code}"></script>`;

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5D54]" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama berkas PDD atau kode registri..."
              className="pl-10 h-11 border-[1.5px] border-[#091E17] rounded-none font-medium text-[#091E17] bg-white focus-visible:ring-0 shadow-[2.5px_2.5px_0_#091E17] sm:shadow-[3px_3px_0_#091E17]"
            />
          </div>

          <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-2">
            {[
              { key: "ALL", label: "Semua", fullLabel: "Semua Rekaman" },
              { key: "HIGH_SCORE", label: "Lulus", fullLabel: "Skor Tinggi / Lulus" },
              { key: "REVISION", label: "Revisi", fullLabel: "Perlu Revisi" },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setFilterMode(f.key as any);
                  setCurrentPage(1);
                }}
                className={cn(
                  "h-11 px-2.5 sm:px-4 border-[1.5px] border-[#091E17] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center",
                  filterMode === f.key
                    ? "bg-[#091E17] text-[#F6F4EE] shadow-[2.5px_2.5px_0_#D97706] sm:shadow-[3px_3px_0_#D97706]"
                    : "bg-white text-[#091E17] hover:bg-[#ECE9DF]"
                )}
              >
                <span className="hidden sm:inline">{f.fullLabel}</span>
                <span className="sm:hidden">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* History Ledger Table */}
        <div className="border-[1.5px] border-[#091E17] bg-white shadow-[4px_4px_0_#091E17] sm:shadow-[6px_6px_0_#091E17]">
          <div className="sm:hidden px-3.5 py-1.5 bg-[#F6F4EE] border-b border-[#091E17]/15 font-mono text-[10px] text-[#4A5D54]">
            Geser tabel ke kanan untuk melihat status &amp; tindakan &rarr;
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="bg-[#071913] text-[#F6F4EE] border-b-[1.5px] border-[#091E17] font-mono text-xs uppercase">
                  <th className="p-4">Kode</th>
                  <th className="p-4">Nama Berkas Proyek / PDD</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Skor</th>
                  <th className="p-4">Status Adjudikasi</th>
                  <th className="p-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#091E17]/15 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center font-mono text-[#4A5D54]">
                      Memuat buku besar histori audit...
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center font-mono text-[#4A5D54]">
                      Tidak ada rekaman audit yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  paginatedHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-[#F6F4EE]/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#4A5D54]">{row.code}</td>
                      <td className="p-4 font-semibold text-[#091E17] text-sm">{row.name}</td>
                      <td className="p-4 font-mono text-[#4A5D54]">{row.date}</td>
                      <td className="p-4 font-mono font-bold text-[#091E17] tabular-nums">
                        {row.score}/100
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-block px-2.5 py-1 border font-mono font-bold uppercase text-[10px]",
                            row.color === "emerald"
                              ? "border-[#0D6E49] bg-[#E6F4EE] text-[#0D6E49]"
                              : row.color === "yellow"
                              ? "border-[#D97706] bg-[#FEF3C7] text-[#B45309]"
                              : "border-[#B91C1C] bg-[#FEE2E2] text-[#B91C1C]"
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to="/workspace/$id"
                            params={{ id: row.id }}
                            className="px-3 py-1.5 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-[10px] font-bold uppercase tracking-wider transition-colors"
                          >
                            Buka Laporan
                          </Link>
                          {row.reviewStatus === "APPROVED" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProject(row);
                                setBadgeOpen(true);
                              }}
                              className="px-3 py-1.5 border border-[#091E17] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#091E17] font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                            >
                              QR Badge
                            </button>
                          ) : (
                            <span className="px-3 py-1.5 border border-[#091E17]/20 bg-[#F6F4EE] text-[#4A5D54] font-mono text-[10px] uppercase">
                              Menunggu Segel
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProject(row);
                              setDeleteOpen(true);
                            }}
                            className="h-7 w-7 border border-[#B91C1C] bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Hapus rekaman"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
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
                  className="px-3 py-1.5 border border-[#091E17] bg-white font-bold uppercase disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-[#091E17] bg-white font-bold uppercase disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  Berikutnya <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Badge Dialog */}
      <Dialog open={badgeOpen} onOpenChange={setBadgeOpen}>
        <DialogContent className="border-[1.5px] border-[#091E17] rounded-none shadow-[4px_4px_0_#091E17] sm:shadow-[8px_8px_0_#091E17] p-0 max-w-[95vw] md:max-w-3xl bg-white overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="bg-[#071913] text-[#F6F4EE] p-5 sm:p-6 border-b-[1.5px] border-[#091E17] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <DialogTitle className="font-editorial text-xl sm:text-2xl font-semibold text-white break-words">
                Lencana Kriptografi Proyek Hijau
              </DialogTitle>
              <DialogDescription className="font-mono text-[11px] sm:text-xs text-[#34D399] mt-1 break-words">
                TERVERIFIKASI HMAC-SHA256 // {selectedProject?.name}
              </DialogDescription>
            </div>
            <Link
              to="/verify/$id"
              params={{ id: selectedProject?.id || "OZK-2026-SAMPLE-VERIFIED" }}
              className="px-3 py-1.5 bg-[#FBBF24] text-[#091E17] font-mono text-[10px] font-bold uppercase inline-flex items-center gap-1 self-start sm:self-auto shrink-0"
            >
              Buka Buku Besar <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="p-6 border-b md:border-b-0 md:border-r border-[#091E17]/20 bg-[#F6F4EE] flex flex-col items-center justify-center">
              <div className="border-[1.5px] border-[#091E17] bg-white shadow-[5px_5px_0_#091E17] p-5 max-w-[240px] w-full flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#091E17] text-[#FBBF24] p-1.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="font-editorial font-bold text-[#091E17] text-base">
                    OzikSustain
                  </span>
                </div>

                <div className="border border-[#091E17] p-2.5 mb-4 bg-white">
                  <QRCodeSVG
                    value={`https://oziksustain.my.id/verify/${selectedProject?.id}`}
                    size={120}
                    bgColor={"#ffffff"}
                    fgColor={"#091E17"}
                    level={"Q"}
                    ref={qrRef}
                  />
                </div>

                <div className="w-full text-center border-t border-[#091E17]/20 pt-3 font-mono">
                  <div className="font-bold text-[#091E17] text-[11px]">
                    ID: {selectedProject?.code}
                  </div>
                  <div className="text-[#0D6E49] font-bold text-[10px] mt-0.5">
                    SKOR KELAYAKAN: {selectedProject?.score}/100
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#091E17] border-b border-[#091E17]/15 pb-2 mb-3">
                  A. Unduh Berkas Grafik QR
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={downloadPNG}
                    className="py-2.5 px-4 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Unduh PNG
                  </button>
                  <button
                    type="button"
                    onClick={downloadSVG}
                    className="py-2.5 px-4 border-[1.5px] border-[#091E17] bg-[#F6F4EE] hover:bg-[#ECE9DF] text-[#091E17] font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Unduh SVG
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#091E17] border-b border-[#091E17]/15 pb-2 mb-3">
                  B. Sematkan pada Portal Web / Tender
                </h3>
                <div className="bg-[#F6F4EE] border border-[#091E17]/30 p-3 mb-3">
                  <code className="font-mono text-[10px] text-[#091E17] break-all select-all">
                    {embedCode}
                  </code>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(embedCode);
                      setCopiedEmbed(true);
                      setTimeout(() => setCopiedEmbed(false), 1800);
                    }}
                    className="py-2 px-3 border border-[#091E17] bg-white hover:bg-[#ECE9DF] font-mono text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedEmbed ? <Check className="h-3.5 w-3.5 text-[#0D6E49]" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedEmbed ? "Tersalin" : "Salin Script"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://oziksustain.my.id/verify/${selectedProject?.id}`
                      );
                      setCopiedVerifyUrl(true);
                      setTimeout(() => setCopiedVerifyUrl(false), 1800);
                    }}
                    className="py-2 px-3 border border-[#091E17] bg-white hover:bg-[#ECE9DF] font-mono text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedVerifyUrl ? (
                      <Check className="h-3.5 w-3.5 text-[#0D6E49]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedVerifyUrl ? "URL Disalin" : "Salin Tautan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-[1.5px] border-[#091E17] rounded-none shadow-[8px_8px_0_#091E17] p-0 sm:max-w-md bg-white">
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-editorial text-2xl font-semibold text-[#091E17] flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-[#B91C1C]" />
                Hapus Rekaman Audit
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-[#4A5D54] mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus laporan audit{" "}
                <strong className="text-[#091E17]">{selectedProject?.name}</strong> secara permanen?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 gap-2">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2.5 border-[1.5px] border-[#091E17] bg-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 border-[1.5px] border-[#B91C1C] bg-[#B91C1C] text-white font-mono text-xs font-bold uppercase cursor-pointer"
              >
                Hapus Permanen
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
