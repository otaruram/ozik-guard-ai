import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Upload,
  ShieldCheck,
  Lock,
  ArrowRight,
  Play,
  FileText,
  Cpu,
  Check,
  ChevronDown,
  Leaf,
  Scale,
  Sun,
  Globe,
  Award,
  CloudUpload,
  Loader2,
  EyeOff,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="bg-white font-sans text-emerald-950 selection:bg-emerald-950 selection:text-white">
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-emerald-950 bg-white pt-16 pb-24">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,78,59,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,78,59,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 text-center">
        <Badge variant="outline" className="mb-6 border-2 border-emerald-950 bg-white text-emerald-950 px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-none shadow-[2px_2px_0_rgba(6,78,59,1)]">
          <Leaf className="h-3 w-3 inline-block mr-1" /> INOVASI GREENTECH & LEGALTECH
        </Badge>
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-emerald-950 leading-[1.1] uppercase">
          Validasi Kelayakan Proyek Energi &amp; Hukum dalam{" "}
          <span className="text-white bg-emerald-950 px-2 py-1 inline-block mt-2 transform -rotate-1 shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
            &lt;30 Detik
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-3xl text-base md:text-lg text-emerald-950/80 leading-relaxed font-bold">
          Platform agregator pintar untuk UMKM. Unggah Project Design Document (PDD) Anda, dan biarkan AI kami memverifikasi data lingkungan & audit kepatuhan hukum secara otomatis.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/audit">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-emerald-950 text-white hover:bg-emerald-800 font-bold shadow-[4px_4px_0_rgba(6,78,59,0.2)] h-14 px-8 text-base border-2 border-transparent transition-all rounded-none hover:translate-y-0.5 hover:shadow-[2px_2px_0_rgba(6,78,59,0.2)]">
              <ArrowRight className="h-5 w-5" /> Mulai Audit Gratis
            </Button>
          </Link>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-emerald-950/60 font-bold uppercase tracking-widest">
          <ShieldCheck className="h-4 w-4" /> Zero Greenwashing Risk
        </p>
      </div>
    </section>
  );
}


