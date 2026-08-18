import { useState } from "react";
import { Copy, Loader2, Zap, AlertTriangle, Terminal, Code2, BookOpen, Play, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuditWorkspace } from "@/components/AuditWorkspace";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PengaturanProps {
  dbUser: any;
  refreshUser: () => void;
}

export function Pengaturan({ dbUser, refreshUser }: PengaturanProps) {
  const { user } = useAuth();
  const [loadingKey, setLoadingKey] = useState(false);
  const [pddFile, setPddFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('Sample PDD Audit');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loadingPlayground, setLoadingPlayground] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiTab, setApiTab] = useState<'playground' | 'docs'>('playground');
  const [confirmKeyOpen, setConfirmKeyOpen] = useState(false);
  const [notifyReportDone, setNotifyReportDone] = useState(dbUser?.notifyReportDone ?? true);
  const [notifyRegulation, setNotifyRegulation] = useState(dbUser?.notifyRegulation ?? true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const userEmail = user?.email || "";
  const userAvatar = user?.user_metadata?.avatar_url;

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    try {
      await api.updateNotifications({ notifyReportDone, notifyRegulation });
      toast.success("Preferensi notifikasi berhasil disimpan!");
      refreshUser();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan preferensi");
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleTestAPI = async () => {
    if (!dbUser?.apiKey) {
      toast.error("Buat API Key terlebih dahulu di atas.");
      return;
    }
    if (!pddFile) {
      toast.error("Silakan unggah dokumen PDD terlebih dahulu.");
      return;
    }
    setLoadingPlayground(true);
    setApiResponse(null);
    
    try {
      const res = await fetch(import.meta.env.DEV ? "http://localhost:10000/api/v1/audit/full-process" : "https://ozikgrid.web.id/api/v1/audit/full-process", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${dbUser.apiKey}`,
        },
        body: (() => {
          const fd = new FormData();
          fd.append('projectName', projectName);
          fd.append('document', pddFile);
          return fd;
        })()
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      setApiResponse({ status: res.status, data });
    } catch (err: any) {
      setApiResponse({ error: err.message });
    } finally {
      setLoadingPlayground(false);
      refreshUser(); // refresh credits
    }
  };

  const curlCode = `curl -X POST https://ozikgrid.web.id/api/v1/audit/full-process \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "projectName=My Carbon Project" \\
  -F "document=@/path/to/pdd.pdf"`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-white border-4 border-emerald-950 h-auto sm:h-16 p-1 rounded-none shadow-[6px_6px_0_rgba(2,44,34,1)] mb-8 flex flex-col sm:flex-row w-full gap-1 sm:gap-0">
          {["account", "notifications", "api"].map((val, idx) => (
            <TabsTrigger 
              key={val} 
              value={val}
              className="w-full sm:flex-1 rounded-none data-[state=active]:bg-emerald-950 data-[state=active]:text-white font-black uppercase tracking-widest text-xs h-12 sm:h-full"
            >
              {idx === 0 ? "Akun Google" : idx === 1 ? "Notifikasi" : "Kunci API"}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="account" className="border-4 border-emerald-950 bg-white p-6 sm:p-8 shadow-[8px_8px_0_rgba(2,44,34,1)]">
          <h3 className="text-xl font-black uppercase text-emerald-950 mb-6">Akun Google Terhubung</h3>
          <div className="border-4 border-emerald-950 bg-emerald-50 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="grid h-16 w-16 place-items-center bg-white border-4 border-emerald-950 shrink-0">
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.58v2.98h3.86c2.26-2.09 3.58-5.17 3.58-8.8z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.86-2.98c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 000 12c0 1.94.47 3.77 1.29 5.38l3.98-3.09z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
              </svg>
            </div>
            <div className="flex-1 w-full truncate">
              <div className="font-black text-emerald-950 text-sm uppercase truncate">{userEmail}</div>
              <div className="text-xs font-bold text-emerald-950/60 mt-1 whitespace-normal">Autentikasi via Google OAuth 2.0 — Tidak ada kata sandi yang disimpan.</div>
            </div>
            <Badge className="sm:ml-auto mt-2 sm:mt-0 bg-emerald-950 text-white font-black uppercase text-[10px] rounded-none px-3 py-1 shrink-0">Terhubung</Badge>
          </div>
          <p className="mt-6 text-xs font-bold text-emerald-950/50">
            Untuk mengubah email atau menghapus akun, silakan kelola melalui pengaturan akun Google Anda.
          </p>
        </TabsContent>

        <TabsContent value="notifications" className="border-4 border-emerald-950 bg-white p-8 shadow-[8px_8px_0_rgba(2,44,34,1)]">
          <h3 className="text-xl font-black uppercase text-emerald-950 mb-6">Preferensi Notifikasi</h3>
          <div className="space-y-6">
            <label className="flex items-start gap-4 cursor-pointer group">
              <Checkbox 
                className="mt-1 border-4 border-emerald-950 rounded-none h-6 w-6 data-[state=checked]:bg-emerald-950 data-[state=checked]:text-white" 
                checked={notifyReportDone}
                onCheckedChange={(c) => setNotifyReportDone(c as boolean)}
              />
              <div>
                <div className="font-black text-emerald-950 uppercase text-sm">Email Laporan Selesai</div>
                <div className="text-xs font-bold text-emerald-950/60 mt-1">Kirim email setiap kali dual-track audit PDD selesai.</div>
              </div>
            </label>
            <label className="flex items-start gap-4 cursor-pointer group">
              <Checkbox 
                className="mt-1 border-4 border-emerald-950 rounded-none h-6 w-6 data-[state=checked]:bg-emerald-950 data-[state=checked]:text-white" 
                checked={notifyRegulation}
                onCheckedChange={(c) => setNotifyRegulation(c as boolean)}
              />
              <div>
                <div className="font-black text-emerald-950 uppercase text-sm">Peringatan Regulasi ESDM</div>
                <div className="text-xs font-bold text-emerald-950/60 mt-1">Kirim pemberitahuan jika ada perubahan aturan di Pasal.id.</div>
              </div>
            </label>
            <Button 
              className="h-12 bg-emerald-950 text-white rounded-none border-2 border-emerald-950 font-black uppercase mt-4"
              onClick={handleSavePreferences}
              disabled={isSavingPrefs}
            >
              {isSavingPrefs ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
              ) : "Simpan Preferensi"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="api" className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-emerald-100">
          <h3 className="text-lg sm:text-xl font-bold text-emerald-950 mb-4 sm:mb-6">Manajemen Kunci API</h3>
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden">
            <Label className="text-sm font-semibold text-emerald-900 mb-3 block">Live API Key</Label>
            <div className="flex flex-row gap-2 sm:gap-3">
              <Input type="password" readOnly value={dbUser?.apiKey || ""} placeholder="Belum ada kunci API. Silakan buat (Regenerate)." className="h-12 border-emerald-200 rounded-lg font-medium bg-white text-emerald-950 font-mono focus-visible:ring-emerald-500" />
              <Button size="icon" variant="outline" onClick={() => {
                if (dbUser?.apiKey) {
                  navigator.clipboard.writeText(dbUser.apiKey);
                  toast.success("API Key disalin ke clipboard!");
                }
              }} className="h-12 w-12 shrink-0 border-emerald-200 rounded-lg hover:bg-emerald-100 hover:text-emerald-900">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="sm" disabled={loadingKey} onClick={() => setConfirmKeyOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold h-10 px-4 w-full sm:w-auto shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all border-2 border-emerald-950">
                {loadingKey ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />} 
                {loadingKey ? "Memproses..." : "Generate Key Baru"}
              </Button>
            </div>
          </div>

          <Dialog open={confirmKeyOpen} onOpenChange={setConfirmKeyOpen}>
            <DialogContent className="border-4 border-emerald-950 rounded-none shadow-[12px_12px_0_rgba(2,44,34,1)] p-0 gap-0 sm:max-w-md bg-white">
              <div className="p-8">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black uppercase tracking-wide text-emerald-950 flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    Konfirmasi Regenerate API
                  </DialogTitle>
                  <DialogDescription className="text-emerald-950/70 font-bold mt-2 text-sm leading-relaxed">
                    Apakah Anda yakin ingin mengganti kunci API lama? 
                    <span className="block mt-2 font-black text-emerald-950">Kunci yang lama akan langsung hangus dan tidak dapat digunakan lagi.</span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-8 gap-3 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmKeyOpen(false)}
                    className="rounded-none border-4 border-emerald-950 font-black uppercase tracking-widest text-emerald-950 hover:bg-emerald-50 h-12"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={async () => {
                      setLoadingKey(true);
                      setConfirmKeyOpen(false);
                      try {
                        await api.regenerateApiKey();
                        refreshUser();
                        toast.success("Kunci API baru berhasil dibuat!");
                      } catch(e) {
                        toast.error("Gagal membuat kunci API");
                      }
                      setLoadingKey(false);
                    }}
                    className="rounded-none border-4 border-emerald-950 bg-emerald-950 hover:bg-emerald-900 text-white font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(16,185,129,0.3)] h-12"
                  >
                    Ya, Ganti Key
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-3 mb-10">
            <div className="flex justify-between items-center text-xs font-black uppercase text-emerald-950">
              <span>Sisa Saldo Kredit API</span>
              <span>{dbUser?.creditsBalance ?? 0} KREDIT</span>
            </div>
            <div className="h-4 w-full bg-emerald-100 border-2 border-emerald-950 overflow-hidden">
              <div className="h-full bg-emerald-950 transition-all duration-500" style={{ width: `${Math.min(((dbUser?.creditsBalance ?? 0) / 1000) * 100, 100)}%` }}></div>
            </div>
          </div>

          <div className="border-t-4 border-emerald-950 pt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-emerald-950">
                  <Terminal className="h-6 w-6 text-emerald-600" /> Developer API
                </h3>
                <p className="text-emerald-950/70 font-bold text-xs uppercase tracking-wider mt-1">Integrasi Audit Kepatuhan & AI Spasial ke Sistem Anda</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setApiTab('playground')} variant={apiTab === 'playground' ? 'default' : 'outline'} className={cn("rounded-none font-black text-xs uppercase border-2", apiTab === 'playground' ? 'bg-emerald-950 text-white border-emerald-950' : 'border-emerald-950 text-emerald-950 hover:bg-emerald-50')}>
                  <Code2 className="h-4 w-4 mr-2" /> Production Test
                </Button>
                <Button onClick={() => setApiTab('docs')} variant={apiTab === 'docs' ? 'default' : 'outline'} className={cn("rounded-none font-black text-xs uppercase border-2", apiTab === 'docs' ? 'bg-emerald-950 text-white border-emerald-950' : 'border-emerald-950 text-emerald-950 hover:bg-emerald-50')}>
                  <BookOpen className="h-4 w-4 mr-2" /> Dokumen
                </Button>
              </div>
            </div>

            {apiTab === 'playground' ? (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Request Panel */}
                  <div className="bg-white border-4 border-emerald-950 shadow-[6px_6px_0_rgba(2,44,34,1)] p-6">
                    <h2 className="text-sm font-black uppercase tracking-widest text-emerald-950 border-b-4 border-emerald-950 pb-2 mb-6 flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-emerald-600" /> Request Configuration
                    </h2>
  
                    <div className="space-y-6">
                      <div>
                        <Label className="text-xs font-black uppercase text-emerald-950 mb-2 block">1. Project Name</Label>
                        <Input 
                          value={projectName} 
                          onChange={e => setProjectName(e.target.value)}
                          className="border-4 border-emerald-950 rounded-none h-12 font-bold focus-visible:ring-0"
                        />
                      </div>
  
                      <div>
                        <Label className="text-xs font-black uppercase text-emerald-950 mb-2 block">2. PDD Document (PDF)</Label>
                        <Input 
                          type="file"
                          accept=".pdf"
                          onChange={e => setPddFile(e.target.files?.[0] || null)}
                          className="border-4 border-emerald-950 rounded-none h-12 font-bold focus-visible:ring-0 file:bg-emerald-950 file:text-white file:border-0 file:mr-4 file:h-full file:px-4 cursor-pointer"
                        />
                      </div>
  
                      <Button 
                        onClick={handleTestAPI}
                        disabled={loadingPlayground}
                        className="w-14 rounded-none bg-yellow-400 hover:bg-yellow-500 text-emerald-950 border-4 border-emerald-950 font-black uppercase tracking-widest h-14 shadow-[4px_4px_0_rgba(2,44,34,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all mx-auto block"
                        title="Jalankan Audit"
                      >
                        {loadingPlayground ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : <Play className="h-6 w-6 fill-emerald-950 mx-auto" />}
                      </Button>
  
                      <div className="bg-yellow-50 border-4 border-yellow-400 p-4 flex gap-3 items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
                        <p className="text-[10px] font-bold text-yellow-800 leading-relaxed uppercase">Setiap hit ke endpoint ini akan memotong 1 kredit dari akun Anda. Pastikan API key Anda dijaga kerahasiaannya.</p>
                      </div>
                    </div>
                  </div>
  
                  {/* Response Panel */}
                  <div className="bg-emerald-950 border-4 border-emerald-950 shadow-[6px_6px_0_rgba(2,44,34,1)] p-6 text-white flex flex-col">
                    <div className="flex items-center justify-between border-b-4 border-white/20 pb-2 mb-6">
                      <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-yellow-400" /> API Response
                      </h2>
                      {apiResponse && (
                        <div className={cn("px-3 py-1 font-black text-xs rounded-none border-2", apiResponse.status === 200 ? 'bg-emerald-500 border-emerald-300' : 'bg-red-500 border-red-300')}>
                          HTTP {apiResponse.status || 'ERROR'}
                        </div>
                      )}
                    </div>
  
                    <div className="flex-1 bg-black/50 border-2 border-white/10 p-4 overflow-auto font-mono text-[11px] leading-relaxed relative min-h-[300px] max-h-[300px]">
                      {apiResponse ? (
                        <pre className="whitespace-pre-wrap text-emerald-400">{JSON.stringify(apiResponse.data || apiResponse.error, null, 2)}</pre>
                      ) : (
                        <div className="h-full flex items-center justify-center text-white/30 italic">
                          Tunggu respons API... Tekan Jalankan Audit.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {apiResponse && apiResponse.status === 200 && apiResponse.data && (
                  <div className="bg-white border-4 border-emerald-950 shadow-[6px_6px_0_rgba(2,44,34,1)] h-[800px] overflow-hidden">
                    <AuditWorkspace 
                      isFreemium={false} 
                      userName={user?.user_metadata?.full_name || "Author"} 
                      userEmail={userEmail} 
                      initialResult={{
                        id: apiResponse.data.auditId,
                        projectName: projectName,
                        feasibilityScore: apiResponse.data.feasibilityScore,
                        scoreLegal: apiResponse.data.scoreLegal,
                        scoreTechnical: apiResponse.data.scoreTechnical,
                        scoreSocial: apiResponse.data.scoreSocial,
                        scoreTransparency: apiResponse.data.scoreTransparency,
                        parsedDocumentJson: apiResponse.data.parsedDocumentJson,
                        issues: apiResponse.data.issues || [],
                        totalPages: apiResponse.data.totalPages,
                        totalWords: apiResponse.data.totalWords,
                        totalSentences: apiResponse.data.totalSentences,
                        hash: apiResponse.data.sha256Hash
                      }} 
                      initialStatus="result" 
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50 border-4 border-emerald-950 shadow-[6px_6px_0_rgba(2,44,34,1)] p-8">
                <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-950 mb-8">Dokumentasi API</h2>
                
                <div className="prose max-w-none prose-emerald">
                  <h3 className="font-black text-lg uppercase text-emerald-950 border-b-4 border-emerald-950 pb-2 inline-block">Authentication</h3>
                  <p className="font-bold text-emerald-950/80 mt-4 mb-4 text-sm">Semua permintaan ke API OzikSustain memerlukan header <code>Authorization: Bearer &lt;API_KEY&gt;</code>.</p>
                  
                  <h3 className="font-black text-lg uppercase text-emerald-950 border-b-4 border-emerald-950 pb-2 inline-block mt-8">Endpoint Utama</h3>
                  
                  <div className="bg-white border-4 border-emerald-950 p-6 mt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-yellow-400 border-2 border-emerald-950 text-emerald-950 font-black px-3 py-1 text-sm uppercase">POST</span>
                      <span className="font-mono font-bold text-emerald-950 text-sm sm:text-base">/api/v1/audit/full-process</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-950/70 mb-4">Mengeksekusi audit legalitas dan kelayakan secara menyeluruh terhadap dokumen PDD.</p>
                    
                    <h4 className="font-black uppercase text-xs mb-2 text-emerald-950">Request Format (multipart/form-data)</h4>
                    <ul className="list-disc pl-5 text-sm font-bold text-emerald-950/80 space-y-1 mb-6">
                      <li><code>projectName</code> (string, optional) - Nama proyek karbon.</li>
                      <li><code>document</code> (file, required) - File PDF / DOCX / TXT maksimal 10MB.</li>
                    </ul>

                    <h4 className="font-black uppercase text-xs mb-2 text-emerald-950">Contoh cURL</h4>
                    <div className="relative">
                      <pre className="bg-emerald-950 text-emerald-400 p-4 font-mono text-[11px] overflow-x-auto border-4 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)]">
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
                  
                  <h3 className="font-black text-lg uppercase text-emerald-950 border-b-4 border-emerald-950 pb-2 inline-block mt-10">Rate Limit & Credit</h3>
                  <p className="font-bold text-emerald-950/80 mt-4 text-sm">Setiap kali Anda menembak endpoint <code>/full-process</code>, sistem akan memotong 1 kredit dari akun Anda. Batasan (Rate Limit) standar adalah 60 request per menit per IP address.</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
