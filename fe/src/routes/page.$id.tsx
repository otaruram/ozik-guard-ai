import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/page/$id")({
  component: PageComponent,
});

const PAGES_DATA: Record<string, { title: string; content: React.ReactNode }> = {
  "pln-sustainaction": {
    title: "PLN SustainAction 2026",
    content: (
      <>
        <p>Halaman ini berisikan informasi mengenai integrasi dan komitmen OzikCarbon dalam mendukung program PLN SustainAction 2026.</p>
        <p>OzikCarbon bertindak sebagai agregator pintar untuk mempercepat transisi energi hijau di tingkat UMKM dan enterprise menengah.</p>
      </>
    ),
  },
  "kontak": {
    title: "Hubungi Tim OzikCarbon",
    content: (
      <>
        <p>Email: <strong>hello@ozikcarbon.id</strong></p>
        <p>Telepon: <strong>+62 811 0000 0000</strong></p>
        <p>Alamat: Gedung Inovasi Hijau, Lt. 12, Jakarta Selatan, Indonesia.</p>
      </>
    ),
  },
  "privasi": {
    title: "Kebijakan Privasi Data",
    content: (
      <>
        <p>Kami sangat menjaga kerahasiaan PDD dan dokumen proposal Anda. OzikCarbon mengadopsi prinsip <em>Zero Data Retention Guarantee</em> di mana seluruh dokumen yang diunggah akan otomatis dihapus dari server (RAM) kami segera setelah laporan audit selesai dibuat.</p>
        <p>Sistem AI kami beroperasi sesuai standar kepatuhan UU Pelindungan Data Pribadi (UU PDP No. 27 Tahun 2022).</p>
      </>
    ),
  },
  "disclaimer": {
    title: "Disclaimer Hak Cipta",
    content: (
      <>
        <p>Hak cipta seluruh desain, algoritma dual-track, dan aset visual OzikCarbon dilindungi oleh hukum. Dilarang melakukan <em>reverse engineering</em> atau menyalin materi tanpa izin tertulis dari OzikCarbon Inc.</p>
      </>
    ),
  },
};

function PageComponent() {
  const { id } = Route.useParams();
  const page = PAGES_DATA[id] || {
    title: "Halaman Tidak Ditemukan",
    content: <p>Halaman yang Anda cari tidak tersedia atau sedang dalam perbaikan.</p>,
  };

  return (
    <div className="min-h-screen bg-white font-sans text-emerald-950 selection:bg-emerald-950 selection:text-white flex flex-col">
      <header className="border-b border-border/40 bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-emerald-950 text-white p-2 rounded group-hover:bg-emerald-800 transition-colors">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-widest uppercase text-emerald-950 hidden sm:block">OzikCarbon</span>
        </Link>
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-emerald-950 hover:bg-emerald-50 rounded-none transition-all">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </header>
      
      <main className="flex-1 p-6 md:p-12 flex justify-center">
        <article className="w-full max-w-3xl">
          <div className="border-4 border-emerald-950 bg-white p-8 md:p-12 shadow-[12px_12px_0_rgba(2,44,34,1)]">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-emerald-950 mb-8 border-b-4 border-emerald-950/10 pb-6">
              {page.title}
            </h1>
            <div className="prose prose-emerald max-w-none text-emerald-950/80 font-medium text-lg leading-relaxed space-y-6">
              {page.content}
            </div>
            
            <div className="mt-16 pt-8 border-t-4 border-emerald-950/10">
              <Link to="/">
                <Button className="bg-emerald-950 text-white hover:bg-emerald-900 border-4 border-transparent rounded-none font-black uppercase tracking-widest px-8 py-6 shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
