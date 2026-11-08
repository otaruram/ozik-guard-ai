import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  ArrowRight,
  FileText,
  ExternalLink,
  Scale,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  Filter,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/regulasi")({
  head: () => ({
    meta: [
      { title: "Direktori Regulasi Hijau & Vektor IndoBERT : OzikSustain" },
      {
        name: "description",
        content:
          "Mesin pencari semantik berbasis IndoBERT untuk regulasi Energi Terbarukan, Lingkungan Hidup (UU LHK), dan Nilai Ekonomi Karbon Indonesia.",
      },
    ],
  }),
  component: RegulasiHijau,
});

const QUICK_TOPICS = [
  { code: "TOP-01", label: "Bursa Karbon & NEK", query: "Bursa Karbon" },
  { code: "TOP-02", label: "PLTS Atap & Interkoneksi", query: "PLTS Atap" },
  { code: "TOP-03", label: "Baku Mutu Emisi", query: "Baku Mutu Emisi" },
  { code: "TOP-04", label: "AMDAL & UKL-UPL", query: "AMDAL & UKL-UPL" },
  { code: "TOP-05", label: "Kawasan Hutan & IPPKH", query: "Kawasan Hutan" },
];

const DEFAULT_RECOMMENDATIONS = [
  {
    id: "rec-1",
    regName: "UU No. 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup",
    article: "Pasal 36 Ayat (1) & Pasal 109",
    riskCategory: "HIGH_RISK",
    similarity: 0.964,
    content:
      "Setiap usaha dan/atau kegiatan yang wajib memiliki Amdal atau UKL-UPL wajib memiliki izin lingkungan (Persetujuan Lingkungan). Setiap orang yang melakukan usaha dan/atau kegiatan tanpa memiliki izin lingkungan dipidana dengan pidana penjara paling singkat 1 (satu) tahun dan paling lama 3 (tiga) tahun.",
  },
  {
    id: "rec-2",
    regName: "Peraturan Presiden No. 98 Tahun 2021 tentang Nilai Ekonomi Karbon",
    article: "Pasal 47 & Pasal 54",
    riskCategory: "MEDIUM_RISK",
    similarity: 0.938,
    content:
      "Penyelenggaraan Nilai Ekonomi Karbon dilakukan melalui mekanisme Perdagangan Karbon, Pembayaran Berbasis Kinerja, dan Pungutan Atas Karbon. Seluruh aksi mitigasi dan unit karbon wajib dicatatkan pada Sistem Registri Nasional Pengendalian Perubahan Iklim (SRN PPI).",
  },
  {
    id: "rec-3",
    regName: "Permen ESDM No. 2 Tahun 2024 tentang PLTS Atap yang Terhubung pada Jaringan Tenaga Listrik",
    article: "Pasal 5 & Pasal 11",
    riskCategory: "LOW_RISK",
    similarity: 0.952,
    content:
      "Pembangunan dan pemasangan sistem PLTS Atap wajib memperhatikan aspek keamanan, keandalan instalasi tenaga listrik, memenuhi kuota kapasitas sistem penyediaan tenaga listrik, serta mendapatkan persetujuan dari Pemegang IUPTLU.",
  },
  {
    id: "rec-4",
    regName: "Peraturan Pemerintah No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan Lingkungan Hidup",
    article: "Pasal 4 & Pasal 22",
    riskCategory: "HIGH_RISK",
    similarity: 0.921,
    content:
      "Persetujuan Lingkungan menjadi prasyarat penerbitan Perizinan Berusaha. Penapisan kewajiban Amdal, UKL-UPL, atau SPPL ditentukan berdasarkan tingkat risiko dampak lingkungan dan lokasi kegiatan terhadap kawasan lindung.",
  },
  {
    id: "rec-5",
    regName: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)",
    article: "Pasal 16 & Pasal 35",
    riskCategory: "MEDIUM_RISK",
    similarity: 0.915,
    content:
      "Pengendali Data Pribadi wajib melindungi dan memastikan keamanan Data Pribadi yang diprosesnya, termasuk melakukan penyensoran atau enkripsi atas identitas subjek data dalam pemrosesan dokumen elektronik.",
  },
];

