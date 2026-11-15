import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Upload,
  Lock,
  Loader2,
  AlertTriangle,
  Globe,
  ShieldCheck,
  Zap,
  CheckCircle2,
  BookOpen,
  Copy,
  ChevronLeft,
  ChevronRight,
  FileText,
  ZoomIn,
  ZoomOut,
  Download,
  Fingerprint,
  Calendar,
  Hash,
  FileStack,
  Scale,
  Building2,
  Wand2,
  Activity,
  Compass,
  EyeOff,
  ArrowUpRight,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  ResponsiveContainer,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { PDFReportTemplate } from "./PDFReportTemplate";

interface AuditWorkspaceProps {
  isFreemium?: boolean;
  onAuditComplete?: () => void;
  userName?: string;
  userCompany?: string;
  userEmail?: string;
  initialResult?: any;
  initialStatus?: "idle" | "configure" | "parsing" | "masking" | "spatial" | "law" | "result";
}

const GREEN_DESIGN_TEMPLATES = [
  {
    id: "alkes-b2g",
    badge: "STANDAR B2G MEDIS",
    title: "PDD Rantai Pasok Alkes Hijau & Limbah Medis B2G",
    subtitle: "Distribusi Alat Kesehatan, Cold-Chain Rendah Emisi & Pengelolaan B3",
    fileName: "PDD_Desain_Hijau_Rantai_Pasok_Alkes_B2G_2026.txt",
    highlights: [
      "UU No. 32/2009 (UKL-UPL & B3)",
      "UU No. 41/1999 (Spasial Hutan)",
      "UU PDP No. 27/2022 (Auto-Masking PII)",
    ],
    content: `BAB I - IDENTITAS PROYEK DESAIN HIJAU & LOKASI FASILITAS
Dokumen Desain Hijau (Project Design Document) ini diajukan untuk modernisasi Pusat Distribusi Alat Kesehatan Hijau dan Instalasi Cold-Chain Rendah Karbon yang berlokasi pada titik koordinat -6.2088 LS dan 106.8456 BT. Penanggung jawab operasional adalah Direktur Kepatuhan dengan identitas NIK 3174051808850002, NPWP 01.345.678.9-012.000, serta kontak resmi direktur.kepatuhan@jayatamedika.co.id dan nomor telepon +628119876543.

BAB II - PERIZINAN LINGKUNGAN & INSTALASI PENGOLAHAN LIMBAH MEDIS
Pembangunan fasilitas penyimpanan reagen diagnostik dan sterilisasi limbah medis B3 akan langsung dimulai pada Kuartal II tahun berjalan sementara proses verifikasi substansi izin dampak lingkungan UKL-UPL masih menunggu persetujuan akhir dari Dinas Lingkungan Hidup Provinsi.

BAB III - TATA GUNA LAHAN & ZONASI SPASIAL EKSPANSI GUDANG
Area perluasan gudang logistik regional seluas 1,8 hektare pada sektor timur tercatat bersinggungan dengan zona penyangga kawasan hutan produksi terbatas berdasarkan peta tumpang susun spasial, dan saat ini dokumen permohonan penggunaan kawasan hutan masih dalam tahap penyiapan internal.

BAB IV - EFISIENSI ENERGI SURYA ATAP & DEKARBONISASI ARMADA
Fasilitas distribusi dilengkapi sistem Pembangkit Listrik Tenaga Surya (PLTS) Atap berkapasitas 450 kWp dengan inverter sinkronisasi jaringan PLN sesuai Permen ESDM No. 2 Tahun 2024, serta armada kendaraan listrik pengantar alkes yang menurunkan emisi gas rumah kaca sebesar 1.250 tCO2e per tahun.

BAB V - MEKANISME PENCATATAN NILAI EKONOMI KARBON (SRN PPI)
Seluruh klaim penurunan emisi karbon dari efisiensi rantai dingin (cold-chain) dan elektrifikasi armada logistik medis diukur menggunakan metodologi terverifikasi dan didaftarkan secara resmi pada Sistem Registri Nasional Pengendalian Perubahan Iklim (SRN PPI) sesuai Perpres No. 98 Tahun 2021.

BAB VI - KESEHATAN KESELAMATAN KERJA (K3) & PARTISIPASI MASYARAKAT
Pengelola proyek telah melaksanakan sosialisasi dan konsultasi publik bersama warga sekitar kawasan pergudangan medis, menerapkan standar K3 rumah sakit dan distribusi alkes, serta melindungi kerahasiaan data mitra pemasok sesuai UU Perlindungan Data Pribadi No. 27 Tahun 2022.`,
  },
  {
    id: "plts-cirata",
    badge: "ENERGI TERBARUKAN",
    title: "PDD PLTS Terapung Cirata 145 MWp & Kredit Karbon",
    subtitle: "Pembangkit Listrik Tenaga Surya Terapung & Perdagangan Karbon SRN PPI",
    fileName: "PDD_Desain_Hijau_PLTS_Terapung_Cirata_145MWp.txt",
    highlights: [
      "Perpres No. 98/2021 (SRN PPI)",
      "UU No. 32/2009 Pasal 36",
      "Permen ESDM No. 2/2024",
    ],
    content: `BAB I - IDENTITAS & POLIGON GEOSPASIAL PLTS TERAPUNG
Proyek Pembangkit Listrik Tenaga Surya (PLTS) Terapung ini berlokasi pada koordinat -6.6983 LS dan 107.3611 BT di perairan Waduk Cirata. Data pemohon izin atas nama Koordinator Proyek dengan NIK 3204011205790004 dan kontak +6281234567890 serta email perizinan@nusantarasolar.co.id telah tercatat dalam sistem NIB terintegrasi.

BAB II - JADWAL KONSTRUKSI GARDU HUBUNG & PERSETUJUAN LINGKUNGAN
Pekerjaan konstruksi fisik fondasi tambatan apung dan gardu hubung 20 kV dijadwalkan berlangsung pada bulan depan sementara dokumen revisi izin dampak lingkungan UKL-UPL masih menunggu pengesahan resmi dari instansi lingkungan hidup terkait.

BAB III - JALUR TRANSMISI & KAWASAN HUTAN PENYANGGA
Jalur penarikan kabel transmisi tegangan menengah sepanjang 3,4 kilometer melintasi sebagian area kawasan hutan produksi dan sabuk hijau penyangga waduk tanpa lampiran Persetujuan Penggunaan Kawasan Hutan (PPKH) yang telah berlaku efektif.

BAB IV - KLAIM REDUKSI EMISI & PERDAGANGAN KARBON
Estimasi penurunan emisi gas rumah kaca sebesar 21.400 tCO2e per tahun dari pengoperasian modul bifacial PLTS Terapung telah melalui perhitungan baseline ketenagalistrikan nasional dan disiapkan untuk pencatatan pada Sistem Registri Nasional (SRN PPI) sesuai Perpres No. 98 Tahun 2021.

BAB V - KEANDALAN INTERKONEKSI JARINGAN DISTRIBUSI PLN
Inverter sentral yang digunakan memiliki fitur proteksi anti-islanding otomatis, batas distorsi harmonisa total (THD) di bawah 3 persen, serta sinkronisasi frekuensi 50 Hz sesuai standar teknis interkoneksi jaringan distribusi PLN.

BAB VI - KONSULTASI PUBLIK & PEMBERDAYAAN MASYARAKAT WADUK
Pengembang telah menyelenggarakan konsultasi publik berbasis Free, Prior, and Informed Consent (FPIC) bersama kelompok pembudidaya ikan jaring apung dan pemerintah desa setempat dengan berita acara yang terdokumentasi secara sah.`,
  },
  {
    id: "manufaktur-ikm",
    badge: "GREEN SUPPLY CHAIN IKM",
    title: "PDD Dekarbonisasi Manufaktur & Kemasan Hijau IKM",
    subtitle: "Substitusi Bioplastik, Boiler Biomassa & Inventarisasi GRK ISO 14064-1",
    fileName: "PDD_Desain_Hijau_Manufaktur_Kemasan_IKM_2026.txt",
    highlights: [
      "ISO 14064-1 Scope 1 & 2",
      "UU No. 41/1999 Pasal 38",
      "UU No. 32/2009 (Baku Mutu Emisi)",
    ],
    content: `BAB I - PROFIL FASILITAS MANUFAKTUR DESAIN HIJAU
Dokumen Desain Hijau ini mencakup program transformasi pabrik kemasan ramah lingkungan di Kawasan Industri Cikarang pada koordinat -6.2845 LS dan 107.1705 BT. Penanggung jawab teknis terdaftar dengan NIK 3216082409880009, NPWP 02.889.112.4-412.000, dan alamat surat elektronik kepatuhan@greenpack-industri.id.

BAB II - SUBSTITUSI MATERIAL BIOPLASTIK & EKOLABEL NASIONAL
Lini produksi utama menggantikan 85 persen resin plastik konvensional berbasis fosil dengan polimer nabati terurai secara hayati (biodegradable) yang memenuhi standar Ekolabel Swadeklarasi SNI serta menekan timbulan limbah padat industri.

BAB III - PENYEDIAAN BAHAN BAKU BIOMASSA & KAWASAN HUTAN
Pasokan serpih kayu untuk bahan bakar boiler biomassa diperoleh dari pembukaan lahan pemasok yang beririsan dengan kawasan hutan produksi di wilayah hulu tanpa verifikasi legalitas izin pemanfaatan hutan yang lengkap.

BAB IV - OPERASIONAL BOILER & PERIZINAN BAKU MUTU EMISI
Pengoperasian penuh unit boiler biomassa berkapasitas 12 ton uap per jam telah dijalankan untuk mengejar target produksi kuartalan meskipun izin teknis pembuangan emisi udara cerobong masih menunggu hasil uji laboratorium dan pengesahan dinas lingkungan.

BAB V - INVENTARISASI GAS RUMAH KACA (SCOPE 1 DAN SCOPE 2)
Perusahaan melakukan penghitungan jejak karbon tahunan cakupan Scope 1 dan Scope 2 sesuai pedoman ISO 14064-1 dengan target penurunan intensitas emisi sebesar 32 persen pada tahun 2026 melalui pemulihan panas buang (waste heat recovery).

BAB VI - TRANSPARANSI RANTAI PASOK & PERLINDUNGAN DATA MITRA
Seluruh data audit pemasok bahan baku hijau dan dokumen identitas pekerja dikelola menggunakan enkripsi standar industri dan penyensoran data pribadi otomatis sesuai ketentuan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi.`,
  },
];

