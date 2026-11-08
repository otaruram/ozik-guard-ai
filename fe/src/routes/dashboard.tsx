import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  History,
  User as UserIcon,
  Settings,
  CreditCard,
  LogOut,
  Zap,
  Menu,
  X,
  ShieldCheck,
  EyeOff,
  BookOpen,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

import { DashboardUtama } from "@/components/dashboard/DashboardUtama";
import { HistoriAudit } from "@/components/dashboard/HistoriAudit";
import { Pengaturan } from "@/components/dashboard/Pengaturan";
import { PaketPricing } from "@/components/dashboard/PaketPricing";
import { ProfilPengguna } from "@/components/dashboard/ProfilPengguna";
import { AdminPanel } from "@/components/dashboard/AdminPanel";
import { ReviewerQueueTab } from "@/components/dashboard/ReviewerQueueTab";
import { KycQueueTab } from "@/components/dashboard/KycQueueTab";

type DashboardSearch = {
  tab?: string;
};

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      tab: search.tab as string | undefined,
    };
  },
  head: () => ({
    meta: [{ title: "Workspace Adjudikasi — OzikSustain" }],
  }),
  component: Dashboard,
});

const NAV_ITEMS = [
  { key: "overview", label: "Workspace Utama", icon: LayoutDashboard },
  { key: "history", label: "Registri & Histori Audit", icon: History },
  { key: "billing", label: "Alokasi Kredit & Paket", icon: CreditCard },
  { key: "profile", label: "Identitas Entitas (KYC)", icon: UserIcon },
  { key: "settings", label: "Pengaturan & Kunci API", icon: Settings },
] as const;

