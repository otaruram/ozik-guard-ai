import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Scale, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/page/$id")({
  component: PageComponent,
});

const PAGES_DATA: Record<
  string,
  { code: string; title: string; subtitle: string; content: React.ReactNode }
> = {
  "pln-sustainaction": {
    code: "DOKUMEN PROGRAM // PLN SUSTAINACTION 2026",
    title: "Komitmen Transisi Energi & Rantai Pasok Bersih PLN SustainAction 2026",
    subtitle:
      "Peran OzikSustain sebagai agregator kepatuhan hukum dan spasial untuk mempercepat dekarbonisasi rantai pasok nasional.",
    content: (
      <div className="space-y-4">
        <p>
          OzikSustain dikembangkan sebagai infrastruktur adjudikasi digital yang mendukung visi <strong>PLN SustainAction 2026</strong> dalam mempercepat transisi energi bersih yang akuntabel di seluruh kepulauan Indonesia.
        </p>
        <p>
          Melalui integrasi pencarian vektor hukum <strong>IndoBERT</strong> dan verifikasi poligon spasial, kami membantu korporasi energi serta ribuan pemasok UMKM memvalidasi dokumen <em>Project Design Document</em> (PDD), izin lingkungan (AMDAL/UKL-UPL), dan kelayakan teknis PLTS secara cepat, objektif, dan bebas dari klaim semu (<em>greenwashing</em>).
        </p>
      </div>
    ),
  },
  kontak: {
    code: "KANAL KOMUNIKASI // TIM ADJUDIKASI",
    title: "Hubungi Tim Teknis & Hukum OzikSustain",
    subtitle:
      "Konsultasi integrasi Enterprise REST API, penyediaan Private VPC, dan dukungan verifikasi sertifikat.",
    content: (
      <div className="space-y-4">
        <p>
          Untuk permintaan demonstrasi korporasi, pengadaan instansi pemerintah (B2G), maupun bantuan teknis terkait kunci API, silakan hubungi tim kami melalui kanal resmi berikut:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
          <div className="border border-[#091E17] bg-[#F6F4EE] p-4">
            <div className="text-[#4A5D54] uppercase mb-1">SURAT ELEKTRONIK RESMI</div>
            <div className="font-bold text-[#091E17] text-sm">adjudikasi@oziksustain.id</div>
          </div>
          <div className="border border-[#091E17] bg-[#F6F4EE] p-4">
            <div className="text-[#4A5D54] uppercase mb-1">KANTOR OPERASIONAL</div>
            <div className="font-bold text-[#091E17] text-sm">Jakarta Selatan, DKI Jakarta, ID</div>
          </div>
        </div>
      </div>
    ),
  },
  privasi: {
    code: "KEPATUHAN REGULASI // UU PDP NO. 27 TAHUN 2022",
    title: "Kebijakan Privasi & Jaminan Zero Data Retention",
    subtitle:
      "Arsitektur pemrosesan memori volatil (RAM) dan penyensoran otomatis identitas pribadi.",
    content: (
      <div className="space-y-4">
        <p>
          OzikSustain menerapkan standar perlindungan tertinggi atas dokumen rahasia perusahaan Anda. Kami mengadopsi arsitektur <strong>Zero Data Retention</strong> di mana berkas mentah PDD atau kontrak yang diunggah diproses langsung di memori volatil (RAM) dan segera dihapus begitu laporan evaluasi selesai disusun.
        </p>
        <p>
          Sebelum teks dokumen dianalisis oleh model bahasa, lapisan <em>PII Auto-Masking</em> kami secara otomatis menyamarkan Nomor Induk Kependudukan (NIK), Nomor Induk Berusaha (NIB), dan nama individu sesuai amanat <strong>Undang-Undang Pelindungan Data Pribadi (UU No. 27 Tahun 2022)</strong>.
        </p>
      </div>
    ),
  },
  disclaimer: {
    code: "KETENTUAN HUKUM // HAK CIPTA & BATASAN TANGGUNG JAWAB",
    title: "Ketentuan Layanan & Pernyataan Hukum",
    subtitle:
      "Pedoman penggunaan laporan adjudikasi digital dan lencana verifikasi kriptografi OzikSustain.",
    content: (
      <div className="space-y-4">
        <p>
          Seluruh hasil pemindaian AI pada platform OzikSustain dilengkapi dengan rujukan pasal deterministik dari korpus <strong>Pasal.id</strong> serta melewati mekanisme kalibrasi pakar (<em>Human-in-the-Loop</em>) sebelum lencana kriptografi HMAC-SHA256 diterbitkan.
        </p>
        <p>
          Setiap upaya memodifikasi isi dokumen setelah sertifikat diterbitkan akan membatalkan kecocokan hash SHA-256 pada buku besar verifikasi publik kami secara otomatis.
        </p>
      </div>
    ),
  },
};

function PageComponent() {
  const { id } = Route.useParams();
  const page = PAGES_DATA[id] || {
    code: "INDEKS 404",
    title: "Lembar Informasi Tidak Ditemukan",
    subtitle: "Dokumen yang Anda maksud tidak tersedia dalam indeks.",
    content: <p>Silakan kembali ke halaman utama untuk mengakses modul yang aktif.</p>,
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid text-[#091E17] py-8 sm:py-14 md:py-20 px-3 sm:px-4">
      <article className="mx-auto max-w-3xl border-[1.5px] border-[#091E17] bg-white shadow-[4px_4px_0_#091E17] sm:shadow-[8px_8px_0_#091E17]">
        <div className="bg-[#071913] text-[#F6F4EE] p-5 sm:p-8 md:p-10 border-b-[1.5px] border-[#091E17]">
          <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#34D399] mb-2">
            {page.code}
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight break-words">
            {page.title}
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-[#F6F4EE]/75 leading-relaxed">{page.subtitle}</p>
        </div>

        <div className="p-5 sm:p-8 md:p-10 text-xs sm:text-sm md:text-base text-[#091E17]/90 leading-relaxed space-y-6">
          {page.content}

          <div className="pt-6 sm:pt-8 border-t border-[#091E17]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border-[1.5px] border-[#091E17] bg-[#091E17] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#F6F4EE] hover:bg-[#0D6E49] transition-colors text-center w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
            </Link>
            <span className="font-mono text-[10px] sm:text-[11px] text-[#4A5D54]">OZIKSUSTAIN LEGAL ARCHIVE</span>
          </div>
        </div>
      </article>
    </div>
  );
}
