import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AuditWorkspace } from "@/components/AuditWorkspace";
import { Loader2, ArrowLeft, Leaf, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/workspace/$id")({
  component: WorkspacePage,
});

function WorkspacePage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getAuditDetail(id)
      .then((res) => {
        // Use parsedDocumentJson if available (DrillBit UI), else fallback
        let clauses = [];
        if (res.parsedDocumentJson) {
          try {
            clauses = JSON.parse(res.parsedDocumentJson);
          } catch (e) {
            console.error("Failed to parse document JSON:", e);
          }
        }
        
        if (clauses.length === 0) {
          clauses = res.issues?.map((issue: any, i: number) => ({
            id: i + 1,
            clause: `Klausul Terdeteksi ${i + 1}`,
            text: issue.clauseText || "Teks paragraf tidak tersedia.",
            status: issue.severity === "HIGH_RISK" ? "high" : (issue.severity === "MEDIUM_RISK" ? "medium" : "compliant"),
            issue: {
              id: issue.id,
              severity: issue.severity,
              matchedLaw: issue.matchedLaw,
              originalLawText: issue.originalLawText,
              suggestedRevision: issue.suggestedRevision
            }
          })) || [];
        }

        setData({
          ...res,
          clauses,
          auditId: res.id,
        });
      })
      .catch((err) => {
        console.error("Failed to load audit:", err);
        alert("Gagal memuat detail audit.");
        navigate({ to: "/dashboard" });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-emerald-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-950" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col font-sans text-emerald-950">
      <header className="border-b-4 border-emerald-950 bg-white px-6 py-4 flex justify-between items-center z-50">
        <Link to="/dashboard" className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hover:bg-emerald-50 rounded-none h-10 w-10 border-2 border-transparent hover:border-emerald-950">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="bg-emerald-950 text-white p-1.5 rounded-none border-2 border-emerald-950 hidden sm:block">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase hidden sm:block">Kembali ke Dashboard</span>
        </Link>
        <div className="font-black uppercase tracking-widest text-emerald-950 text-sm">
          Workspace Laporan
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {data.reviewStatus === "PENDING_REVIEW" ? (
            <div className="bg-white border-4 border-emerald-950 p-12 text-center max-w-2xl mx-auto mt-12 shadow-[8px_8px_0_rgba(2,44,34,1)]">
              <div className="bg-yellow-100 p-4 inline-block mb-6 border-2 border-yellow-500">
                <ShieldCheck className="h-12 w-12 text-yellow-600 mx-auto" />
              </div>
              <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-widest mb-4">Menunggu Tinjauan Reviewer</h2>
              <p className="text-gray-600 font-bold leading-relaxed mb-8">
                Dokumen Anda telah dianalisis oleh AI dan saat ini sedang dalam tahap kalibrasi oleh <strong>Ahli Hukum OzikSustain (Human-in-the-Loop)</strong> untuk memastikan akurasi rekomendasi. 
                <br /><br />
                Setelah tinjauan selesai (Disetujui/Revisi/Ditolak), Anda akan menerima pemberitahuan via email dan Anda akan mendapatkan akses penuh ke laporan ini beserta SHA-256 QR Badge (jika lulus).
              </p>
              <Link to="/dashboard">
                <Button className="bg-emerald-950 hover:bg-emerald-900 text-white rounded-none border-2 border-emerald-950 font-black tracking-widest uppercase px-8 h-12">
                  Kembali ke Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <AuditWorkspace 
              isFreemium={false} 
              initialResult={data} 
              initialStatus="result" 
              userName={data.authorName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
              userEmail={data.authorEmail || user?.email || "user@example.com"}
            />
          )}
        </div>
      </main>
    </div>
  );
}