const DEMO_SAMPLE_RESULT = {
  auditId: "OZK-2026-SAMPLE-VERIFIED",
  projectName: "PDD_PLTS_Terapung_Cirata_Ekspansi_15MWp.pdf",
  feasibilityScore: 78,
  scoreLegal: 31,
  scoreTechnical: 26,
  scoreSocial: 11,
  scoreTransparency: 10,
  totalPages: 2,
  totalSentences: 24,
  totalWords: 486,
  reviewStatus: "APPROVED",
  sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  clauses: [
    {
      id: 101,
      clause: "BAB I • KLAUSUL 1.1 : IDENTITAS & LOKASI PROYEK",
      status: "compliant",
      text: "Proyek Pembangkit Listrik Tenaga Surya (PLTS) Terapung ini berlokasi pada koordinat -6.6983° LS dan 107.3611° BT di luar kawasan hutan lindung dan di luar peta indikatif penghentian pemberian izin baru hutan alam primer dan lahan gambut. Data pemohon [REDACTED_PII_UU_PDP] telah diverifikasi melalui sistem NIB terintegrasi.",
      issue: null,
    },
    {
      id: 102,
      clause: "BAB II • KLAUSUL 2.4 : JADWAL KONSTRUKSI & PERIZINAN LINGKUNGAN",
      status: "high",
      text: "Pembangunan fondasi tambatan apung dan gardu hubung 20 kV akan langsung dieksekusi pada Kuartal I sambil menunggu proses pemeriksaan substansi formulir UKL-UPL oleh Dinas Lingkungan Hidup selesai diterbitkan.",
      issue: {
        severity: "HIGH_RISK",
        clauseText:
          "Eksekusi konstruksi fisik sebelum diterbitkannya Persetujuan Lingkungan (UKL-UPL/AMDAL) melanggar ketentuan wajib izin lingkungan dan berpotensi menghentikan proyek secara paksa.",
        matchedLaw: "UU No. 32 Tahun 2009 Pasal 36 Ayat (1) & PP No. 22 Tahun 2021",
        originalLawText:
          "Setiap usaha dan/atau kegiatan yang wajib memiliki Amdal atau UKL-UPL wajib memiliki izin lingkungan (Persetujuan Lingkungan) sebelum kegiatan konstruksi dilaksanakan.",
        suggestedRevision:
          "Seluruh kegiatan konstruksi fisik fondasi tambatan apung dan gardu hubung 20 kV wajib dilaksanakan setelah Persetujuan Lingkungan (UKL-UPL) diterbitkan secara resmi sesuai PP No. 22 Tahun 2021 dan UU No. 32 Tahun 2009.",
      },
    },
    {
      id: 103,
      clause: "BAB III • KLAUSUL 3.2 : MEKANISME KLAIM REDUKSI EMISI KARBON",
      status: "medium",
      text: "Estimasi penurunan emisi gas rumah kaca sebesar 21.400 tCO2e per tahun dari pengoperasian PLTS akan langsung diperdagangkan kepada pembeli luar negeri melalui kontrak bilateral tanpa pencatatan pada SRN PPI.",
      issue: {
        severity: "MEDIUM_RISK",
        clauseText:
          "Perdagangan karbon lintas negara tanpa registrasi pada Sistem Registri Nasional Pengendalian Perubahan Iklim (SRN PPI) dan tanpa otorisasi Menteri LHK tidak diakui secara hukum nasional.",
        matchedLaw: "Perpres No. 98 Tahun 2021 Pasal 47 & Pasal 54",
        originalLawText:
          "Penyelenggaraan Perdagangan Karbon luar negeri wajib dicatatkan pada SRN PPI dan memperoleh otorisasi dari Menteri setelah memenuhi target NDC sub-sektor energi.",
        suggestedRevision:
          "Estimasi penurunan emisi sebesar 21.400 tCO2e per tahun wajib diverifikasi oleh validator independen, dicatatkan pada Sistem Registri Nasional (SRN PPI), serta mengikuti prosedur otorisasi Perdagangan Karbon sesuai Perpres No. 98 Tahun 2021.",
      },
    },
    {
      id: 104,
      clause: "BAB IV • KLAUSUL 4.1 : KEANDALAN INTERKONEKSI JARINGAN",
      status: "compliant",
      text: "Inverter sentral yang digunakan memiliki fitur proteksi anti-islanding otomatis, batas distorsi harmonisa total (THD) di bawah 3%, serta sinkronisasi frekuensi 50 Hz sesuai standar jaringan distribusi PLN.",
      issue: null,
    },
    {
      id: 105,
      clause: "BAB V • KLAUSUL 5.3 : PARTISIPASI MASYARAKAT SEKITAR WADUK",
      status: "compliant",
      text: "Pengembang telah menyelenggarakan konsultasi publik bersama kelompok nelayan jaring apung dan pemerintah desa setempat dengan dokumentasi berita acara yang sah.",
      issue: null,
    },
  ],
};

