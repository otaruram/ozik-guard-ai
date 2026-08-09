import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from 'qrcode.react';
import {
  Leaf,
  LayoutDashboard,
  History,
  User as UserIcon,
  Settings,
  CreditCard,
  LogOut,
  Zap,
  Bell,
  Menu,
  X,
  CheckCircle2,
  Upload,
  FileText,
  ShieldCheck,
  Search,
  Wand2,
  Loader2,
  Check,
  MoreHorizontal,
  ChevronDown,
  ArrowRight,
  EyeOff,
  Copy,
  AlertTriangle,
  QrCode,
  Lock,
  Play,
  Code2,
  Terminal,
  BookOpen,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditWorkspace } from "@/components/AuditWorkspace";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — OzikSustain Workspace" },
    ],
  }),
  component: Dashboard,
});

const NAV_ITEMS = [
  { key: "overview", label: "Dashboard Utama", icon: LayoutDashboard },
  { key: "history", label: "Histori Audit", icon: History },
  { key: "billing", label: "Paket & Pricing", icon: CreditCard },
  { key: "profile", label: "Profil Akun", icon: UserIcon },
  { key: "settings", label: "Pengaturan", icon: Settings },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]["key"];

function Dashboard() {
  const [active, setActive] = useState<string>("overview");
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
      api.getHistory().then(res => setHistoryData(res.audits || [])).catch(console.error),
      api.getMe().then(res => setDbUser(res)).catch(console.error)
    ]).finally(() => setLoadingHistory(false));
  };

  // Redirect to /auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    } else if (user) {
      refreshHistory();
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-emerald-50/30">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-950" />
      </div>
    );
  }

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "user@example.com";
  const userAvatar = user.user_metadata?.avatar_url;
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-emerald-50/30 flex text-emerald-950 font-sans selection:bg-emerald-950 selection:text-white">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-emerald-950/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "bg-white border-r-4 border-emerald-950 flex flex-col shrink-0 transition-transform duration-300 z-50 w-[280px]",
          "fixed inset-y-0 left-0 lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-20 flex items-center px-6 border-b-4 border-emerald-950 shrink-0 bg-emerald-950 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-sm bg-emerald-950 text-white shadow-[2px_2px_0_rgba(2,44,34,1)] overflow-hidden">
              <img src="/logo.png" alt="OzikSustain" className="h-full w-full object-cover" />
            </div>
            <span className="text-[17px] font-black uppercase tracking-widest">OzikSustain</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-white/70 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
          {[
            { key: "overview", label: "Dashboard Utama", icon: LayoutDashboard },
            { key: "history", label: "Histori Audit", icon: History },
            { key: "billing", label: "Paket & Pricing", icon: CreditCard },
            { key: "profile", label: "Profil Akun", icon: UserIcon },
            ...(user && ["okitr52@gmail.com", "okitarunaramadhan@gmail.com"].includes(user?.email || "") 
              ? [{ key: "admin", label: "Admin Panel", icon: ShieldCheck }] : []),
            { key: "settings", label: "Pengaturan", icon: Settings },
          ].map((item) => {
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActive(item.key);
                  setMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 text-sm font-black uppercase tracking-widest transition-all rounded-none border-4",
                  isActive
                    ? "bg-emerald-950 text-white border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,0.3)] translate-x-1"
                    : "bg-transparent text-emerald-950/70 border-transparent hover:border-emerald-950 hover:bg-emerald-50 hover:text-emerald-950"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t-4 border-emerald-950 bg-white">
          <div className="p-4 border-4 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)] mb-4 flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-none border-2 border-emerald-950">
              {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
              <AvatarFallback className="bg-emerald-950 text-white font-black text-xs">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-emerald-950 truncate uppercase">{userName}</div>
              <Badge variant="outline" className="text-[9px] border-emerald-950 bg-emerald-50 text-emerald-950 font-black rounded-none mt-1 px-1">
                FREE PLAN
              </Badge>
            </div>
          </div>
          <Button
            variant="destructive"
            className="w-full rounded-none font-black uppercase tracking-widest border-4 border-red-600 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white shadow-[4px_4px_0_rgba(220,38,38,0.2)] transition-all h-12"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="h-4 w-4 mr-2" /> Keluar
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b-4 border-emerald-950 flex items-center px-4 md:px-8 gap-4 shrink-0 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-emerald-950 hover:bg-emerald-50"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-black uppercase tracking-widest text-emerald-950 hidden sm:block">
              {NAV_ITEMS.find((n) => n.key === active)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-4 border-emerald-950 p-1.5 shadow-[2px_2px_0_rgba(2,44,34,1)] bg-white">
              <span className="flex items-center gap-1.5 px-2 text-xs font-black uppercase text-emerald-950">
                <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                {["okitr52@gmail.com", "okitarunaramadhan@gmail.com"].includes(user?.email || "") ? "UNLIMITED (ADMIN)" : `${dbUser?.creditsBalance ?? 0} Kredit Tersisa`}
              </span>
              <Button size="sm" className="h-8 rounded-none bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-black text-xs uppercase tracking-wider border-2 border-emerald-950">
                Top Up
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {active === "overview" && <DashboardUtama history={historyData} onAuditComplete={refreshHistory} userName={userName} userEmail={userEmail} />}
          {active === "history" && <HistoriAudit history={historyData} loading={loadingHistory} refreshHistory={refreshHistory} />}
          {active === "profile" && <ProfilPengguna dbUser={dbUser} onProfileUpdate={refreshHistory} />}
          {active === "admin" && <AdminPanel />}
          {active === "settings" && <Pengaturan dbUser={dbUser} refreshUser={refreshHistory} />}
          {active === "billing" && <PaketPricing />}
        </main>
      </div>

      {/* Logout Modal */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="border-4 border-emerald-950 rounded-none shadow-[16px_16px_0_rgba(2,44,34,1)] p-0 gap-0 sm:max-w-md bg-white">
          <div className="p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-wide text-emerald-950">
                Konfirmasi Keluar
              </DialogTitle>
              <DialogDescription className="text-emerald-950/70 font-bold mt-2">
                Apakah Anda yakin ingin keluar? Sesi B2B Anda akan diakhiri secara aman.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-8 gap-3 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setLogoutOpen(false)}
                className="rounded-none border-4 border-emerald-950 font-black uppercase tracking-widest text-emerald-950 hover:bg-emerald-50 h-12"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="rounded-none border-4 border-red-600 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(220,38,38,0.3)] h-12"
              >
                Ya, Keluar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------------------------
// 1. DASHBOARD UTAMA
// ----------------------------------------------------------------------
function DashboardUtama({ history, onAuditComplete, userName, userEmail }: { history: any[], onAuditComplete: () => void, userName: string, userEmail: string }) {
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

// ----------------------------------------------------------------------
// 2. HISTORI AUDIT
// ----------------------------------------------------------------------
function HistoriAudit({ history, loading, refreshHistory }: { history: any[], loading: boolean, refreshHistory: () => void }) {
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const qrRef = useRef<SVGSVGElement>(null);

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
    status: item.feasibilityScore >= 80 ? 'Compliant' : (item.feasibilityScore >= 60 ? 'Needs Revision' : 'High Violation'),
    color: item.feasibilityScore >= 80 ? 'emerald' : (item.feasibilityScore >= 60 ? 'yellow' : 'red'),
    code: `OZK-${item.id.substring(0, 8).toUpperCase()}`,
  }));

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
              ) : mappedHistory.map((row) => (
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
                    {row.color === 'emerald' && (
                      <Button size="sm" variant="outline" onClick={() => { setSelectedProject(row); setBadgeOpen(true); }} className="rounded-none font-black text-[10px] uppercase border-2 border-emerald-950 hover:bg-emerald-50">Badge</Button>
                    )}
                    {row.color !== 'emerald' && (
                      <Button size="sm" variant="outline" className="rounded-none font-black text-[10px] uppercase border-2 border-emerald-950 hover:bg-emerald-50">Re-Audit</Button>
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
        </div>
      </div>

      <Dialog open={badgeOpen} onOpenChange={setBadgeOpen}>
        <DialogContent className="border-4 border-emerald-950 rounded-none shadow-[12px_12px_0_rgba(2,44,34,1)] p-0 max-w-3xl bg-white overflow-hidden">
          <div className="bg-emerald-950 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-emerald-950 gap-3">
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-widest text-white mb-1">
                Lencana Verifikasi Proyek Hijau
              </DialogTitle>
              <DialogDescription className="text-white/70 font-bold text-xs">
                Verified Green Project Badge untuk {selectedProject?.name}
              </DialogDescription>
            </div>
            <Badge className="bg-white text-emerald-950 border-2 border-transparent font-black uppercase text-xs rounded-none px-3 py-1">
              Status: Aktif & Terverifikasi
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 border-r-4 border-emerald-950 bg-emerald-50 flex flex-col items-center justify-center">
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


// ----------------------------------------------------------------------
// 4. PENGATURAN (Google Auth — no password tab)
// ----------------------------------------------------------------------
function Pengaturan({ dbUser, refreshUser }: { dbUser: any, refreshUser: () => void }) {
  const { user } = useAuth();
  const [loadingKey, setLoadingKey] = useState(false);
  const [pddText, setPddText] = useState('Paragraf ini memuat klaim pengurangan emisi karbon dari proyek PLTS, namun tidak terdapat bukti studi kelayakan yang memadai.');
  const [projectName, setProjectName] = useState('Sample PDD Audit');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loadingPlayground, setLoadingPlayground] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiTab, setApiTab] = useState<'playground' | 'docs'>('playground');
  const [confirmKeyOpen, setConfirmKeyOpen] = useState(false);

  const userEmail = user?.email || "";
  const userAvatar = user?.user_metadata?.avatar_url;

  const handleTestAPI = async () => {
    if (!dbUser?.apiKey) {
      alert("Buat API Key terlebih dahulu di atas.");
      return;
    }
    setLoadingPlayground(true);
    setApiResponse(null);
    
    try {
      const res = await fetch(import.meta.env.DEV ? "http://localhost:10000/api/v1/audit/full-process" : "https://ozikgrid.web.id/api/v1/audit/full-process", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${dbUser.apiKey}`,
        },
        body: (() => {
          const fd = new FormData();
          fd.append('projectName', projectName);
          const blob = new Blob([pddText], { type: 'text/plain' });
          fd.append('document', blob, 'sample.txt');
          return fd;
        })()
      });
      const data = await res.json();
      setApiResponse({ status: res.status, data });
    } catch (err: any) {
      setApiResponse({ error: err.message });
    } finally {
      setLoadingPlayground(false);
      refreshUser(); // refresh credits
    }
  };

  const curlCode = `curl -X POST https://ozikgrid.web.id/api/v1/audit/full-process \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "projectName=My Carbon Project" \\
  -F "document=@/path/to/pdd.pdf"`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-white border-4 border-emerald-950 h-auto sm:h-16 p-1 rounded-none shadow-[6px_6px_0_rgba(2,44,34,1)] mb-8 flex flex-col sm:flex-row w-full gap-1 sm:gap-0">
          {["account", "notifications", "api"].map((val, idx) => (
            <TabsTrigger 
              key={val} 
              value={val}
              className="w-full sm:flex-1 rounded-none data-[state=active]:bg-emerald-950 data-[state=active]:text-white font-black uppercase tracking-widest text-xs h-12 sm:h-full"
            >
              {idx === 0 ? "Akun Google" : idx === 1 ? "Notifikasi" : "Kunci API"}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="account" className="border-4 border-emerald-950 bg-white p-6 sm:p-8 shadow-[8px_8px_0_rgba(2,44,34,1)]">
          <h3 className="text-xl font-black uppercase text-emerald-950 mb-6">Akun Google Terhubung</h3>
          <div className="border-4 border-emerald-950 bg-emerald-50 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="grid h-16 w-16 place-items-center bg-white border-4 border-emerald-950 shrink-0">
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.58v2.98h3.86c2.26-2.09 3.58-5.17 3.58-8.8z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.86-2.98c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 000 12c0 1.94.47 3.77 1.29 5.38l3.98-3.09z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
              </svg>
            </div>
            <div className="flex-1 w-full truncate">
              <div className="font-black text-emerald-950 text-sm uppercase truncate">{userEmail}</div>
              <div className="text-xs font-bold text-emerald-950/60 mt-1 whitespace-normal">Autentikasi via Google OAuth 2.0 — Tidak ada kata sandi yang disimpan.</div>
            </div>
            <Badge className="sm:ml-auto mt-2 sm:mt-0 bg-emerald-950 text-white font-black uppercase text-[10px] rounded-none px-3 py-1 shrink-0">Terhubung</Badge>
          </div>
          <p className="mt-6 text-xs font-bold text-emerald-950/50">
            Untuk mengubah email atau menghapus akun, silakan kelola melalui pengaturan akun Google Anda.
          </p>
        </TabsContent>

        <TabsContent value="notifications" className="border-4 border-emerald-950 bg-white p-8 shadow-[8px_8px_0_rgba(2,44,34,1)]">
          <h3 className="text-xl font-black uppercase text-emerald-950 mb-6">Preferensi Notifikasi</h3>
          <div className="space-y-6">
            <label className="flex items-start gap-4 cursor-pointer group">
              <Checkbox className="mt-1 border-4 border-emerald-950 rounded-none h-6 w-6 data-[state=checked]:bg-emerald-950 data-[state=checked]:text-white" defaultChecked />
              <div>
                <div className="font-black text-emerald-950 uppercase text-sm">Email Laporan Selesai</div>
                <div className="text-xs font-bold text-emerald-950/60 mt-1">Kirim email setiap kali dual-track audit PDD selesai.</div>
              </div>
            </label>
            <label className="flex items-start gap-4 cursor-pointer group">
              <Checkbox className="mt-1 border-4 border-emerald-950 rounded-none h-6 w-6 data-[state=checked]:bg-emerald-950 data-[state=checked]:text-white" defaultChecked />
              <div>
                <div className="font-black text-emerald-950 uppercase text-sm">Peringatan Regulasi ESDM</div>
                <div className="text-xs font-bold text-emerald-950/60 mt-1">Kirim pemberitahuan jika ada perubahan aturan di Pasal.id.</div>
              </div>
            </label>
            <Button className="h-12 bg-emerald-950 text-white rounded-none border-2 border-emerald-950 font-black uppercase mt-4">Simpan Preferensi</Button>
          </div>
        </TabsContent>

        <TabsContent value="api" className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
          <h3 className="text-xl font-bold text-emerald-950 mb-6">Manajemen Kunci API</h3>
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-6 mb-8 relative">
            <Label className="text-sm font-semibold text-emerald-900 mb-3 block">Live API Key</Label>
            <div className="flex gap-3">
              <Input readOnly value={dbUser?.apiKey || "Belum ada kunci API. Silakan buat (Regenerate)."} className="h-12 border-emerald-200 rounded-lg font-medium bg-white text-emerald-950 font-mono focus-visible:ring-emerald-500" />
              <Button size="icon" variant="outline" onClick={() => {
                if (dbUser?.apiKey) {
                  navigator.clipboard.writeText(dbUser.apiKey);
                  alert("API Key disalin ke clipboard!");
                }
              }} className="h-12 w-12 shrink-0 border-emerald-200 rounded-lg hover:bg-emerald-100 hover:text-emerald-900">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-5 flex gap-4">
              <Button size="sm" disabled={loadingKey} onClick={() => setConfirmKeyOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold h-10 px-4 shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all border-2 border-emerald-950">
                {loadingKey ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />} 
                {loadingKey ? "Memproses..." : "Generate Key Baru"}
              </Button>
            </div>
          </div>

          <Dialog open={confirmKeyOpen} onOpenChange={setConfirmKeyOpen}>
            <DialogContent className="border-4 border-emerald-950 rounded-none shadow-[12px_12px_0_rgba(2,44,34,1)] p-0 gap-0 sm:max-w-md bg-white">
              <div className="p-8">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black uppercase tracking-wide text-emerald-950 flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    Konfirmasi Regenerate API
                  </DialogTitle>
                  <DialogDescription className="text-emerald-950/70 font-bold mt-2 text-sm leading-relaxed">
                    Apakah Anda yakin ingin mengganti kunci API lama? 
                    <span className="block mt-2 font-black text-emerald-950">Kunci yang lama akan langsung hangus dan tidak dapat digunakan lagi.</span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-8 gap-3 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmKeyOpen(false)}
                    className="rounded-none border-4 border-emerald-950 font-black uppercase tracking-widest text-emerald-950 hover:bg-emerald-50 h-12"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={async () => {
                      setLoadingKey(true);
                      setConfirmKeyOpen(false);
                      try {
                        await api.regenerateApiKey();
                        refreshUser();
                        alert("Kunci API baru berhasil dibuat!");
                      } catch(e) {
                        alert("Gagal membuat kunci API");
                      }
                      setLoadingKey(false);
                    }}
                    className="rounded-none border-4 border-emerald-950 bg-emerald-950 hover:bg-emerald-900 text-white font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(16,185,129,0.3)] h-12"
                  >
                    Ya, Ganti Key
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-3 mb-10">
            <div className="flex justify-between items-center text-xs font-black uppercase text-emerald-950">
              <span>Penggunaan API Bulan Ini</span>
              <span>450 / 1,000 Calls</span>
            </div>
            <div className="h-4 w-full bg-emerald-100 border-2 border-emerald-950 overflow-hidden">
              <div className="h-full bg-emerald-950" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div className="border-t-4 border-emerald-950 pt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-emerald-950">
                  <Terminal className="h-6 w-6 text-emerald-600" /> Developer API
                </h3>
                <p className="text-emerald-950/70 font-bold text-xs uppercase tracking-wider mt-1">Integrasi Audit Kepatuhan & AI Spasial ke Sistem Anda</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setApiTab('playground')} variant={apiTab === 'playground' ? 'default' : 'outline'} className={cn("rounded-none font-black text-xs uppercase border-2", apiTab === 'playground' ? 'bg-emerald-950 text-white border-emerald-950' : 'border-emerald-950 text-emerald-950 hover:bg-emerald-50')}>
                  <Code2 className="h-4 w-4 mr-2" /> Playground
                </Button>
                <Button onClick={() => setApiTab('docs')} variant={apiTab === 'docs' ? 'default' : 'outline'} className={cn("rounded-none font-black text-xs uppercase border-2", apiTab === 'docs' ? 'bg-emerald-950 text-white border-emerald-950' : 'border-emerald-950 text-emerald-950 hover:bg-emerald-50')}>
                  <BookOpen className="h-4 w-4 mr-2" /> Dokumen
                </Button>
              </div>
            </div>

            {apiTab === 'playground' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Request Panel */}
                <div className="bg-white border-4 border-emerald-950 shadow-[6px_6px_0_rgba(2,44,34,1)] p-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-emerald-950 border-b-4 border-emerald-950 pb-2 mb-6 flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-emerald-600" /> Request Configuration
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-xs font-black uppercase text-emerald-950 mb-2 block">1. Project Name</Label>
                      <Input 
                        value={projectName} 
                        onChange={e => setProjectName(e.target.value)}
                        className="border-4 border-emerald-950 rounded-none h-12 font-bold focus-visible:ring-0"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-black uppercase text-emerald-950 mb-2 block">2. PDD Document Text (Simulasi)</Label>
                      <Textarea 
                        value={pddText}
                        onChange={e => setPddText(e.target.value)}
                        className="border-4 border-emerald-950 rounded-none min-h-[150px] font-mono text-sm focus-visible:ring-0"
                      />
                    </div>

                    <Button 
                      onClick={handleTestAPI}
                      disabled={loadingPlayground}
                      className="w-full rounded-none bg-yellow-400 hover:bg-yellow-500 text-emerald-950 border-4 border-emerald-950 font-black uppercase tracking-widest h-14 shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                    >
                      {loadingPlayground ? 'Memproses Audit...' : <><Play className="h-5 w-5 mr-2 fill-emerald-950" /> Jalankan Audit (POST /full-process)</>}
                    </Button>

                    <div className="bg-yellow-50 border-4 border-yellow-400 p-4 flex gap-3 items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
                      <p className="text-[10px] font-bold text-yellow-800 leading-relaxed uppercase">Setiap hit ke endpoint ini akan memotong 1 kredit dari akun Anda. Pastikan API key Anda dijaga kerahasiaannya.</p>
                    </div>
                  </div>
                </div>

                {/* Response Panel */}
                <div className="bg-emerald-950 border-4 border-emerald-950 shadow-[6px_6px_0_rgba(2,44,34,1)] p-6 text-white flex flex-col">
                  <div className="flex items-center justify-between border-b-4 border-white/20 pb-2 mb-6">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-yellow-400" /> API Response
                    </h2>
                    {apiResponse && (
                      <div className={cn("px-3 py-1 font-black text-xs rounded-none border-2", apiResponse.status === 200 ? 'bg-emerald-500 border-emerald-300' : 'bg-red-500 border-red-300')}>
                        HTTP {apiResponse.status || 'ERROR'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 bg-black/50 border-2 border-white/10 p-4 overflow-auto font-mono text-[11px] leading-relaxed relative min-h-[300px]">
                    {apiResponse ? (
                      <pre className="whitespace-pre-wrap text-emerald-400">{JSON.stringify(apiResponse.data || apiResponse.error, null, 2)}</pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-white/30 italic">
                        Tunggu respons API... Tekan Jalankan Audit.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border-4 border-emerald-950 shadow-[6px_6px_0_rgba(2,44,34,1)] p-8">
                <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-950 mb-8">Dokumentasi API</h2>
                
                <div className="prose max-w-none prose-emerald">
                  <h3 className="font-black text-lg uppercase text-emerald-950 border-b-4 border-emerald-950 pb-2 inline-block">Authentication</h3>
                  <p className="font-bold text-emerald-950/80 mt-4 mb-4 text-sm">Semua permintaan ke API OzikSustain memerlukan header <code>Authorization: Bearer &lt;API_KEY&gt;</code>.</p>
                  
                  <h3 className="font-black text-lg uppercase text-emerald-950 border-b-4 border-emerald-950 pb-2 inline-block mt-8">Endpoint Utama</h3>
                  
                  <div className="bg-white border-4 border-emerald-950 p-6 mt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-yellow-400 border-2 border-emerald-950 text-emerald-950 font-black px-3 py-1 text-sm uppercase">POST</span>
                      <span className="font-mono font-bold text-emerald-950 text-sm sm:text-base">/api/v1/audit/full-process</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-950/70 mb-4">Mengeksekusi audit legalitas dan kelayakan secara menyeluruh terhadap dokumen PDD.</p>
                    
                    <h4 className="font-black uppercase text-xs mb-2 text-emerald-950">Request Format (multipart/form-data)</h4>
                    <ul className="list-disc pl-5 text-sm font-bold text-emerald-950/80 space-y-1 mb-6">
                      <li><code>projectName</code> (string, optional) - Nama proyek karbon.</li>
                      <li><code>document</code> (file, required) - File PDF / DOCX / TXT maksimal 10MB.</li>
                    </ul>

                    <h4 className="font-black uppercase text-xs mb-2 text-emerald-950">Contoh cURL</h4>
                    <div className="relative">
                      <pre className="bg-emerald-950 text-emerald-400 p-4 font-mono text-[11px] overflow-x-auto border-4 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)]">
                        {curlCode}
                      </pre>
                      <Button 
                        onClick={() => handleCopy(curlCode)} 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-none border border-white/30"
                      >
                        {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="font-black text-lg uppercase text-emerald-950 border-b-4 border-emerald-950 pb-2 inline-block mt-10">Rate Limit & Credit</h3>
                  <p className="font-bold text-emerald-950/80 mt-4 text-sm">Setiap kali Anda menembak endpoint <code>/full-process</code>, sistem akan memotong 1 kredit dari akun Anda. Batasan (Rate Limit) standar adalah 60 request per menit per IP address.</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. PAKET & PRICING
// ----------------------------------------------------------------------
function PaketPricing() {
  const plans = [
    {
      name: "Free (Starter)",
      price: "Gratis",
      period: "",
      desc: "Evaluasi personal, 3 kredit gratis untuk UI & API OzikSustain.",
      button: "Saat Ini Aktif",
      active: true,
      highlight: false
    },
    {
      name: "Developer (Pro)",
      price: "Rp 499rb",
      period: "/ bulan",
      desc: "100 Kredit Audit/API per bulan, Lencana QR Publik, Support Email.",
      button: "Langganan Sekarang",
      active: false,
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Rp 2.499rb",
      period: "/ bulan",
      desc: "Unlimited Audit, Private VPC, SSO, 24/7 Dedicated Support.",
      button: "Hubungi Sales",
      active: false,
      highlight: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-emerald-950 text-white border-4 border-emerald-950 p-6 mb-12 flex items-center justify-between shadow-[8px_8px_0_rgba(2,44,34,1)]">
        <div>
          <h3 className="font-black text-lg uppercase tracking-wide">Status Langganan Anda</h3>
          <p className="font-bold opacity-80 mt-1">Anda saat ini berada di Paket Free (3 Kredit Audit Gratis).</p>
        </div>
        <CreditCard className="h-10 w-10 opacity-50 hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, i) => (
          <div key={i} className={cn(
            "flex flex-col p-8 border-4 border-emerald-950 relative",
            p.active ? "bg-emerald-50 shadow-[6px_6px_0_rgba(2,44,34,1)]" : "bg-white shadow-[6px_6px_0_rgba(2,44,34,1)]"
          )}>
            {p.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-emerald-950 text-[10px] font-black px-4 py-1 border-4 border-emerald-950 uppercase tracking-widest shadow-[2px_2px_0_rgba(2,44,34,1)]">Rekomendasi</div>}
            <h3 className="text-xl font-black uppercase text-emerald-950">{p.name}</h3>
            <div className="mt-6 mb-2 flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight text-emerald-950">{p.price}</span>
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-emerald-950/60 mb-8">{p.period}</div>
            <p className="text-sm mb-10 flex-1 font-bold text-emerald-950/80 leading-relaxed">{p.desc}</p>
            <Button 
              className={cn(
                "w-full h-14 font-black border-4 uppercase tracking-widest rounded-none transition-all",
                p.active 
                  ? "bg-transparent text-emerald-950 border-emerald-950 opacity-50 cursor-default hover:bg-transparent" 
                  : p.highlight 
                    ? "bg-yellow-400 text-emerald-950 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none hover:bg-yellow-500" 
                    : "bg-emerald-950 text-white border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none hover:bg-emerald-900"
              )}
            >
              {p.button}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. PROFIL PENGGUNA
// ----------------------------------------------------------------------
function ProfilPengguna({ dbUser, onProfileUpdate }: { dbUser: any, onProfileUpdate: () => void }) {
  const [name, setName] = useState(dbUser?.name || "");
  const [company, setCompany] = useState(dbUser?.company || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name || "");
      setCompany(dbUser.company || "");
    }
  }, [dbUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateMe({ name, company });
      alert("Profil berhasil diperbarui!");
      onProfileUpdate();
    } catch (err) {
      alert("Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-4 border-emerald-950 bg-white p-8 shadow-[8px_8px_0_rgba(2,44,34,1)]">
        <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-950 mb-6">Profil Pengguna</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label className="font-bold text-emerald-950 uppercase text-xs">Email Pengguna</Label>
            <Input disabled value={dbUser?.email || ""} className="mt-1 border-4 border-emerald-950/20 bg-gray-50 rounded-none font-bold" />
          </div>
          <div>
            <Label className="font-bold text-emerald-950 uppercase text-xs">Nama Lengkap</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0" />
          </div>
          <div>
            <Label className="font-bold text-emerald-950 uppercase text-xs">Perusahaan / Instansi</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0" />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full h-12 mt-4 rounded-none bg-emerald-950 hover:bg-emerald-900 text-white font-black uppercase tracking-widest text-xs border-2 border-emerald-950">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Simpan Perubahan"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. ADMIN PANEL
// ----------------------------------------------------------------------
function AdminPanel() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="border-4 border-emerald-950 bg-emerald-950 p-8 shadow-[8px_8px_0_rgba(2,44,34,0.3)] text-white">
        <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
          <ShieldCheck className="h-8 w-8" />
          Admin Control Center
        </h2>
        <p className="mt-2 text-white/70 font-bold text-sm">Akses sistem administratif untuk kelola konfigurasi aplikasi.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-4 border-emerald-950 bg-white p-6 shadow-[6px_6px_0_rgba(2,44,34,1)]">
           <h3 className="font-black uppercase text-emerald-950 tracking-widest mb-4 border-b-4 border-emerald-950 pb-2">Manajemen User</h3>
           <p className="text-sm font-bold text-emerald-950/70 mb-4">Fitur ini memungkinkan admin untuk mengelola sisa kredit pengguna dan akun-akun institusi.</p>
           <Button variant="outline" className="rounded-none border-4 border-emerald-950 text-xs font-black uppercase">Segera Hadir</Button>
        </div>
        <div className="border-4 border-emerald-950 bg-white p-6 shadow-[6px_6px_0_rgba(2,44,34,1)]">
           <h3 className="font-black uppercase text-emerald-950 tracking-widest mb-4 border-b-4 border-emerald-950 pb-2">Konfigurasi Model</h3>
           <p className="text-sm font-bold text-emerald-950/70 mb-4">Pengaturan parameter LLM, instruksi sistem, dan threshold risiko compliance.</p>
           <Button variant="outline" className="rounded-none border-4 border-emerald-950 text-xs font-black uppercase">Segera Hadir</Button>
        </div>
      </div>
    </div>
  );
}