function Dashboard() {
  const { tab } = Route.useSearch();
  const active = tab || "overview";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const refreshHistory = () => {
    setLoadingHistory(true);
    Promise.all([
      api
        .getHistory()
        .then((res) => setHistoryData(res.audits || []))
        .catch((err) => {
          console.error("History fetch error:", err);
        }),
      api
        .getMe()
        .then((res) => {
          setDbUser(res);
        })
        .catch((err) => {
          console.error("User fetch error:", err);
          if (
            err.message?.includes("Akun pengguna tidak ditemukan") ||
            err.message?.includes("401")
          ) {
            signOut().then(() => navigate({ to: "/auth" }));
          }
        }),
    ]).finally(() => setLoadingHistory(false));
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    } else if (user) {
      refreshHistory();
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (dbUser && dbUser.kycStatus === "UNVERIFIED") {
      const isAdmin =
        user &&
        ["okitr52@gmail.com", "okitarunaramadhan@gmail.com"].includes(user.email || "");
      if (!isAdmin && dbUser.role !== "ADMIN") {
        navigate({ to: "/kyc-onboarding" as any });
      }
    }
  }, [dbUser, navigate, user]);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div
        suppressHydrationWarning
        className="min-h-screen flex items-center justify-center bg-[#F6F4EE]"
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#091E17]" />
      </div>
    );
  }

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Auditor";
  const userEmail = user.email || "auditor@oziksustain.id";
  const userAvatar = user.user_metadata?.avatar_url;
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAdminEmail = ["okitr52@gmail.com", "okitarunaramadhan@gmail.com"].includes(
    user?.email || ""
  );

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid flex text-[#091E17] selection:bg-[#091E17] selection:text-[#F6F4EE]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#071913]/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR INSTRUMENT PANEL */}
      <aside
        className={cn(
          "bg-[#071913] text-[#F6F4EE] border-r-[1.5px] border-[#091E17] flex flex-col shrink-0 transition-transform duration-300 z-50 w-[276px]",
          "fixed inset-y-0 left-0 lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-18 flex items-center justify-between px-5 border-b border-[#F6F4EE]/15 shrink-0 bg-[#091E17]">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center bg-[#F6F4EE] p-1 border border-[#F6F4EE]">
              <img
                src="/logo.png"
                alt="OzikSustain"
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
            <div>
              <span className="font-editorial text-lg font-bold tracking-tight text-white block leading-none">
                OzikSustain
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#34D399]">
                WORKSPACE PRO
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[#F6F4EE]/70 hover:text-white"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {[
            {
              group: "MODUL ADJUDIKASI & DATA",
              items: [
                { key: "overview", label: "Workspace Utama", icon: LayoutDashboard },
                { key: "history", label: "Registri & Histori", icon: History },
                {
                  key: "regulasi",
                  label: "Direktori Pasal.id",
                  icon: BookOpen,
                  path: "/regulasi",
                },
              ],
            },
            {
              group: "ENTITAS & KREDIT",
              items: [
                { key: "billing", label: "Alokasi Kredit & Paket", icon: CreditCard },
                { key: "profile", label: "Identitas Entitas (KYC)", icon: UserIcon },
              ],
            },
            {
              group: "OTORITAS & SISTEM",
              items: [
                ...(isAdminEmail
                  ? [{ key: "admin", label: "Admin Control Center", icon: ShieldCheck }]
                  : []),
                ...(isAdminEmail
                  ? [{ key: "kyc-queue", label: "Antrean Verifikasi KYC", icon: ShieldCheck }]
                  : []),
                ...(dbUser?.role === "ADMIN" ||
                dbUser?.role === "REVIEWER" ||
                isAdminEmail
                  ? [{ key: "reviewer", label: "Antrean Reviewer (HITL)", icon: EyeOff }]
                  : []),
                { key: "settings", label: "Pengaturan & Kunci API", icon: Settings },
              ],
            },
          ].map((group) => {
            if (group.items.length === 0) return null;
            return (
              <div key={group.group} className="space-y-1.5">
                <h4 className="px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#F6F4EE]/45 mb-2">
                  {group.group}
                </h4>
                {group.items.map((item) => {
                  const isActive = item.key === active;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        if ((item as any).path) {
                          navigate({ to: (item as any).path });
                        } else {
                          navigate({ to: "/dashboard", search: { tab: item.key } });
                        }
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border cursor-pointer",
                        isActive
                          ? "bg-[#FBBF24] text-[#091E17] border-[#FBBF24] font-bold shadow-[3px_3px_0_#000000]"
                          : "bg-transparent text-[#F6F4EE]/75 border-transparent hover:border-[#F6F4EE]/20 hover:bg-[#0C261E] hover:text-white"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </span>
                      {(item as any).path && <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#F6F4EE]/15 bg-[#091E17] space-y-3">
          <div className="p-3 border border-[#F6F4EE]/20 bg-[#071913] flex items-center gap-3">
            <Avatar className="h-9 w-9 rounded-none border border-[#FBBF24]">
              {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
              <AvatarFallback className="bg-[#0C261E] text-[#FBBF24] font-mono font-bold text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{userName}</div>
              <div className="font-mono text-[10px] text-[#34D399] uppercase mt-0.5">
                {isAdminEmail ? "OTORITAS ADMIN" : dbUser?.company || "AKUN TERVERIFIKASI"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="w-full py-2.5 px-4 border border-[#EF4444]/50 bg-[#7F1D1D]/30 hover:bg-[#B91C1C] text-[#FCA5A5] hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Akhiri Sesi
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-18 bg-white border-b-[1.5px] border-[#091E17] flex items-center px-4 md:px-8 gap-4 shrink-0 justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 border border-[#091E17] text-[#091E17] hover:bg-[#F6F4EE]"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#4A5D54] hidden sm:block">
                TERMINAL ADJUDIKASI // OZIKSUSTAIN
              </div>
              <h1 className="font-editorial text-xl font-semibold text-[#091E17]">
                {NAV_ITEMS.find((n) => n.key === active)?.label ||
                  (active === "admin"
                    ? "Admin Control Center"
                    : active === "kyc-queue"
                    ? "Antrean Verifikasi KYC"
                    : active === "reviewer"
                    ? "Antrean Reviewer Pakar (HITL)"
                    : "Workspace Utama")}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 border-[1.5px] border-[#091E17] p-1.5 bg-[#F6F4EE] shadow-[3px_3px_0_#091E17]">
              <span className="flex items-center gap-1.5 px-2.5 font-mono text-xs font-bold uppercase text-[#091E17] tabular-nums">
                <Zap className="h-3.5 w-3.5 text-[#D97706] fill-[#D97706]" />
                {isAdminEmail
                  ? "UNLIMITED (ADMIN)"
                  : `${dbUser?.creditsBalance ?? 0} Kredit Tersedia`}
              </span>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard", search: { tab: "billing" } })}
                className="px-3 py-1.5 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Tambah Kredit
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {active === "overview" && (
            <DashboardUtama
              history={historyData}
              onAuditComplete={refreshHistory}
              userName={userName}
              userEmail={userEmail}
            />
          )}
          {active === "history" && (
            <HistoriAudit
              history={historyData}
              loading={loadingHistory}
              refreshHistory={refreshHistory}
            />
          )}
          {active === "profile" && (
            <ProfilPengguna dbUser={dbUser} onProfileUpdate={refreshHistory} />
          )}
          {active === "admin" && <AdminPanel />}
          {active === "kyc-queue" && <KycQueueTab />}
          {active === "reviewer" && <ReviewerQueueTab />}
          {active === "settings" && (
            <Pengaturan dbUser={dbUser} refreshUser={refreshHistory} />
          )}
          {active === "billing" && <PaketPricing />}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="border-[1.5px] border-[#091E17] rounded-none shadow-[8px_8px_0_#091E17] p-0 gap-0 sm:max-w-md bg-white">
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-editorial text-2xl font-semibold text-[#091E17]">
                Konfirmasi Akhiri Sesi
              </DialogTitle>
              <DialogDescription className="text-[#4A5D54] text-xs sm:text-sm mt-2 leading-relaxed">
                Apakah Anda yakin ingin keluar dari Workspace OzikSustain? Sesi terenkripsi Anda akan ditutup secara aman.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 gap-2.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="px-5 py-2.5 border-[1.5px] border-[#091E17] bg-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-wider text-[#091E17] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 border-[1.5px] border-[#B91C1C] bg-[#B91C1C] text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Ya, Akhiri Sesi
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
