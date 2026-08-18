import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaketPricing() {
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
