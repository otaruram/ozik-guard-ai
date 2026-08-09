import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Scale, AlertTriangle, ShieldCheck, Leaf, BookOpen, Loader2 } from "lucide-react";

export const Route = createFileRoute("/regulasi")({
  component: RegulasiHijau,
});

function RegulasiHijau() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 600);
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
        const response = await fetch(`https://oziksustain.my.id/api/v1/regulasi/search?q=${encodeURIComponent(debouncedQuery)}`);
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "CRITICAL":
        return "bg-red-600 text-white border-red-800";
      case "HIGH":
        return "bg-orange-500 text-white border-orange-700";
      case "MEDIUM":
        return "bg-yellow-400 text-emerald-950 border-yellow-600";
      case "LOW":
        return "bg-emerald-500 text-white border-emerald-700";
      default:
        return "bg-gray-200 text-gray-800 border-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 font-sans text-emerald-950">
      {/* Hero Section */}
      <div className="bg-emerald-950 text-white pt-24 pb-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/50 border-2 border-emerald-700 text-emerald-300 text-xs font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0_rgba(4,120,87,1)]">
            <Leaf className="h-4 w-4" />
            AI-Powered Legal Search
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Direktori Regulasi Hijau
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
            Pencarian cerdas berbasis AI untuk UU, Peraturan Menteri, dan Standar ESG di Indonesia.
          </p>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-emerald-950/50" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari regulasi tentang emisi karbon, izin lingkungan, dll..."
              className="w-full pl-14 pr-16 py-5 text-lg font-bold text-emerald-950 bg-white border-4 border-emerald-950 shadow-[8px_8px_0_rgba(2,44,34,1)] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[12px_12px_0_rgba(2,44,34,1)] transition-all placeholder:text-emerald-950/40"
            />
            {loading && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Loader2 className="h-6 w-6 text-emerald-950 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {!debouncedQuery && (
          <div className="text-center py-20 opacity-50">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-emerald-950" />
            <h3 className="text-xl font-black uppercase tracking-widest">Mulai Pencarian</h3>
            <p className="font-medium">Ketik topik hukum lingkungan yang ingin Anda cari</p>
          </div>
        )}

        {debouncedQuery && !loading && results.length === 0 && (
          <div className="text-center py-20 border-4 border-dashed border-emerald-950/20">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-emerald-950/40" />
            <h3 className="text-xl font-black uppercase tracking-widest text-emerald-950/60">Tidak Ditemukan</h3>
            <p className="font-medium text-emerald-950/50">Coba gunakan kata kunci lain</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
            {results.map((item, index) => (
              <div 
                key={item.id || index} 
                className="bg-white border-4 border-emerald-950 p-6 shadow-[6px_6px_0_rgba(2,44,34,1)] hover:shadow-[10px_10px_0_rgba(2,44,34,1)] hover:-translate-y-1 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-emerald-950 mb-1 flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      {item.regName}
                    </h3>
                    <div className="text-sm font-bold text-emerald-700 uppercase tracking-widest">
                      {item.article}
                    </div>
                  </div>
                  <div className={`px-3 py-1 font-black text-xs uppercase tracking-widest border-2 whitespace-nowrap inline-flex items-center gap-1 ${getRiskColor(item.riskCategory)}`}>
                    {item.riskCategory === 'LOW' ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    Risiko: {item.riskCategory}
                  </div>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-950 p-4 text-emerald-900 font-medium">
                  {item.content}
                </div>

                {item.similarity && (
                  <div className="mt-4 flex justify-end">
                    <span className="text-[10px] font-black text-emerald-950/40 uppercase tracking-widest">
                      Similarity Score: {(item.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
