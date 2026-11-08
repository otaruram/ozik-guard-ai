import { ShieldCheck, FileCheck2, Activity } from "lucide-react";
import { AuditWorkspace } from "@/components/AuditWorkspace";

interface DashboardUtamaProps {
  history: any[];
  onAuditComplete: () => void;
  userName: string;
  userEmail: string;
}

export function DashboardUtama({
  history,
  onAuditComplete,
  userName,
  userEmail,
}: DashboardUtamaProps) {
  const total = history.length;
  const avgCompliance =
    total > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + (curr.feasibilityScore || 0), 0) / total
        )
      : 0;
  const greenBadges = history.filter(
    (h) => h.reviewStatus === "APPROVED" || h.status === "ACTIVE" || (h.feasibilityScore || 0) >= 75
  ).length;

  return (
    <div suppressHydrationWarning className="max-w-7xl mx-auto space-y-8">
      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="instrument-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#4A5D54] mb-3">
            <span>METRIK 01 // VOLUME EVALUASI</span>
            <FileCheck2 className="h-4 w-4 text-[#0D6E49]" />
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-[#091E17] tabular-nums">
              {total} <span className="text-sm font-normal text-[#4A5D54]">Dokumen PDD</span>
            </div>
            <div className="mt-1 text-xs text-[#4A5D54]">
              Total berkas proyek yang telah dipindai
            </div>
          </div>
        </div>

        <div className="border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] p-6 shadow-[4px_4px_0_#D97706] flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#34D399] mb-3">
            <span>METRIK 02 // RATA-RATA SKOR</span>
            <Activity className="h-4 w-4 text-[#FBBF24]" />
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-white tabular-nums">
              {avgCompliance}
              <span className="text-base text-[#F6F4EE]/60">/100</span>
            </div>
            <div className="mt-1 text-xs text-[#F6F4EE]/70">
              Indeks kepatuhan gabungan 4 pilar
            </div>
          </div>
        </div>

        <div className="instrument-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#4A5D54] mb-3">
            <span>METRIK 03 // SERTIFIKAT AKTIF</span>
            <ShieldCheck className="h-4 w-4 text-[#0D6E49]" />
          </div>
          <div>
            <div className="font-mono text-3xl md:text-4xl font-bold text-[#0D6E49] tabular-nums">
              {greenBadges} <span className="text-sm font-normal text-[#4A5D54]">Lencana QR</span>
            </div>
            <div className="mt-1 text-xs text-[#4A5D54]">
              Tersegel kriptografi HMAC-SHA256
            </div>
          </div>
        </div>
      </div>

      {/* Main Audit Workspace */}
      <AuditWorkspace
        isFreemium={false}
        onAuditComplete={onAuditComplete}
        userName={userName}
        userEmail={userEmail}
      />
    </div>
  );
}
