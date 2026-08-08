import { createFileRoute, Link } from "@tanstack/react-router";
import { AuditWorkspace } from "@/components/AuditWorkspace";
import { Leaf } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Gratis — OzikGrid" },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  return (
    <div className="min-h-screen bg-emerald-50/30 selection:bg-emerald-950 selection:text-white pb-20">
      <div className="bg-emerald-950 text-white border-b-4 border-emerald-950 py-12 px-4 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <span className="bg-white text-emerald-950 p-1.5 rounded-sm"><Leaf className="h-5 w-5" /></span>
            <span className="font-black uppercase tracking-widest text-lg">OzikGrid</span>
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4">Uji Coba Audit PDD</h1>
          <p className="font-bold text-white/80 max-w-2xl mx-auto">
            Coba kehebatan agregasi AI kami. Unggah sampel PDD, dan lihat bagaimana AI mendeteksi kelayakan teknis serta potensi pelanggaran hukum secara instan.
          </p>
        </div>
      </div>
      
      <div className="px-4">
        <AuditWorkspace isFreemium={true} />
      </div>
    </div>
  );
}