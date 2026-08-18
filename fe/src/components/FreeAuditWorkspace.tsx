import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Upload,
  Lock,
  Loader2,
  FileText,
  AlertTriangle,
  Globe,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export function FreeAuditWorkspace() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "parsing" | "masking" | "spatial" | "law" | "result">("idle");
  const [result, setResult] = useState<any>(null);

  const startTeaserAudit = async () => {
    // 3 Second Animation Stepper
    setStatus("parsing");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("masking");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("spatial");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("law");
    
    try {
      // Call Backend API
      const fd = new FormData();
      fd.append("pddText", "SAMPEL_DOKUMEN_TEKS_PANJANG_YANG_AKAN_DIPOTONG_OLEH_BACKEND_KE_3_HALAMAN");
      fd.append("fileType", "pdf");
      const res = await api.guestTeaser(fd);
      setResult(res);
      setStatus("result");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Gagal memproses audit teaser.");
    }
  };

  const handleRegister = () => {
    navigate({ to: "/auth" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-[600px] border-4 border-emerald-950 bg-white shadow-[12px_12px_0_rgba(2,44,34,1)] flex flex-col font-sans">
      <div className="border-b-4 border-emerald-950 bg-emerald-50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="font-black uppercase tracking-widest text-emerald-950 text-sm flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Freemium Teaser Workspace
        </h3>
        {status === "result" && (
          <Button size="sm" variant="outline" onClick={() => setStatus("idle")} className="rounded-none border-2 border-emerald-950 font-black text-xs uppercase hover:bg-emerald-100">
            Ulangi Uji Coba
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {status === "idle" && (
          <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center bg-white">
            <div 
              className="w-full max-w-2xl border-4 border-dashed border-emerald-950 p-12 hover:bg-emerald-950 hover:text-white transition-all cursor-pointer flex flex-col items-center justify-center group text-emerald-950"
              onClick={startTeaserAudit}
            >
              <Upload className="h-16 w-16 mb-6 group-hover:-translate-y-2 transition-transform" />
              <h4 className="text-2xl font-black uppercase tracking-widest mb-2 text-center">Unggah Dokumen (Gratis)</h4>
              <p className="font-bold opacity-70 text-center text-sm mb-4">PDF, DOCX (Akan dipotong otomatis max 3 halaman pertama)</p>
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
              <span className="text-xs font-black uppercase text-emerald-950/50">Atau</span>
              <Button onClick={startTeaserAudit} variant="outline" className="border-4 border-emerald-950 rounded-none h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                Gunakan Dokumen Sampel PLTS 50 kWp
              </Button>
            </div>
          </div>
        )}

        {(status === "parsing" || status === "masking" || status === "spatial" || status === "law") && (
          <div className="flex-1 p-12 flex flex-col items-center justify-center bg-emerald-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative z-10 flex flex-col items-center">
              <Loader2 className="h-20 w-20 animate-spin mb-8 text-yellow-400" />
              <h3 className="text-3xl font-black uppercase tracking-widest text-center mb-6">Analisis AI Berjalan...</h3>
              <div className="flex flex-col items-center gap-3">
                <Badge variant={status === "parsing" ? "default" : "outline"} className="border-2 border-white rounded-none font-black text-xs uppercase px-4 py-2 w-64 justify-center">1. Membaca 3 Halaman Pertama</Badge>
                <Badge variant={status === "masking" || status === "spatial" || status === "law" ? "default" : "outline"} className="border-2 border-white rounded-none font-black text-xs uppercase px-4 py-2 w-64 justify-center">2. PII Auto-Masking (UU PDP)</Badge>
                <Badge variant={status === "spatial" || status === "law" ? "default" : "outline"} className="border-2 border-white rounded-none font-black text-xs uppercase px-4 py-2 w-64 justify-center">3. Verifikasi Data Spasial</Badge>
                <Badge variant={status === "law" ? "default" : "outline"} className="border-2 border-white rounded-none font-black text-xs uppercase px-4 py-2 w-64 justify-center bg-yellow-500 text-emerald-950 border-yellow-500">4. RAG Audit Regulasi (Pasal.id)</Badge>
              </div>
            </div>
          </div>
        )}

        {status === "result" && result && (
          <div className="flex-1 flex flex-col md:flex-row min-h-[600px]">
            {/* Left Panel: Document Viewer */}
            <div className="w-full md:w-1/2 md:border-r-4 border-b-4 md:border-b-0 border-emerald-950 flex flex-col bg-white relative h-[500px] md:h-auto">
              <div className="p-4 border-b-4 border-emerald-950 font-black text-xs uppercase tracking-widest bg-emerald-50">Preview Dokumen (Hal 1-3)</div>
              <div className="flex-1 p-6 overflow-y-auto space-y-6 relative">
                <div className="p-4 border-l-4 border-emerald-950 bg-emerald-50 relative">
                  <Badge className="absolute -top-3 -right-2 bg-emerald-600 text-white rounded-none uppercase text-[10px] font-black border-2 border-emerald-900">Valid</Badge>
                  <span className="font-black text-emerald-950 uppercase text-xs">Lokasi & Teknis</span>
                  <p className="mt-2 text-sm font-medium">Data geospasial kawasan industri cocok dengan koordinat.</p>
                </div>
                <div className="p-4 border-4 border-red-600 bg-red-50 text-red-900 relative">
                  <Badge className="absolute -top-3 -right-2 bg-red-600 text-white rounded-none uppercase text-[10px] font-black border-2 border-red-900">Pelanggaran</Badge>
                  <span className="font-black uppercase text-xs">{result.topViolation?.clauseText.substring(0, 30)}...</span>
                  <p className="mt-2 text-sm font-medium">{result.topViolation?.clauseText}</p>
                </div>
                
                {/* Paywall Overlay for Pages 4+ */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-8 z-10 backdrop-blur-[2px]">
                  <div className="bg-emerald-950 text-white p-6 border-4 border-emerald-950 shadow-[6px_6px_0_rgba(2,44,34,1)] text-center max-w-sm mx-4">
                    <Lock className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                    <h4 className="font-black uppercase text-sm mb-2">Halaman 4+ Terkunci</h4>
                    <p className="text-xs font-bold text-white/80">Daftar akun gratis untuk mengaudit dokumen hingga 15 halaman secara penuh.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Freemium Results & Paywall */}
            <div className="w-full md:w-1/2 flex flex-col bg-slate-50">
              <div className="p-4 border-b-4 border-emerald-950 font-black text-xs uppercase tracking-widest bg-emerald-950 text-white flex justify-between">
                <span>Hasil Teaser (Gratis)</span>
                <span className="text-yellow-400">1 Temuan Kritis</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* Score & Spatial (Unlocked) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-4 border-emerald-950 p-4 bg-white shadow-[4px_4px_0_rgba(2,44,34,1)] text-center flex flex-col justify-center">
                    <div className="text-[10px] font-black uppercase text-emerald-950/60 mb-2">Feasibility Score</div>
                    <div className="text-4xl font-black text-emerald-950">{result.feasibilityScore}<span className="text-sm text-emerald-950/50">/100</span></div>
                  </div>
                  <div className="border-4 border-emerald-950 p-4 bg-emerald-50 shadow-[4px_4px_0_rgba(2,44,34,1)] flex flex-col justify-center">
                    <Globe className="h-6 w-6 text-emerald-950 mb-2" />
                    <div className="text-[10px] font-black uppercase text-emerald-950 mb-1">Status Lokasi</div>
                    <div className="text-xs font-bold leading-tight text-emerald-950/80">{result.spatialSummary}</div>
                  </div>
                </div>

                {/* 4 Pillars Drilldown (Limited) */}
                <div className="mt-8">
                  <h4 className="font-black uppercase text-sm text-emerald-950 mb-4 border-b-4 border-emerald-950 pb-2">Rincian Analisis (Drilldown)</h4>
                  
                  {/* Pillar 1 (Unlocked) */}
                  <div className="border-4 border-red-900 bg-white p-5 mb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-[9px] uppercase px-2 py-1 border-b-4 border-l-4 border-red-900">
                      High Risk
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-black text-sm uppercase text-red-900">1. Kepatuhan Regulasi (Legal)</span>
                    </div>
                    <div className="bg-red-900 text-white px-3 py-1.5 inline-block text-[10px] font-black mb-3 uppercase tracking-wider">
                      {result.topViolation?.matchedLaw || "UU Ketenagalistrikan"}
                    </div>
                    <p className="text-xs font-bold text-red-900/80 mb-4">{result.topViolation?.originalLawText || "Ditemukan pelanggaran kritis terkait izin usaha penyediaan tenaga listrik."}</p>
                  </div>

                  {/* Pillars 2, 3, 4 (Locked & Blurred) */}
                  <div className="relative">
                    <div className="space-y-4 filter blur-sm opacity-50 pointer-events-none select-none">
                      {/* Pillar 2 */}
                      <div className="border-4 border-emerald-950 bg-emerald-50 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-emerald-950" />
                          <span className="font-black text-sm uppercase text-emerald-950">2. Teknis & Sipil</span>
                        </div>
                        <div className="h-2 w-3/4 bg-emerald-950/20 mb-2"></div>
                        <div className="h-2 w-1/2 bg-emerald-950/20"></div>
                      </div>
                      
                      {/* Pillar 3 */}
                      <div className="border-4 border-emerald-950 bg-emerald-50 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="h-5 w-5 text-emerald-950" />
                          <span className="font-black text-sm uppercase text-emerald-950">3. Lingkungan & Spasial</span>
                        </div>
                        <div className="h-2 w-2/3 bg-emerald-950/20 mb-2"></div>
                        <div className="h-2 w-1/3 bg-emerald-950/20"></div>
                      </div>
                      
                      {/* Pillar 4 */}
                      <div className="border-4 border-emerald-950 bg-emerald-50 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="h-5 w-5 text-emerald-950" />
                          <span className="font-black text-sm uppercase text-emerald-950">4. Analisis Risiko & Mitigasi</span>
                        </div>
                        <div className="h-2 w-5/6 bg-emerald-950/20 mb-2"></div>
                        <div className="h-2 w-1/2 bg-emerald-950/20"></div>
                      </div>
                    </div>

                    {/* Paywall Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                      <div className="bg-emerald-950 text-white p-6 border-4 border-emerald-950 shadow-[8px_8px_0_rgba(250,204,21,1)] w-full max-w-sm text-center">
                        <Lock className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-lg font-black uppercase tracking-wide mb-3 leading-snug">
                          Akses Terkunci
                        </h3>
                        <p className="text-xs font-bold text-white/80 mb-6 px-2">
                          Login ke aplikasi untuk melihat Drilldown 4 Pilar secara lengkap, Draf Revisi AI, dan klaim lencana verifikasi QR SHA-256.
                        </p>
                        <Button 
                          onClick={handleRegister}
                          size="lg" 
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-emerald-950 border-4 border-emerald-950 h-12 font-black uppercase tracking-widest rounded-none hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_rgba(255,255,255,0.2)] transition-all"
                        >
                          Login / Daftar (Gratis)
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
