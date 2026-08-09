import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Play, Code2, Copy, CheckCircle2, ChevronRight, Terminal, BookOpen, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/playground')({
  component: PlaygroundPage,
})

function PlaygroundPage() {
  const { user } = useAuth()
  const [apiKey, setApiKey] = useState('')
  const [pddText, setPddText] = useState('Paragraf ini memuat klaim pengurangan emisi karbon dari proyek PLTS, namun tidak terdapat bukti studi kelayakan yang memadai.')
  const [projectName, setProjectName] = useState('Sample PDD Audit')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'playground' | 'docs'>('playground')

  const handleTestAPI = async () => {
    if (!apiKey) {
      alert("Masukkan API Key terlebih dahulu. Anda bisa mendapatkannya di Dashboard > Pengaturan.")
      return
    }
    setLoading(true)
    setResponse(null)
    
    try {
      const res = await fetch(import.meta.env.DEV ? "http://localhost:10000/api/v1/audit/full-process" : "https://otaruchain.my.id/api/v1/audit/full-process", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: (() => {
          const fd = new FormData();
          fd.append('projectName', projectName);
          const blob = new Blob([pddText], { type: 'text/plain' });
          fd.append('document', blob, 'sample.txt');
          return fd;
        })()
      })
      const data = await res.json()
      setResponse({ status: res.status, data })
    } catch (err: any) {
      setResponse({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const curlCode = `curl -X POST https://otaruchain.my.id/api/v1/audit/full-process \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "projectName=My Carbon Project" \\
  -F "document=@/path/to/pdd.pdf"`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      {/* Header */}
      <header className="bg-[#0F382C] text-white p-6 border-b-4 border-[#FACC15]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
              <Terminal className="h-6 w-6 text-[#FACC15]" /> OzikSustain Developer API
            </h1>
            <p className="text-white/70 font-bold text-xs uppercase tracking-wider mt-1">Integrasi Audit Kepatuhan & AI Spasial ke Sistem Anda</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setActiveTab('playground')} variant={activeTab === 'playground' ? 'default' : 'outline'} className={`rounded-none font-black text-xs uppercase ${activeTab === 'playground' ? 'bg-[#FACC15] text-[#0F382C]' : 'border-white/30 text-white hover:bg-white/10'}`}>
              <Code2 className="h-4 w-4 mr-2" /> API Playground
            </Button>
            <Button onClick={() => setActiveTab('docs')} variant={activeTab === 'docs' ? 'default' : 'outline'} className={`rounded-none font-black text-xs uppercase ${activeTab === 'docs' ? 'bg-[#FACC15] text-[#0F382C]' : 'border-white/30 text-white hover:bg-white/10'}`}>
              <BookOpen className="h-4 w-4 mr-2" /> Dokumentasi
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-6">
        {activeTab === 'playground' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Panel */}
            <div className="bg-white border-4 border-[#0F382C] shadow-[8px_8px_0_rgba(15,56,44,1)] p-6">
              <h2 className="text-lg font-black uppercase tracking-widest text-[#0F382C] border-b-4 border-[#0F382C] pb-2 mb-6 flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-[#FACC15]" /> Request Configuration
              </h2>

              <div className="space-y-6">
                <div>
                  <Label className="text-xs font-black uppercase text-[#0F382C] mb-2 block">1. Authentication (API Key)</Label>
                  <Input 
                    placeholder="ozik_live_..." 
                    value={apiKey} 
                    onChange={e => setApiKey(e.target.value)}
                    className="border-4 border-[#0F382C] rounded-none h-12 font-mono text-sm bg-gray-50 focus-visible:ring-0 focus-visible:border-[#FACC15]"
                  />
                  <p className="text-[10px] font-bold text-gray-500 mt-2">Dapatkan API Key di Dashboard - Pengaturan.</p>
                </div>

                <div>
                  <Label className="text-xs font-black uppercase text-[#0F382C] mb-2 block">2. Project Name</Label>
                  <Input 
                    value={projectName} 
                    onChange={e => setProjectName(e.target.value)}
                    className="border-4 border-[#0F382C] rounded-none h-12 font-bold focus-visible:ring-0 focus-visible:border-[#FACC15]"
                  />
                </div>

                <div>
                  <Label className="text-xs font-black uppercase text-[#0F382C] mb-2 block">3. PDD Document Text (Simulasi)</Label>
                  <Textarea 
                    value={pddText}
                    onChange={e => setPddText(e.target.value)}
                    className="border-4 border-[#0F382C] rounded-none min-h-[150px] font-mono text-sm focus-visible:ring-0 focus-visible:border-[#FACC15]"
                  />
                </div>

                <Button 
                  onClick={handleTestAPI}
                  disabled={loading}
                  className="w-full rounded-none bg-[#FACC15] hover:bg-yellow-500 text-[#0F382C] font-black uppercase tracking-widest h-14 shadow-[4px_4px_0_rgba(15,56,44,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  {loading ? 'Memproses Audit (Menggunakan 1 Kredit)...' : <><Play className="h-5 w-5 mr-2" /> Jalankan Audit (POST /full-process)</>}
                </Button>

                <div className="bg-yellow-50 border-4 border-yellow-400 p-4 flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
                  <p className="text-[10px] font-bold text-yellow-800 leading-relaxed uppercase">Setiap hit ke endpoint ini akan memotong 1 kredit dari akun Anda. Pastikan API key Anda dijaga kerahasiaannya.</p>
                </div>
              </div>
            </div>

            {/* Response Panel */}
            <div className="bg-[#0F382C] border-4 border-[#0F382C] shadow-[8px_8px_0_rgba(15,56,44,1)] p-6 text-white flex flex-col">
              <div className="flex items-center justify-between border-b-4 border-white/20 pb-2 mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-[#FACC15]" /> API Response
                </h2>
                {response && (
                  <div className={`px-3 py-1 font-black text-xs rounded-none border-2 ${response.status === 200 ? 'bg-emerald-500 border-emerald-300' : 'bg-red-500 border-red-300'}`}>
                    HTTP {response.status || 'ERROR'}
                  </div>
                )}
              </div>

              <div className="flex-1 bg-black/50 border-2 border-white/10 p-4 overflow-auto font-mono text-[11px] leading-relaxed relative">
                {response ? (
                  <pre className="whitespace-pre-wrap text-emerald-400">{JSON.stringify(response.data || response.error, null, 2)}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/30 italic">
                    Tunggu respons API... Tekan Jalankan Audit.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-4 border-[#0F382C] shadow-[8px_8px_0_rgba(15,56,44,1)] p-8 md:p-12">
            <h2 className="text-3xl font-black uppercase tracking-widest text-[#0F382C] mb-8">Dokumentasi API</h2>
            
            <div className="prose max-w-none prose-emerald">
              <h3 className="font-black text-xl uppercase text-[#0F382C] border-b-4 border-[#FACC15] pb-2 inline-block">Authentication</h3>
              <p className="font-bold text-gray-700 mt-4 mb-4">Semua permintaan ke API OzikSustain memerlukan header <code>Authorization: Bearer &lt;API_KEY&gt;</code>.</p>
              
              <h3 className="font-black text-xl uppercase text-[#0F382C] border-b-4 border-[#FACC15] pb-2 inline-block mt-8">Endpoint Utama</h3>
              
              <div className="bg-gray-50 border-4 border-[#0F382C] p-6 mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#FACC15] text-[#0F382C] font-black px-3 py-1 text-sm uppercase">POST</span>
                  <span className="font-mono font-bold text-[#0F382C] text-lg">/api/v1/audit/full-process</span>
                </div>
                <p className="text-sm font-bold text-gray-600 mb-4">Mengeksekusi audit legalitas dan kelayakan secara menyeluruh terhadap dokumen PDD.</p>
                
                <h4 className="font-black uppercase text-xs mb-2">Request Format (multipart/form-data)</h4>
                <ul className="list-disc pl-5 text-sm font-bold text-gray-700 space-y-1 mb-6">
                  <li><code>projectName</code> (string, optional) - Nama proyek karbon.</li>
                  <li><code>document</code> (file, required) - File PDF / DOCX / TXT maksimal 10MB.</li>
                </ul>

                <h4 className="font-black uppercase text-xs mb-2">Contoh cURL</h4>
                <div className="relative">
                  <pre className="bg-[#0F382C] text-emerald-400 p-4 font-mono text-[11px] overflow-x-auto border-4 border-[#0F382C]">
                    {curlCode}
                  </pre>
                  <Button 
                    onClick={() => handleCopy(curlCode)} 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-none border border-white/30"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <h3 className="font-black text-xl uppercase text-[#0F382C] border-b-4 border-[#FACC15] pb-2 inline-block mt-10">Rate Limit & Credit</h3>
              <p className="font-bold text-gray-700 mt-4">Setiap kali Anda menembak endpoint <code>/full-process</code>, sistem akan memotong 1 kredit dari akun Anda. Batasan (Rate Limit) standar adalah 60 request per menit per IP address.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
