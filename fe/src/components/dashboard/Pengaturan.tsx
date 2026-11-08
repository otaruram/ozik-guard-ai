import { useState } from "react";
import {
  Copy,
  Loader2,
  Zap,
  AlertTriangle,
  Terminal,
  Code2,
  BookOpen,
  Play,
  Check,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [projectName, setProjectName] = useState("Audit PDD via API");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loadingPlayground, setLoadingPlayground] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiTab, setApiTab] = useState<"playground" | "docs">("playground");
  const [confirmKeyOpen, setConfirmKeyOpen] = useState(false);
  const [notifyReportDone, setNotifyReportDone] = useState(dbUser?.notifyReportDone ?? true);
  const [notifyRegulation, setNotifyRegulation] = useState(dbUser?.notifyRegulation ?? true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const userEmail = user?.email || "";

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    try {
      await api.updateNotifications({ notifyReportDone, notifyRegulation });
      toast.success("Preferensi notifikasi berhasil disimpan.");
      refreshUser();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan preferensi.");
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleTestAPI = async () => {
    if (!dbUser?.apiKey) {
      toast.error("Buat Kunci API terlebih dahulu pada panel di atas.");
      return;
    }
    if (!pddFile) {
      toast.error("Silakan pilih berkas dokumen PDD terlebih dahulu.");
      return;
    }
    setLoadingPlayground(true);
    setApiResponse(null);

    try {
      const res = await fetch(
        import.meta.env.DEV
          ? "http://localhost:10000/api/v1/audit/full-process"
          : "https://ozikgrid.web.id/api/v1/audit/full-process",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${dbUser.apiKey}`,
          },
          body: (() => {
            const fd = new FormData();
            fd.append("projectName", projectName);
            fd.append("document", pddFile);
            return fd;
          })(),
        }
      );
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
      refreshUser();
    }
  };

  const curlCode = `curl -X POST https://ozikgrid.web.id/api/v1/audit/full-process \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "projectName=Proyek PLTS Nusantara" \\
  -F "document=@/path/to/pdd.pdf"`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-white border-[1.5px] border-[#091E17] h-auto sm:h-13 p-1 rounded-none shadow-[4px_4px_0_#091E17] mb-8 flex flex-col sm:flex-row w-full gap-1">
          {[
            { val: "account", label: "01 // Otorisasi Google" },
            { val: "notifications", label: "02 // Notifikasi Regulasi" },
            { val: "api", label: "03 // Kunci REST API & Sandbox" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.val}
              value={tab.val}
              className="w-full sm:flex-1 rounded-none data-[state=active]:bg-[#091E17] data-[state=active]:text-[#F6F4EE] font-mono font-bold uppercase tracking-wider text-xs h-10 sm:h-full cursor-pointer"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value="account"
          className="border-[1.5px] border-[#091E17] bg-white p-4 sm:p-6 md:p-8 shadow-[4px_4px_0_#091E17] sm:shadow-[6px_6px_0_#091E17]"
        >
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0D6E49] mb-1">
            KEAMANAN IDENTITAS
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#091E17] mb-5 sm:mb-6 break-words">
            Akun OAuth 2.0 Terhubung
          </h3>

          <div className="border-[1.5px] border-[#091E17] bg-[#F6F4EE] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center bg-white border border-[#091E17] shrink-0">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#0D6E49]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono font-bold text-[#091E17] text-xs sm:text-sm truncate">
                {userEmail}
              </div>
              <div className="text-xs text-[#4A5D54] mt-0.5">
                Otentikasi terverifikasi melalui Google OAuth 2.0. Tidak ada kata sandi yang disimpan di server.
              </div>
            </div>
            <span className="bg-[#091E17] text-[#34D399] font-mono font-bold uppercase text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 shrink-0">
              AKTIF
            </span>
          </div>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="border-[1.5px] border-[#091E17] bg-white p-4 sm:p-6 md:p-8 shadow-[4px_4px_0_#091E17] sm:shadow-[6px_6px_0_#091E17]"
        >
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0D6E49] mb-1">
            PREFERENSI KOMUNIKASI
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#091E17] mb-5 sm:mb-6 break-words">
            Pemberitahuan Laporan &amp; Pembaruan Hukum
          </h3>

          <div className="space-y-4 sm:space-y-5">
            <label className="flex items-start gap-3.5 cursor-pointer p-3.5 sm:p-4 border border-[#091E17]/20 bg-[#F6F4EE]/50">
              <Checkbox
                className="mt-0.5 border-[1.5px] border-[#091E17] rounded-none h-5 w-5 data-[state=checked]:bg-[#091E17] data-[state=checked]:text-white shrink-0"
                checked={notifyReportDone}
                onCheckedChange={(c) => setNotifyReportDone(c as boolean)}
              />
              <div>
                <div className="font-mono font-bold text-[#091E17] uppercase text-xs">
                  Notifikasi Penyelesaian Adjudikasi
                </div>
                <div className="text-xs text-[#4A5D54] mt-1">
                  Kirim surat elektronik setiap kali tinjauan pakar (HITL) atas dokumen PDD selesai.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3.5 cursor-pointer p-3.5 sm:p-4 border border-[#091E17]/20 bg-[#F6F4EE]/50">
              <Checkbox
                className="mt-0.5 border-[1.5px] border-[#091E17] rounded-none h-5 w-5 data-[state=checked]:bg-[#091E17] data-[state=checked]:text-white shrink-0"
                checked={notifyRegulation}
                onCheckedChange={(c) => setNotifyRegulation(c as boolean)}
              />
              <div>
                <div className="font-mono font-bold text-[#091E17] uppercase text-xs">
                  Peringatan Amandemen Regulasi ESDM &amp; LHK
                </div>
                <div className="text-xs text-[#4A5D54] mt-1">
                  Terima pembaruan apabila terdapat perubahan pasal pada indeks Pasal.id.
                </div>
              </div>
            </label>

            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={isSavingPrefs}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-wider sm:tracking-widest cursor-pointer inline-flex items-center gap-2"
            >
              {isSavingPrefs && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isSavingPrefs ? "Menyimpan..." : "Simpan Preferensi"}</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent
          value="api"
          className="border-[1.5px] border-[#091E17] bg-white p-4 sm:p-6 md:p-8 shadow-[4px_4px_0_#091E17] sm:shadow-[6px_6px_0_#091E17]"
        >
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0D6E49] mb-1">
            INTEGRASI SISTEM EKSTERNAL
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#091E17] mb-5 sm:mb-6 break-words">
            Manajemen Kunci REST API
          </h3>

          <div className="bg-[#F6F4EE] border-[1.5px] border-[#091E17] p-5 mb-8 space-y-4">
            <Label className="font-mono text-xs font-bold uppercase text-[#091E17] block">
              Kunci API Produksi Aktif (Bearer Token)
            </Label>
            <div className="flex gap-2">
              <Input
                type="password"
                readOnly
                value={dbUser?.apiKey || ""}
                placeholder="Belum ada kunci API aktif. Klik tombol Buat Kunci Baru di bawah."
                className="h-11 border-[1.5px] border-[#091E17] rounded-none bg-white text-[#091E17] font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (dbUser?.apiKey) {
                    navigator.clipboard.writeText(dbUser.apiKey);
                    toast.success("Kunci API disalin ke papan klip.");
                  }
                }}
                className="h-11 px-4 border-[1.5px] border-[#091E17] bg-white hover:bg-[#091E17] hover:text-[#F6F4EE] font-mono text-xs font-bold uppercase transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <Copy className="h-4 w-4" /> Salin
              </button>
            </div>
            <div>
              <button
                type="button"
                disabled={loadingKey}
                onClick={() => setConfirmKeyOpen(true)}
                className="px-4 py-2.5 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
              >
                {loadingKey ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5 text-[#FBBF24]" />
                )}
                <span>{loadingKey ? "Memproses..." : "Buat / Rotasi Kunci API Baru"}</span>
              </button>
            </div>
          </div>

          <Dialog open={confirmKeyOpen} onOpenChange={setConfirmKeyOpen}>
            <DialogContent className="border-[1.5px] border-[#091E17] rounded-none shadow-[8px_8px_0_#091E17] p-0 sm:max-w-md bg-white">
              <div className="p-6 sm:p-8">
                <DialogHeader>
                  <DialogTitle className="font-editorial text-2xl font-semibold text-[#091E17] flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#D97706]" />
                    Rotasi Kunci REST API
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-[#4A5D54] mt-2 leading-relaxed">
                    Kunci API yang lama akan langsung dinonaktifkan dan tidak dapat digunakan lagi oleh sistem eksternal Anda.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmKeyOpen(false)}
                    className="px-4 py-2.5 border-[1.5px] border-[#091E17] bg-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setLoadingKey(true);
                      setConfirmKeyOpen(false);
                      try {
                        await api.regenerateApiKey();
                        refreshUser();
                        toast.success("Kunci API baru berhasil diterbitkan.");
                      } catch (e) {
                        toast.error("Gagal menerbitkan kunci API.");
                      }
                      setLoadingKey(false);
                    }}
                    className="px-4 py-2.5 border-[1.5px] border-[#091E17] bg-[#091E17] text-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Ya, Terbitkan Kunci Baru
                  </button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          {/* Developer API Sandbox */}
          <div className="border-t-[1.5px] border-[#091E17] pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h4 className="font-editorial text-xl font-semibold text-[#091E17] flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-[#0D6E49]" /> Pengujian Endpoint Langsung
                </h4>
                <p className="font-mono text-xs text-[#4A5D54] mt-0.5">
                  Sisa Saldo Kredit: <strong>{dbUser?.creditsBalance ?? 0} KREDIT</strong>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setApiTab("playground")}
                  className={cn(
                    "px-3.5 py-2 font-mono text-xs font-bold uppercase border border-[#091E17] cursor-pointer flex items-center gap-1.5",
                    apiTab === "playground"
                      ? "bg-[#091E17] text-[#F6F4EE]"
                      : "bg-[#F6F4EE] text-[#091E17]"
                  )}
                >
                  <Code2 className="h-3.5 w-3.5" /> Uji Produksi
                </button>
                <button
                  type="button"
                  onClick={() => setApiTab("docs")}
                  className={cn(
                    "px-3.5 py-2 font-mono text-xs font-bold uppercase border border-[#091E17] cursor-pointer flex items-center gap-1.5",
                    apiTab === "docs"
                      ? "bg-[#091E17] text-[#F6F4EE]"
                      : "bg-[#F6F4EE] text-[#091E17]"
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5" /> Spesifikasi cURL
                </button>
              </div>
            </div>

            {apiTab === "playground" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border-[1.5px] border-[#091E17] bg-[#F6F4EE] p-5 space-y-4">
                  <div className="font-mono text-xs font-bold uppercase text-[#091E17] border-b border-[#091E17]/15 pb-2">
                    KONFIGURASI PERMINTAAN HTTP
                  </div>
                  <div>
                    <Label className="font-mono text-xs font-bold uppercase text-[#091E17] mb-1.5 block">
                      1. Nama Proyek
                    </Label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="border-[1.5px] border-[#091E17] bg-white rounded-none h-11 font-medium"
                    />
                  </div>
                  <div>
                    <Label className="font-mono text-xs font-bold uppercase text-[#091E17] mb-1.5 block">
                      2. Berkas PDD (PDF)
                    </Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPddFile(e.target.files?.[0] || null)}
                      className="border-[1.5px] border-[#091E17] bg-white rounded-none h-11 font-mono text-xs file:bg-[#091E17] file:text-white file:border-0 file:mr-3 file:h-full file:px-3 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleTestAPI}
                    disabled={loadingPlayground}
                    className="w-full py-3 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loadingPlayground ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 fill-current text-[#FBBF24]" />
                    )}
                    <span>Kirim Request ke Endpoint</span>
                  </button>
                </div>

                <div className="border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] p-5 flex flex-col">
                  <div className="flex items-center justify-between border-b border-[#F6F4EE]/15 pb-2 mb-4 font-mono text-xs">
                    <span className="text-[#FBBF24] font-bold uppercase">RESPONS JSON</span>
                    {apiResponse && (
                      <span className="px-2 py-0.5 bg-[#064E3B] text-[#34D399] text-[10px]">
                        HTTP {apiResponse.status || "ERR"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 bg-[#05120E] border border-[#F6F4EE]/15 p-3 font-mono text-[11px] overflow-auto min-h-[220px] max-h-[260px]">
                    {apiResponse ? (
                      <pre className="whitespace-pre-wrap text-[#34D399]">
                        {JSON.stringify(apiResponse.data || apiResponse.error, null, 2)}
                      </pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[#F6F4EE]/40">
                        Menunggu eksekusi permintaan...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] p-6 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#FBBF24] font-bold">CONTOH PERMINTAAN CURL</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(curlCode)}
                    className="text-[#34D399] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Disalin" : "Salin Perintah"}
                  </button>
                </div>
                <pre className="bg-[#05120E] border border-[#F6F4EE]/15 p-4 font-mono text-xs text-[#34D399] overflow-x-auto">
                  {curlCode}
                </pre>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