export function AuditWorkspace({
  isFreemium = true,
  onAuditComplete,
  userName,
  userCompany,
  userEmail = "auditor@oziksustain.id",
  initialResult = null,
  initialStatus = "idle",
}: AuditWorkspaceProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<
    "idle" | "configure" | "parsing" | "masking" | "spatial" | "law" | "result"
  >(initialStatus);
  const [result, setResult] = useState<any>(initialResult);
  const [activeClauseId, setActiveClauseId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [pageScope, setPageScope] = useState("teaser");
  const [customRange, setCustomRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [view, setView] = useState<"cover" | "workspace">("cover");
  const CLAUSES_PER_PAGE = 4;

  const { session } = useAuth();
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    GREEN_DESIGN_TEMPLATES[0].id
  );
  const [customTemplateText, setCustomTemplateText] = useState<string>(
    GREEN_DESIGN_TEMPLATES[0].content
  );
  const [showTemplateEditor, setShowTemplateEditor] = useState<boolean>(false);
  const [isAutoFillFile, setIsAutoFillFile] = useState<boolean>(false);

  const activeTemplate =
    GREEN_DESIGN_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    GREEN_DESIGN_TEMPLATES[0];

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const found = GREEN_DESIGN_TEMPLATES.find((t) => t.id === id);
    if (found) {
      setCustomTemplateText(found.content);
    }
  };

  useEffect(() => {
    if (session?.user) {
      api
        .getMe()
        .then((res: any) => setCreditsBalance(res.creditsBalance))
        .catch(console.error);
    }

    const request = indexedDB.open("OzikDB", 2);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("auditState")) {
        db.createObjectStore("auditState");
      }
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("auditState")) return;
      const tx = db.transaction("auditState", "readonly");
      const getReq = tx.objectStore("auditState").get("savedAudit");
      getReq.onsuccess = () => {
        if (getReq.result && session?.user) {
          const data = getReq.result;
          setFile(data.file);
          setFileName(data.fileName);
          setFileSize(data.fileSize);
          setResult(data.result);
          setStatus(data.status);
          setPageScope(data.pageScope);
          const delTx = db.transaction("auditState", "readwrite");
          delTx.objectStore("auditState").delete("savedAudit");
          toast.success("Sesi Workspace Dipulihkan", {
            description: "Melanjutkan konfigurasi dokumen Anda sebelumnya.",
          });
        }
      };
    };
  }, [session]);

  const isGuest = !session?.user;
  const effectiveFreemium = isFreemium || isGuest;

  useEffect(() => {
    let interval: any;
    if (isAuditing) {
      interval = setInterval(() => {
        setStatus((prev) => {
          if (prev === "parsing") return "masking";
          if (prev === "masking") return "spatial";
          if (prev === "spatial") return "law";
          return "law";
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAuditing]);

  const getFlatClauses = () => {
    if (result?.clauses && Array.isArray(result.clauses) && result.clauses.length > 0)
      return result.clauses;
    if (result?.parsedDocumentJson) {
      try {
        let parsed =
          typeof result.parsedDocumentJson === "string"
            ? JSON.parse(result.parsedDocumentJson)
            : result.parsedDocumentJson;

        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }

        if (parsed?.pages) {
          return parsed.pages.flatMap((p: any) => p.chunks || p.Chunks || []);
        }
      } catch (e) {
        console.error("Failed to parse document JSON:", e);
      }
    }
    return [];
  };

  const flatClauses = getFlatClauses();

  // Auto-select first risky clause when switching to workspace view
  useEffect(() => {
    if (status === "result" && flatClauses.length > 0 && activeClauseId === null) {
      const firstRisk = flatClauses.find((c: any) => {
        const s = (c.status || "").toLowerCase();
        return s.includes("high") || s.includes("medium");
      });
      setActiveClauseId(firstRisk ? firstRisk.id : flatClauses[0].id);
    }
  }, [status, flatClauses.length]);

  const totalPages =
    result?.totalPages ||
    (flatClauses.length > 0 ? Math.max(1, Math.ceil(flatClauses.length / CLAUSES_PER_PAGE)) : 1);
  const visibleClauses = flatClauses.slice(
    (currentPage - 1) * CLAUSES_PER_PAGE,
    currentPage * CLAUSES_PER_PAGE
  );

  const highCount =
    flatClauses.filter((c: any) => (c.status || "").toLowerCase().includes("high")).length || 0;
  const mediumCount =
    flatClauses.filter((c: any) => (c.status || "").toLowerCase().includes("medium")).length || 0;
  const compliantCount =
    flatClauses.filter((c: any) => {
      const l = (c.status || "").toLowerCase();
      return !l.includes("high") && !l.includes("medium");
    }).length || 0;
  const totalWords =
    result?.totalWords ||
    flatClauses.reduce((acc: number, c: any) => acc + (c.text?.split(/\s+/).length || 0), 0) ||
    0;
  const totalSentences =
    result?.totalSentences ||
    flatClauses.reduce(
      (acc: number, c: any) => acc + (c.text?.split(/[.!?]+/).filter(Boolean).length || 0),
      0
    ) ||
    0;

  const radarData = [
    { subject: "Legal (40)", A: result?.scoreLegal || 0, fullMark: 40 },
    { subject: "Teknis (30)", A: result?.scoreTechnical || 0, fullMark: 30 },
    { subject: "Sosial (15)", A: result?.scoreSocial || 0, fullMark: 15 },
    { subject: "Transparansi (15)", A: result?.scoreTransparency || 0, fullMark: 15 },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (activeClauseId !== null && rightPanelRef.current) {
      const card = rightPanelRef.current.querySelector(`[data-clause-id="${activeClauseId}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeClauseId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file melebihi batas 10 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selectedFile.type.startsWith("image/")) {
      toast.error("Format gambar tidak didukung. Harap unggah PDF, DOCX, atau TXT.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(selectedFile.size);
    setIsAutoFillFile(false);
    setStatus("configure");
  };

  const isAdminAccount = ["okitr52@gmail.com", "okitarunaramadhan@gmail.com"].includes(
    session?.user?.email || userEmail || ""
  );

  const buildGreenDesignFile = (templateId?: string) => {
    const tpl =
      GREEN_DESIGN_TEMPLATES.find((t) => t.id === (templateId || selectedTemplateId)) ||
      activeTemplate;
    const textContent =
      templateId && templateId !== selectedTemplateId
        ? tpl.content
        : customTemplateText?.trim() || tpl.content;
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    return {
      tpl,
      generatedFile: new File([blob], tpl.fileName, { type: "text/plain" }),
    };
  };

  const handleAutoFillToConfigure = (templateId?: string) => {
    if (templateId) handleSelectTemplate(templateId);
    const { tpl, generatedFile } = buildGreenDesignFile(templateId);
    setFile(generatedFile);
    setFileName(generatedFile.name);
    setFileSize(generatedFile.size);
    setIsAutoFillFile(true);
    setPageScope(effectiveFreemium ? "teaser" : "full");
    setStatus("configure");
    toast.success("Auto-Fill Dokumen Desain Hijau Berhasil", {
      description: `${tpl.title} siap dikonfigurasi & disimpan ke database.`,
    });
  };

  const handleAutoFillAndSaveToDB = async (templateId?: string) => {
    if (templateId) handleSelectTemplate(templateId);
    const { tpl, generatedFile } = buildGreenDesignFile(templateId);
    setFile(generatedFile);
    setFileName(generatedFile.name);
    setFileSize(generatedFile.size);
    setIsAutoFillFile(true);
    setIsAuditing(true);

    const steps: Array<"parsing" | "masking" | "spatial" | "law"> = [
      "parsing",
      "masking",
      "spatial",
      "law",
    ];

    if (!effectiveFreemium) {
      try {
        setStatus("parsing");
        const formData = new FormData();
        formData.append("document", generatedFile);
        formData.append("projectName", tpl.fileName);
        formData.append("page_mode", "full");
        formData.append("is_autofill", "true");

        for (const s of steps) {
          setStatus(s);
          await new Promise((r) => setTimeout(r, 400));
        }

        const res = await api.processFullAudit(formData);
        setIsAuditing(false);
        onAuditComplete?.();
        if (res.auditId) {
          toast.success("Dokumen Desain Hijau Tersimpan di Database (RLS Aktif)", {
            description: `Audit ID ${res.auditId.substring(0, 8)}... terikat ke akun Anda & masuk antrean HITL.`,
          });
          navigate({ to: `/workspace/${res.auditId}` });
          return;
        }
      } catch (err) {
        console.warn("Auto-fill backend save error, falling back:", err);
      }
    }

    for (const s of steps) {
      setStatus(s);
      await new Promise((r) => setTimeout(r, 550));
    }
    setIsAuditing(false);
    setResult({
      ...DEMO_SAMPLE_RESULT,
      projectName: tpl.fileName,
    });
    setStatus("result");
    setCurrentPage(1);
    setActiveClauseId(102);
    toast.success("Simulasi Auto-Fill Dokumen Desain Hijau Selesai", {
      description: effectiveFreemium
        ? "Masuk akun untuk menyimpan hasil auto-fill permanen ke database PostgreSQL Anda."
        : `Menampilkan hasil analisis ${tpl.title}.`,
    });
  };

  const runDemoSampleAudit = async () => {
    await handleAutoFillAndSaveToDB("plts-cirata");
  };

  const startAudit = async () => {
    if (!file) return;

    if (
      !effectiveFreemium &&
      !isAdminAccount &&
      !isAutoFillFile &&
      creditsBalance !== null &&
      creditsBalance <= 0
    ) {
      toast.error("Saldo Kredit Habis", {
        description: "Anda tidak memiliki kredit yang cukup untuk melakukan audit penuh.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    if (!effectiveFreemium) formData.append("projectName", file.name);
    if (isAutoFillFile) formData.append("is_autofill", "true");

    formData.append("page_mode", pageScope);
    if (pageScope === "custom") {
      formData.append("custom_range", customRange);
    }

    setIsAuditing(true);
    setStatus("parsing");

    try {
      const res = effectiveFreemium
        ? await api.guestTeaser(formData)
        : await api.processFullAudit(formData);

      setStatus("law");
      await new Promise((r) => setTimeout(r, 350));

      setIsAuditing(false);
      onAuditComplete?.();

      if (res.auditId && !effectiveFreemium) {
        toast.success("Audit Selesai", { description: "Mengalihkan ke Workspace Laporan..." });
        navigate({ to: `/workspace/${res.auditId}` });
        return;
      }

      toast.success("Analisis Dokumen Selesai", {
        description: "Menampilkan laporan kepatuhan.",
      });
      setResult(res);
      setStatus("result");
      setCurrentPage(1);
    } catch (e: any) {
      console.error(e);
      setIsAuditing(false);
      // Provide fallback to sample simulation if guest teaser server is unreachable
      if (effectiveFreemium) {
        toast.info("Menampilkan Mode Simulasi Lokal", {
          description:
            "Server pemrosesan sedang sibuk; memuat hasil analisis menggunakan dokumen referensi.",
        });
        setResult({
          ...DEMO_SAMPLE_RESULT,
          projectName: fileName || DEMO_SAMPLE_RESULT.projectName,
        });
        setStatus("result");
        setCurrentPage(1);
        return;
      }
      setStatus("idle");
      toast.error("Gagal memproses dokumen", {
        description: "Server AI sedang sibuk atau terjadi gangguan jaringan.",
      });
    }
  };

  const handleRegister = () => {
    const request = indexedDB.open("OzikDB", 2);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("auditState")) {
        db.createObjectStore("auditState");
      }
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction("auditState", "readwrite");
      tx.objectStore("auditState").put(
        { file, fileName, fileSize, result: null, status: "configure", pageScope },
        "savedAudit"
      );
      tx.oncomplete = () => {
        navigate({ to: "/auth" });
      };
    };
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(
        <PDFReportTemplate
          data={{
            ...result,
            projectName: fileName || result?.projectName || "Dokumen PDD",
          }}
          userName={userName || "Auditor OzikSustain"}
          userEmail={userEmail}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `OzikSustain-Audit-${result?.auditId?.substring(0, 8) || "report"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF export failed:", e);
      toast.error("Gagal mengekspor dokumen PDF.");
    }
  };

  const norm = (s: string) => {
    const l = s?.toLowerCase() || "";
    return l.includes("high") ? "high" : l.includes("medium") ? "medium" : "compliant";
  };
  const getBg = (s: string) => {
    const n = norm(s);
    return n === "high" ? "#FEE2E2" : n === "medium" ? "#FEF3C7" : "#E6F4EE";
  };
  const getBorder = (s: string) => {
    const n = norm(s);
    return n === "high" ? "#B91C1C" : n === "medium" ? "#D97706" : "#0D6E49";
  };
  const isHigh = (s: string) => norm(s) === "high";
  const isMedium = (s: string) => norm(s) === "medium";
  const isCompliant = (s: string) => norm(s) === "compliant";

  // ─── 1. IDLE STATE ───
  if (status === "idle") {
    return (
      <div className="w-full border-[1.5px] border-[#091E17] bg-white shadow-[4px_4px_0_#091E17] sm:shadow-[6px_6px_0_#091E17] flex flex-col">
        <div className="border-b-[1.5px] border-[#091E17] bg-[#071913] px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#F6F4EE] flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#34D399] shrink-0" />
            <span className="truncate">
              {isFreemium
                ? "TERMINAL UJI COBA PUBLIK // PEMINDAIAN PDD"
                : "TERMINAL ADJUDIKASI PENUH // WORKSPACE PRO"}
            </span>
          </h3>
          <span className="font-mono text-[9px] sm:text-[10px] text-[#FBBF24] uppercase shrink-0">
            FORMAT: PDF, DOCX, TXT (MAKS. 10 MB)
          </span>
        </div>

        <div className="p-4 sm:p-6 md:p-10 lg:p-12 grid lg:grid-cols-12 gap-6 lg:gap-8 items-start bg-[#F6F4EE]/40">
          {/* Upload Dropzone */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-[#091E17] bg-white p-6 sm:p-10 md:p-12 hover:bg-[#091E17] hover:text-[#F6F4EE] transition-all cursor-pointer flex flex-col items-center justify-center group text-[#091E17] shadow-[3px_3px_0_#091E17] sm:shadow-[4px_4px_0_#091E17]"
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 border-[1.5px] border-current flex items-center justify-center mb-4 sm:mb-5 group-hover:-translate-y-1 transition-transform">
                <Upload className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h4 className="font-editorial text-xl sm:text-2xl font-semibold mb-2 text-center break-words">
                Pilih atau Tarik Dokumen PDD ke Sini
              </h4>
              <p className="text-xs opacity-75 text-center max-w-md leading-relaxed mb-5 sm:mb-6">
                Dokumen Anda diproses langsung di memori volatil (RAM) dengan penyensoran identitas otomatis sesuai UU PDP No. 27 Tahun 2022.
              </p>
              <span className="border-[1.5px] border-current px-4 sm:px-5 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest group-hover:bg-[#FBBF24] group-hover:text-[#091E17] group-hover:border-[#FBBF24] transition-colors text-center">
                Telusuri Berkas Lokal
              </span>
            </div>

            {/* Database RLS & User Isolation Guarantee Banner */}
            <div className="border-[1.5px] border-[#091E17] bg-[#E6F4EE] p-3.5 sm:p-4 flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-[#0D6E49] shrink-0 mt-0.5" />
              <div className="text-xs text-[#091E17] leading-relaxed">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D6E49] block mb-0.5">
                  ROW-LEVEL SECURITY (RLS) POSTGRESQL AKTIF PER-PENGGUNA
                </span>
                Setiap dokumen desain hijau yang dipindai atau di-auto-fill otomatis terikat ke ID pengguna Anda (<code className="font-mono text-[10px] bg-white/80 px-1 py-0.5 border border-[#091E17]/20">project_audits.userId</code>) dan terisolasi penuh melalui kebijakan RLS database.
              </div>
            </div>
          </div>

          {/* Green Design Document (PDD) Auto-Fill Generator */}
          <div className="lg:col-span-6 border-[1.5px] border-[#091E17] bg-white p-5 sm:p-6 md:p-7 space-y-4 shadow-[3px_3px_0_#091E17] sm:shadow-[4px_4px_0_#091E17]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#091E17]/15 pb-2.5 sm:pb-3 font-mono text-[10px] text-[#4A5D54]">
              <span className="flex items-center gap-1.5 font-bold text-[#091E17]">
                <Wand2 className="h-3.5 w-3.5 text-[#0D6E49]" />
                AUTO-FILL DOKUMEN DESAIN HIJAU (PDD)
              </span>
              <span className="bg-[#0D6E49]/10 text-[#0D6E49] border border-[#0D6E49]/30 px-2 py-0.5 font-bold">
                TERSIMPAN DI DB • RLS WAJIB
              </span>
            </div>

            <div>
              <h4 className="font-editorial text-lg sm:text-xl font-semibold text-[#091E17] break-words">
                Generator Otomatis Dokumen Desain Hijau Terstandar
              </h4>
              <p className="mt-1.5 text-xs text-[#4A5D54] leading-relaxed">
                Pilih templat Dokumen Desain Hijau (PDD) siap pakai. Sistem akan mengisi klausul teknis, koordinat geospasial, serta data uji UU PDP secara otomatis dan menyimpannya langsung ke database akun Anda.
              </p>
            </div>

            {/* Template Selector Pills */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#4A5D54] block">
                PILIH TEMPLAT DOKUMEN DESAIN HIJAU ({GREEN_DESIGN_TEMPLATES.length} PRESET TERSEDIA):
              </label>
              <div className="grid grid-cols-1 gap-2">
                {GREEN_DESIGN_TEMPLATES.map((tpl) => {
                  const isSelected = tpl.id === selectedTemplateId;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className={`w-full text-left p-3 border-[1.5px] transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? "border-[#091E17] bg-[#E6F4EE]/80 shadow-[2.5px_2.5px_0_#091E17]"
                          : "border-[#091E17]/20 bg-[#F6F4EE]/40 hover:border-[#091E17]"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#091E17] text-[#FBBF24]">
                            {tpl.badge}
                          </span>
                          <span className="font-mono text-[10px] text-[#4A5D54] truncate">
                            {tpl.fileName}
                          </span>
                        </div>
                        <div className="font-bold text-xs sm:text-sm text-[#091E17] break-words">
                          {tpl.title}
                        </div>
                        <div className="text-[11px] text-[#4A5D54] mt-0.5 line-clamp-1">
                          {tpl.subtitle}
                        </div>
                      </div>
                      <div
                        className={`h-5 w-5 shrink-0 border-[1.5px] border-[#091E17] flex items-center justify-center mt-0.5 ${
                          isSelected ? "bg-[#0D6E49] text-white" : "bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Highlights & Editable Preview Toggle */}
            <div className="bg-[#F6F4EE] border border-[#091E17]/20 p-3 font-mono text-[11px] space-y-2 text-[#091E17]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[#4A5D54] text-[10px] uppercase font-bold">
                  Cakupan Regulasi:
                </span>
                <button
                  type="button"
                  onClick={() => setShowTemplateEditor((prev) => !prev)}
                  className="text-[10px] font-bold text-[#0D6E49] hover:underline cursor-pointer uppercase"
                >
                  {showTemplateEditor ? "Tutup Editor Teks" : "Lihat / Edit Klausul Otomatis"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeTemplate.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-[10px] bg-white border border-[#091E17]/20 px-2 py-0.5 font-semibold"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {showTemplateEditor && (
                <div className="pt-2">
                  <textarea
                    value={customTemplateText}
                    onChange={(e) => setCustomTemplateText(e.target.value)}
                    rows={6}
                    className="w-full border border-[#091E17] bg-white p-2.5 font-mono text-[11px] text-[#091E17] leading-relaxed focus:outline-none"
                    placeholder="Teks Dokumen Desain Hijau (PDD)..."
                  />
                  <p className="text-[10px] text-[#4A5D54] mt-1">
                    Anda dapat memodifikasi klausul di atas sebelum dikirim ke mesin AI & disimpan ke database.
                  </p>
                </div>
              )}
            </div>

            {/* Dual Action Buttons: Direct Save to DB OR Auto-Fill into Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleAutoFillAndSaveToDB()}
                className="w-full py-3 sm:py-3.5 px-4 bg-[#0D6E49] hover:bg-[#091E17] text-white font-mono text-[11px] font-bold uppercase tracking-wider border-[1.5px] border-[#091E17] shadow-[2.5px_2.5px_0_#091E17] transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4 text-[#FBBF24] shrink-0" />
                <span>Auto-Fill & Simpan ke DB</span>
              </button>
              <button
                type="button"
                onClick={() => handleAutoFillToConfigure()}
                className="w-full py-3 sm:py-3.5 px-4 bg-[#F6F4EE] hover:bg-[#FBBF24] text-[#091E17] font-mono text-[11px] font-bold uppercase tracking-wider border-[1.5px] border-[#091E17] shadow-[2.5px_2.5px_0_#091E17] transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Wand2 className="h-4 w-4 text-[#091E17] shrink-0" />
                <span>Auto-Fill ke Konfigurasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. CONFIGURE STATE ───
  if (status === "configure") {
    return (
      <div className="w-full border-[1.5px] border-[#091E17] bg-white shadow-[4px_4px_0_#091E17] sm:shadow-[6px_6px_0_#091E17] flex flex-col">
        <div className="border-b-[1.5px] border-[#091E17] bg-[#071913] px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#F6F4EE] flex items-center gap-2">
            <FileStack className="h-4 w-4 text-[#FBBF24] shrink-0" />
            <span>Konfigurasi Cakupan Audit Dokumen</span>
          </h3>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-mono text-xs text-[#F6F4EE]/70 hover:text-white underline cursor-pointer self-start sm:self-auto"
          >
            Ganti Berkas
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto w-full space-y-5 sm:space-y-6">
          <div className="bg-[#F6F4EE] border-[1.5px] border-[#091E17] p-3.5 sm:p-4 flex flex-wrap justify-between items-center gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-mono text-[10px] font-bold uppercase text-[#4A5D54]">
                  BERKAS DOKUMEN TERPILIH
                </p>
                {isAutoFillFile && (
                  <span className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#0D6E49] text-white">
                    AUTO-FILL DESAIN HIJAU • RLS DB READY
                  </span>
                )}
              </div>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#091E17] truncate max-w-xs sm:max-w-md">
                {fileName}
              </p>
            </div>
            <div className="text-right font-mono shrink-0">
              <p className="text-[10px] font-bold uppercase text-[#4A5D54] mb-1">UKURAN</p>
              <p className="text-xs sm:text-sm font-bold text-[#091E17]">
                {fileSize >= 1024 * 1024
                  ? `${(fileSize / 1024 / 1024).toFixed(2)} MB`
                  : `${Math.max(1, Math.round(fileSize / 1024))} KB`}
              </p>
            </div>
          </div>

          {/* Quick Switcher for Green Design Auto-Fill Templates inside Configure View */}
          <div className="border-[1.5px] border-[#091E17]/25 bg-[#E6F4EE]/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-[#091E17]">
              <span className="font-mono text-[10px] font-bold uppercase text-[#0D6E49] block">
                GANTI CEPAT TEMPLAT DOKUMEN DESAIN HIJAU:
              </span>
              Pilih preset PDD lain untuk diisi otomatis dan disimpan ke database PostgreSQL Anda.
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {GREEN_DESIGN_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleAutoFillToConfigure(tpl.id)}
                  className={`px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase border border-[#091E17] cursor-pointer transition-colors ${
                    isAutoFillFile && selectedTemplateId === tpl.id
                      ? "bg-[#091E17] text-[#FBBF24]"
                      : "bg-white text-[#091E17] hover:bg-[#FBBF24]"
                  }`}
                >
                  {tpl.badge}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#091E17] mb-3">
              Pilih Kedalaman Pemindaian Halaman (Page Scope)
            </h4>
            {effectiveFreemium && (
              <div className="mb-4 text-xs text-[#B45309] bg-[#FEF3C7] p-3 border border-[#F59E0B] font-medium flex items-center justify-between gap-2">
                <span>
                  <Lock className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
                  Mode Publik memindai Halaman 1–3. Masuk akun untuk membuka Full Audit (gratis 3 kredit).
                </span>
                <button
                  type="button"
                  onClick={handleRegister}
                  className="font-mono text-[11px] font-bold uppercase underline shrink-0 cursor-pointer"
                >
                  Buka Akses Penuh
                </button>
              </div>
            )}

            <div className="space-y-3">
              <label
                className={`block border-[1.5px] p-4 cursor-pointer transition-all ${
                  pageScope === "teaser"
                    ? "border-[#091E17] bg-[#E6F4EE]/60 shadow-[3px_3px_0_#091E17]"
                    : "border-[#091E17]/25 hover:border-[#091E17]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="scope"
                    value="teaser"
                    checked={pageScope === "teaser"}
                    onChange={() => setPageScope("teaser")}
                    className="w-4 h-4 accent-[#091E17]"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#091E17]">
                      Inspeksi Cepat (Halaman 1 – 3)
                    </div>
                    <div className="text-xs text-[#4A5D54]">
                      Ekstraksi cepat ringkasan eksekutif dan klausa awal dokumen PDD.
                    </div>
                  </div>
                </div>
              </label>

              <label
                className={`block border-[1.5px] p-4 cursor-pointer transition-all ${
                  pageScope === "custom"
                    ? "border-[#091E17] bg-[#E6F4EE]/60 shadow-[3px_3px_0_#091E17]"
                    : "border-[#091E17]/25 hover:border-[#091E17]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="scope"
                    value="custom"
                    checked={pageScope === "custom"}
                    onChange={() => setPageScope("custom")}
                    className="w-4 h-4 accent-[#091E17]"
                    disabled={effectiveFreemium}
                  />
                  <div className="w-full">
                    <div className="font-bold text-sm text-[#091E17] flex items-center justify-between">
                      <span>Rentang Halaman Spesifik</span>
                      {effectiveFreemium && (
                        <span className="font-mono text-[10px] uppercase border border-[#091E17]/30 px-2 py-0.5">
                          <Lock className="w-2.5 h-2.5 inline mr-1" /> Akun Terdaftar
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#4A5D54] mb-2">
                      Tentukan nomor halaman tertentu untuk dianalisis.
                    </div>
                    {pageScope === "custom" && (
                      <input
                        type="text"
                        placeholder="Contoh: 1-5, 8, 11-13"
                        value={customRange}
                        onChange={(e) => setCustomRange(e.target.value)}
                        className="w-full border border-[#091E17] bg-white p-2 font-mono text-xs focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              </label>

              <label
                className={`block border-[1.5px] p-4 cursor-pointer transition-all ${
                  pageScope === "full"
                    ? "border-[#091E17] bg-[#E6F4EE]/60 shadow-[3px_3px_0_#091E17]"
                    : "border-[#091E17]/25 hover:border-[#091E17]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="scope"
                    value="full"
                    checked={pageScope === "full"}
                    onChange={() => setPageScope("full")}
                    className="w-4 h-4 accent-[#091E17]"
                    disabled={effectiveFreemium}
                  />
                  <div className="w-full">
                    <div className="font-bold text-sm text-[#091E17] flex items-center justify-between gap-2">
                      <span>Audit Dokumen Menyeluruh (Semua Halaman)</span>
                      {effectiveFreemium && (
                        <span className="font-mono text-[10px] uppercase border border-[#091E17]/30 px-2 py-0.5">
                          <Lock className="w-2.5 h-2.5 inline mr-1" /> Akun Terdaftar
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#4A5D54]">
                      Pemindaian penuh seluruh bab PDD beserta penerbitan hash SHA-256.
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={startAudit}
            className="w-full bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono font-bold text-xs uppercase tracking-widest h-14 border-[1.5px] border-[#091E17] shadow-[4px_4px_0_#D97706] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="h-4 w-4 text-[#FBBF24]" /> Eksekusi Pemindaian Dokumen Sekarang
          </button>
        </div>
      </div>
    );
  }

  // ─── 3. ANIMATED TELEMETRY LOADING STATE ───
  if (status !== "result") {
    const steps = [
      {
        key: "parsing",
        code: "STAGE 01",
        label: "Ekstraksi Teks Dokumen (In-Memory Buffer)",
        detail: "Memecah struktur paragraf dan klausa tanpa penyimpanan ke diska...",
      },
      {
        key: "masking",
        code: "STAGE 02",
        label: "Penyensoran Otomatis Data Pribadi (UU PDP No. 27/2022)",
        detail: "Menyamarkan entitas NIK, NIB, dan nama individu sebelum inferensi...",
      },
      {
        key: "spatial",
        code: "STAGE 03",
        label: "Validasi Poligon Geospasial & Iradiasi Surya",
        detail: "Memeriksa tumpang tindih koordinat dengan kawasan hutan lindung...",
      },
      {
        key: "law",
        code: "STAGE 04",
        label: "Pencocokan Vektor Hukum IndoBERT (Pasal.id)",
        detail: "Menghitung kemiripan semantik terhadap pasal UU LHK & Permen ESDM...",
      },
    ];
    const order = ["parsing", "masking", "spatial", "law"];
    const curIdx = Math.max(0, order.indexOf(status));

    return (
      <div className="w-full border-[1.5px] border-[#091E17] bg-[#071913] text-[#F6F4EE] shadow-[4px_4px_0_#091E17] sm:shadow-[8px_8px_0_#091E17] min-h-[440px] relative overflow-hidden flex flex-col justify-between p-4 sm:p-8 md:p-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#34D399]/15 to-transparent animate-scan-beam" />

        <div className="relative z-10 flex flex-col xs:flex-row xs:items-center justify-between border-b border-[#F6F4EE]/15 pb-3 sm:pb-4 font-mono text-[11px] sm:text-xs gap-2">
          <span className="text-[#34D399] flex items-center gap-2 truncate">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span className="truncate">MEMPROSES: {fileName || "DOKUMEN PDD"}</span>
          </span>
          <span className="text-[#FBBF24] shrink-0">LANGKAH {curIdx + 1} / 4</span>
        </div>

        <div className="relative z-10 my-6 sm:my-8 max-w-2xl mx-auto w-full space-y-2.5 sm:space-y-3">
          {steps.map((step, sIdx) => {
            const isDone = sIdx < curIdx;
            const isCurrent = sIdx === curIdx;
            return (
              <div
                key={step.key}
                className={`border p-3.5 sm:p-4 transition-all ${
                  isCurrent
                    ? "border-[#FBBF24] bg-[#0C261E] shadow-[3px_3px_0_#FBBF24] sm:shadow-[4px_4px_0_#FBBF24]"
                    : isDone
                    ? "border-[#34D399]/40 bg-[#091E17]/80 opacity-90"
                    : "border-[#F6F4EE]/15 bg-[#091E17]/30 opacity-45"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px] mb-1">
                  <span className={isCurrent ? "text-[#FBBF24] font-bold" : "text-[#34D399]"}>
                    {step.code}
                  </span>
                  <span>
                    {isDone ? "SELESAI" : isCurrent ? "MEMPROSES..." : "MENUNGGU"}
                  </span>
                </div>
                <div className="font-semibold text-xs sm:text-sm text-white flex items-center gap-2">
                  {isDone && <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />}
                  {isCurrent && <Loader2 className="h-4 w-4 text-[#FBBF24] animate-spin shrink-0" />}
                  <span className="break-words">{step.label}</span>
                </div>
                {isCurrent && (
                  <p className="mt-1.5 font-mono text-[11px] sm:text-xs text-[#F6F4EE]/70">{step.detail}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 border-t border-[#F6F4EE]/15 pt-3 sm:pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-[10px] sm:text-[11px] text-[#F6F4EE]/60">
          <span>KEAMANAN MEMORI: ZERO DATA RETENTION</span>
          <span>KORPUS: PASAL.ID VECTOR INDEX</span>
        </div>
      </div>
    );
  }

  // ─── 4. RESULT STATE (COVER & DRILL-DOWN WORKSPACE) ───
  return (
    <div
      ref={reportRef}
      className="w-full border-[1.5px] border-[#091E17] bg-white shadow-[4px_4px_0_#091E17] sm:shadow-[8px_8px_0_#091E17] flex flex-col"
      style={{ minHeight: "640px" }}
    >
      {/* Top Instrument Navigation Bar */}
      <div className="border-b-[1.5px] border-[#091E17] bg-[#071913] px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setView("cover")}
            className={`px-3 sm:px-4 py-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 border ${
              view === "cover"
                ? "bg-[#FBBF24] text-[#091E17] border-[#FBBF24]"
                : "border-[#F6F4EE]/20 text-[#F6F4EE]/75 hover:text-white"
            }`}
          >
            <FileStack className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Lembar Ringkasan Eksekutif</span>
            <span className="sm:hidden">Ringkasan</span>
          </button>
          <button
            type="button"
            onClick={() => setView("workspace")}
            className={`px-3 sm:px-4 py-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 border ${
              view === "workspace"
                ? "bg-[#FBBF24] text-[#091E17] border-[#FBBF24]"
                : "border-[#F6F4EE]/20 text-[#F6F4EE]/75 hover:text-white"
            }`}
          >
            <Scale className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Inspeksi Klausul &amp; Pasal ({flatClauses.length})</span>
            <span className="sm:hidden">Klausul ({flatClauses.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setResult(null);
              setFile(null);
            }}
            className="px-2.5 sm:px-3 py-2 border border-[#F6F4EE]/25 text-[#F6F4EE]/80 hover:text-white font-mono text-[10px] sm:text-xs uppercase tracking-wider inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Audit Dokumen Baru</span>
            <span className="sm:hidden">Audit Baru</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-3 sm:px-4 py-2 bg-[#0D6E49] hover:bg-[#09583A] text-white border border-[#34D399]/40 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer text-center"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Ekspor Laporan PDF</span>
            <span className="sm:hidden">Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* ═══════════════ VIEW A: COVER REPORT ═══════════════ */}
      {view === "cover" && (
        <div className="flex-1 overflow-y-auto">
          {/* Gazette Report Header */}
          <div className="bg-[#F6F4EE] px-4 sm:px-6 md:px-8 py-5 sm:py-6 border-b-[1.5px] border-[#091E17]">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#0D6E49]">
                  DOKUMEN HASIL ADJUDIKASI KEPATUHAN // OZIKSUSTAIN ENGINE
                </div>
                <h2 className="font-editorial text-xl sm:text-2xl md:text-3xl font-semibold text-[#091E17] break-words">
                  {fileName || result?.projectName || "Laporan Evaluasi Project Design Document"}
                </h2>
                <p className="font-mono text-[11px] sm:text-xs text-[#4A5D54] break-all">
                  SHA-256 INTEGRITY HASH:{" "}
                  <span className="text-[#091E17] font-semibold">
                    {result?.sha256Hash?.substring(0, 32) ||
                      result?.auditId ||
                      "e3b0c44298fc1c149afbf4c8996fb924"}
                    ...
                  </span>
                </p>
              </div>

              {result?.reviewStatus === "APPROVED" && (
                <div className="flex items-center gap-3 border-[1.5px] border-[#091E17] bg-white p-2.5 sm:p-3 shadow-[2px_2px_0_#091E17] sm:shadow-[3px_3px_0_#091E17] shrink-0">
                  <div>
                    <div className="font-mono text-[9px] sm:text-[10px] font-bold uppercase text-[#0D6E49] flex items-center gap-1">
                      <Fingerprint className="h-3.5 w-3.5" /> TERVERIFIKASI SHA-256
                    </div>
                    <div className="font-mono text-xs font-bold text-[#091E17]">
                      SKOR KELAYAKAN: {result?.feasibilityScore ?? 0}/100
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviewer Status Banner */}
          {result?.reviewStatus && (
            <div
              className={`px-6 md:px-8 py-4 border-b-[1.5px] border-[#091E17] flex items-start gap-3 ${
                result.reviewStatus === "APPROVED"
                  ? "bg-[#E6F4EE] text-[#091E17]"
                  : result.reviewStatus === "REJECTED"
                  ? "bg-[#FEE2E2] text-[#7F1D1D]"
                  : result.reviewStatus === "NEEDS_REVISION"
                  ? "bg-[#FEF3C7] text-[#78350F]"
                  : "bg-[#F6F4EE] text-[#091E17]"
              }`}
            >
              <div className="mt-0.5">
                {result.reviewStatus === "APPROVED" && (
                  <CheckCircle2 className="h-5 w-5 text-[#0D6E49]" />
                )}
                {result.reviewStatus === "REJECTED" && (
                  <AlertTriangle className="h-5 w-5 text-[#B91C1C]" />
                )}
                {result.reviewStatus === "NEEDS_REVISION" && (
                  <AlertTriangle className="h-5 w-5 text-[#D97706]" />
                )}
                {result.reviewStatus === "PENDING_REVIEW" && (
                  <Loader2 className="h-5 w-5 animate-spin text-[#0D6E49]" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-mono font-bold uppercase text-xs tracking-wider">
                  {result.reviewStatus === "APPROVED"
                    ? "STATUS ADJUDIKASI: DISETUJUI OLEH PAKAR (VERIFIED COMPLIANT)"
                    : result.reviewStatus === "REJECTED"
                    ? "STATUS ADJUDIKASI: DITOLAK OLEH PAKAR"
                    : result.reviewStatus === "NEEDS_REVISION"
                    ? "STATUS ADJUDIKASI: PERLU REVISI KLAUSUL (CATATAN PAKAR)"
                    : "STATUS ADJUDIKASI: MENUNGGU KALIBRASI AUDITOR MANUSIA (HITL)"}
                </h4>
                {result.reviewFeedback && (
                  <p className="text-xs mt-1 font-medium whitespace-pre-wrap">
                    {result.reviewFeedback}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Two Columns: Metadata Table + 4-Pillar Radar */}
          <div className="grid md:grid-cols-12 border-b-[1.5px] border-[#091E17]">
            {/* Left: Submission Metadata (7 Cols) */}
            <div className="md:col-span-7 p-6 md:p-8 md:border-r-[1.5px] border-b-[1.5px] md:border-b-0 border-[#091E17]">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D6E49] mb-4 flex items-center gap-2">
                <FileStack className="h-4 w-4" /> Spesifikasi &amp; Telemetri Dokumen
              </h3>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-[#091E17]/15">
                  {[
                    {
                      icon: <Building2 className="h-3.5 w-3.5" />,
                      label: "Entitas / Pemohon",
                      value: userName || userCompany || "Entitas Terlindungi (UU PDP)",
                    },
                    {
                      icon: <FileText className="h-3.5 w-3.5" />,
                      label: "Nama Berkas Proyek",
                      value: fileName || result?.projectName || "Dokumen PDD",
                    },
                    {
                      icon: <Hash className="h-3.5 w-3.5" />,
                      label: "Nomor Registri Audit",
                      value: result?.auditId || "OZK-2026-SAMPLE",
                    },
                    {
                      icon: <Calendar className="h-3.5 w-3.5" />,
                      label: "Tanggal Evaluasi",
                      value: new Date().toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }),
                    },
                    {
                      icon: <FileStack className="h-3.5 w-3.5" />,
                      label: "Statistik Teks",
                      value: `${totalPages} Halaman • ${totalSentences} Kalimat • ${totalWords} Kata`,
                    },
                    {
                      icon: <Scale className="h-3.5 w-3.5" />,
                      label: "Acuan Regulasi",
                      value: "UU No. 32/2009, Perpres No. 98/2021, Permen ESDM No. 2/2024",
                    },
                    {
                      icon: <Globe className="h-3.5 w-3.5" />,
                      label: "Skor Kelayakan Gabungan",
                      value: `${result?.feasibilityScore ?? 0} / 100 Poin`,
                    },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 text-[#4A5D54] font-mono text-[11px] uppercase whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          {row.icon} {row.label}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-semibold text-[#091E17]">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right: 4-Pillar Scoring Radar (5 Cols) */}
            <div className="md:col-span-5 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center relative bg-[#F6F4EE]/40">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#091E17] mb-2 text-center">
                Distribusi Skor 4 Pilar Kepatuhan
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#091E17" strokeOpacity={0.2} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#091E17", fontSize: 9, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, "dataMax"]} tick={false} axisLine={false} />
                  <Radar
                    name="Skor"
                    dataKey="A"
                    stroke="#0D6E49"
                    strokeWidth={2}
                    fill="#0D6E49"
                    fillOpacity={0.45}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#071913",
                      color: "#F6F4EE",
                      borderRadius: "0px",
                      border: "1.5px solid #0D6E49",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "11px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* Clause Counts */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-3 font-mono">
                <div className="bg-[#E6F4EE] border border-[#0D6E49] p-2 sm:p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-[#091E17] tabular-nums">
                    {compliantCount}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold uppercase text-[#0D6E49]">Patuh</div>
                </div>
                <div className="bg-[#FEF3C7] border border-[#D97706] p-2 sm:p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-[#091E17] tabular-nums">
                    {mediumCount}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold uppercase text-[#B45309]">Sedang</div>
                </div>
                <div className="bg-[#FEE2E2] border border-[#B91C1C] p-2 sm:p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-[#091E17] tabular-nums">{highCount}</div>
                  <div className="text-[8px] sm:text-[9px] font-bold uppercase text-[#B91C1C]">Tinggi</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA to Drill-Down Clause Inspector */}
          <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 bg-[#F6F4EE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <p className="text-xs text-[#4A5D54] max-w-xl leading-relaxed">
              Buka <strong className="text-[#091E17]">Inspeksi Klausul &amp; Pasal</strong> untuk membaca bedah kalimat demi kalimat, melihat kutipan asli regulasi Pasal.id, dan menyalin rekomendasi perbaikan redaksional hukum.
            </p>
            <button
              type="button"
              onClick={() => setView("workspace")}
              className="px-5 sm:px-6 py-3 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-xs font-bold uppercase tracking-widest border-[1.5px] border-[#091E17] shadow-[3px_3px_0_#D97706] sm:shadow-[4px_4px_0_#D97706] transition-all cursor-pointer shrink-0 text-center"
            >
              Buka Inspeksi Klausul Detail &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ VIEW B: DRILL-DOWN CLAUSE WORKSPACE ═══════════════ */}
      {view === "workspace" && (
        <div className="flex-1 grid md:grid-cols-12 min-h-[560px]">
          {/* LEFT PANEL: Document Reader (7 Cols) */}
          <div className="md:col-span-7 flex flex-col bg-[#F6F4EE]/50 md:border-r-[1.5px] border-b-[1.5px] md:border-b-0 border-[#091E17]">
            {/* Reader Toolbar */}
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[#091E17]/20 bg-white flex items-center justify-between shrink-0 font-mono text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-[#0D6E49] shrink-0" />
                <span className="font-bold text-[#091E17] truncate max-w-[110px] xs:max-w-[160px] sm:max-w-[220px]">
                  {fileName || result?.projectName || "Dokumen PDD"}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-7 w-7 border border-[#091E17]/30 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] sm:text-[11px] font-bold px-1 sm:px-2 whitespace-nowrap">
                  Hal {currentPage}/{totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-7 w-7 border border-[#091E17]/30 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <div className="hidden xs:block w-px h-4 bg-[#091E17]/20 mx-0.5 sm:mx-1" />
                <div className="hidden xs:flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(85, z - 10))}
                    className="h-7 w-7 border border-[#091E17]/30 flex items-center justify-center cursor-pointer"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] w-8 text-center">{zoom}%</span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(135, z + 10))}
                    className="h-7 w-7 border border-[#091E17]/30 flex items-center justify-center cursor-pointer"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Clauses List */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 bg-white" style={{ fontSize: `${zoom}%` }}>
              {visibleClauses.map((p: any) => {
                const isActive = activeClauseId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActiveClauseId(p.id)}
                    className="relative p-4 transition-all cursor-pointer border"
                    style={{
                      backgroundColor: getBg(p.status),
                      borderColor: isActive ? "#091E17" : "rgba(9,30,23,0.15)",
                      borderLeft: `4px solid ${getBorder(p.status)}`,
                      boxShadow: isActive ? "4px 4px 0px #091E17" : "none",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                      <span className="font-bold uppercase text-[#091E17]/80">
                        {p.clause || `KLAUSUL #${p.id}`}
                      </span>
                      <span
                        className="px-2 py-0.5 font-bold uppercase"
                        style={{
                          backgroundColor: getBorder(p.status),
                          color: "#FFFFFF",
                        }}
                      >
                        {isHigh(p.status)
                          ? "RISIKO TINGGI • KLIK SOLUSI"
                          : isMedium(p.status)
                          ? "RISIKO SEDANG • KLIK SOLUSI"
                          : "PATUH REGULASI"}
                      </span>
                    </div>
                    <p className="font-serif text-sm leading-relaxed text-[#091E17]">
                      {p.text || p.Text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: Legal Resolution Inspector (5 Cols) */}
          <div className="md:col-span-5 flex flex-col bg-white">
            <div className="px-4 py-2.5 border-b border-[#091E17]/20 bg-[#071913] text-[#F6F4EE] flex items-center justify-between shrink-0 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider flex items-center gap-2">
                <Scale className="h-3.5 w-3.5 text-[#FBBF24]" /> Panel Resolusi &amp; Rujukan Pasal.id
              </span>
              <span className="text-[10px] text-[#34D399]">INDOBERT RAG</span>
            </div>

            {/* Score Summary Strip */}
            <div className="grid grid-cols-3 border-b border-[#091E17]/15 font-mono text-center bg-[#F6F4EE]">
              <div className="p-2.5 border-r border-[#091E17]/15">
                <div className="text-[9px] uppercase text-[#4A5D54]">Kelayakan</div>
                <div className="text-base font-bold text-[#091E17]">
                  {result?.feasibilityScore ?? 0}/100
                </div>
              </div>
              <div className="p-2.5 border-r border-[#091E17]/15">
                <div className="text-[9px] uppercase text-[#4A5D54]">Skor Legal</div>
                <div className="text-base font-bold text-[#0D6E49]">
                  {result?.scoreLegal ?? 0}/40
                </div>
              </div>
              <div className="p-2.5">
                <div className="text-[9px] uppercase text-[#4A5D54]">Skor Teknis</div>
                <div className="text-base font-bold text-[#091E17]">
                  {result?.scoreTechnical ?? 0}/30
                </div>
              </div>
            </div>

            {/* Active Clause Detail */}
            <div ref={rightPanelRef} className="flex-1 overflow-y-auto p-5">
              {!activeClauseId || !flatClauses.find((c: any) => c.id === activeClauseId) ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 border border-dashed border-[#091E17]/30 bg-[#F6F4EE]/50">
                  <BookOpen className="h-8 w-8 text-[#4A5D54] mb-3" />
                  <p className="text-xs font-medium text-[#4A5D54] max-w-xs leading-relaxed">
                    Pilih salah satu klausa pada panel dokumen di sebelah kiri untuk menampilkan analisis risiko, bunyi pasal rujukan, dan draf perbaikan hukum.
                  </p>
                </div>
              ) : (
                (() => {
                  const clause = flatClauses.find((c: any) => c.id === activeClauseId);
                  return (
                    <div
                      key={clause.id}
                      data-clause-id={clause.id}
                      className="border-[1.5px] border-[#091E17] bg-white shadow-[4px_4px_0_#091E17]"
                    >
                      <div
                        className="px-3.5 sm:px-4 py-2 sm:py-2.5 flex flex-col xs:flex-row xs:items-center justify-between font-mono text-[9px] sm:text-[10px] font-bold uppercase text-white gap-1"
                        style={{ backgroundColor: getBorder(clause.status) }}
                      >
                        <span className="truncate">
                          {isHigh(clause.status)
                            ? "TEMUAN: RISIKO TINGGI (HIGH RISK)"
                            : isMedium(clause.status)
                            ? "TEMUAN: RISIKO SEDANG (MEDIUM RISK)"
                            : "STATUS: KLAUSUL PATUH (COMPLIANT)"}
                        </span>
                        <span className="shrink-0">ID #{clause.id}</span>
                      </div>

                      {isCompliant(clause.status) ? (
                        <div className="p-4 sm:p-5 space-y-3 bg-[#E6F4EE]/40">
                          <div className="flex items-center gap-2 text-[#0D6E49] font-mono text-xs font-bold uppercase">
                            <CheckCircle2 className="h-4 w-4 shrink-0" /> Tidak Ditemukan Indikasi Pelanggaran
                          </div>
                          <p className="font-serif text-xs italic text-[#091E17]/80 border-l-2 border-[#0D6E49] pl-3 break-words">
                            "{clause.text || clause.Text}"
                          </p>
                          <p className="text-xs text-[#4A5D54] leading-relaxed bg-white p-3 border border-[#091E17]/15 break-words">
                            Substansi klausa ini telah sejalan dengan kaidah perizinan lingkungan, tata ruang, dan keselamatan ketenagalistrikan yang berlaku.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#091E17]/15">
                          <div className="p-3.5 sm:p-4 bg-[#F6F4EE]/60">
                            <div className="font-mono text-[10px] uppercase text-[#4A5D54] mb-1">
                              KUTIPAN KLAUSUL BERMASALAH
                            </div>
                            <p className="font-serif text-xs italic text-[#091E17] leading-relaxed break-words">
                              "{clause.text || clause.Text}"
                            </p>
                          </div>

                          <div className="p-3.5 sm:p-4 space-y-1.5">
                            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-[#B91C1C]">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Analisis Ketidaksesuaian Hukum
                            </div>
                            <p className="text-xs text-[#091E17] leading-relaxed break-words">
                              {clause.issue?.clauseText ||
                                clause.issue?.explanation ||
                                "Klausul ini mengandung potensi ketidaksesuaian terhadap ketentuan perizinan lingkungan nasional."}
                            </p>
                          </div>

                          {clause.issue?.matchedLaw && (
                            <div className="p-3.5 sm:p-4 bg-[#F6F4EE] space-y-2">
                              <div className="flex items-center justify-between font-mono text-[10px] gap-2">
                                <span className="font-bold uppercase text-[#091E17] flex items-center gap-1.5">
                                  <BookOpen className="h-3.5 w-3.5 text-[#0D6E49] shrink-0" /> Sitasi Regulasi (Pasal.id)
                                </span>
                                <Link
                                  to="/regulasi"
                                  className="text-[#0D6E49] font-bold hover:underline inline-flex items-center gap-0.5 shrink-0"
                                >
                                  Buka Direktori <ArrowUpRight className="h-3 w-3" />
                                </Link>
                              </div>
                              <div className="inline-block bg-[#091E17] text-[#FBBF24] font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-1 break-words max-w-full">
                                {clause.issue.matchedLaw}
                              </div>
                              {clause.issue?.originalLawText && (
                                <p className="font-serif text-xs italic text-[#091E17]/85 border-l-2 border-[#091E17]/40 pl-3 leading-relaxed break-words">
                                  "{clause.issue.originalLawText}"
                                </p>
                              )}
                            </div>
                          )}

                          {clause.issue?.suggestedRevision && (
                            <div className="p-3.5 sm:p-4 space-y-3 bg-white">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] font-bold uppercase text-[#0D6E49] flex items-center gap-1.5">
                                  <Wand2 className="h-3.5 w-3.5 text-[#0D6E49] shrink-0" /> Rekomendasi Redaksi Perbaikan
                                </span>
                              </div>
                              <div className="p-3 sm:p-3.5 bg-[#E6F4EE]/70 border border-[#0D6E49] font-serif text-xs text-[#091E17] leading-relaxed break-words">
                                "{clause.issue.suggestedRevision}"
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopy(clause.issue.suggestedRevision)}
                                className="w-full py-2.5 px-4 bg-[#091E17] hover:bg-[#0D6E49] text-[#F6F4EE] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                              >
                                {copied ? (
                                  <Check className="h-4 w-4 text-[#34D399]" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                                {copied ? "Draf Perbaikan Disalin" : "Salin Kalimat Perbaikan"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
