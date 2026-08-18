import { useState, useEffect } from "react";
import { Loader2, ShieldCheck, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'models'>('users');
  const [editingCredits, setEditingCredits] = useState<{ id: string, name: string, current: number } | null>(null);
  const [newCredits, setNewCredits] = useState<number>(0);
  const [editingRole, setEditingRole] = useState<{id: string, name: string, currentRole: string} | null>(null);
  const [newRole, setNewRole] = useState("USER");
  const [viewingHistory, setViewingHistory] = useState<{ id: string, name: string } | null>(null);
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
      toast.error("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCredits = async () => {
    if (!editingCredits) return;
    try {
      await api.adminUpdateCredits(editingCredits.id, newCredits);
      toast.success("Kredit berhasil diperbarui");
      setEditingCredits(null);
      fetchUsers();
    } catch (err) {
      toast.error("Gagal memperbarui kredit");
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      await api.adminUpdateRole(editingRole.id, newRole);
      toast.success("Role berhasil diperbarui");
      setEditingRole(null);
      fetchUsers();
    } catch (err) {
      toast.error("Gagal memperbarui role");
    }
  };

  const handleToggleBan = async (id: string, currentStatus: boolean) => {
    try {
      await api.adminToggleBan(id, !currentStatus);
      toast.success(currentStatus ? "User berhasil di-unban" : "User berhasil di-ban");
      fetchUsers();
    } catch (err) {
      toast.error("Gagal mengubah status ban");
    }
  };

  const handleViewHistory = async (user: any) => {
    setViewingHistory({ id: user.id, name: user.name });
    setLoadingHistory(true);
    try {
      const res = await api.adminGetUserHistory(user.id);
      setUserHistory(res.history || []);
    } catch (err) {
      toast.error("Gagal mengambil histori user");
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="border-4 border-emerald-950 bg-emerald-950 p-8 shadow-[8px_8px_0_rgba(2,44,34,0.3)] text-white">
        <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
          <ShieldCheck className="h-8 w-8" />
          Admin Control Center
        </h2>
        <p className="mt-2 text-white/70 font-bold text-sm">Akses sistem administratif untuk kelola konfigurasi aplikasi.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="bg-white border-4 border-emerald-950 rounded-none h-14 p-1 mb-6 flex gap-2">
          <TabsTrigger value="users" className="rounded-none h-full data-[state=active]:bg-emerald-950 data-[state=active]:text-white font-black uppercase tracking-wider text-xs px-6">Manajemen User</TabsTrigger>
          <TabsTrigger value="models" className="rounded-none h-full data-[state=active]:bg-emerald-950 data-[state=active]:text-white font-black uppercase tracking-wider text-xs px-6">Konfigurasi Model</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="border-4 border-emerald-950 bg-white p-6 shadow-[8px_8px_0_rgba(2,44,34,1)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black uppercase text-emerald-950 tracking-widest text-xl">Daftar Pengguna</h3>
            <Button variant="outline" className="border-2 border-emerald-950 rounded-none font-bold text-xs uppercase" onClick={fetchUsers}>
              Refresh Data
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-emerald-950" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-4 border-emerald-950 text-left bg-emerald-50">
                    <th className="p-4 font-black uppercase text-emerald-950 text-xs">Nama / Email</th>
                    <th className="p-4 font-black uppercase text-emerald-950 text-xs">Perusahaan</th>
                    <th className="p-4 font-black uppercase text-emerald-950 text-xs">Role</th>
                    <th className="p-4 font-black uppercase text-emerald-950 text-xs text-center">Kredit</th>
                    <th className="p-4 font-black uppercase text-emerald-950 text-xs text-center">Status</th>
                    <th className="p-4 font-black uppercase text-emerald-950 text-xs text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-emerald-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-emerald-950">{u.name}</div>
                        <div className="text-xs text-emerald-950/60 font-mono mt-1">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-emerald-900">{u.company || '-'}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={cn("rounded-none font-bold uppercase text-[10px]", u.role === 'ADMIN' ? 'border-amber-500 text-amber-600' : 'border-emerald-950 text-emerald-950')}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center justify-center bg-emerald-100 text-emerald-950 font-black h-8 px-3 rounded-md">
                          {u.creditsBalance}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge className={cn("rounded-none font-bold uppercase text-[10px]", u.isBanned ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600')}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-none border-2 border-emerald-950">
                              <MoreHorizontal className="h-4 w-4 text-emerald-950" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-none border-2 border-emerald-950 shadow-[4px_4px_0_rgba(2,44,34,1)]">
                            <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => {
                              setEditingCredits({ id: u.id, name: u.name, current: u.creditsBalance });
                              setNewCredits(u.creditsBalance);
                            }}>
                              Ubah Kredit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => {
                              setEditingRole({ id: u.id, name: u.name, currentRole: u.role });
                              setNewRole(u.role);
                            }}>
                              Ubah Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold cursor-pointer" onClick={() => handleViewHistory(u)}>
                              Lihat Histori
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-emerald-200" />
                            <DropdownMenuItem className={cn("font-bold cursor-pointer", u.isBanned ? "text-emerald-600" : "text-red-600")} onClick={() => handleToggleBan(u.id, u.isBanned)}>
                              {u.isBanned ? 'Unban User' : 'Ban User'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-emerald-950/50 font-bold">Belum ada pengguna terdaftar</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="models" className="border-4 border-emerald-950 bg-white p-6 shadow-[8px_8px_0_rgba(2,44,34,1)]">
          <h3 className="font-black uppercase text-emerald-950 tracking-widest mb-4 border-b-4 border-emerald-950 pb-2">Konfigurasi Model (LLM)</h3>
          <p className="text-sm font-bold text-emerald-950/70 mb-4">Pengaturan parameter LLM, instruksi sistem, dan threshold risiko compliance.</p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
             <p className="font-bold text-amber-800 text-sm">Fitur kustomisasi prompt dan threshold akan tersedia pada rilis mayor berikutnya.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Edit Credits */}
      <Dialog open={!!editingCredits} onOpenChange={(o: boolean) => !o && setEditingCredits(null)}>
        <DialogContent className="rounded-none border-4 border-emerald-950 shadow-[8px_8px_0_rgba(2,44,34,1)] sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-widest text-emerald-950">Ubah Kredit Pengguna</DialogTitle>
            <DialogDescription className="font-bold text-emerald-950/70">
              Menyesuaikan saldo kredit untuk {editingCredits?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label className="font-bold text-emerald-950 mb-2 block">Saldo Kredit Baru</Label>
            <Input 
              type="number" 
              value={newCredits} 
              onChange={(e) => setNewCredits(parseInt(e.target.value) || 0)}
              className="h-14 border-2 border-emerald-950 rounded-none font-black text-xl text-center"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-2 border-emerald-950 rounded-none font-bold uppercase" onClick={() => setEditingCredits(null)}>Batal</Button>
            <Button className="bg-emerald-950 text-white rounded-none font-bold uppercase" onClick={handleUpdateCredits}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Change Role */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent className="border-4 border-emerald-950 rounded-none shadow-[8px_8px_0_rgba(2,44,34,1)] p-0">
          <div className="p-6 bg-emerald-50 border-b-4 border-emerald-950">
            <DialogHeader>
              <DialogTitle className="font-black uppercase text-xl text-emerald-950">Ubah Role Pengguna</DialogTitle>
              <DialogDescription className="font-bold text-emerald-950/70">
                Tentukan hak akses untuk {editingRole?.name}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 bg-white space-y-4">
            <div className="space-y-2">
              <Label className="font-black uppercase text-xs text-emerald-950">Pilih Role</Label>
              <select
                className="flex h-10 w-full rounded-md border-2 border-emerald-950 bg-background px-3 py-2 text-sm ring-offset-background font-bold text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="REVIEWER">REVIEWER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 border-t-4 border-emerald-950 flex justify-end gap-2">
            <Button variant="outline" className="border-2 border-emerald-950 rounded-none font-bold uppercase hover:bg-emerald-100" onClick={() => setEditingRole(null)}>
              Batal
            </Button>
            <Button className="border-2 border-emerald-950 rounded-none font-bold uppercase bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleUpdateRole}>
              Simpan Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal View History */}
      <Dialog open={!!viewingHistory} onOpenChange={(o: boolean) => !o && setViewingHistory(null)}>
        <DialogContent className="rounded-none border-4 border-emerald-950 shadow-[8px_8px_0_rgba(2,44,34,1)] sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-widest text-emerald-950">Histori Audit Pengguna</DialogTitle>
            <DialogDescription className="font-bold text-emerald-950/70">
              Riwayat dokumen yang pernah dianalisis oleh {viewingHistory?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {loadingHistory ? (
               <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-950" /></div>
            ) : userHistory.length === 0 ? (
               <div className="text-center p-8 bg-emerald-50 font-bold text-emerald-950/60 border-2 border-emerald-100">
                 Pengguna ini belum pernah melakukan audit.
               </div>
            ) : (
               <div className="space-y-4">
                 {userHistory.map(h => (
                   <div key={h.id} className="border-2 border-emerald-950 p-4 bg-white flex justify-between items-center">
                     <div>
                       <div className="font-black text-emerald-950 uppercase">{h.projectName}</div>
                       <div className="text-xs font-bold text-emerald-950/60 mt-1">{new Date(h.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                     </div>
                     <Badge className={cn("rounded-none font-bold uppercase text-[10px]", 
                        h.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'
                     )}>
                       {h.status}
                     </Badge>
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
