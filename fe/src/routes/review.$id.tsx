import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AuditWorkspace } from "@/components/AuditWorkspace";

export const Route = createFileRoute("/review/$id")({
  head: () => ({
    meta: [{ title: "Panel Adjudikasi Pakar (HITL) — OzikSustain" }],
  }),
  component: ReviewerWorkspace,
});

function ReviewerWorkspace() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    } else if (user) {
      fetchAudit();
    }
  }, [user, authLoading]);

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>(`/audit/${id}`);
      setAudit(res);
    } catch (err: any) {
      toast.error("Gagal mengambil rekaman audit.");
      navigate({ to: "/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (verdict: string) => {
    if (verdict !== "APPROVED" && !feedback.trim()) {
      toast.error("Harap cantumkan catatan alasan penolakan atau permintaan revisi.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch(`/reviewer/audit/${id}/review`, {
        method: "PUT",
        body: JSON.stringify({ verdict, feedback }),
      });
      toast.success("Keputusan adjudikasi berhasil disimpan.");
      navigate({ to: "/dashboard", search: { tab: "reviewer" } });
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan keputusan review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F4EE]">
        <Loader2 className="h-8 w-8 animate-spin text-[#091E17]" />
      </div>
    );
  }

  if (!audit) return null;

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid flex flex-col text-[#091E17]">
      <header className="bg-[#071913] text-[#F6F4EE] px-6 py-4 border-b-[1.5px] border-[#091E17] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            search={{ tab: "reviewer" }}
            className="h-9 w-9 border border-[#F6F4EE]/30 flex items-center justify-center hover:border-[#FBBF24]"
          >
            <ArrowLeft className="h-4 w-4 text-[#FBBF24]" />
          </Link>
          <div>
            <h1 className="font-editorial text-xl font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#FBBF24]" /> Panel Keputusan Auditor Pakar
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#34D399]">
              KALIBRASI HUMAN-IN-THE-LOOP // ID: {id.substring(0, 12)}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8 grid lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full items-start">
        <div className="lg:col-span-8 bg-white border-[1.5px] border-[#091E17] shadow-[6px_6px_0_#091E17] overflow-hidden">
          <div className="bg-[#F6F4EE] border-b-[1.5px] border-[#091E17] p-4 flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#091E17] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0D6E49]" /> Hasil Pemindaian Awal AI:{" "}
              {audit.projectName}
            </h2>
            <span className="font-mono text-xs font-bold text-[#0D6E49]">
              SKOR: {audit.feasibilityScore}/100
            </span>
          </div>
          <AuditWorkspace
            isFreemium={false}
            initialStatus="result"
            initialResult={{
              id: audit.id,
              auditId: audit.id,
              projectName: audit.projectName || "Dokumen PDD",
              feasibilityScore: audit.feasibilityScore,
              scoreLegal: audit.scoreLegal,
              scoreTechnical: audit.scoreTechnical,
              scoreSocial: audit.scoreSocial,
              scoreTransparency: audit.scoreTransparency,
              issues: audit.issues || [],
              clauses: audit.clauses || [],
              parsedDocumentJson: audit.parsedDocumentJson,
              sha256Hash: audit.sha256Hash,
            }}
            userName="Auditor Reviewer"
            userEmail="reviewer@oziksustain.id"
          />
        </div>

        <div className="lg:col-span-4 space-y-5 sticky top-24">
          <div className="bg-white border-[1.5px] border-[#091E17] p-6 shadow-[6px_6px_0_#091E17] space-y-5">
            <div className="border-b border-[#091E17]/15 pb-3">
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0D6E49]">
                OTORISASI AKHIR
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-[#091E17]">
                Putusan Adjudikasi Pakar
              </h3>
            </div>

            <div>
              <label className="font-mono text-xs font-bold uppercase text-[#091E17] mb-2 block">
                Catatan Hukum / Masukan Revisi
              </label>
              <Textarea
                placeholder="Tuliskan catatan hukum atau instruksi perbaikan klausul bagi pemohon..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px] border-[1.5px] border-[#091E17] rounded-none font-medium text-xs bg-[#F6F4EE]/50 resize-none focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => submitReview("APPROVED")}
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-[#0D6E49] hover:bg-[#09583A] text-white border-[1.5px] border-[#091E17] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" /> Setujui &amp; Segel SHA-256
              </button>

              <button
                type="button"
                onClick={() => submitReview("NEEDS_REVISION")}
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#091E17] border-[1.5px] border-[#091E17] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4" /> Minta Revisi Klausul
              </button>

              <button
                type="button"
                onClick={() => submitReview("REJECTED")}
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-[#B91C1C] hover:bg-[#991B1B] text-white border-[1.5px] border-[#091E17] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle className="h-4 w-4" /> Tolak Dokumen (Pelanggaran)
              </button>
            </div>
          </div>

          <div className="bg-[#071913] text-[#F6F4EE] border-[1.5px] border-[#091E17] p-4 font-mono text-[11px] leading-relaxed">
            Menyetujui dokumen ini akan membangkitkan tanda tangan kriptografi HMAC-SHA256 permanen pada buku besar verifikasi publik.
          </div>
        </div>
      </main>
    </div>
  );
}
