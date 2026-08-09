import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Loader2, Leaf, ArrowRight, Circle, FileText, ExternalLink } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Route = createFileRoute("/regulasi")({
  component: RegulasiHijau,
});

const QUICK_CHIPS = [
  "🌱 Bursa Karbon",
  "☀️ PLTS Atap",
  "🏭 Baku Mutu Emisi",
  "📄 AMDAL & UKL-UPL"
];

const DEFAULT_RECOMMENDATIONS = [
  {
    id: "rec-1",
    regName: "UU LHK No. 32 Tahun 2009",
    article: "Pasal 36",
    riskCategory: "HIGH_RISK",
    content: "Setiap usaha dan/atau kegiatan yang wajib memiliki amdal atau UKL-UPL wajib memiliki izin lingkungan. Menteri, gubernur, atau bupati/walikota menerbitkan izin lingkungan sesuai dengan kewenangannya."
  },
  {
    id: "rec-2",
    regName: "Perpres No. 98 Tahun 2021",
    article: "Pasal 47",
    riskCategory: "MEDIUM_RISK",
    content: "Penyelenggaraan Nilai Ekonomi Karbon meliputi Perdagangan Karbon, Pembayaran Berbasis Kinerja, Pungutan Atas Karbon, dan mekanisme lain sesuai dengan perkembangan ilmu pengetahuan."
  },
  {
    id: "rec-3",
    regName: "Permen ESDM No. 2 Tahun 2024",
    article: "Pasal 5",
    riskCategory: "LOW_RISK",
    content: "Pembangunan sistem PLTS Atap harus memperhatikan aspek keamanan, keandalan instalasi tenaga listrik, dan tidak mengganggu sistem penyediaan tenaga listrik."
  }
];

function ResultCard({ item }: { item: any }) {
  const getRiskDisplay = (risk: string) => {
    const r = (risk || "").toUpperCase();
    if (r.includes("HIGH") || r.includes("CRITICAL")) {
      return { label: "Kepatuhan Wajib / HIGH RISK", color: "text-red-500", bg: "bg-red-50 text-red-700 border-red-200" };
    }
    if (r.includes("MEDIUM")) {
      return { label: "Perhatian / MEDIUM RISK", color: "text-yellow-500", bg: "bg-yellow-50 text-yellow-700 border-yellow-200" };
    }
    return { label: "Aman / LOW RISK", color: "text-green-500", bg: "bg-green-50 text-green-700 border-green-200" };
  };

  const riskData = getRiskDisplay(item.riskCategory);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-5 mb-4 flex flex-col gap-3 cursor-pointer group">
          {/* Header */}
          <div className="flex flex-row justify-between items-start gap-4">
            <h3 className="text-lg font-bold text-[#0F382C] leading-snug group-hover:text-emerald-700 transition-colors">
              {item.regName}
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-md font-semibold whitespace-nowrap shrink-0">
              {item.article}
            </span>
          </div>

          {/* Body */}
          <p className="line-clamp-3 text-gray-600 text-sm leading-relaxed">
            {item.content}
          </p>

          {/* Footer */}
          <div className="mt-2 pt-3 flex flex-row items-center justify-between border-t border-gray-50">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wide uppercase ${riskData.bg}`}>
              <Circle className={`h-2 w-2 fill-current ${riskData.color}`} />
              {riskData.label}
            </div>
            
            <button className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 group-hover:underline flex items-center gap-1 transition-colors">
              Baca Selengkapnya <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl p-0 overflow-hidden">
        <div className="bg-emerald-950 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">{item.article}</span>
          </div>
          <DialogTitle className="text-2xl font-black text-white leading-tight">
            {item.regName}
          </DialogTitle>
          <div className="flex items-center gap-3 mt-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent text-xs font-bold uppercase ${riskData.bg.replace('bg-', 'bg-').replace('border-', 'border-')}`}>
              <Circle className={`h-2.5 w-2.5 fill-current ${riskData.color}`} />
              {riskData.label}
            </div>
            {item.similarity && (
              <Badge variant="outline" className="border-emerald-700 text-emerald-300 font-bold">
                Kecocokan AI: {(item.similarity * 100).toFixed(1)}%
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Isi Regulasi / Konten Pasal</h4>
          <DialogDescription className="text-gray-700 text-base leading-loose whitespace-pre-wrap">
            {item.content}
          </DialogDescription>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(item.regName + " PDF JDIH BPK")}`, "_blank")}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" /> Buka Dokumen Asli
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

  // Fetch dynamic personalized recommendations on mount
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await apiFetch<any[]>('/regulasi/recommendations');
        if (data && data.length > 0) {
          setRecommendations(data);
        }
      } catch (e) {
        console.error("Failed fetching recs:", e);
      }
    };
    fetchRecs();
  }, []);

  // Custom debounce hook logic (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<any>(`/regulasi/search?q=${encodeURIComponent(debouncedQuery)}`);
        setResults(data.results || []);
        setAiSummary(data.aiSummary || null);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-12 px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-6 border border-emerald-100">
            <Leaf className="h-3.5 w-3.5" />
            Eksklusif OzikSustain
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F382C] mb-4">
            Direktori Regulasi Hijau
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Mesin pencari hukum pintar khusus Energi Terbarukan, Lingkungan Hidup (UU LHK), dan Perdagangan Karbon.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari aturan... (misal: Izin PLTS Atap, Syarat IPPKH, Baku Mutu Emisi)"
              className="w-full pl-14 pr-16 py-4 text-base md:text-lg text-gray-800 bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-400"
            />
            {loading && (
              <div className="absolute inset-y-0 right-5 flex items-center">
                <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
              </div>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-row gap-2 flex-wrap justify-center items-center mt-6 max-w-2xl mx-auto">
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(chip.substring(chip.indexOf(" ") + 1))}
                className="px-4 py-2 bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-sm font-medium text-gray-600 hover:text-emerald-700 rounded-full shadow-sm transition-all flex items-center gap-2"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 mt-10">
        {!debouncedQuery ? (
          // Default State (Recommendations)
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                🔥 Rekomendasi Regulasi Esensial
              </h2>
            </div>
            <div className="space-y-4">
              {recommendations.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          // Search Results
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-700">
                {loading ? "Mencari regulasi..." : `Hasil pencarian untuk "${debouncedQuery}"`}
              </h2>
              {!loading && results.length > 0 && (
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {results.length} ditemukan
                </span>
              )}
            </div>

            {!loading && results.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                <Search className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">Tidak Ditemukan</h3>
                <p className="text-gray-500 text-sm">Coba gunakan kata kunci yang lebih umum.</p>
              </div>
            ) : (
              <>
                {!loading && aiSummary && (
                  <div className="bg-gradient-to-br from-[#0F382C] to-emerald-950 rounded-2xl p-6 mb-8 text-white shadow-lg relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                      <Leaf className="h-5 w-5 text-emerald-400" />
                      <h3 className="font-bold text-lg text-emerald-50">Sintesis AI</h3>
                    </div>
                    <div className="text-emerald-100/90 leading-relaxed relative z-10 text-sm md:text-base prose prose-sm prose-invert prose-emerald max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {aiSummary}
                      </ReactMarkdown>
                    </div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
                  </div>
                )}
                <div className="space-y-4">
                  {results.map((item, idx) => (
                    <ResultCard key={item.id || idx} item={item} />
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
