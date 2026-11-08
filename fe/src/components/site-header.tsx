import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ArrowUpRight, ShieldCheck, FileSearch, Scale, Terminal, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: "/audit", label: "Uji Coba PDD", code: "01", icon: FileSearch },
  { to: "/regulasi", label: "Direktori Hukum", code: "02", icon: Scale },
  { to: "/pricing", label: "Skema Biaya", code: "03", icon: Layers },
  { to: "/playground", label: "Spesifikasi API", code: "04", icon: Terminal },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b-[1.5px] border-[#091E17] bg-[#F6F4EE]/95 backdrop-blur-md">
      {/* Top Telemetry Strip */}
      <div className="hidden lg:block border-b border-[#091E17]/15 bg-[#071913] text-[#F6F4EE] px-6 py-1.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between font-mono text-[11px] tracking-wider">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#34D399]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
              MESIN INDOBERT RAG AKTIF
            </span>
            <span className="text-[#F6F4EE]/30">|</span>
            <span className="text-[#F6F4EE]/75">BASIS REGULASI: UU 32/2009 • PERPRES 98/2021 • PERMEN ESDM 2/2024 • UU PDP 27/2022</span>
          </div>
          <div className="flex items-center gap-4 text-[#F6F4EE]/75">
            <span>ZERO DATA RETENTION (IN-MEMORY)</span>
            <span className="text-[#F6F4EE]/30">|</span>
            <a
              href="https://github.com/otaruram/ozik-guard-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#F6F4EE] hover:text-[#34D399] transition-colors"
            >
              <GithubIcon className="h-3 w-3" />
              <span>GITHUB</span>
            </a>
            <span className="text-[#F6F4EE]/30">|</span>
            <Link to="/page/$id" params={{ id: "pln-sustainaction" }} className="text-[#FBBF24] hover:underline">
              PLN SUSTAINACTION 2026
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0" onClick={() => setOpen(false)}>
          <div className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center border-[1.5px] border-[#091E17] bg-white p-1.5 shadow-[2px_2px_0_#091E17] transition-transform group-hover:-translate-y-0.5 shrink-0">
            <img src="/logo.png" alt="Logo OzikSustain" className="h-full w-full object-contain mix-blend-multiply" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#091E17]">
                OzikSustain
              </span>
              <span className="border border-[#091E17] bg-[#E6F4EE] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#0D6E49]">
                v2.4
              </span>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-[#4A5D54] truncate max-w-[150px] xs:max-w-none">
              Adjudikasi ESG &amp; Kepatuhan Hukum
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center border-[1.5px] border-[#091E17] bg-white">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors",
                  idx !== 0 && "border-l border-[#091E17]/20",
                  isActive
                    ? "bg-[#091E17] text-[#F6F4EE]"
                    : "text-[#091E17] hover:bg-[#ECE9DF]"
                )}
              >
                <span className={cn("font-mono text-[10px]", isActive ? "text-[#FBBF24]" : "text-[#4A5D54]")}>
                  {item.code}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/otaruram/ozik-guard-ai"
            target="_blank"
            rel="noopener noreferrer"
            title="Repository GitHub OzikSustain"
            className="grid h-10 w-10 place-items-center border-[1.5px] border-[#091E17] bg-white text-[#091E17] shadow-[2px_2px_0_#091E17] transition-all hover:-translate-y-0.5 hover:bg-[#ECE9DF]"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-[#0D6E49] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[3px_3px_0_#091E17] transition-all hover:-translate-y-0.5 hover:bg-[#09583A]"
            >
              <ShieldCheck className="h-4 w-4" />
              Workspace Audit
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="inline-flex items-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#091E17] border-[1.5px] border-transparent hover:border-[#091E17] hover:bg-white transition-all"
              >
                Masuk Akun
              </Link>
              <Link
                to="/audit"
                className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-[#091E17] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F6F4EE] shadow-[3px_3px_0_#D97706] transition-all hover:-translate-y-0.5 hover:bg-[#0D6E49]"
              >
                Simulasi Audit PDD
                <ArrowUpRight className="h-3.5 w-3.5 text-[#FBBF24]" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center border-[1.5px] border-[#091E17] bg-white text-[#091E17]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t-[1.5px] border-[#091E17] bg-[#F6F4EE] px-4 py-5 space-y-4">
          <div className="grid gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between border-[1.5px] border-[#091E17] px-4 py-3 text-sm font-bold",
                    isActive ? "bg-[#091E17] text-[#F6F4EE]" : "bg-white text-[#091E17]"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[#0D6E49]" />
                    {item.label}
                  </span>
                  <span className="font-mono text-xs opacity-60">[{item.code}]</span>
                </Link>
              );
            })}
          </div>
          <div className="pt-2 border-t border-[#091E17]/15 space-y-2">
            <a
              href="https://github.com/otaruram/ozik-guard-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-[1.5px] border-[#091E17] bg-white py-2.5 text-xs font-bold uppercase tracking-widest text-[#091E17]"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Lihat di GitHub</span>
            </a>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {user ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="col-span-2 flex items-center justify-center gap-2 border-[1.5px] border-[#091E17] bg-[#0D6E49] py-3 text-xs font-bold uppercase tracking-widest text-white"
              >
                Buka Workspace Audit
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center border-[1.5px] border-[#091E17] bg-white py-3 px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#091E17] text-center"
                >
                  Masuk Akun
                </Link>
                <Link
                  to="/audit"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center border-[1.5px] border-[#091E17] bg-[#091E17] py-3 px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F6F4EE] text-center"
                >
                  Uji Coba Gratis
                </Link>
              </>
            )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