function Features() {
  const features = [
    {
      icon: Globe,
      title: "Verifikasi Data Lingkungan",
      desc: "Integrasi API spasial memvalidasi lokasi proyek dari risiko lingkungan.",
    },
    {
      icon: Scale,
      title: "Kepatuhan Regulasi Otomatis",
      desc: "Pencocokan dokumen dengan database Pasal.id secara presisi.",
    },
    {
      icon: Cpu,
      title: "Scoring Engine Terpadu",
      desc: "Kalkulasi transparan gabungan metrik lingkungan dan kepatuhan hukum.",
    },
    {
      icon: Award,
      title: "Verified Green Badge",
      desc: "Lencana sertifikasi digital sebagai bukti proyek bebas greenwashing.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white border-b-2 border-emerald-950">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-emerald-950 tracking-tight uppercase">
            Pilar Utama
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="p-8 border-4 border-emerald-950 bg-white hover:bg-emerald-950 hover:text-white transition-colors duration-300 group shadow-[8px_8px_0_rgba(6,78,59,1)]">
              <div className="h-14 w-14 border-4 border-emerald-950 bg-white flex items-center justify-center mb-8 transition-all duration-300 shadow-[4px_4px_0_rgba(6,78,59,1)] group-hover:shadow-none">
                <f.icon className="h-6 w-6 text-emerald-950" />
              </div>
              <h3 className="text-xl font-black mb-4 leading-snug group-hover:text-white text-emerald-950 uppercase tracking-wide">{f.title}</h3>
              <p className="text-sm leading-relaxed font-bold text-emerald-950/70 group-hover:text-white/80">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Unggah PDD",
      desc: "Masukkan proposal proyek hijau ke platform kami.",
    },
    {
      num: "02",
      title: "Analisis Dual-Track AI",
      desc: "Verifikasi lingkungan & audit hukum berjalan paralel.",
    },
    {
      num: "03",
      title: "Klaim Lencana",
      desc: "Unduh laporan kelayakan dan pasang lencana terverifikasi.",
    },
  ];
  return (
    <section id="how" className="py-20 md:py-28 bg-emerald-50/50 border-b-2 border-emerald-950">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-emerald-950 tracking-tight uppercase">
            3 Langkah Mudah
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0 border-t-4 border-dashed border-emerald-950/30" />
          {steps.map((s, i) => (
            <div key={i} className="relative bg-white border-4 border-emerald-950 p-8 text-center z-10 shadow-[8px_8px_0_rgba(6,78,59,1)]">
              <div className="mx-auto h-20 w-20 border-4 border-emerald-950 bg-emerald-950 text-white font-black text-3xl flex items-center justify-center mb-8 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                {s.num}
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-4 uppercase tracking-widest">{s.title}</h3>
              <p className="text-sm text-emerald-950/70 font-bold leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Single Audit",
      target: "Eceran",
      price: "Rp 99rb",
      period: "/ 1x Audit",
      desc: "Untuk UMKM insidental yang baru memulai inisiatif hijau.",
      button: "Beli Audit Tunggal",
      highlight: false,
    },
    {
      name: "B2B Eco-Basic",
      target: "UMKM Pilihan",
      price: "Rp 499rb",
      period: "/ bulan",
      desc: "10 Audit/bulan + Verified Green Badge Premium.",
      button: "Mulai Trial 7 Hari",
      highlight: true,
    },
    {
      name: "Enterprise",
      target: "Korporat & Bank",
      price: "Kustom",
      period: "/ Akses API",
      desc: "Skema API terintegrasi untuk platform ESG perbankan.",
      button: "Hubungi Kami",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-emerald-950 tracking-tight uppercase">
            Investasi Terjangkau
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className={cn("flex flex-col p-8 bg-white border-4 border-emerald-950 relative", p.highlight ? "shadow-[12px_12px_0_rgba(6,78,59,1)] md:-translate-y-4 z-10 bg-emerald-950 text-white" : "shadow-[6px_6px_0_rgba(6,78,59,1)]")}>
              {p.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-emerald-950 text-[10px] font-black px-4 py-1.5 border-4 border-emerald-950 uppercase tracking-widest">Disarankan</div>}
              <div className={cn("mb-3 text-xs font-black uppercase tracking-widest", p.highlight ? "text-white/60" : "text-emerald-950/60")}>{p.target}</div>
              <h3 className={cn("text-2xl font-black uppercase tracking-wide", p.highlight ? "text-white" : "text-emerald-950")}>{p.name}</h3>
              <div className="mt-6 mb-2 flex items-baseline">
                <span className={cn("text-4xl font-black tracking-tight", p.highlight ? "text-white" : "text-emerald-950")}>{p.price}</span>
              </div>
              <div className={cn("text-sm font-black uppercase tracking-widest mb-8", p.highlight ? "text-white/60" : "text-emerald-950/60")}>{p.period}</div>
              <p className={cn("text-sm mb-10 flex-1 leading-relaxed font-bold", p.highlight ? "text-white/80" : "text-emerald-950/80")}>{p.desc}</p>
              <Button className={cn("w-full h-14 text-sm font-black border-4 transition-all uppercase tracking-widest rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,0.3)]", p.highlight ? "bg-white text-emerald-950 border-white hover:bg-emerald-50" : "bg-emerald-950 text-white border-emerald-950 hover:bg-emerald-800")}>
                {p.button}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 bg-emerald-950 text-center border-t-4 border-emerald-950">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Siap Memvalidasi Proyek?</h2>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-bold leading-relaxed">
          OzikCarbon telah digunakan oleh puluhan UMKM untuk mempercepat audit dan mencegah greenwashing secara otomatis.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/audit">
            <Button size="lg" className="bg-white text-emerald-950 border-4 border-white hover:bg-emerald-50 h-16 px-10 text-lg font-black shadow-[6px_6px_0_rgba(0,0,0,0.4)] hover:translate-y-1 hover:shadow-[3px_3px_0_rgba(0,0,0,0.4)] transition-all uppercase tracking-widest rounded-none">
              Coba Audit Gratis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-emerald-950 text-white border-t-4 border-emerald-950">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white text-emerald-950 p-2 rounded">
                <Leaf className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-widest uppercase">OzikCarbon</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6 font-bold">
              Mendukung Transisi Energi Indonesia melalui verifikasi data instan dan agregasi tepercaya.
            </p>
          </div>
          <div>
            <h4 className="font-black text-white mb-6 tracking-widest uppercase text-xs border-b-2 border-white/20 pb-3">Platform</h4>
            <ul className="space-y-4 text-sm text-white/70 font-bold uppercase tracking-wider">
              <li><a href="#features" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Fitur AI</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Harga B2B</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-6 tracking-widest uppercase text-xs border-b-2 border-white/20 pb-3">Tentang</h4>
            <ul className="space-y-4 text-sm text-white/70 font-bold uppercase tracking-wider">
              <li><Link to="/page/pln-sustainaction" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> PLN SustainAction</Link></li>
              <li><Link to="/page/kontak" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Hubungi Tim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-6 tracking-widest uppercase text-xs border-b-2 border-white/20 pb-3">Legalitas</h4>
            <ul className="space-y-4 text-sm text-white/70 font-bold uppercase tracking-wider">
              <li><Link to="/page/privasi" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Privasi Data</Link></li>
              <li><Link to="/page/disclaimer" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Disclaimer Hak Cipta</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t-2 border-white/10 text-center">
          <div className="text-xs text-white/50 font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} OzikCarbon Inc. Seluruh Hak Cipta Dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
}
