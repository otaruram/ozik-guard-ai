import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  ArrowRight,
  Cpu,
  Globe,
  Award,
  Leaf,
  Scale,
  Sparkles,
  Zap,
  Code2,
  QrCode,
  CheckCircle2,
  Search,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-950" />
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/30 min-h-screen text-emerald-950 font-sans selection:bg-emerald-900 selection:text-white overflow-hidden">
      <div className="relative z-10">
        <Hero />
        <Features />
        <VerificationChecker />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}

function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative pt-24 pb-32 md:pt-36 md:pb-40 px-4 bg-white border-b-4 border-emerald-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,44,34,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,44,34,0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-emerald-950 bg-emerald-100 text-emerald-950 font-black uppercase tracking-widest text-xs mb-8 shadow-[4px_4px_0_rgba(2,44,34,1)]">
          <Sparkles className="h-4 w-4" /> Smart Greentech & Legaltech Aggregator
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tight leading-[1.1] mb-8 uppercase">
          Validasi Proyek Energi <br className="hidden md:block" />
          <span className="text-emerald-600">Dalam Hitungan Detik</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl font-bold text-emerald-950/70 leading-relaxed mb-12">
          OzikSustain mengautomasi audit Project Design Document (PDD) Anda. Deteksi risiko lingkungan, pastikan kepatuhan regulasi secara deterministik, dan dapatkan sertifikasi tanpa *greenwashing*.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button size="lg" className="h-16 px-10 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-base transition-all hover:translate-y-1 hover:translate-x-1 shadow-[6px_6px_0_rgba(2,44,34,1)] border-4 border-emerald-950 hover:shadow-none">
              {user ? "Buka Dashboard" : "Mulai Audit Gratis"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/playground">
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-none border-4 border-emerald-950 bg-white hover:bg-emerald-50 text-emerald-950 font-black uppercase tracking-widest text-base transition-all hover:translate-y-1 hover:translate-x-1 shadow-[6px_6px_0_rgba(2,44,34,1)] hover:shadow-none">
              <Code2 className="mr-2 h-5 w-5" /> Dokumentasi API
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Globe,
      title: "Verifikasi Spasial Lingkungan",
      desc: "Integrasi mendalam untuk memvalidasi koordinat dan area proyek dari risiko deforestasi atau tumpang tindih lahan.",
    },
    {
      icon: Scale,
      title: "Kepatuhan Regulasi Pasal.id",
      desc: "Menyisir dokumen menggunakan AI deterministik untuk memastikan kepatuhan penuh terhadap UU & PP di Indonesia.",
    },
    {
      icon: QrCode,
      title: "Public QR Verification",
      desc: "Hasilkan lencana QR interaktif yang bisa disematkan pada laporan keberlanjutan Anda untuk transparansi publik.",
    },
    {
      icon: Zap,
      title: "Scoring Engine Terpadu",
      desc: "Sistem penilaian gabungan dari aspek kelayakan energi, lingkungan, dan legalitas yang bebas interpretasi bias.",
    },
  ];

  return (
    <section id="features" className="py-24 relative bg-emerald-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-emerald-950 tracking-tight mb-4">
            Keunggulan OzikSustain
          </h2>
          <p className="text-emerald-950/70 font-bold max-w-2xl mx-auto">Kami menggabungkan kekuatan AI dan basis data hukum untuk mencegah klaim keliru.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group p-8 bg-white border-4 border-emerald-950 hover:-translate-y-2 hover:-translate-x-2 transition-transform shadow-[8px_8px_0_rgba(2,44,34,1)] hover:shadow-[12px_12px_0_rgba(2,44,34,1)]">
              <div className="w-14 h-14 bg-emerald-100 flex items-center justify-center mb-6 border-2 border-emerald-950">
                <f.icon className="h-7 w-7 text-emerald-950" />
              </div>
              <h3 className="text-xl font-black uppercase text-emerald-950 mb-3">{f.title}</h3>
              <p className="text-emerald-950/70 font-bold leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VerificationChecker() {
  const [auditId, setAuditId] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditId.trim()) return;
    navigate({ to: "/verify/$id", params: { id: auditId.trim() } });
  };

  return (
    <section id="verify" className="py-24 relative bg-white border-y-4 border-emerald-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0,transparent_100%)]" />
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 border-4 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)] mb-8">
          <ShieldCheck className="w-8 h-8 text-emerald-950" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase text-emerald-950 mb-4">Verifikasi Sertifikat</h2>
        <p className="text-emerald-950/70 font-bold mb-10 text-lg max-w-2xl mx-auto">
          Masukkan ID Audit atau SHA-256 Hash dari dokumen untuk memverifikasi keaslian Green Badge OzikSustain.
        </p>
        
        <form onSubmit={handleVerify} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-950/50" />
            <Input 
              value={auditId}
              onChange={(e) => setAuditId(e.target.value)}
              placeholder="Contoh: 123e4567-e89b-12d3-a456-426614174000" 
              className="pl-12 h-16 border-4 border-emerald-950 rounded-none font-bold text-emerald-950 focus-visible:ring-0 shadow-[6px_6px_0_rgba(2,44,34,1)] bg-white text-lg" 
            />
          </div>
          <Button type="submit" className="h-16 px-10 rounded-none bg-emerald-950 hover:bg-emerald-900 text-white font-black uppercase tracking-widest text-lg border-4 border-emerald-950 shadow-[6px_6px_0_rgba(16,185,129,1)] transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
            Cari Dokumen
          </Button>
        </form>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Unggah PDD", desc: "Berikan file proposal / dokumen desain proyek hijau Anda." },
    { num: "02", title: "AI Menganalisis", desc: "Kami mengekstrak klaim energi, cek regulasi, dan verifikasi lokasi." },
    { num: "03", title: "Terima Sertifikat", desc: "Dapatkan Green Badge, skor kelayakan, dan kode QR unik." },
  ];
  return (
    <section id="how" className="py-24 relative bg-emerald-950 text-white border-y-4 border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Cara Kerja Kami</h2>
          <p className="text-white/70 font-bold">Proses otomatis tanpa intervensi manusia.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 relative z-10">
          {steps.map((s, i) => (
            <div key={i} className="text-center relative">
              {i !== 2 && <div className="hidden md:block absolute top-10 left-[60%] w-full h-[4px] bg-emerald-800" />}
              <div className="w-20 h-20 mx-auto bg-white border-4 border-emerald-950 flex items-center justify-center text-3xl font-black text-emerald-950 mb-6 shadow-[6px_6px_0_rgba(16,185,129,1)]">
                {s.num}
              </div>
              <h3 className="text-xl font-black uppercase mb-3">{s.title}</h3>
              <p className="text-white/70 font-bold text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-emerald-950 mb-4">Skema API Fleksibel</h2>
          <p className="text-emerald-950/70 font-bold">Pilih paket sesuai dengan jumlah audit dan skala proyek Anda.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="p-8 bg-emerald-50 border-4 border-emerald-950 shadow-[8px_8px_0_rgba(2,44,34,1)] flex flex-col">
            <div className="text-emerald-700 font-black mb-2 uppercase tracking-wide text-xs">Eceran</div>
            <h3 className="text-2xl font-black uppercase text-emerald-950 mb-4">Single Audit</h3>
            <div className="text-4xl font-black text-emerald-950 mb-1">Rp 99rb</div>
            <div className="text-emerald-950/60 font-bold text-sm mb-6">/ 1x Audit Penuh</div>
            <ul className="space-y-4 text-sm font-bold text-emerald-950/80 mb-8 flex-1">
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/> Laporan PDF Komprehensif</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/> Akses Pasal.id Terbatas</li>
            </ul>
            <Button className="w-full rounded-none border-2 border-emerald-950 bg-white hover:bg-emerald-100 text-emerald-950 font-black uppercase shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">Beli Kredit</Button>
          </div>

          {/* Plan 2 */}
          <div className="p-8 bg-yellow-400 border-4 border-emerald-950 shadow-[12px_12px_0_rgba(2,44,34,1)] flex flex-col relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-950 text-white font-black uppercase px-4 py-1 text-xs border-2 border-emerald-950">
              PALING POPULER
            </div>
            <div className="text-emerald-950 font-black mb-2 uppercase tracking-wide text-xs">UMKM & B2B</div>
            <h3 className="text-2xl font-black uppercase text-emerald-950 mb-4">B2B Eco-Basic</h3>
            <div className="text-4xl font-black text-emerald-950 mb-1">Rp 499rb</div>
            <div className="text-emerald-950/70 font-bold text-sm mb-6">/ bulan</div>
            <ul className="space-y-4 text-sm font-bold text-emerald-950 mb-8 flex-1">
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-950 shrink-0"/> 10 Kredit Audit per Bulan</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-950 shrink-0"/> Verified Green Badge Premium</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-950 shrink-0"/> Akses API Terbuka</li>
            </ul>
            <Button className="w-full rounded-none bg-emerald-950 hover:bg-emerald-800 text-white font-black uppercase border-2 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">Mulai Percobaan</Button>
          </div>

          {/* Plan 3 */}
          <div className="p-8 bg-emerald-50 border-4 border-emerald-950 shadow-[8px_8px_0_rgba(2,44,34,1)] flex flex-col">
            <div className="text-emerald-700 font-black mb-2 uppercase tracking-wide text-xs">Korporat</div>
            <h3 className="text-2xl font-black uppercase text-emerald-950 mb-4">Enterprise</h3>
            <div className="text-4xl font-black text-emerald-950 mb-1">Kustom</div>
            <div className="text-emerald-950/60 font-bold text-sm mb-6">/ Skema API Tinggi</div>
            <ul className="space-y-4 text-sm font-bold text-emerald-950/80 mb-8 flex-1">
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/> Unlimited API Calls</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/> SLA & Dedicated Support</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0"/> Whitelabel Report</li>
            </ul>
            <Button className="w-full rounded-none border-2 border-emerald-950 bg-white hover:bg-emerald-100 text-emerald-950 font-black uppercase shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">Hubungi Penjualan</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { user } = useAuth();
  return (
    <section className="py-24 relative overflow-hidden bg-emerald-100 border-y-4 border-emerald-950">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black uppercase text-emerald-950 mb-6">Amankan Reputasi ESG Anda</h2>
        <p className="text-lg font-bold text-emerald-950/70 mb-10">
          OzikSustain telah digunakan oleh puluhan UMKM dan korporat untuk mempercepat audit berkelanjutan dan mencegah greenwashing.
        </p>
        <Link to={user ? "/dashboard" : "/auth"}>
          <Button size="lg" className="h-16 px-10 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-lg transition-transform hover:-translate-y-1 hover:-translate-x-1 shadow-[8px_8px_0_rgba(2,44,34,1)] border-4 border-emerald-950">
            {user ? "Buka Dashboard" : "Mulai Gratis Sekarang"}
          </Button>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-4 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center overflow-hidden border-2 border-emerald-950">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-black uppercase tracking-widest text-emerald-950">OzikSustain</span>
            </Link>
            <p className="text-sm font-bold text-emerald-950/70 mb-6">
              Platform agregator kepatuhan hukum dan kelayakan energi hijau terdepan.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase text-emerald-950 mb-4 tracking-widest">Platform</h4>
            <ul className="space-y-3 text-sm font-bold text-emerald-950/70">
              <li><Link to="/auth" className="hover:text-emerald-600">Audit PDD</Link></li>
              <li><Link to="/playground" className="hover:text-emerald-600">API Documentation</Link></li>
              <li><Link to="/" className="hover:text-emerald-600">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase text-emerald-950 mb-4 tracking-widest">Legal</h4>
            <ul className="space-y-3 text-sm font-bold text-emerald-950/70">
              <li><a href="#" className="hover:text-emerald-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-600">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase text-emerald-950 mb-4 tracking-widest">Follow Us</h4>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
                <a key={s} href="#" className="w-10 h-10 rounded-none bg-emerald-50 border-2 border-emerald-950 flex items-center justify-center text-emerald-950 hover:bg-emerald-950 hover:text-white transition-colors">
                  <span className="sr-only">{s}</span>
                  <Globe className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t-4 border-emerald-950 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-emerald-950/60 uppercase">
          <p>© 2026 OzikSustain. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified by Pasal.id Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

