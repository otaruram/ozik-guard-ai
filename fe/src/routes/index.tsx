import { createFileRoute, Link } from "@tanstack/react-router";
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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="bg-[#040D09] min-h-screen text-slate-300 font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Ambient glowing background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-teal-800/20 rounded-full blur-[150px] opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-24 pb-32 md:pt-36 md:pb-40 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-pulse">
          <Sparkles className="h-4 w-4" /> Smart Greentech & Legaltech Aggregator
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
          Validasi Proyek Energi & Hukum <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Dalam Hitungan Detik
          </span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed mb-12">
          OzikSustain mengautomasi audit Project Design Document (PDD) Anda. Deteksi risiko lingkungan, pastikan kepatuhan regulasi secara deterministik, dan dapatkan sertifikasi tanpa *greenwashing*.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/auth">
            <Button size="lg" className="h-14 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-base transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              Mulai Audit Gratis <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/playground">
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base backdrop-blur-md transition-all">
              <Code2 className="mr-2 h-5 w-5" /> Developer API
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
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Keunggulan OzikSustain
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Kami menggabungkan kekuatan AI dan basis data hukum untuk mencegah klaim keliru.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20">
                <f.icon className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
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
    <section id="how" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Cara Kerja Kami</h2>
            <p className="text-slate-400">Proses otomatis tanpa intervensi manusia.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 relative z-10">
            {steps.map((s, i) => (
              <div key={i} className="text-center relative">
                {i !== 2 && <div className="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-gradient-to-r from-emerald-500/50 to-transparent" />}
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-2xl font-black text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  {s.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Skema API Fleksibel</h2>
          <p className="text-slate-400">Pilih paket sesuai dengan jumlah audit dan skala proyek Anda.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col">
            <div className="text-emerald-400 font-semibold mb-2 uppercase tracking-wide text-xs">Eceran</div>
            <h3 className="text-2xl font-bold text-white mb-4">Single Audit</h3>
            <div className="text-4xl font-extrabold text-white mb-1">Rp 99rb</div>
            <div className="text-slate-500 text-sm mb-6">/ 1x Audit Penuh</div>
            <ul className="space-y-4 text-sm text-slate-300 mb-8 flex-1">
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Laporan PDF Komprehensif</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Akses Pasal.id Terbatas</li>
            </ul>
            <Button className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20">Beli Kredit</Button>
          </div>

          {/* Plan 2 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-900/40 to-emerald-950/40 border border-emerald-500/40 backdrop-blur-md flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 font-bold px-4 py-1 rounded-full text-xs shadow-lg">
              PALING POPULER
            </div>
            <div className="text-emerald-400 font-semibold mb-2 uppercase tracking-wide text-xs">UMKM & B2B</div>
            <h3 className="text-2xl font-bold text-white mb-4">B2B Eco-Basic</h3>
            <div className="text-4xl font-extrabold text-white mb-1">Rp 499rb</div>
            <div className="text-emerald-500/70 text-sm mb-6">/ bulan</div>
            <ul className="space-y-4 text-sm text-slate-200 mb-8 flex-1">
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> 10 Kredit Audit per Bulan</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> Verified Green Badge Premium</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> Akses API Terbuka</li>
            </ul>
            <Button className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold">Mulai Percobaan</Button>
          </div>

          {/* Plan 3 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col">
            <div className="text-slate-400 font-semibold mb-2 uppercase tracking-wide text-xs">Korporat</div>
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
            <div className="text-4xl font-extrabold text-white mb-1">Kustom</div>
            <div className="text-slate-500 text-sm mb-6">/ Skema API Tinggi</div>
            <ul className="space-y-4 text-sm text-slate-300 mb-8 flex-1">
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Unlimited API Calls</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> SLA & Dedicated Support</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Whitelabel Report</li>
            </ul>
            <Button className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20">Hubungi Penjualan</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-900/20" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Amankan Reputasi ESG Anda</h2>
        <p className="text-lg text-slate-400 mb-10">
          OzikSustain telah digunakan oleh puluhan UMKM dan korporat untuk mempercepat audit berkelanjutan dan mencegah greenwashing.
        </p>
        <Link to="/auth">
          <Button size="lg" className="h-16 px-10 rounded-full bg-white text-emerald-950 hover:bg-slate-200 font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Mulai Gratis Sekarang
          </Button>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020503] pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-4 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden border border-white/20 group-hover:border-emerald-500/50 transition-colors">
                <img src="/logo.png" alt="OzikSustain" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">OzikSustain</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Mendukung Transisi Energi Indonesia melalui verifikasi data instan dan agregasi tepercaya.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">Fitur AI</a></li>
              <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Harga B2B</a></li>
              <li><Link to="/playground" className="hover:text-emerald-400 transition-colors">Developer API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-6">Tentang</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/page/pln-sustainaction" className="hover:text-emerald-400 transition-colors">PLN SustainAction</Link></li>
              <li><Link to="/page/kontak" className="hover:text-emerald-400 transition-colors">Hubungi Tim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-6">Legalitas</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/page/privasi" className="hover:text-emerald-400 transition-colors">Privasi Data</Link></li>
              <li><Link to="/page/disclaimer" className="hover:text-emerald-400 transition-colors">Disclaimer Hak Cipta</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-600">
          &copy; {new Date().getFullYear()} OzikSustain Inc. Seluruh Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}

