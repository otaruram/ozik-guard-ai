import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk dengan Google — OzikCarbon" },
      { name: "description", content: "Masuk ke OzikCarbon dengan akun Google Anda untuk evaluasi kelayakan proyek energi & kepatuhan regulasi." },
    ],
  }),
  component: AuthPage,
});

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.58v2.98h3.86c2.26-2.09 3.58-5.17 3.58-8.8z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.86-2.98c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
      <path fill="#FBBC05" d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 000 12c0 1.94.47 3.77 1.29 5.38l3.98-3.09z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50/30">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-950" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-emerald-50/30 selection:bg-emerald-950 selection:text-white">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-emerald-950 text-white p-12 xl:p-16 border-r-4 border-emerald-950">
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <span className="grid h-12 w-12 place-items-center rounded-sm bg-white text-emerald-950 transition-transform group-hover:scale-105">
              <Leaf className="h-7 w-7" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-widest uppercase">OzikCarbon</span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/70">
                Greentech & Legaltech
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-12 mb-auto">
          <div className="inline-flex items-center gap-2 border-4 border-white bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white mb-8 shadow-[4px_4px_0_rgba(255,255,255,1)]">
            <Sparkles className="h-4 w-4" /> B2B SaaS Aggregator
          </div>
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.1] uppercase">
            Validasi Kelayakan Proyek Energi Anda
          </h1>
          <p className="mt-6 text-white/80 font-bold leading-relaxed text-lg">
            Bergabunglah untuk memindai Project Design Document (PDD), mendapatkan rujukan hukum presisi, dan mengklaim Verified Green Badge.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              "Analisis Iradiasi & Potensi Energi",
              "Sitasi regulasi presisi via Pasal.id",
              "Public QR Verification Badge",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-white/90">
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Google Auth panel */}
      <section className="flex items-center justify-center p-6 sm:p-10 relative">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10 flex justify-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-emerald-950 text-white shadow-[4px_4px_0_rgba(2,44,34,1)]">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="text-xl font-black tracking-widest uppercase text-emerald-950">OzikCarbon</span>
            </Link>
          </div>

          <div className="border-4 border-emerald-950 bg-white shadow-[12px_12px_0_rgba(2,44,34,1)] p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center bg-emerald-950 text-white border-4 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,0.3)]">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-black tracking-wide text-emerald-950 uppercase">
                Selamat Datang
              </h2>
              <p className="mt-2 text-sm font-bold text-emerald-950/70">
                Masuk atau daftar dengan akun Google Anda untuk melanjutkan ke workspace B2B.
              </p>
            </div>

            {/* Google Auth Button (Single CTA) */}
            <Button
              size="lg"
              className="w-full h-16 gap-4 bg-white text-emerald-950 border-4 border-emerald-950 hover:bg-emerald-50 rounded-none shadow-[6px_6px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all font-black uppercase tracking-widest text-sm"
              onClick={signInWithGoogle}
            >
              <GoogleIcon className="h-6 w-6" />
              Lanjutkan dengan Google
            </Button>

            <div className="mt-8 space-y-4">
              <div className="bg-emerald-50 border-4 border-emerald-950 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-emerald-950 text-xs uppercase">3 Kredit Audit Gratis</div>
                    <div className="text-xs font-bold text-emerald-950/60 mt-1">Pengguna baru langsung mendapatkan 3 kredit audit penuh tanpa biaya.</div>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 border-4 border-emerald-950 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-emerald-950 text-xs uppercase">Keamanan Terjamin</div>
                    <div className="text-xs font-bold text-emerald-950/60 mt-1">Autentikasi aman via Google OAuth 2.0. Tidak ada kata sandi yang disimpan.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-bold text-emerald-950/50">
              Dengan masuk, Anda menyetujui <a href="#" className="underline font-black">Ketentuan Layanan</a> dan <a href="#" className="underline font-black">Kebijakan Privasi</a> OzikCarbon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
