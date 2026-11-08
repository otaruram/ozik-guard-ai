import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AuditWorkspace } from "@/components/AuditWorkspace";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/workspace/$id")({
  head: () => ({
    meta: [{ title: "Inspeksi Laporan Audit — OzikSustain" }],
  }),
  component: WorkspacePage,
});

function WorkspacePage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getAuditDetail(id)
      .then((res) => {
        let clauses = [];
        if (res.parsedDocumentJson) {
          try {
            let parsed =
              typeof res.parsedDocumentJson === "string"
                ? JSON.parse(res.parsedDocumentJson)
                : res.parsedDocumentJson;
            if (typeof parsed === "string") parsed = JSON.parse(parsed);

            if (parsed && parsed.pages) {
              clauses = parsed.pages.flatMap((p: any) => p.chunks || p.Chunks || []);
            }
          } catch (e) {
            console.error("Failed to parse document JSON:", e);
          }
        }

        if (clauses.length === 0) {
          clauses =
            res.issues?.map((issue: any, i: number) => ({
              id: i + 1,
              clause: `KLAUSUL TERDETEKSI #${i + 1}`,
              text: issue.clauseText || "Teks paragraf tidak tersedia.",
              status:
                issue.severity === "HIGH_RISK"
                  ? "high"
                  : issue.severity === "MEDIUM_RISK"
                  ? "medium"
                  : "compliant",
              issue: {
                id: issue.id,
                severity: issue.severity,
                matchedLaw: issue.matchedLaw,
                originalLawText: issue.originalLawText,
                suggestedRevision: issue.suggestedRevision,
              },
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
        toast.error("Gagal memuat detail rekaman audit.");
        navigate({ to: "/dashboard" });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#F6F4EE] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#091E17]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid flex flex-col text-[#091E17]">
      <header className="border-b-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/dashboard" className="inline-flex items-center gap-3 group">
          <span className="h-8 w-8 border border-[#F6F4EE]/30 flex items-center justify-center group-hover:border-[#FBBF24]">
            <ArrowLeft className="h-4 w-4 text-[#FBBF24]" />
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-widest">
            Kembali ke Workspace Utama
          </span>
        </Link>
        <div className="font-mono text-xs uppercase tracking-widest text-[#34D399]">
          LAPORAN ADJUDIKASI // ID: {id.substring(0, 12)}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {data.reviewStatus === "PENDING_REVIEW" ? (
            <div className="bg-white border-[1.5px] border-[#091E17] p-8 md:p-12 text-center max-w-2xl mx-auto mt-10 shadow-[8px_8px_0_#091E17]">
              <div className="bg-[#FEF3C7] p-4 inline-block mb-5 border border-[#D97706]">
                <ShieldCheck className="h-10 w-10 text-[#B45309] mx-auto" />
              </div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#B45309] mb-2">
                STATUS: ANTREAN KALIBRASI PAKAR (HITL)
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#091E17] mb-4">
                Menunggu Otorisasi Reviewer Hukum
              </h2>
              <p className="text-sm text-[#4A5D54] leading-relaxed mb-8">
                Dokumen Anda telah selesai dipindai oleh mesin vektor IndoBERT dan saat ini sedang berada dalam tahap verifikasi akhir oleh <strong>Auditor Pakar OzikSustain (Human-in-the-Loop)</strong> untuk memastikan akurasi sitasi sebelum segel HMAC-SHA256 diterbitkan.
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold tracking-widest uppercase px-7 py-3.5"
              >
                Kembali ke Workspace
              </Link>
            </div>
          ) : (
            <AuditWorkspace
              isFreemium={false}
              initialResult={data}
              initialStatus="result"
              userName={
                data.authorName ||
                user?.user_metadata?.full_name ||
                user?.email?.split("@")[0] ||
                "Auditor"
              }
              userEmail={data.authorEmail || user?.email || "auditor@oziksustain.id"}
            />
          )}
        </div>
      </main>
    </div>
  );
}
