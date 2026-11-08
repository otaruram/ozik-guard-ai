import { useState } from "react";
import { CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PaketPricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = [
    {
      code: "TIER-01 // RETAIL & UMKM",
      name: "Pay-Per-Audit",
      price: "Rp 140.000",
      usd: "Setara $9 / dokumen",
      desc: "Pembelian kredit eceran untuk UMKM tanpa ikatan langganan bulanan. Ideal saat mengikuti tender pengadaan hijau.",
      button: "Beli 1 Kredit Audit",
      active: false,
      highlight: false,
      features: [
        "1 Kredit Audit PDD Menyeluruh",
        "Sertifikat QR Kriptografi (SHA-256)",
        "Laporan PDF + Rujukan Pasal.id",
        "Kalibrasi Reviewer Pakar (HITL)",
      ],
    },
    {
      code: "TIER-02 // VENDOR MENENGAH",
      name: "SME Eco-Basic",
      price: "Rp 750.000",
      usd: "Setara $49 / bulan",
      desc: "Paket bulanan hemat dengan alokasi 10 kredit audit penuh serta akses kunci REST API standar.",
      button: "Aktifkan Paket SME",
      active: false,
      highlight: true,
      features: [
        "10 Kredit Audit Penuh / Bulan",
        "Penyensoran Otomatis UU PDP",
        "Verifikasi Spasial & Kawasan Lindung",
        "Prioritas Antrean Reviewer Pakar",
      ],
    },
    {
      code: "TIER-03 // KORPORASI & B2G",
      name: "Enterprise API",
      price: "Rp 15.500.000",
      usd: "Setara $999 / bulan",
      desc: "Integrasi sistem backend-to-backend ke ERP perusahaan atau kementerian untuk pemindaian dokumen massal.",
      button: "Ajukan Kontrak Enterprise",
      active: false,
      highlight: false,
      features: [
        "Kuota Request REST API Massal",
        "Deployment Private VPC / On-Premise",
        "Dukungan Teknis & SLA 99.9%",
        "Laporan Sertifikasi Whitelabel",
      ],
    },
  ];

  const handleConfirmPurchase = () => {
    if (!selectedPlan) return;
    toast.success(`Permintaan Aktivasi ${selectedPlan.name} Diterima`, {
      description:
        "Faktur proforma dan instruksi pembayaran B2B telah dikirimkan ke alamat email terdaftar Anda.",
    });
    setSelectedPlan(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-[#071913] text-[#F6F4EE] border-[1.5px] border-[#091E17] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[6px_6px_0_#D97706]">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#34D399] mb-1">
            STATUS ALOKASI KREDIT AKUN
          </div>
          <h3 className="font-editorial text-2xl font-semibold text-white">
            Paket Starter Aktif (Alokasi Awal 3 Kredit Audit Penuh)
          </h3>
          <p className="text-xs text-[#F6F4EE]/75 mt-1">
            Pilih paket di bawah untuk menambah kuota audit dokumen PDD atau meningkatkan batas pemanggilan REST API.
          </p>
        </div>
        <CreditCard className="h-10 w-10 text-[#FBBF24] shrink-0 hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className={cn(
              "flex flex-col justify-between p-7 border-[1.5px] border-[#091E17] relative",
              p.highlight
                ? "bg-[#091E17] text-[#F6F4EE] shadow-[8px_8px_0_#D97706]"
                : "bg-white text-[#091E17] shadow-[5px_5px_0_#091E17]"
            )}
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] mb-3">
                <span className={p.highlight ? "text-[#FBBF24]" : "text-[#0D6E49]"}>
                  {p.code}
                </span>
                {p.highlight && (
                  <span className="bg-[#FBBF24] text-[#091E17] px-2 py-0.5 font-bold uppercase">
                    REKOMENDASI
                  </span>
                )}
              </div>
              <h3 className="font-editorial text-2xl font-semibold">{p.name}</h3>
              <div className="mt-4 pb-4 border-b border-current/15 font-mono">
                <span className="text-3xl font-bold tracking-tight tabular-nums">{p.price}</span>
                <span
                  className={`block text-xs mt-1 ${
                    p.highlight ? "text-[#F6F4EE]/70" : "text-[#4A5D54]"
                  }`}
                >
                  {p.usd}
                </span>
              </div>
              <p
                className={`text-xs mt-4 mb-6 leading-relaxed ${
                  p.highlight ? "text-[#F6F4EE]/80" : "text-[#4A5D54]"
                }`}
              >
                {p.desc}
              </p>
              <ul className="mb-8 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs font-medium">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        p.highlight ? "text-[#34D399]" : "text-[#0D6E49]"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlan(p)}
              className={cn(
                "w-full py-3.5 px-5 font-mono text-xs font-bold uppercase tracking-widest border-[1.5px] transition-all cursor-pointer",
                p.highlight
                  ? "bg-[#FBBF24] text-[#091E17] border-[#FBBF24] hover:bg-[#F59E0B]"
                  : "bg-[#091E17] text-[#F6F4EE] border-[#091E17] hover:bg-[#0D6E49]"
              )}
            >
              {p.button}
            </button>
          </div>
        ))}
      </div>

      {/* Purchase / Invoice Confirmation Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={(o) => !o && setSelectedPlan(null)}>
        <DialogContent className="border-[1.5px] border-[#091E17] rounded-none shadow-[8px_8px_0_#091E17] p-0 sm:max-w-md bg-white">
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-editorial text-2xl font-semibold text-[#091E17] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#0D6E49]" />
                Konfirmasi Pemesanan Paket
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-[#4A5D54] mt-2 leading-relaxed">
                Anda memilih skema{" "}
                <strong className="text-[#091E17]">{selectedPlan?.name}</strong> (
                {selectedPlan?.price}). Sistem akan menerbitkan faktur pembayaran B2B ke email akun Anda.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="px-4 py-2.5 border-[1.5px] border-[#091E17] bg-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                className="px-5 py-2.5 border-[1.5px] border-[#091E17] bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase cursor-pointer"
              >
                Terbitkan Faktur
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
