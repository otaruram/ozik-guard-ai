import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Loader2, Leaf, ArrowRight, Circle } from "lucide-react";

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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-5 mb-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-row justify-between items-start gap-4">
        <h3 className="text-lg font-bold text-[#0F382C] leading-snug">
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

        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors">
          Baca Selengkapnya <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function RegulasiHijau() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
        const response = await fetch(`https://ozikgrid.web.id/api/v1/regulasi/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        setResults(data || []);
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
              {DEFAULT_RECOMMENDATIONS.map((item) => (
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
              <div className="space-y-4">
                {results.map((item, idx) => (
                  <ResultCard key={item.id || idx} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
