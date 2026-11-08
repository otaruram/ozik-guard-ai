import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Terminal,
  Code2,
  Copy,
  Check,
  Play,
  Loader2,
  ShieldCheck,
  ArrowUpRight,
  Cpu,
  Key,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Spesifikasi REST API & Sandbox Pengembang : OzikSustain" },
      {
        name: "description",
        content:
          "Dokumentasi teknis dan simulator endpoint REST API OzikSustain untuk integrasi audit kepatuhan PDD ke sistem e-Procurement dan ERP.",
      },
    ],
  }),
  component: Playground,
});

const CODE_SNIPPETS = {
  curl: `curl -X POST https://ozikgrid.web.id/api/v1/audit/full-process \\
  -H "Authorization: Bearer ozk_live_98a7bc65d4e3f210" \\
  -F "projectName=PLTS_Atap_Industri_Cikarang_5MWp" \\
  -F "page_mode=full" \\
  -F "document=@/path/to/pdd_dokumen.pdf"`,
  node: `const form = new FormData();
form.append("projectName", "PLTS_Atap_Industri_Cikarang_5MWp");
form.append("page_mode", "full");
form.append("document", fileInput.files[0]);

const response = await fetch("https://ozikgrid.web.id/api/v1/audit/full-process", {
  method: "POST",
  headers: {
    Authorization: "Bearer ozk_live_98a7bc65d4e3f210",
  },
  body: form,
});

const auditResult = await response.json();
console.log("Skor Kelayakan:", auditResult.feasibilityScore);`,
  go: `req, err := http.NewRequest("POST", "https://ozikgrid.web.id/api/v1/audit/full-process", bodyBuffer)
req.Header.Set("Authorization", "Bearer ozk_live_98a7bc65d4e3f210")
req.Header.Set("Content-Type", writer.FormDataContentType())

client := &http.Client{Timeout: 60 * time.Second}
resp, err := client.Do(req)`,
} as const;

const SIMULATED_API_RESPONSE = {
  auditId: "8f4b2e10-9c3a-4d7e-b812-4901a32e991c",
  projectName: "PLTS_Atap_Industri_Cikarang_5MWp.pdf",
  feasibilityScore: 86,
  scoreLegal: 35,
  scoreTechnical: 27,
  scoreSocial: 12,
  scoreTransparency: 12,
  reviewStatus: "PENDING_REVIEW",
  piiRedactedCount: 4,
  sha256Hash: "a948904f2f0f479b8f8197694b30184b0d2ed1c1cd2a1ec0fb85d299a192a447",
  issues: [
    {
      severity: "MEDIUM_RISK",
      clauseText: "Klaim unit pengurangan emisi belum mencantumkan nomor registrasi SRN PPI.",
      matchedLaw: "Perpres No. 98 Tahun 2021 Pasal 47",
      vectorSimilarity: 0.942,
      suggestedRevision:
        "Seluruh unit reduksi emisi dari pengoperasian PLTS Atap 5 MWp wajib dicatatkan pada Sistem Registri Nasional Pengendalian Perubahan Iklim (SRN PPI).",
    },
  ],
};

