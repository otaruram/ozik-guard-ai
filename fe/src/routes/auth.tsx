import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Fingerprint,
  Scale,
  EyeOff,
  FileSearch,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Otorisasi Sesi Workspace : OzikSustain" },
      {
        name: "description",
        content:
          "Masuk ke workspace OzikSustain menggunakan akun Google OAuth 2.0 untuk evaluasi kelayakan proyek energi dan kepatuhan regulasi lingkungan.",
      },
    ],
  }),
  component: AuthPage,
});

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.58v2.98h3.86c2.26-2.09 3.58-5.17 3.58-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.86-2.98c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 000 12c0 1.94.47 3.77 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F4EE]">
        <Loader2 className="h-8 w-8 animate-spin text-[#091E17]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#F6F4EE] text-[#091E17] selection:bg-[#091E17] selection:text-[#F6F4EE]">
      {/* Left Editorial & Botanical-Technical Panel (7 Cols) */}
      <aside className="relative hidden lg:flex lg:col-span-7 flex-col justify-between overflow-hidden bg-[#071913] bg-canopy-grid text-[#F6F4EE] p-12 xl:p-16 border-r-[1.5px] border-[#091E17]">
        {/* Top Brand Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#F6F4EE]/15 pb-6">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="grid h-11 w-11 place-items-center bg-[#F6F4EE] p-1.5 border border-[#F6F4EE]">
              <img
                src="/logo.png"
                alt="OzikSustain"
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
            <div>
              <span className="font-editorial text-xl font-bold tracking-tight text-white block leading-none">
                OzikSustain
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#34D399]">
                ADJUDIKASI HUKUM &amp; SPASIAL ESG
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#F6F4EE]/75 hover:text-[#FBBF24] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Beranda
          </Link>
        </div>

        {/* Center Editorial Showcase */}
        <div className="relative z-10 my-auto py-8 grid xl:grid-cols-12 gap-8 items-center">
          <div className="xl:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FBBF24]">
              GERBANG OTORISASI WORKSPACE B2B &amp; UMKM
            </div>
            <h1 className="font-editorial text-4xl xl:text-5xl font-semibold tracking-tight text-white leading-[1.08]">
              Validasi Kepatuhan Proyek Energi Tanpa Risiko Greenwashing.
            </h1>
            <p className="text-sm text-[#F6F4EE]/75 leading-relaxed">
              Masuk untuk memindai dokumen PDD secara utuh, menerima kalibrasi dari tim auditor pakar hukum, menggunakan REST API, dan menerbitkan lencana sertifikasi bersegel HMAC-SHA256.
            </p>

            <div className="space-y-3 pt-2 font-mono text-xs">
              {[
                {
                  icon: Scale,
                  text: "Pencocokan Vektor IndoBERT pada Korpus Pasal.id",
                },
                {
                  icon: EyeOff,
                  text: "Penyensoran Otomatis NIK & NIB (Standar UU PDP)",
                },
                {
                  icon: Fingerprint,
                  text: "Penerbitan QR Badge Publik Anti-Manipulasi",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3 text-[#F6F4EE]/90">
                    <div className="h-7 w-7 border border-[#34D399]/40 bg-[#064E3B]/40 flex items-center justify-center text-[#34D399] shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generated Engraving Artwork Card */}
          <div className="xl:col-span-5 border border-[#F6F4EE]/25 bg-[#091E17] p-3 shadow-[6px_6px_0_#D97706]">
            <div className="relative aspect-[4/5] overflow-hidden border border-[#F6F4EE]/15 bg-[#071913]">
              <img
                src="/images/auth-editorial.png"
                alt="Ilustrasi Instrumen Hukum dan Botani Nusantara"
                className="h-full w-full object-cover opacity-95"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071913] via-[#071913]/85 to-transparent p-3.5 font-mono text-[10px]">
                <div className="text-[#FBBF24] font-bold">FIG. 02 // NERACA EKOLOGI &amp; HUKUM</div>
                <div className="text-[#F6F4EE]/75 mt-0.5">
                  Standar Evaluasi Pengadaan Hijau Nasional 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Telemetry Footer */}
        <div className="relative z-10 border-t border-[#F6F4EE]/15 pt-5 flex items-center justify-between font-mono text-[11px] text-[#F6F4EE]/60">
          <span>PROTOKOL: OAUTH 2.0 • ZERO PASSWORD STORAGE</span>
          <span>ENKRIPSI: TLS 1.3 + SHA-256</span>
        </div>
      </aside>

      {/* Right Authentication Terminal (5 Cols) */}
      <section className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-[#F6F4EE] bg-archival-grid">
        <div className="flex items-center justify-between lg:justify-end">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2.5">
            <div className="h-9 w-9 border border-[#091E17] bg-white p-1">
              <img src="/logo.png" alt="OzikSustain" className="h-full w-full object-contain" />
            </div>
            <span className="font-editorial text-lg font-bold text-[#091E17]">OzikSustain</span>
          </Link>
          <Link
            to="/audit"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0D6E49] hover:underline"
          >
            <FileSearch className="h-3.5 w-3.5" /> Coba Sandbox Tanpa Login
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-8">
          <div className="border-[1.5px] border-[#091E17] bg-white p-7 sm:p-10 shadow-[6px_6px_0_#091E17]">
            <div className="flex items-center justify-between border-b border-[#091E17]/15 pb-4 mb-6 font-mono text-[10px] text-[#4A5D54]">
              <span>OTENTIKASI IDENTITAS</span>
              <span className="text-[#0D6E49] font-bold">SESI TERENKRIPSI</span>
            </div>

            <div className="mb-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center border-[1.5px] border-[#091E17] bg-[#091E17] text-[#FBBF24]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#091E17]">
                Masuk ke Workspace
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#4A5D54] leading-relaxed">
                Gunakan akun Google institusi atau perusahaan Anda untuk mengakses dashboard audit penuh dan manajemen kunci API.
              </p>
            </div>

            {/* Single Sign-On Button */}
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full h-14 px-5 bg-white hover:bg-[#091E17] text-[#091E17] hover:text-[#F6F4EE] border-[1.5px] border-[#091E17] shadow-[4px_4px_0_#091E17] hover:shadow-[4px_4px_0_#D97706] transition-all flex items-center justify-center gap-3.5 font-mono text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              <span>Lanjutkan dengan Akun Google</span>
            </button>

            <div className="mt-8 space-y-3 pt-6 border-t border-[#091E17]/15">
              <div className="bg-[#E6F4EE]/70 border border-[#0D6E49]/40 p-3.5 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#0D6E49] shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase text-[#091E17]">
                    Alokasi 3 Kredit Audit Penuh Gratis
                  </div>
                  <p className="text-xs text-[#4A5D54] mt-0.5 leading-relaxed">
                    Setiap akun baru langsung menerima 3 kredit untuk menguji pemindaian PDD menyeluruh atau memanggil endpoint API.
                  </p>
                </div>
              </div>

              <div className="bg-[#F6F4EE] border border-[#091E17]/20 p-3.5 flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-[#091E17] shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase text-[#091E17]">
                    Otorisasi Tanpa Kata Sandi
                  </div>
                  <p className="text-xs text-[#4A5D54] mt-0.5 leading-relaxed">
                    OzikSustain tidak menyimpan kredensial sandi Anda. Token sesi diverifikasi melalui standar OAuth 2.0.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#4A5D54] leading-relaxed">
            Dengan melanjutkan otorisasi, Anda menyetujui{" "}
            <Link
              to="/page/$id"
              params={{ id: "disclaimer" }}
              className="font-semibold text-[#091E17] underline underline-offset-2"
            >
              Ketentuan Layanan
            </Link>{" "}
            serta{" "}
            <Link
              to="/page/$id"
              params={{ id: "privasi" }}
              className="font-semibold text-[#091E17] underline underline-offset-2"
            >
              Kebijakan Privasi &amp; Kepatuhan UU PDP
            </Link>{" "}
            OzikSustain.
          </p>
        </div>

        <div className="text-center font-mono text-[10px] text-[#4A5D54] uppercase tracking-widest">
          OZIKSUSTAIN SECURITY GATEWAY // JAKARTA, ID
        </div>
      </section>
    </div>
  );
}