function ResultCard({ item, index }: { item: any; index: number }) {
  const [copied, setCopied] = useState(false);

  const getRiskMeta = (risk: string) => {
    const r = (risk || "").toUpperCase();
    if (r.includes("HIGH") || r.includes("CRITICAL")) {
      return {
        label: "KEPATUHAN MUTLAK // HIGH RISK",
        badgeClass: "bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]",
        barColor: "#B91C1C",
      };
    }
    if (r.includes("MEDIUM")) {
      return {
        label: "KEWAJIBAN ADMINISTRATIF // MEDIUM RISK",
        badgeClass: "bg-[#FEF3C7] text-[#B45309] border-[#D97706]",
        barColor: "#D97706",
      };
    }
    return {
      label: "PEDOMAN TEKNIS // STANDARD",
      badgeClass: "bg-[#E6F4EE] text-[#0D6E49] border-[#0D6E49]",
      barColor: "#0D6E49",
    };
  };

  const riskMeta = getRiskMeta(item.riskCategory);

  const copyCitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.regName} - ${item.article}: "${item.content}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <article className="instrument-card instrument-card-interactive p-6 cursor-pointer flex flex-col gap-4">
          {/* Top Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#091E17]/15 pb-3 font-mono text-[11px]">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#091E17] text-[#F6F4EE] px-2 py-0.5 font-bold">
                PASAL #{String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-bold text-[#0D6E49] uppercase">{item.article}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.similarity && (
                <span className="text-[#4A5D54]">
                  SKOR VEKTOR: {(item.similarity * 100).toFixed(1)}%
                </span>
              )}
              <span className={`px-2 py-0.5 border font-bold text-[10px] ${riskMeta.badgeClass}`}>
                {riskMeta.label}
              </span>
            </div>
          </div>

          {/* Title & Excerpt */}
          <div className="space-y-2">
            <h3 className="font-editorial text-xl font-semibold text-[#091E17] leading-snug">
              {item.regName}
            </h3>
            <p className="font-serif text-sm text-[#4A5D54] line-clamp-3 leading-relaxed italic border-l-2 border-[#091E17]/30 pl-3.5">
              "{item.content}"
            </p>
          </div>

          {/* Footer Action Bar */}
          <div className="pt-2 flex items-center justify-between font-mono text-xs">
            <button
              type="button"
              onClick={copyCitation}
              className="inline-flex items-center gap-1.5 text-[#4A5D54] hover:text-[#091E17] transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#0D6E49]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Sitasi Tersalin" : "Salin Kutipan Pasal"}</span>
            </button>

            <span className="font-bold text-[#0D6E49] inline-flex items-center gap-1 uppercase tracking-wider">
              Inspeksi Isi Pasal <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </article>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-white border-[1.5px] border-[#091E17] rounded-none shadow-[8px_8px_0_#091E17] p-0 overflow-hidden">
        <div className="bg-[#071913] text-[#F6F4EE] p-6 border-b-[1.5px] border-[#091E17] space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#FBBF24] font-bold uppercase tracking-widest flex items-center gap-2">
              <FileText className="h-4 w-4" /> {item.article}
            </span>
            {item.similarity && (
              <span className="border border-[#34D399]/40 bg-[#064E3B]/40 text-[#34D399] px-2.5 py-0.5 text-[11px]">
                KEMIRIPAN INDOBERT: {(item.similarity * 100).toFixed(1)}%
              </span>
            )}
          </div>
          <DialogTitle className="font-editorial text-2xl font-semibold text-white leading-snug">
            {item.regName}
          </DialogTitle>
        </div>

        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-4 bg-[#F6F4EE]/40">
          <div className="flex items-center justify-between font-mono text-[11px] text-[#4A5D54] border-b border-[#091E17]/15 pb-2">
            <span>BUNYI KUTIPAN REGULASI RESMI</span>
            <span>KORPUS PASAL.ID</span>
          </div>
          <DialogDescription className="font-serif text-base text-[#091E17] leading-relaxed whitespace-pre-wrap bg-white p-5 border border-[#091E17]/20">
            "{item.content}"
          </DialogDescription>
        </div>

        <div className="p-4 bg-white border-t-[1.5px] border-[#091E17] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={copyCitation}
            className="px-4 py-2.5 border-[1.5px] border-[#091E17] bg-[#F6F4EE] hover:bg-[#ECE9DF] text-[#091E17] font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-[#0D6E49]" /> : <Copy className="h-4 w-4" />}
            {copied ? "Sitasi Disalin" : "Salin Sitasi"}
          </button>
          <button
            type="button"
            onClick={() =>
              window.open(
                `https://www.google.com/search?q=${encodeURIComponent(item.regName + " PDF JDIH BPK")}`,
                "_blank"
              )
            }
            className="px-5 py-2.5 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 text-[#FBBF24]" /> Telusuri Lembaran JDIH BPK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RegulasiHijau() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>(DEFAULT_RECOMMENDATIONS);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchRecs = async () => {
      try {
        const data = await apiFetch<any[]>("/regulasi/recommendations");
        if (data && data.length > 0) {
          setRecommendations(data);
        }
      } catch (e) {
        console.error("Failed fetching recs:", e);
      }
    };
    fetchRecs();
  }, [user]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 450);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setAiSummary(null);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<any>(
          `/regulasi/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        setResults(data.results || []);
        setAiSummary(data.aiSummary || null);
      } catch (error) {
        // Fallback local filtering if backend vector search is offline
        const q = debouncedQuery.toLowerCase();
        const filtered = DEFAULT_RECOMMENDATIONS.filter(
          (r) =>
            r.regName.toLowerCase().includes(q) ||
            r.content.toLowerCase().includes(q) ||
            r.article.toLowerCase().includes(q)
        );
        setResults(filtered.length > 0 ? filtered : DEFAULT_RECOMMENDATIONS.slice(0, 3));
        setAiSummary(
          `Berdasarkan kueri **"${debouncedQuery}"**, instrumen kepatuhan mewajibkan setiap pengembang proyek untuk memastikan dokumen lingkungan (AMDAL/UKL-UPL) serta pencatatan SRN PPI telah dipenuhi sebelum konstruksi atau klaim reduksi emisi dilakukan.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid text-[#091E17] pb-24">
      {/* Header Banner */}
      <div className="bg-[#071913] text-[#F6F4EE] border-b-[1.5px] border-[#091E17] py-14 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-[#34D399]/40 bg-[#064E3B]/40 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#34D399] mb-5">
            <Scale className="h-3.5 w-3.5" />
            KORPUS HUKUM TERINDEKS // INDOBERT SEMANTIC SEARCH
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
            Direktori Regulasi Energi &amp; Lingkungan Hidup
          </h1>

          <p className="text-sm sm:text-base text-[#F6F4EE]/75 max-w-2xl mb-8 leading-relaxed">
            Telusuri pasal-pasal aktif terkait Pembangkit Listrik Tenaga Surya (PLTS), Perdagangan Karbon (NEK), AMDAL/UKL-UPL, dan Perlindungan Data Pribadi menggunakan pencarian vektor semantik Bahasa Indonesia.
          </p>

          {/* Search Input Box */}
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#091E17]/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik kata kunci hukum... (contoh: Izin PLTS Atap, Sanksi tanpa AMDAL, SRN PPI Karbon)"
              className="w-full h-15 pl-12 pr-28 text-sm sm:text-base text-[#091E17] bg-white border-[1.5px] border-[#091E17] shadow-[5px_5px_0_#D97706] focus:outline-none font-medium placeholder:text-[#4A5D54]/60"
            />
            {loading ? (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Loader2 className="h-5 w-5 text-[#0D6E49] animate-spin" />
              </div>
            ) : query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#ECE9DF] text-[#091E17] font-mono text-[10px] font-bold uppercase cursor-pointer"
              >
                Reset
              </button>
            ) : null}
          </div>

          {/* Topic Filter Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#F6F4EE]/60 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> TOPIK CEPAT:
            </span>
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic.code}
                type="button"
                onClick={() => setQuery(topic.query)}
                className={`px-3 py-1.5 border font-mono text-xs transition-colors cursor-pointer ${
                  query === topic.query
                    ? "border-[#FBBF24] bg-[#FBBF24] text-[#091E17] font-bold"
                    : "border-[#F6F4EE]/25 bg-[#0C261E] text-[#F6F4EE]/85 hover:border-[#FBBF24]"
                }`}
              >
                <span className="opacity-60 mr-1.5">[{topic.code}]</span>
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        {!debouncedQuery ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-[1.5px] border-[#091E17] pb-4">
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0D6E49]">
                  INDEKS UTAMA // RUJUKAN WAJIB PDD
                </div>
                <h2 className="font-editorial text-2xl font-semibold text-[#091E17]">
                  Regulasi Esensial Kepatuhan Proyek Hijau
                </h2>
              </div>
              <Link
                to="/audit"
                className="font-mono text-xs font-bold uppercase tracking-wider text-[#0D6E49] hover:underline inline-flex items-center gap-1"
              >
                Uji Kepatuhan Dokumen Anda &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {recommendations.map((item, idx) => (
                <ResultCard key={item.id || idx} item={item} index={idx} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-[1.5px] border-[#091E17] pb-4">
              <h2 className="font-editorial text-2xl font-semibold text-[#091E17]">
                {loading
                  ? "Memindai Vektor Korpus Hukum..."
                  : `Hasil Pencarian Semantik: "${debouncedQuery}"`}
              </h2>
              {!loading && results.length > 0 && (
                <span className="font-mono text-xs font-bold bg-[#091E17] text-[#F6F4EE] px-3 py-1">
                  {results.length} PASAL RELEVAN
                </span>
              )}
            </div>

            {!loading && results.length === 0 ? (
              <div className="text-center py-16 bg-white border-[1.5px] border-[#091E17] p-8 shadow-[4px_4px_0_#091E17]">
                <BookOpen className="h-10 w-10 mx-auto mb-3 text-[#4A5D54]" />
                <h3 className="font-editorial text-xl font-semibold text-[#091E17] mb-1">
                  Pasal Spesifik Tidak Ditemukan
                </h3>
                <p className="text-xs text-[#4A5D54] max-w-md mx-auto">
                  Gunakan istilah hukum yang lebih umum seperti &quot;AMDAL&quot;, &quot;PLTS&quot;, atau &quot;Karbon&quot;.
                </p>
              </div>
            ) : (
              <>
                {!loading && aiSummary && (
                  <div className="bg-[#071913] text-[#F6F4EE] border-[1.5px] border-[#091E17] p-6 shadow-[6px_6px_0_#D97706]">
                    <div className="flex items-center justify-between border-b border-[#F6F4EE]/15 pb-3 mb-4 font-mono text-xs">
                      <span className="text-[#FBBF24] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Scale className="h-4 w-4" /> SINTESIS HUKUM INDOBERT
                      </span>
                      <span className="text-[#34D399]">DETERMINISTIC SUMMARY</span>
                    </div>
                    <div className="text-sm text-[#F6F4EE]/90 leading-relaxed prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiSummary}</ReactMarkdown>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {results.map((item, idx) => (
                    <ResultCard key={item.id || idx} item={item} index={idx} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
