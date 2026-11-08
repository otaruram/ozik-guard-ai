import { createFileRoute, Link } from "@tanstack/react-router";
import { AuditWorkspace } from "@/components/AuditWorkspace";
import { ShieldCheck, FileSearch, EyeOff, Cpu, Scale, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Simulasi & Uji Coba Audit PDD : OzikSustain" },
      {
        name: "description",
        content:
          "Uji coba mesin adjudikasi AI OzikSustain. Unggah dokumen PDD atau jalankan simulasi sampel untuk mendeteksi risiko hukum lingkungan dan kelayakan teknis.",
      },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid text-[#091E17] pb-24">
      {/* Header Banner */}
      <div className="border-b-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] py-12 md:py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 border border-[#34D399]/40 bg-[#064E3B]/40 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#34D399]">
                <FileSearch className="h-3.5 w-3.5" />
                LABORATORIUM UJI COBA PUBLIK // FREEMIUM SANDBOX
              </div>
              <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                Inspeksi Kepatuhan Dokumen PDD &amp; Izin Lingkungan
              </h1>
              <p className="text-sm sm:text-base text-[#F6F4EE]/75 max-w-2xl leading-relaxed">
                Unggah dokumen <strong className="text-white">Project Design Document (PDD)</strong> dalam format PDF/DOCX atau gunakan <strong className="text-[#FBBF24]">Dokumen Sampel</strong> yang tersedia di bawah untuk melihat bagaimana mesin IndoBERT menyensor data pribadi, memverifikasi koordinat spasial, dan mencocokkan pasal regulasi secara langsung.
              </p>
            </div>

            <div className="lg:col-span-4 border border-[#F6F4EE]/20 bg-[#0C261E] p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#FBBF24] border-b border-[#F6F4EE]/15 pb-2">
                <span>PARAMETER SANDBOX</span>
                <span>AKTIF</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-[#F6F4EE]/80">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-3.5 w-3.5 text-[#34D399]" />
                  <span>Penyensoran NIK &amp; NIB Otomatis (UU PDP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-[#34D399]" />
                  <span>Pemrosesan In-Memory (Tanpa Simpan File)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-[#34D399]" />
                  <span>Sitasi Deterministik Korpus Pasal.id</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#F6F4EE]/15 flex items-center justify-between">
                <span className="text-[10px] text-[#F6F4EE]/60">Butuh 3 kredit penuh gratis?</span>
                <Link to="/auth" className="text-[#FBBF24] font-bold hover:underline inline-flex items-center gap-1">
                  Daftar Akun <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-10">
        <AuditWorkspace isFreemium={true} />
      </div>
    </div>
  );
}
