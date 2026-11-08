import { useState, useEffect } from "react";
import { Loader2, ShieldCheck, MoreHorizontal, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "models">("users");
  const [editingCredits, setEditingCredits] = useState<{
    id: string;
    name: string;
    current: number;
  } | null>(null);
  const [newCredits, setNewCredits] = useState<number>(0);
  const [editingRole, setEditingRole] = useState<{
    id: string;
    name: string;
    currentRole: string;
  } | null>(null);
  const [newRole, setNewRole] = useState("USER");
  const [viewingHistory, setViewingHistory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetAllUsers();
      setUsers(res.users || []);
    } catch (err) {
      toast.error("Gagal mengambil daftar akun pengguna.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCredits = async () => {
    if (!editingCredits) return;
    try {
      await api.adminUpdateCredits(editingCredits.id, newCredits);
      toast.success("Saldo kredit berhasil diperbarui.");
      setEditingCredits(null);
      fetchUsers();
    } catch (err) {
      toast.error("Gagal memperbarui saldo kredit.");
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      await api.adminUpdateRole(editingRole.id, newRole);
      toast.success("Otoritas role pengguna diperbarui.");
      setEditingRole(null);
      fetchUsers();
    } catch (err) {
      toast.error("Gagal memperbarui role pengguna.");
    }
  };

  const handleToggleBan = async (id: string, currentStatus: boolean) => {
    try {
      await api.adminToggleBan(id, !currentStatus);
      toast.success(currentStatus ? "Akses pengguna dipulihkan." : "Akses pengguna dibekukan.");
      fetchUsers();
    } catch (err) {
      toast.error("Gagal mengubah status akses.");
    }
  };

  const handleViewHistory = async (user: any) => {
    setViewingHistory({ id: user.id, name: user.name });
    setLoadingHistory(true);
    try {
      const res = await api.adminGetUserHistory(user.id);
      setUserHistory(res.history || []);
    } catch (err) {
      toast.error("Gagal mengambil histori pengguna.");
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="border-[1.5px] border-[#091E17] bg-[#071913] p-6 md:p-8 shadow-[6px_6px_0_#D97706] text-[#F6F4EE]">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#34D399] mb-1">
          OTORITAS ADMINISTRATOR // SYSTEM GOVERNANCE
        </div>
        <h2 className="font-editorial text-2xl font-semibold text-white flex items-center gap-2.5">
          <ShieldCheck className="h-6 w-6 text-[#FBBF24]" />
          Pusat Kendali Administratif OzikSustain
        </h2>
        <p className="mt-1 text-xs text-[#F6F4EE]/75">
          Kelola alokasi kredit pengguna, otoritas reviewer pakar (HITL), dan parameter mesin AI.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="bg-white border-[1.5px] border-[#091E17] rounded-none h-12 p-1 mb-6 flex gap-1">
          <TabsTrigger
            value="users"
            className="rounded-none h-full data-[state=active]:bg-[#091E17] data-[state=active]:text-[#F6F4EE] font-mono font-bold uppercase tracking-wider text-xs px-5 cursor-pointer"
          >
            01 // Registri Pengguna
          </TabsTrigger>
          <TabsTrigger
            value="models"
            className="rounded-none h-full data-[state=active]:bg-[#091E17] data-[state=active]:text-[#F6F4EE] font-mono font-bold uppercase tracking-wider text-xs px-5 cursor-pointer"
          >
            02 // Parameter Mesin IndoBERT &amp; LLM
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="users"
          className="border-[1.5px] border-[#091E17] bg-white p-6 shadow-[6px_6px_0_#091E17]"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-editorial text-xl font-semibold text-[#091E17]">
              Daftar Akun Terdaftar
            </h3>
            <button
              type="button"
              onClick={fetchUsers}
              className="px-3.5 py-2 border-[1.5px] border-[#091E17] bg-[#F6F4EE] hover:bg-[#ECE9DF] font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Muat Ulang
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-7 w-7 animate-spin text-[#091E17]" />
            </div>
          ) : (
            <div className="overflow-x-auto border-[1.5px] border-[#091E17]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] font-mono text-xs uppercase">
                    <th className="p-4">Nama / Email</th>
                    <th className="p-4">Badan Usaha</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Saldo Kredit</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#091E17]/15 text-xs">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F6F4EE]/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#091E17]">{u.name}</div>
                        <div className="font-mono text-[11px] text-[#4A5D54] mt-0.5">{u.email}</div>
                      </td>
                      <td className="p-4 font-medium text-[#091E17]">{u.company || "-"}</td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 border font-mono font-bold uppercase text-[10px]",
                            u.role === "ADMIN"
                              ? "border-[#D97706] bg-[#FEF3C7] text-[#B45309]"
                              : "border-[#091E17] bg-[#F6F4EE] text-[#091E17]"
                          )}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-[#091E17] tabular-nums">
                        {u.creditsBalance}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={cn(
                            "px-2 py-0.5 font-mono font-bold uppercase text-[10px]",
                            u.isBanned
                              ? "bg-[#FEE2E2] text-[#B91C1C]"
                              : "bg-[#E6F4EE] text-[#0D6E49]"
                          )}
                        >
                          {u.isBanned ? "Dibekukan" : "Aktif"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="h-8 w-8 border border-[#091E17] bg-white hover:bg-[#F6F4EE] inline-flex items-center justify-center cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4 text-[#091E17]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-none border-[1.5px] border-[#091E17] shadow-[4px_4px_0_#091E17] bg-white font-mono text-xs"
                          >
                            <DropdownMenuItem
                              className="font-bold cursor-pointer"
                              onClick={() => {
                                setEditingCredits({
                                  id: u.id,
                                  name: u.name,
                                  current: u.creditsBalance,
                                });
                                setNewCredits(u.creditsBalance);
                              }}
                            >
                              Sesuaikan Saldo Kredit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="font-bold cursor-pointer"
                              onClick={() => {
                                setEditingRole({
                                  id: u.id,
                                  name: u.name,
                                  currentRole: u.role,
                                });
                                setNewRole(u.role);
                              }}
                            >
                              Ubah Otoritas Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="font-bold cursor-pointer"
                              onClick={() => handleViewHistory(u)}
                            >
                              Inspeksi Histori Audit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#091E17]/15" />
                            <DropdownMenuItem
                              className={cn(
                                "font-bold cursor-pointer",
                                u.isBanned ? "text-[#0D6E49]" : "text-[#B91C1C]"
                              )}
                              onClick={() => handleToggleBan(u.id, u.isBanned)}
                            >
                              {u.isBanned ? "Pulihkan Akses" : "Bekukan Akses"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center font-mono text-[#4A5D54]">
                        Belum terdapat pengguna terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="models"
          className="border-[1.5px] border-[#091E17] bg-white p-6 shadow-[6px_6px_0_#091E17] space-y-4"
        >
          <h3 className="font-editorial text-xl font-semibold text-[#091E17]">
            Konfigurasi Mesin Vektor IndoBERT &amp; Failover LLM
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="border border-[#091E17] bg-[#F6F4EE] p-4">
              <div className="text-[10px] text-[#4A5D54] uppercase mb-1">MODEL EMBEDDING</div>
              <div className="font-bold text-[#091E17]">IndoBERT Base (768-Dim)</div>
            </div>
            <div className="border border-[#091E17] bg-[#F6F4EE] p-4">
              <div className="text-[10px] text-[#4A5D54] uppercase mb-1">PRIMARY INFERENCE</div>
              <div className="font-bold text-[#0D6E49]">Claude 3.5 Haiku + Gemini Flash</div>
            </div>
            <div className="border border-[#091E17] bg-[#F6F4EE] p-4">
              <div className="text-[10px] text-[#4A5D54] uppercase mb-1">AMBANG BATAS LULUS</div>
              <div className="font-bold text-[#091E17]">Skor Kelayakan &ge; 75/100</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Edit Credits */}
      <Dialog open={!!editingCredits} onOpenChange={(o: boolean) => !o && setEditingCredits(null)}>
        <DialogContent className="rounded-none border-[1.5px] border-[#091E17] shadow-[8px_8px_0_#091E17] sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="font-editorial text-xl font-semibold text-[#091E17]">
              Sesuaikan Saldo Kredit
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4A5D54]">
              Mengubah alokasi kredit audit untuk {editingCredits?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="font-mono text-xs font-bold uppercase text-[#091E17] mb-2 block">
              Jumlah Kredit Baru
            </Label>
            <Input
              type="number"
              value={newCredits}
              onChange={(e) => setNewCredits(parseInt(e.target.value) || 0)}
              className="h-12 border-[1.5px] border-[#091E17] rounded-none font-mono font-bold text-lg text-center"
            />
          </div>
          <DialogFooter className="gap-2">
            <button
              type="button"
              className="px-4 py-2 border border-[#091E17] bg-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
              onClick={() => setEditingCredits(null)}
            >
              Batal
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#091E17] text-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
              onClick={handleUpdateCredits}
            >
              Simpan Kredit
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Change Role */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent className="border-[1.5px] border-[#091E17] rounded-none shadow-[8px_8px_0_#091E17] p-6 bg-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-editorial text-xl font-semibold text-[#091E17]">
              Ubah Otoritas Role
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4A5D54]">
              Tentukan hak akses untuk {editingRole?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label className="font-mono text-xs font-bold uppercase text-[#091E17]">
              Pilih Role
            </Label>
            <select
              className="flex h-11 w-full border-[1.5px] border-[#091E17] bg-[#F6F4EE] px-3 py-2 font-mono text-xs font-bold text-[#091E17]"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="USER">USER (Pemohon)</option>
              <option value="REVIEWER">REVIEWER (Pakar HITL)</option>
              <option value="ADMIN">ADMIN (Otoritas Penuh)</option>
            </select>
          </div>
          <DialogFooter className="gap-2">
            <button
              type="button"
              className="px-4 py-2 border border-[#091E17] bg-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
              onClick={() => setEditingRole(null)}
            >
              Batal
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#091E17] text-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
              onClick={handleUpdateRole}
            >
              Simpan Role
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal View History */}
      <Dialog open={!!viewingHistory} onOpenChange={(o: boolean) => !o && setViewingHistory(null)}>
        <DialogContent className="rounded-none border-[1.5px] border-[#091E17] shadow-[8px_8px_0_#091E17] sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="font-editorial text-2xl font-semibold text-[#091E17]">
              Histori Evaluasi: {viewingHistory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {loadingHistory ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#091E17]" />
              </div>
            ) : userHistory.length === 0 ? (
              <div className="text-center p-8 bg-[#F6F4EE] font-mono text-xs text-[#4A5D54] border border-[#091E17]/20">
                Pengguna ini belum memiliki rekaman audit.
              </div>
            ) : (
              <div className="space-y-3">
                {userHistory.map((h) => (
                  <div
                    key={h.id}
                    className="border border-[#091E17] p-4 bg-[#F6F4EE] flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#091E17]">{h.projectName}</div>
                      <div className="font-mono text-[11px] text-[#4A5D54] mt-0.5">
                        {new Date(h.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#091E17] text-[#F6F4EE] font-mono text-[10px] font-bold uppercase">
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
