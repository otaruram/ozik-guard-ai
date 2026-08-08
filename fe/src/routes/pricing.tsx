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
    name: "Starter",
    price: "Free",
    period: "",
    tagline: "For solo founders and evaluators.",
    features: [
      "3 document audits / month",
      "UU PDP citations",
      "PDF export",
      "Community support",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Business",
    price: "Rp 1.499K",
    period: "/mo",
    tagline: "For growing legal & privacy teams.",
    features: [
      "Unlimited audits",
      "Public QR verification badge",
      "Priority audit queue",
      "Team workspace (up to 10 seats)",
      "Slack & email alerts",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "For regulated industries at scale.",
    features: [
      "SSO / SAML",
      "Private deployment (VPC)",
      "Custom law library",
      "SLA & dedicated support",
      "Audit logs & SOC 2 report",
    ],
    cta: "Contact sales",
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