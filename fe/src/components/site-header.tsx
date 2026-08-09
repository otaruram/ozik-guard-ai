import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/#features", label: "Features", hash: true },
  { to: "/#how", label: "How It Works", hash: true },
  { to: "/pricing", label: "Pricing", hash: false },
  { to: "/verify", label: "Verification Badge", hash: false },
  { to: "/playground", label: "API Playground", hash: false },
  { to: "/#faq", label: "FAQ", hash: true },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-sm bg-emerald-950 text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-black tracking-widest text-emerald-950 uppercase">
              OzikCarbon
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-950/70">
              Greentech & Legaltech
            </span>
          </div>
          <Badge
            variant="secondary"
            className="ml-1 hidden lg:inline-flex bg-success/10 text-success border-success/20 text-[10px] font-semibold"
          >
            BETA
          </Badge>
        </Link>

        {isLanding && (
          <nav className="ml-6 hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              n.hash ? (
                <a
                  key={n.to}
                  href={n.to}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
                >
                  {n.label}
                </a>
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
                  activeProps={{ className: "text-foreground bg-muted" }}
                >
                  {n.label}
                </Link>
              )
            ))}
          </nav>
        )}

        {isLanding && (
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
              <Link to="/auth">Masuk</Link>
            </Button>
            <Button size="sm" asChild className="hidden md:inline-flex gap-1.5 bg-emerald-950 text-white hover:bg-emerald-900 rounded-none shadow-[2px_2px_0_rgba(2,44,34,1)] hover:translate-y-0.5 hover:shadow-none transition-all">
              <Link to="/audit">
                <User className="h-3.5 w-3.5" /> Coba Audit Gratis
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>

      {isLanding && (
        <div
          className={cn(
            "md:hidden overflow-hidden border-t border-border/60 transition-all",
            open ? "max-h-96" : "max-h-0",
          )}
        >
          <nav className="flex flex-col p-3 gap-1">
            {NAV.map((n) => (
              n.hash ? (
                <a
                  key={n.to}
                  href={n.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {n.label}
                </a>
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  activeProps={{ className: "text-foreground bg-muted" }}
                >
                  {n.label}
                </Link>
              )
            ))}
            <div className="mt-2 flex gap-2 border-t border-border/60 pt-3">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to="/auth" onClick={() => setOpen(false)}>Masuk</Link>
              </Button>
              <Button size="sm" asChild className="flex-1">
                <Link to="/audit" onClick={() => setOpen(false)}>
                  Coba Audit Gratis
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}