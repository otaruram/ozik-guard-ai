import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { AuthProvider } from "@/lib/auth-context";
import { Compass, RotateCcw, ArrowLeft } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F4EE] bg-archival-grid px-4 text-[#091E17]">
      <div className="w-full max-w-lg border-[1.5px] border-[#091E17] bg-white p-8 md:p-12 shadow-[6px_6px_0_#091E17]">
        <div className="flex items-center justify-between border-b border-[#091E17]/15 pb-4 mb-6 font-mono text-xs uppercase tracking-widest text-[#4A5D54]">
          <span>KODE STATUS // 404</span>
          <span>INDEKS TIDAK DITEMUKAN</span>
        </div>
        <h1 className="font-editorial text-5xl md:text-6xl font-semibold tracking-tight text-[#091E17]">
          Lembar Arsip Tidak Tersedia
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#4A5D54]">
          Rute atau dokumen yang Anda tuju tidak terdaftar dalam registri sistem OzikSustain atau telah dipindahkan ke indeks baru.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-[#091E17] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#F6F4EE] transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-[#F6F4EE] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#091E17] transition-colors hover:bg-[#ECE9DF]"
          >
            <Compass className="h-4 w-4" /> Uji Coba Audit PDD
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: any; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    if (error instanceof Error) {
      reportLovableError(error, { boundary: "tanstack_root_error_component" });
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F4EE] bg-archival-grid px-4 text-[#091E17]">
      <div className="w-full max-w-lg border-[1.5px] border-[#091E17] bg-white p-8 md:p-12 shadow-[6px_6px_0_#091E17]">
        <div className="flex items-center justify-between border-b border-[#091E17]/15 pb-4 mb-6 font-mono text-xs uppercase tracking-widest text-[#B91C1C]">
          <span>INTERRUPTION // RUNTIME</span>
          <span>GANGGUAN PEMUATAN</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-4xl font-semibold tracking-tight text-[#091E17]">
          Kendala Pemrosesan Halaman
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#4A5D54]">
          Terjadi gangguan saat memuat modul antarmuka ini. Silakan muat ulang sesi atau kembali ke beranda utama.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-[#091E17] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#F6F4EE] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Muat Ulang Modul
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 border-[1.5px] border-[#091E17] bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#091E17] hover:bg-[#ECE9DF]"
          >
            Beranda Utama
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OzikSustain : Mesin Audit Kepatuhan Hukum & Spasial Proyek Hijau" },
      {
        name: "description",
        content:
          "Platform adjudikasi digital untuk audit Project Design Document (PDD), izin lingkungan, dan rantai pasok hijau berbasis IndoBERT RAG, pengawasan pakar, dan segel kriptografi SHA-256.",
      },
      { name: "author", content: "OzikSustain" },
      { property: "og:title", content: "OzikSustain : Mesin Audit Kepatuhan Hukum & Spasial Proyek Hijau" },
      {
        property: "og:description",
        content:
          "Audit dokumen PDD dan izin lingkungan terhadap UU LHK, Permen ESDM, dan Perpres Nilai Ekonomi Karbon dalam hitungan detik dengan rujukan Pasal.id.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "OzikSustain : Mesin Audit Kepatuhan Hukum & Spasial Proyek Hijau" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideChrome =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/review") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/kyc-onboarding") ||
    pathname.startsWith("/verify");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#F6F4EE] text-[#091E17]">
          {!hideChrome && <SiteHeader />}
          <main className="flex-1">
            <Outlet />
          </main>
          <Toaster richColors position="top-right" />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
