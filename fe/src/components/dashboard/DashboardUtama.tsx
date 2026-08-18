import { Leaf, ShieldCheck } from "lucide-react";
import { AuditWorkspace } from "@/components/AuditWorkspace";

interface DashboardUtamaProps {
  history: any[];
  onAuditComplete: () => void;
  userName: string;
  userEmail: string;
}

export function DashboardUtama({ history, onAuditComplete, userName, userEmail }: DashboardUtamaProps) {
  const total = history.length;
  const avgCompliance = total > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.feasibilityScore || 0), 0) / total) 
    : 0;
  const greenBadges = history.filter(h => h.status === "ACTIVE" || (h.feasibilityScore || 0) >= 50).length;

  return (
    <div suppressHydrationWarning className="max-w-7xl mx-auto space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-4 border-emerald-950 bg-white p-6 shadow-[6px_6px_0_rgba(2,44,34,1)]">
          <div className="text-xs font-black text-emerald-950/60 uppercase tracking-widest">Total Proyek Dievaluasi</div>
          <div className="mt-2 text-4xl font-black text-emerald-950">{total} <span className="text-xl">Proyek</span></div>
        </div>
        <div className="border-4 border-emerald-950 bg-emerald-950 text-white p-6 shadow-[6px_6px_0_rgba(2,44,34,0.3)] relative overflow-hidden">
          <div className="text-xs font-black text-white/60 uppercase tracking-widest">Rata-rata Compliance</div>
          <div className="mt-2 text-4xl font-black">{avgCompliance}<span className="text-xl text-white/60">/100</span></div>
          <Leaf className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
        </div>
        <div className="border-4 border-emerald-950 bg-white p-6 shadow-[6px_6px_0_rgba(2,44,34,1)]">
          <div className="text-xs font-black text-emerald-950/60 uppercase tracking-widest">Verified Green Badges</div>
          <div className="mt-2 text-4xl font-black text-emerald-950 flex items-center gap-3">
            {greenBadges} <ShieldCheck className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      <AuditWorkspace isFreemium={false} onAuditComplete={onAuditComplete} userName={userName} userEmail={userEmail} />
    </div>
  );
}