function Playground() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [lang, setLang] = useState<"curl" | "node" | "go">("curl");
  const [simulating, setSimulating] = useState(false);
  const [simOutput, setSimOutput] = useState<any>(SIMULATED_API_RESPONSE);
  const [latencyMs, setLatencyMs] = useState(412);

  const endpoint = "POST https://ozikgrid.web.id/api/v1/audit/full-process";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(endpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1800);
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[lang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const runSimulation = async () => {
    setSimulating(true);
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 750));
    setLatencyMs(Math.round(performance.now() - start));
    setSimOutput({
      ...SIMULATED_API_RESPONSE,
      timestamp: new Date().toISOString(),
    });
    setSimulating(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-archival-grid text-[#091E17] pb-24">
      {/* Header Banner */}
      <div className="bg-[#071913] text-[#F6F4EE] border-b-[1.5px] border-[#091E17] py-14 md:py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#34D399]/40 bg-[#064E3B]/40 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#34D399]">
              <Terminal className="h-3.5 w-3.5" />
              SPESIFIKASI REST API // VERSI 1.4 STABLE
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              Integrasikan Mesin Adjudikasi OzikSustain ke Sistem ERP Anda
            </h1>
            <p className="text-sm sm:text-base text-[#F6F4EE]/75 max-w-2xl leading-relaxed">
              Otomatisasi penyaringan dokumen vendor pada portal e-Procurement Anda. Kirim berkas PDF melalui permintaan HTTP multipart dan terima skor kepatuhan 4 pilar, kutipan Pasal.id, serta hash SHA-256 dalam format JSON terstruktur.
            </p>
          </div>

          <div className="lg:col-span-4 border border-[#F6F4EE]/20 bg-[#0C261E] p-5 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-[#FBBF24] border-b border-[#F6F4EE]/15 pb-2">
              <span>OTENTIKASI &amp; KUOTA</span>
              <span>BEARER TOKEN</span>
            </div>
            <p className="text-[11px] text-[#F6F4EE]/80 leading-relaxed">
              Setiap pemanggilan endpoint memerlukan header <code className="text-[#34D399]">Authorization: Bearer &lt;API_KEY&gt;</code>. Anda dapat membuat kunci API langsung di halaman Pengaturan Workspace.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 text-[#FBBF24] font-bold hover:underline"
            >
              <Key className="h-3.5 w-3.5" /> Dapatkan API Key Gratis (3 Kredit) <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Endpoint Specs & Schema (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="border-[1.5px] border-[#091E17] bg-white shadow-[6px_6px_0_#091E17]">
            <div className="bg-[#091E17] text-[#F6F4EE] px-6 py-4 flex items-center justify-between font-mono text-xs">
              <span className="font-bold uppercase tracking-wider flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#FBBF24]" /> ENDPOINT UTAMA PEMROSESAN PDD
              </span>
              <span className="bg-[#34D399] text-[#091E17] px-2 py-0.5 font-bold text-[10px]">
                MULTIPART/FORM-DATA
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* URL Box */}
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4A5D54] mb-2">
                  ENDPOINT URL
                </div>
                <div className="flex items-stretch gap-2">
                  <code className="flex-1 bg-[#F6F4EE] border-[1.5px] border-[#091E17] px-4 py-3 font-mono text-xs sm:text-sm font-bold text-[#091E17] break-all flex items-center">
                    {endpoint}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-4 border-[1.5px] border-[#091E17] bg-white hover:bg-[#091E17] hover:text-[#F6F4EE] font-mono text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {copiedUrl ? <Check className="h-4 w-4 text-[#0D6E49]" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedUrl ? "Disalin" : "Salin"}</span>
                  </button>
                </div>
              </div>

              {/* Request Parameters Table */}
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4A5D54] mb-2">
                  PARAMETER FORM-DATA
                </div>
                <div className="border-[1.5px] border-[#091E17] overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F6F4EE] border-b-[1.5px] border-[#091E17] font-mono text-[11px] uppercase">
                        <th className="p-3">Field Key</th>
                        <th className="p-3">Tipe</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#091E17]/15">
                      <tr>
                        <td className="p-3 font-mono font-bold text-[#091E17]">document</td>
                        <td className="p-3 font-mono text-[#4A5D54]">File (PDF/DOCX)</td>
                        <td className="p-3 font-mono font-bold text-[#B91C1C]">WAJIB</td>
                        <td className="p-3 text-[#4A5D54]">
                          Berkas dokumen PDD atau izin lingkungan (maksimal 10 MB).
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-[#091E17]">projectName</td>
                        <td className="p-3 font-mono text-[#4A5D54]">String</td>
                        <td className="p-3 font-mono text-[#0D6E49]">OPSIONAL</td>
                        <td className="p-3 text-[#4A5D54]">
                          Nama proyek untuk dicetak pada sertifikat (default: nama berkas).
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-[#091E17]">page_mode</td>
                        <td className="p-3 font-mono text-[#4A5D54]">Enum String</td>
                        <td className="p-3 font-mono text-[#0D6E49]">OPSIONAL</td>
                        <td className="p-3 text-[#4A5D54]">
                          Pilihan cakupan: <code className="bg-[#ECE9DF] px-1">full</code>,{" "}
                          <code className="bg-[#ECE9DF] px-1">teaser</code>, atau{" "}
                          <code className="bg-[#ECE9DF] px-1">custom</code>.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Multi-Language Code Examples */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {(["curl", "node", "go"] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase border border-[#091E17] cursor-pointer ${
                          lang === l
                            ? "bg-[#091E17] text-[#F6F4EE]"
                            : "bg-[#F6F4EE] text-[#091E17] hover:bg-[#ECE9DF]"
                        }`}
                      >
                        {l === "curl" ? "cURL" : l === "node" ? "Node.js / Fetch" : "Golang"}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="font-mono text-xs font-bold text-[#0D6E49] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedCode ? "Kode Disalin" : "Salin Contoh Kode"}
                  </button>
                </div>
                <pre className="bg-[#071913] text-[#34D399] border-[1.5px] border-[#091E17] p-4 font-mono text-xs overflow-x-auto leading-relaxed">
                  {CODE_SNIPPETS[lang]}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Response Simulator (5 Cols) */}
        <div className="lg:col-span-5 border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] shadow-[8px_8px_0_#D97706]">
          <div className="px-5 py-4 border-b border-[#F6F4EE]/15 bg-[#0C261E] flex items-center justify-between">
            <div className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#FBBF24]" /> SIMULATOR PAYLOAD RESPONS JSON
            </div>
            <span className="font-mono text-[10px] bg-[#064E3B] text-[#34D399] border border-[#34D399]/40 px-2 py-0.5">
              HTTP 200 OK • {latencyMs}ms
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between bg-[#091E17] border border-[#F6F4EE]/20 p-3 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#F6F4EE]/60">SAMPEL PAYLOAD</div>
                <div className="font-bold text-white">PLTS_Atap_Industri_Cikarang_5MWp.pdf</div>
              </div>
              <button
                type="button"
                onClick={runSimulation}
                disabled={simulating}
                className="px-3.5 py-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#091E17] font-mono text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
              >
                {simulating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
                <span>Uji Request</span>
              </button>
            </div>

            <div className="bg-[#05120E] border border-[#F6F4EE]/15 p-4 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[420px]">
              <pre className="text-[#34D399]">{JSON.stringify(simOutput, null, 2)}</pre>
            </div>

            <div className="pt-2 border-t border-[#F6F4EE]/15 flex items-center justify-between font-mono text-[11px] text-[#F6F4EE]/70">
              <span>RATE LIMIT: 60 REQ/MENIT</span>
              <Link to="/audit" className="text-[#FBBF24] font-bold hover:underline">
                Buka Antarmuka Web UI &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
