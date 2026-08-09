import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Terminal, Code2, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/playground")({
  component: Playground,
});

function Playground() {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const endpoint = "POST https://oziksustain.my.id/api/v1/audit/full-process";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(endpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 text-emerald-950 font-sans selection:bg-emerald-900 selection:text-white pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 border-4 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)] mb-6">
            <BookOpen className="w-8 h-8 text-emerald-950" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-emerald-950 mb-4">
            Dokumentasi API
          </h1>
          <p className="text-emerald-950/70 font-bold text-lg max-w-2xl">
            Integrasikan verifikasi PDD hijau dan deteksi greenwashing ke dalam sistem Anda menggunakan REST API OzikSustain.
          </p>
        </div>

        <div className="bg-white border-4 border-emerald-950 shadow-[8px_8px_0_rgba(2,44,34,1)] overflow-hidden">
          <div className="bg-emerald-950 p-4 border-b-4 border-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Terminal className="h-5 w-5" />
              <span className="font-black uppercase tracking-widest text-sm">Proses Audit PDD</span>
            </div>
            <span className="bg-white text-emerald-950 text-[10px] font-black uppercase px-2 py-1">
              POST Endpoint
            </span>
          </div>
          
          <div className="p-6 md:p-8">
            <h3 className="font-black uppercase text-emerald-950 mb-3 text-sm tracking-widest border-b-2 border-emerald-950/10 pb-2">
              Endpoint URL
            </h3>
            <div className="flex items-center gap-3 mb-8">
              <code className="bg-emerald-50 px-4 py-3 font-bold text-sm text-emerald-950 border-2 border-emerald-950 border-dashed flex-1 break-all">
                {endpoint}
              </code>
              <Button onClick={handleCopy} variant="outline" className="h-[46px] rounded-none border-4 border-emerald-950 font-black uppercase shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none shrink-0">
                {copiedUrl ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <h3 className="font-black uppercase text-emerald-950 mb-3 text-sm tracking-widest border-b-2 border-emerald-950/10 pb-2">
              Header Request
            </h3>
            <div className="bg-slate-900 rounded-none border-4 border-emerald-950 p-4 mb-8 overflow-x-auto">
              <pre className="text-emerald-400 font-mono text-sm leading-relaxed">
{`Authorization: Bearer <YOUR_API_KEY>
Content-Type: multipart/form-data`}
              </pre>
            </div>

            <h3 className="font-black uppercase text-emerald-950 mb-3 text-sm tracking-widest border-b-2 border-emerald-950/10 pb-2">
              Body Request (Form-Data)
            </h3>
            <div className="overflow-x-auto mb-8 border-4 border-emerald-950 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-100 border-b-4 border-emerald-950">
                    <th className="p-3 font-black text-xs uppercase tracking-widest text-emerald-950">Key</th>
                    <th className="p-3 font-black text-xs uppercase tracking-widest text-emerald-950">Tipe</th>
                    <th className="p-3 font-black text-xs uppercase tracking-widest text-emerald-950">Wajib</th>
                    <th className="p-3 font-black text-xs uppercase tracking-widest text-emerald-950">Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-2 border-emerald-950/20">
                    <td className="p-3 font-mono text-sm font-bold">document</td>
                    <td className="p-3 text-sm font-semibold">File (PDF)</td>
                    <td className="p-3 text-sm font-black text-emerald-600">Ya</td>
                    <td className="p-3 text-sm text-emerald-950/70 font-semibold">Dokumen PDD yang akan diaudit.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm font-bold">projectName</td>
                    <td className="p-3 text-sm font-semibold">String</td>
                    <td className="p-3 text-sm font-bold text-gray-500">Tidak</td>
                    <td className="p-3 text-sm text-emerald-950/70 font-semibold">Nama kustom untuk proyek. Default: Nama file.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-black uppercase text-emerald-950 mb-3 text-sm tracking-widest border-b-2 border-emerald-950/10 pb-2 flex items-center gap-2">
              <Code2 className="h-4 w-4" /> Response (JSON)
            </h3>
            <div className="bg-slate-900 rounded-none border-4 border-emerald-950 p-4 overflow-x-auto">
              <pre className="text-emerald-400 font-mono text-sm leading-relaxed">
{`{
  "feasibilityScore": 85,
  "status": "Tinggi",
  "issues": [
    {
      "severity": "MEDIUM_RISK",
      "clauseText": "...",
      "matchedLaw": "UU LHK No. 32/2009",
      "suggestedRevision": "Pastikan amdal tersedia."
    }
  ]
}`}
              </pre>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
