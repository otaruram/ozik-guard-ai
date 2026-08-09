import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — OzikGuard" },
      { name: "description", content: "Simple, transparent pricing for teams auditing legal documents against Indonesian regulations." },
      { property: "og:title", content: "Pricing — OzikGuard" },
      { property: "og:description", content: "Plans for startups, growing teams, and enterprises." },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Free (Starter)",
    price: "Gratis",
    period: "",
    tagline: "Untuk evaluasi personal & uji coba API.",
    features: [
      "Dapat 3 Kredit (Bisa UI & API)",
      "Akses API OzikSustain",
      "Unduh Laporan PDF",
      "Kutipan Regulasi (Pasal.id)",
    ],
    cta: "Mulai Gratis",
    highlighted: false,
  },
  {
    name: "Developer (Pro)",
    price: "Rp 499.000",
    period: "/bln",
    tagline: "Untuk startup & tim kecil.",
    features: [
      "100 Kredit Audit/API per bulan",
      "Lencana Verifikasi QR Publik",
      "Workspace Tim (Hingga 5 User)",
      "Support Email & Dokumentasi API",
    ],
    cta: "Langganan Sekarang",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Rp 2.499.000",
    period: "/bln",
    tagline: "Untuk korporat (PLN, Adaro, dll).",
    features: [
      "Unlimited Audit & API Access",
      "Private VPC & Custom Model",
      "SSO & On-Premise Integration",
      "Dedicated SLA & 24/7 Support",
    ],
    cta: "Hubungi Tim Sales",
    highlighted: false,
  },
];

function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="outline" className="mb-4 gap-1.5 border-primary/20 bg-primary/5 text-primary">
          <Zap className="h-3 w-3" /> Simple pricing
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Compliance that scales with you.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Start free. Upgrade when you need public verification, team seats, or private deployment.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "p-6 md:p-8 relative flex flex-col",
              p.highlighted && "border-primary shadow-lg ring-1 ring-primary/10",
            )}
          >
            {p.highlighted && (
              <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground font-semibold">
                Most popular
              </Badge>
            )}
            <div className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {p.name}
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <div className="text-4xl font-bold text-foreground tracking-tight">{p.price}</div>
              {p.period && <div className="text-sm text-muted-foreground">{p.period}</div>}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>

            <ul className="mt-6 space-y-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className={cn(
                    "grid h-4 w-4 place-items-center rounded-full shrink-0 mt-0.5",
                    p.highlighted ? "bg-primary text-primary-foreground" : "bg-success/10 text-success",
                  )}>
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              variant={p.highlighted ? "default" : "outline"}
              className="mt-8 w-full"
            >
              <Link to="/audit">{p.cta}</Link>
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        All plans include zero data retention and citation-anchored audit reports.
      </div>
    </div>
  );
}