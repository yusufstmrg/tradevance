import { useEffect, useMemo, useState } from "react";
import { api, auth } from "@appdeploy/client";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  ChevronRight,
  Database,
  FileCheck2,
  Globe2,
  GitBranch,
  Layers3,
  LockKeyhole,
  Menu,
  Moon,
  PackageSearch,
  PanelLeft,
  Search,
  Send,
  ShieldCheck,
  Ship,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import EntityIntelligence from "./EntityIntelligence";
import QuoteIntelligence from "./QuoteIntelligence";
import CommercialGuardrails from "./CommercialGuardrails";
import ExecutionCenter from "./ExecutionCenter";
import IntelligenceCenter from "./IntelligenceCenter";
import DataFabric from "./DataFabric";
import TradeDeskCopilot from "./TradeDeskCopilot";
import DealOrigination from "./DealOrigination";
import AgentControlCenter from "./AgentControlCenter";
import NetworkView from "./NetworkView";
import PredictiveAlerts from "./PredictiveAlerts";
import OpportunityAutopilot from "./OpportunityAutopilot";
import AdaptiveWorkspace from "./AdaptiveWorkspace";
import AccessCenter from "./AccessCenter";
import ProfileCenter from "./ProfileCenter";
import AdminIntelligence from "./AdminIntelligence";
import DecisionMesh from "./DecisionMesh";
import CommandCenter from "./components/CommandCenter";
import LandingPage from "./components/LandingPage";

type Supplier = {
  id: string;
  name: string;
  country: string;
  products: string[];
  score: number;
  status: string;
  capacity: string;
  port: string;
  verified: string;
  risk: string;
};
type Buyer = {
  id: string;
  name: string;
  country: string;
  industry: string;
  activeDemands: number;
  credit: string;
};
type Demand = {
  id: string;
  buyer: string;
  product: string;
  quantity: number;
  unit: string;
  destination: string;
  incoterm: string;
  payment: string;
  status: string;
};
type Trade = {
  id: string;
  product: string;
  buyer: string;
  supplier: string;
  qty: number;
  value: number;
  status: string;
  risk: number;
};
type Match = { supplier: Supplier; matchScore: number; reasons: string[] };

const money = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const nav = [
  ["Command Center", Activity],
  ["My Tradeview", BrainCircuit],
  ["Daily Trade Command", Sparkles],
  ["Predictive Alerts", Bell],
  ["Decision Mesh", BrainCircuit],
  ["Buyer Workspace", Users],
  ["Seller Workspace", Building2],
  ["Global Entities", Globe2],
  ["Data Fabric", Database],
  ["Suppliers", Building2],
  ["Products", PackageSearch],
  ["RFQ & Tenders", Send],
  ["Quote Intelligence", BarChart3],
  ["Execution Center", GitBranch],
  ["Trades", BriefcaseBusiness],
  ["Trade Room", Layers3],
  ["Commercial Guardrails", Target],
  ["Intelligence", BarChart3],
  ["Deal Origination", Target],
  ["AI Agents", Bot],
  ["Risk & Compliance", ShieldCheck],
  ["Trade Finance", CircleDollarSign],
  ["Logistics", Ship],
  ["Documents", FileCheck2],
  ["Network Access", LockKeyhole],
  ["Revenue", TrendingUp],
  ["Profile & Verification", UserRound],
  ["Legal Center", FileCheck2],
  ["Admin Intelligence", Database],
] as const;
const languages = {
  en: "English",
  id: "Bahasa Indonesia",
  zh: "中文",
  ar: "العربية",
  es: "Español",
  fr: "Français",
  hi: "हिन्दी",
  pt: "Português",
} as const;
const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  id: {
    "Buyer Workspace": "Ruang Kerja Buyer",
    "Seller Workspace": "Ruang Kerja Seller",
    "Command Center": "Pusat Komando",
    "My Tradeview": "Tradeview Saya",
    "Daily Trade Command": "Komando Perdagangan Harian",
    "Predictive Alerts": "Peringatan Prediktif",
    "Decision Mesh": "Mesh Keputusan",
    "Global Entities": "Entitas Global",
    Suppliers: "Pemasok",
    Products: "Produk",
    "RFQ & Tenders": "RFQ & Tender",
    "Quote Intelligence": "Intelijen Penawaran",
    "Execution Center": "Pusat Eksekusi",
    Trades: "Perdagangan",
    "Trade Room": "Ruang Transaksi",
    "Commercial Guardrails": "Batasan Komersial",
    Intelligence: "Intelijen",
    "Deal Origination": "Origination Deal",
    "AI Agents": "Agen AI",
    "Risk & Compliance": "Risiko & Kepatuhan",
    "Trade Finance": "Pembiayaan Perdagangan",
    Logistics: "Logistik",
    Documents: "Dokumen",
    "Network Access": "Akses Jaringan",
    Revenue: "Pendapatan",
    "Profile & Verification": "Profil & Verifikasi",
    "Admin Intelligence": "Intelijen Admin",
    "New demand": "Permintaan baru",
    "Start sourcing": "Mulai sourcing",
    "View RFQs": "Lihat RFQ",
    "Parse + Match Suppliers": "Parse + Cocokkan Pemasok",
    "Create RFQ & launch supplier outreach":
      "Buat RFQ & mulai outreach pemasok",
    "Analyze & match": "Analisis & cocokkan",
    "Open RFQ": "Buka RFQ",
    "Open Trade Room": "Buka Ruang Transaksi",
    Advance: "Lanjutkan",
    Close: "Tutup",
    "Update supplier profile": "Perbarui profil pemasok",
    "Respond to RFQ": "Balas RFQ",
    "Systems operational": "Sistem operasional",
    "Procurement command center": "Pusat komando procurement",
    "Supply command center": "Pusat komando supply",
    "Source with AI": "Sourcing dengan AI",
    "My Active Demands": "Permintaan Aktif Saya",
    "Matched Buyer Demand": "Permintaan Buyer yang Cocok",
    "Seller Readiness": "Kesiapan Seller",
    "Complete verification": "Selesaikan verifikasi",
    "Try Free": "Coba Gratis",
    "Sign in": "Masuk",
    "Sign in securely": "Masuk dengan aman",
  },
  zh: {
    "Buyer Workspace": "买方工作台",
    "Seller Workspace": "卖方工作台",
    "Command Center": "指挥中心",
    "My Tradeview": "我的 Tradeview",
    "Daily Trade Command": "每日贸易指挥",
    "Predictive Alerts": "预测提醒",
    "Decision Mesh": "决策网",
    "Global Entities": "全球实体",
    Suppliers: "供应商",
    Products: "产品",
    "RFQ & Tenders": "RFQ 与招标",
    "Quote Intelligence": "报价智能",
    "Execution Center": "执行中心",
    Trades: "交易",
    "Trade Room": "交易室",
    "Commercial Guardrails": "商业护栏",
    Intelligence: "智能中心",
    "Deal Origination": "交易机会",
    "AI Agents": "AI 智能体",
    "Risk & Compliance": "风险与合规",
    "Trade Finance": "贸易融资",
    Logistics: "物流",
    Documents: "文件",
    "Network Access": "网络访问",
    Revenue: "收入",
    "Profile & Verification": "资料与验证",
    "Admin Intelligence": "管理智能",
    "New demand": "新需求",
    "Start sourcing": "开始采购",
    "View RFQs": "查看 RFQ",
    "Parse + Match Suppliers": "解析并匹配供应商",
    "Create RFQ & launch supplier outreach": "创建 RFQ 并发起供应商联系",
    "Analyze & match": "分析并匹配",
    "Open RFQ": "打开 RFQ",
    "Open Trade Room": "打开交易室",
    Advance: "推进",
    Close: "关闭",
    "Update supplier profile": "更新供应商资料",
    "Respond to RFQ": "回复 RFQ",
    "Systems operational": "系统运行正常",
    "Procurement command center": "采购指挥中心",
    "Supply command center": "供应指挥中心",
    "Source with AI": "AI 采购",
    "My Active Demands": "我的有效需求",
    "Matched Buyer Demand": "匹配的买方需求",
    "Seller Readiness": "卖方准备度",
    "Complete verification": "完成验证",
    "Try Free": "免费试用",
    "Sign in": "登录",
    "Sign in securely": "安全登录",
  },
  es: {
    "Buyer Workspace": "Espacio del comprador",
    "Seller Workspace": "Espacio del vendedor",
    "Command Center": "Centro de control",
    "My Tradeview": "Mi Tradeview",
    "Daily Trade Command": "Comando comercial diario",
    "Predictive Alerts": "Alertas predictivas",
    "Decision Mesh": "Malla de decisiones",
    "Global Entities": "Entidades globales",
    Suppliers: "Proveedores",
    Products: "Productos",
    "RFQ & Tenders": "RFQ y licitaciones",
    "Quote Intelligence": "Inteligencia de ofertas",
    "Execution Center": "Centro de ejecución",
    Trades: "Operaciones",
    "Trade Room": "Sala de operaciones",
    "Commercial Guardrails": "Controles comerciales",
    Intelligence: "Inteligencia",
    "Deal Origination": "Originación de acuerdos",
    "AI Agents": "Agentes de IA",
    "Risk & Compliance": "Riesgo y cumplimiento",
    "Trade Finance": "Financiación comercial",
    Logistics: "Logística",
    Documents: "Documentos",
    "Network Access": "Acceso a la red",
    Revenue: "Ingresos",
    "Profile & Verification": "Perfil y verificación",
    "Admin Intelligence": "Inteligencia administrativa",
    "New demand": "Nueva demanda",
    "Start sourcing": "Iniciar abastecimiento",
    "View RFQs": "Ver RFQ",
    "Parse + Match Suppliers": "Analizar y buscar proveedores",
    "Create RFQ & launch supplier outreach":
      "Crear RFQ e iniciar contacto con proveedores",
    "Analyze & match": "Analizar y comparar",
    "Open RFQ": "Abrir RFQ",
    "Open Trade Room": "Abrir sala de operaciones",
    Advance: "Avanzar",
    Close: "Cerrar",
    "Update supplier profile": "Actualizar perfil del proveedor",
    "Respond to RFQ": "Responder RFQ",
    "Systems operational": "Sistemas operativos",
    "Procurement command center": "Centro de control de compras",
    "Supply command center": "Centro de control de suministro",
    "Source with AI": "Abastecimiento con IA",
    "My Active Demands": "Mis demandas activas",
    "Matched Buyer Demand": "Demanda de compradores coincidente",
    "Seller Readiness": "Preparación del vendedor",
    "Complete verification": "Completar verificación",
    "Try Free": "Probar gratis",
    "Sign in": "Iniciar sesión",
    "Sign in securely": "Iniciar sesión de forma segura",
  },
  fr: {
    "Buyer Workspace": "Espace acheteur",
    "Seller Workspace": "Espace vendeur",
    "Command Center": "Centre de contrôle",
    "My Tradeview": "Mon Tradeview",
    "Daily Trade Command": "Commande commerciale quotidienne",
    "Predictive Alerts": "Alertes prédictives",
    "Decision Mesh": "Réseau de décision",
    "Global Entities": "Entités mondiales",
    Suppliers: "Fournisseurs",
    Products: "Produits",
    "RFQ & Tenders": "RFQ et appels d’offres",
    "Quote Intelligence": "Intelligence des offres",
    "Execution Center": "Centre d’exécution",
    Trades: "Transactions",
    "Trade Room": "Salle de transaction",
    "Commercial Guardrails": "Garde-fous commerciaux",
    Intelligence: "Intelligence",
    "Deal Origination": "Origination des transactions",
    "AI Agents": "Agents IA",
    "Risk & Compliance": "Risque et conformité",
    "Trade Finance": "Financement du commerce",
    Logistics: "Logistique",
    Documents: "Documents",
    "Network Access": "Accès réseau",
    Revenue: "Revenus",
    "Profile & Verification": "Profil et vérification",
    "Admin Intelligence": "Intelligence administrative",
    "New demand": "Nouvelle demande",
    "Start sourcing": "Démarrer le sourcing",
    "View RFQs": "Voir les RFQ",
    "Parse + Match Suppliers": "Analyser et trouver des fournisseurs",
    "Create RFQ & launch supplier outreach":
      "Créer le RFQ et contacter les fournisseurs",
    "Analyze & match": "Analyser et faire correspondre",
    "Open RFQ": "Ouvrir le RFQ",
    "Open Trade Room": "Ouvrir la salle de transaction",
    Advance: "Avancer",
    Close: "Fermer",
    "Update supplier profile": "Mettre à jour le profil fournisseur",
    "Respond to RFQ": "Répondre au RFQ",
    "Systems operational": "Systèmes opérationnels",
    "Procurement command center": "Centre de commande des achats",
    "Supply command center": "Centre de commande de l’offre",
    "Source with AI": "Sourcing avec IA",
    "My Active Demands": "Mes demandes actives",
    "Matched Buyer Demand": "Demande acheteur correspondante",
    "Seller Readiness": "Préparation vendeur",
    "Complete verification": "Terminer la vérification",
    "Try Free": "Essayer gratuitement",
    "Sign in": "Se connecter",
    "Sign in securely": "Se connecter en toute sécurité",
  },
  pt: {
    "Buyer Workspace": "Espaço do comprador",
    "Seller Workspace": "Espaço do vendedor",
    "Command Center": "Centro de comando",
    "My Tradeview": "Meu Tradeview",
    "Daily Trade Command": "Comando comercial diário",
    "Predictive Alerts": "Alertas preditivos",
    "Decision Mesh": "Malha de decisão",
    "Global Entities": "Entidades globais",
    Suppliers: "Fornecedores",
    Products: "Produtos",
    "RFQ & Tenders": "RFQ e licitações",
    "Quote Intelligence": "Inteligência de cotações",
    "Execution Center": "Centro de execução",
    Trades: "Transações",
    "Trade Room": "Sala de transações",
    "Commercial Guardrails": "Limites comerciais",
    Intelligence: "Inteligência",
    "Deal Origination": "Originação de negócios",
    "AI Agents": "Agentes de IA",
    "Risk & Compliance": "Risco e conformidade",
    "Trade Finance": "Financiamento comercial",
    Logistics: "Logística",
    Documents: "Documentos",
    "Network Access": "Acesso à rede",
    Revenue: "Receita",
    "Profile & Verification": "Perfil e verificação",
    "Admin Intelligence": "Inteligência administrativa",
    "New demand": "Nova demanda",
    "Start sourcing": "Iniciar sourcing",
    "View RFQs": "Ver RFQs",
    "Parse + Match Suppliers": "Analisar e combinar fornecedores",
    "Create RFQ & launch supplier outreach":
      "Criar RFQ e iniciar contato com fornecedores",
    "Analyze & match": "Analisar e combinar",
    "Open RFQ": "Abrir RFQ",
    "Open Trade Room": "Abrir sala de transações",
    Advance: "Avançar",
    Close: "Fechar",
    "Update supplier profile": "Atualizar perfil do fornecedor",
    "Respond to RFQ": "Responder à RFQ",
    "Systems operational": "Sistemas operacionais",
    "Procurement command center": "Centro de comando de compras",
    "Supply command center": "Centro de comando de oferta",
    "Source with AI": "Sourcing com IA",
    "My Active Demands": "Minhas demandas ativas",
    "Matched Buyer Demand": "Demanda de comprador compatível",
    "Seller Readiness": "Preparação do vendedor",
    "Complete verification": "Concluir verificação",
    "Try Free": "Experimentar grátis",
    "Sign in": "Entrar",
    "Sign in securely": "Entrar com segurança",
  },
  ar: {
    "Buyer Workspace": "مساحة المشتري",
    "Seller Workspace": "مساحة البائع",
    "Command Center": "مركز القيادة",
    "My Tradeview": "Tradeview الخاص بي",
    "Daily Trade Command": "قيادة التجارة اليومية",
    "Predictive Alerts": "تنبيهات تنبؤية",
    "Decision Mesh": "شبكة القرار",
    "Global Entities": "الكيانات العالمية",
    Suppliers: "الموردون",
    Products: "المنتجات",
    "RFQ & Tenders": "طلبات RFQ والمناقصات",
    "Quote Intelligence": "ذكاء عروض الأسعار",
    "Execution Center": "مركز التنفيذ",
    Trades: "المعاملات",
    "Trade Room": "غرفة التجارة",
    "Commercial Guardrails": "الحواجز التجارية",
    Intelligence: "الذكاء التجاري",
    "Deal Origination": "نشأة الصفقات",
    "AI Agents": "وكلاء الذكاء الاصطناعي",
    "Risk & Compliance": "المخاطر والامتثال",
    "Trade Finance": "تمويل التجارة",
    Logistics: "الخدمات اللوجستية",
    Documents: "المستندات",
    "Network Access": "الوصول إلى الشبكة",
    Revenue: "الإيرادات",
    "Profile & Verification": "الملف والتحقق",
    "Admin Intelligence": "ذكاء الإدارة",
    "New demand": "طلب جديد",
    "Start sourcing": "بدء التوريد",
    "View RFQs": "عرض RFQ",
    "Parse + Match Suppliers": "تحليل ومطابقة الموردين",
    "Create RFQ & launch supplier outreach":
      "إنشاء RFQ وبدء التواصل مع الموردين",
    "Analyze & match": "تحليل ومطابقة",
    "Open RFQ": "فتح RFQ",
    "Open Trade Room": "فتح غرفة التجارة",
    Advance: "تقدم",
    Close: "إغلاق",
    "Update supplier profile": "تحديث ملف المورد",
    "Respond to RFQ": "الرد على RFQ",
    "Systems operational": "الأنظمة تعمل",
    "Procurement command center": "مركز قيادة المشتريات",
    "Supply command center": "مركز قيادة العرض",
    "Source with AI": "التوريد بالذكاء الاصطناعي",
    "My Active Demands": "طلباتي النشطة",
    "Matched Buyer Demand": "طلبات المشترين المطابقة",
    "Seller Readiness": "جاهزية البائع",
    "Complete verification": "أكمل التحقق",
    "Try Free": "جرّب مجاناً",
    "Sign in": "تسجيل الدخول",
    "Sign in securely": "تسجيل الدخول بأمان",
  },
  hi: {
    "Buyer Workspace": "बायर वर्कस्पेस",
    "Seller Workspace": "सेलर वर्कस्पेस",
    "Command Center": "कमांड सेंटर",
    "My Tradeview": "मेरा Tradeview",
    "Daily Trade Command": "दैनिक ट्रेड कमांड",
    "Predictive Alerts": "पूर्वानुमान अलर्ट",
    "Decision Mesh": "निर्णय जाल",
    "Global Entities": "वैश्विक इकाइयाँ",
    Suppliers: "आपूर्तिकर्ता",
    Products: "उत्पाद",
    "RFQ & Tenders": "RFQ और टेंडर",
    "Quote Intelligence": "कोट इंटेलिजेंस",
    "Execution Center": "एक्जीक्यूशन सेंटर",
    Trades: "ट्रेड्स",
    "Trade Room": "ट्रेड रूम",
    "Commercial Guardrails": "कमर्शियल गार्डरेल्स",
    Intelligence: "इंटेलिजेंस",
    "Deal Origination": "डील ऑरिजिनेशन",
    "AI Agents": "AI एजेंट",
    "Risk & Compliance": "जोखिम और अनुपालन",
    "Trade Finance": "ट्रेड फाइनेंस",
    Logistics: "लॉजिस्टिक्स",
    Documents: "दस्तावेज़",
    "Network Access": "नेटवर्क एक्सेस",
    Revenue: "राजस्व",
    "Profile & Verification": "प्रोफ़ाइल और सत्यापन",
    "Admin Intelligence": "एडमिन इंटेलिजेंस",
    "New demand": "नई मांग",
    "Start sourcing": "सोर्सिंग शुरू करें",
    "View RFQs": "RFQ देखें",
    "Parse + Match Suppliers": "विश्लेषण और सप्लायर मैच",
    "Create RFQ & launch supplier outreach":
      "RFQ बनाएं और सप्लायर संपर्क शुरू करें",
    "Analyze & match": "विश्लेषण और मैच",
    "Open RFQ": "RFQ खोलें",
    "Open Trade Room": "ट्रेड रूम खोलें",
    Advance: "आगे बढ़ें",
    Close: "बंद करें",
    "Update supplier profile": "सप्लायर प्रोफ़ाइल अपडेट करें",
    "Respond to RFQ": "RFQ का जवाब दें",
    "Systems operational": "सिस्टम सक्रिय",
    "Procurement command center": "प्रोक्योरमेंट कमांड सेंटर",
    "Supply command center": "सप्लाई कमांड सेंटर",
    "Source with AI": "AI से सोर्सिंग",
    "My Active Demands": "मेरी सक्रिय मांगें",
    "Matched Buyer Demand": "मिलान वाली बायर मांग",
    "Seller Readiness": "सेलर तैयारी",
    "Complete verification": "सत्यापन पूरा करें",
    "Try Free": "मुफ़्त आज़माएँ",
    "Sign in": "साइन इन",
    "Sign in securely": "सुरक्षित साइन इन",
  },
};
function applyUILanguage(language: keyof typeof languages) {
  if (typeof document === "undefined") return;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  if (language === "en") return;
  const map = UI_TRANSLATIONS[language] || {};
  Array.from(document.body.querySelectorAll<HTMLElement>("*")).forEach((el) => {
    if (
      el.children.length > 0 ||
      [
        "SCRIPT",
        "STYLE",
        "PRE",
        "TEXTAREA",
        "INPUT",
        "SELECT",
        "OPTION",
      ].includes(el.tagName)
    )
      return;
    const raw = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (map[raw]) el.textContent = map[raw];
  });
}

function App() {
  const [section, setSection] = useState("Command Center");
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [demandText, setDemandText] = useState("");
  const [parsed, setParsed] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [toast, setToast] = useState("");
  const [role, setRole] = useState<"Operator" | "Buyer" | "Seller">("Operator");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [returningUser, setReturningUser] = useState(() => {
    try {
      return localStorage.getItem("tradevance-returning-user") === "1";
    } catch {
      return false;
    }
  });
  const [onboardCompany, setOnboardCompany] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return localStorage.getItem("tradevance-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });
  const [language, setLanguage] = useState<keyof typeof languages>(() => {
    try {
      return (
        (localStorage.getItem(
          "tradevance-language",
        ) as keyof typeof languages) || "en"
      );
    } catch {
      return "en";
    }
  });
  const systemLabel =
    language === "id"
      ? "Kontrol produksi aktif"
      : language === "zh"
        ? "生产治理已启用"
        : language === "ar"
          ? "ضوابط الإنتاج مفعلة"
          : language === "es"
            ? "Controles de producción activos"
            : language === "fr"
              ? "Contrôles de production actifs"
              : language === "hi"
                ? "प्रोडक्शन नियंत्रण सक्रिय"
                : language === "pt"
                  ? "Controles de produção ativos"
                  : "Production controls active";
  const [data, setData] = useState<{
    suppliers: Supplier[];
    buyers: Buyer[];
    demands: Demand[];
    trades: Trade[];
  }>({ suppliers: [], buyers: [], demands: [], trades: [] });
  const [creatingRfQ, setCreatingRfQ] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("tradevance-theme", theme);
    } catch (e) {}
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem("tradevance-language", language);
    } catch (e) {}
    applyUILanguage(language);
  }, [language, section, user]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await auth.getUser();
        if (!alive) return;
        setUser(u);
        if (u) {
          const m = await api.get("/api/me");
          setProfile(m.data.user);
          setRole(
            m.data.user.role === "seller"
              ? "Seller"
              : m.data.user.role === "buyer"
                ? "Buyer"
                : "Operator",
          );
          if (m.data.user.role !== "pending") {
            const r = await api.get("/api/bootstrap");
            setData(r.data);
            setSection(
              m.data.user.role === "buyer"
                ? "Buyer Workspace"
                : m.data.user.role === "seller"
                  ? "Seller Workspace"
                  : "Command Center",
            );
          }
        }
      } finally {
        if (alive) setAuthLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const filteredSuppliers = useMemo(
    () =>
      data.suppliers.filter(
        (s) =>
          !query ||
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.products.some((p) => p.toLowerCase().includes(query.toLowerCase())),
      ),
    [data.suppliers, query],
  );
  const workspaceNav = useMemo(
    () =>
      profile?.role === "operator"
        ? ["Buyer Workspace", "Seller Workspace"]
        : profile?.role === "buyer"
          ? ["Buyer Workspace"]
          : profile?.role === "seller"
            ? ["Seller Workspace"]
            : [],
    [profile?.role],
  );
  const visibleNav = useMemo(
    () =>
      nav
        .filter(
          ([label]) =>
            label !== "Buyer Workspace" && label !== "Seller Workspace",
        )
        .filter(
          ([label]) => label !== "Data Fabric" || profile?.role === "operator",
        )
        .map(
          ([label, Icon]) =>
            (profile?.role === "seller" && label === "Suppliers"
              ? ["Buyer Network", Users]
              : [label, Icon]) as const,
        )
        .filter(
          ([label]) =>
            profile?.role === "operator" ||
            (profile?.role === "buyer"
              ? label !== "Buyer Network"
              : label !== "Suppliers"),
        ),
    [profile?.role],
  );
  const signIn = async (preferredRole?: "buyer" | "seller") => {
    try {
      if (preferredRole) {
        try {
          localStorage.setItem("tradevance-entry-role", preferredRole);
        } catch (e) {}
      }
      const r = await auth.signIn();
      try {
        localStorage.setItem("tradevance-returning-user", "1");
      } catch (e) {}
      setReturningUser(true);
      setUser(r.user);
      const m = await api.get("/api/me");
      setProfile(m.data.user);
      trackEvent("login_success", { role: m.data.user.role });
      setRole(
        m.data.user.role === "seller"
          ? "Seller"
          : m.data.user.role === "buyer"
            ? "Buyer"
            : "Operator",
      );
      if (m.data.user.role === "pending") {
        setToast("Choose Buyer or Seller to finish onboarding.");
      } else {
        const b = await api.get("/api/bootstrap");
        setData(b.data);
        setSection(
          m.data.user.role === "buyer"
            ? "Buyer Workspace"
            : m.data.user.role === "seller"
              ? "Seller Workspace"
              : "Command Center",
        );
      }
    } catch {
      setToast("Sign-in was cancelled or failed.");
    }
  };
  const signOut = async () => {
    try {
      localStorage.setItem("tradevance-returning-user", "1");
    } catch (e) {}
    setReturningUser(true);
    await auth.signOut();
    trackEvent("logout", { role: profile?.role || "unknown" });
    setUser(null);
    setProfile(null);
    setData({ suppliers: [], buyers: [], demands: [], trades: [] });
    setSection("Command Center");
  };
  const finishOnboarding = async (
    nextRole: "buyer" | "seller",
    company: string,
  ) => {
    try {
      const r = await api.post("/api/profile", { role: nextRole, company });
      setProfile(r.data);
      setRole(nextRole === "buyer" ? "Buyer" : "Seller");
      const b = await api.get("/api/bootstrap");
      setData(b.data);
      setSection(nextRole === "buyer" ? "Buyer Workspace" : "Seller Workspace");
    } catch {
      setToast("Could not save onboarding.");
    }
  };
  const runParse = async () => {
    if (!demandText.trim()) return;
    try {
      const r = await api.post("/api/ai/parse-demand", { text: demandText });
      setParsed(r.data);
      const m = await api.post("/api/match", { demand: r.data });
      setMatches(m.data.matches);
      setToast("AI requirement parsed and supplier matches ranked.");
    } catch {
      setToast("AI sourcing failed. Please refine the request.");
    }
  };
  const createDemand = async () => {
    if (!parsed || !requireVerified() || creatingRfQ) return;
    setCreatingRfQ(true);
    try {
      const r = await api.post("/api/demands", {
        ...parsed,
        buyer: profile?.company || profile?.name || "Your organization",
      });
      const results = await Promise.allSettled(
        matches
          .slice(0, 5)
          .map((m) =>
            api.post("/api/introductions", {
              targetType: "seller",
              targetEntityId: m.supplier.id,
              targetName: m.supplier.name,
              product: parsed.product,
              purpose: "RFQ supplier outreach",
            }),
          ),
      );
      const outreach = results.filter((x) => x.status === "fulfilled").length;
      setData((d) => ({ ...d, demands: [r.data, ...d.demands] }));
      setSection("RFQ & Tenders");
      setToast(
        `RFQ ${r.data.id} created. ${outreach} controlled supplier outreach request${outreach === 1 ? "" : "s"} created.`,
      );
    } catch {
      setToast("RFQ could not be created. No supplier outreach was sent.");
    } finally {
      setCreatingRfQ(false);
    }
  };
  const advance = async (id: string) => {
    try {
      const r = await api.post("/api/trades/" + id + "/advance", {});
      setData((d) => ({
        ...d,
        trades: d.trades.map((t) =>
          t.id === id ? { ...t, status: r.data.status } : t,
        ),
      }));
      setToast("Trade workflow advanced.");
    } catch {
      setToast("Trade update failed.");
    }
  };
  const trackEvent = async (event: string, meta: any = {}) => {
    try {
      const visitorId =
        localStorage.getItem("tradevance-visitor-id") || crypto.randomUUID();
      localStorage.setItem("tradevance-visitor-id", visitorId);
      const sessionId =
        sessionStorage.getItem("tradevance-session-id") || crypto.randomUUID();
      sessionStorage.setItem("tradevance-session-id", sessionId);
      await api.post("/api/analytics/event", {
        event,
        page: window.location.pathname,
        visitorId,
        sessionId,
        userId: profile?.userId || null,
        language,
        referrer: document.referrer || "direct",
        screenWidth: window.innerWidth,
        meta,
      });
    } catch (e) {}
  };
  const navTo = (s: string) => {
    setSection(s);
    setMobile(false);
    trackEvent("section_view", { section: s });
  };
  const isVerified =
    profile?.role === "operator" || profile?.verificationStatus === "verified";
  const requireVerified = () => {
    if (!isVerified) {
      setToast(
        "Verification is required before transactional actions are enabled. Complete Profile & Verification first.",
      );
      return false;
    }
    return true;
  };
  if (authLoading)
    return (
      <LandingPage
        loading
        returningUser={returningUser}
        languages={languages}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        onSignIn={signIn}
      />
    );
  if (!user)
    return (
      <LandingPage
        returningUser={returningUser}
        languages={languages}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        onSignIn={signIn}
      />
    );
  if (profile?.role === "pending")
    return (
      <div className="auth-gate">
        <div className="auth-card onboarding-card">
          <div className="onboarding-logo">
            <TradevanceOriginalLogo />
          </div>
          <h1>Complete your workspace</h1>
          <p>Choose how your organization participates in Tradevance.</p>
          <input
            className="onboard-input"
            value={onboardCompany}
            onChange={(e) => setOnboardCompany(e.target.value)}
            placeholder="Company / organization name"
          />
          <div className="onboard-actions">
            <button
              className="btn primary"
              disabled={!onboardCompany.trim()}
              onClick={() => finishOnboarding("buyer", onboardCompany.trim())}
            >
              <Users size={16} /> Continue as Buyer
            </button>
            <button
              className="btn secondary"
              disabled={!onboardCompany.trim()}
              onClick={() => finishOnboarding("seller", onboardCompany.trim())}
            >
              <Building2 size={16} /> Continue as Seller
            </button>
          </div>
          <small>
            Operator access is restricted to the application owner or authorized
            administration.
          </small>
        </div>
      </div>
    );
  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="icon-btn mobile-only"
          onClick={() => setMobile(true)}
        >
          <Menu size={19} />
        </button>
        <div className="brand brand-logo-lockup">
          <TradevanceOriginalLogo />
        </div>
        <div className="global-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === "id"
                ? "Apa yang Anda cari? Supplier, buyer, trade, produk..."
                : "What are you looking for? Supplier, buyer, trade, product..."
            }
          />
          <kbd>⌘ K</kbd>
        </div>
        <div className="top-actions">
          <button
            className="status-chip-btn"
            onClick={() => navTo("Risk & Compliance")}
            title="Open Risk & Compliance controls"
          >
            <span className="status-dot" />
            <span className="online">{systemLabel}</span>
          </button>
          <div className="utility-switch">
            <select
              aria-label="Language"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as keyof typeof languages)
              }
            >
              {Object.entries(languages).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <button
              aria-label="Toggle dark mode"
              className="theme-btn"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
          <div className="role-pill">
            <span className="role-pill-dot" />
            {role} · {isVerified ? "Verified" : "Not verified"}
          </div>
          <button
            className="icon-btn"
            aria-label="Open predictive alerts"
            onClick={() => navTo("Predictive Alerts")}
          >
            <Bell size={18} />
          </button>
          <button
            className="avatar"
            aria-label="Open profile"
            onClick={() => navTo("Profile & Verification")}
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Profile" />
            ) : (
              "YB"
            )}
          </button>
        </div>
      </header>
      <div className="layout">
        <aside className={mobile ? "sidebar open" : "sidebar"}>
          <div className="side-head">
            <span>TRADEVANCE OS</span>
            <button className="icon-btn" onClick={() => setMobile(false)}>
              <X size={17} />
            </button>
          </div>
          <div className="workspace-pins">
            {workspaceNav.map((label) => {
              const Icon = label === "Buyer Workspace" ? Users : Building2;
              return (
                <button
                  key={label}
                  className={
                    section === label
                      ? "nav-item workspace-pin active"
                      : "nav-item workspace-pin"
                  }
                  onClick={() => navTo(label)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  <span className="workspace-dot">OS</span>
                </button>
              );
            })}
          </div>
          <div className="side-nav-scroll">
            {visibleNav.map(([label, Icon]) => (
              <button
                key={label}
                className={section === label ? "nav-item active" : "nav-item"}
                onClick={() => navTo(label)}
              >
                <Icon size={17} />
                <span>{label}</span>
                {["AI Agents", "Risk & Compliance"].includes(label) && (
                  <span className="nav-badge">AI</span>
                )}
              </button>
            ))}
          </div>
          <div className="side-bottom">
            <div className="mini-card">
              <div className="mini-label">ACCOUNT</div>
              <b>{profile?.company || profile?.name || role + " Workspace"}</b>
              <small>{role} account · access controlled</small>
            </div>
            <button className="nav-item" onClick={signOut}>
              <PanelLeft size={17} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>
        <main className="main">
          <FocusBar
            role={role}
            section={section}
            verified={isVerified}
            onNavigate={navTo}
          />
          {section === "My Tradeview" ? (
            <AdaptiveWorkspace role={role} onNavigate={navTo} />
          ) : section === "Daily Trade Command" ? (
            <OpportunityAutopilot onNavigate={navTo} />
          ) : section === "Predictive Alerts" ? (
            <PredictiveAlerts onNavigate={navTo} />
          ) : section === "Decision Mesh" ? (
            <DecisionMesh onNavigate={navTo} role={role} />
          ) : section === "Commercial Guardrails" ? (
            <CommercialGuardrails />
          ) : section === "Admin Intelligence" ? (
            <AdminIntelligence />
          ) : section === "Profile & Verification" ? (
            <ProfileCenter onToast={setToast} />
          ) : section === "Data Fabric" ? (
            <DataFabric />
          ) : section === "Network Access" ? (
            <AccessCenter />
          ) : section === "Legal Center" ? (
            <LegalCenter />
          ) : section === "Global Entities" ? (
            <EntityIntelligence />
          ) : section === "Quote Intelligence" ? (
            <QuoteIntelligence onNavigate={navTo} />
          ) : section === "Execution Center" ? (
            <ExecutionCenter />
          ) : section === "Intelligence" ? (
            <IntelligenceCenter />
          ) : section === "Deal Origination" ? (
            <DealOrigination onNavigate={setSection} />
          ) : section === "AI Agents" ? (
            <AgentControlCenter onNavigate={setSection} />
          ) : section === "Buyer Network" ? (
            <NetworkView mode="buyers" data={data} />
          ) : section === "Supplier Network" ? (
            <NetworkView mode="suppliers" data={data} />
          ) : section === "Command Center" ? (
            <CommandCenter
              data={data}
              demandText={demandText}
              setDemandText={setDemandText}
              parsed={parsed}
              matches={matches}
              runParse={runParse}
              createDemand={createDemand}
              creatingRfQ={creatingRfQ}
              advance={advance}
            />
          ) : section === "Buyer Workspace" ? (
            <BuyerWorkspace
              data={data}
              demandText={demandText}
              setDemandText={setDemandText}
              parsed={parsed}
              matches={matches}
              runParse={runParse}
              createDemand={createDemand}
              creatingRfQ={creatingRfQ}
              setSection={setSection}
            />
          ) : section === "Seller Workspace" ? (
            <SellerWorkspace
              data={data}
              setToast={setToast}
              setSection={setSection}
            />
          ) : (
            <SectionView
              section={section}
              suppliers={filteredSuppliers}
              data={data}
              matches={matches}
              setMatches={setMatches}
              onCreate={() => {
                setSection("Buyer Workspace");
                setRole("Buyer");
              }}
              onNavigate={setSection}
            />
          )}
        </main>
      </div>
      {toast && (
        <div className="toast">
          <CheckCircle text={toast} />
          <button onClick={() => setToast("")}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function CheckCircle({ text }: { text: string }) {
  return (
    <>
      <ShieldCheck size={17} />
      <span>{text}</span>
    </>
  );
}
function TradevanceOriginalLogo() {
  return (
    <img
      className="tradevance-original-logo"
      src="/resources/tradevance-original-logo.png"
      alt="Tradevance Global Resources"
    />
  );
}

function BuyerWorkspace({
  data,
  demandText,
  setDemandText,
  parsed,
  matches,
  runParse,
  createDemand,
  creatingRfQ,
  setSection,
}: {
  data: {
    suppliers: Supplier[];
    buyers: Buyer[];
    demands: Demand[];
    trades: Trade[];
  };
  demandText: string;
  setDemandText: (v: string) => void;
  parsed: any;
  matches: Match[];
  runParse: () => void;
  createDemand: () => void;
  creatingRfQ: boolean;
  setSection: (x: string) => void;
}) {
  const buyer = data.buyers[0];
  const myDemands = data.demands.filter(
    (d) => d.buyer === buyer?.name || false,
  );
  return (
    <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
            <Users size={14} /> BUYER WORKSPACE
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Procurement command center</h2>
          <p className="text-[#75818d] text-sm max-w-2xl">
            Start with one requirement. Tradevance will structure it, find
            qualified supply and guide you to the next decision.
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shrink-0 shadow-lg shadow-blue-500/20"
          onClick={() =>
            document
              .getElementById("buyer-demand")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <Sparkles size={16} /> New demand
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
            {buyer?.name.slice(0, 2).toUpperCase() || "BU"}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{buyer?.name || "Your Buyer Organization"}</h3>
          <p className="text-[#75818d] text-sm mb-6">
            {buyer?.industry || "Industrial procurement"} ·{" "}
            {buyer?.country || "Global"}
          </p>
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4">
              <b className="text-2xl font-mono text-white block mb-1">{buyer?.activeDemands || 0}</b>
              <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Active demands</small>
            </div>
            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4">
              <b className="text-2xl font-mono text-green-400 block mb-1">{buyer?.credit || "Strong"}</b>
              <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Credit standing</small>
            </div>
          </div>
          <button
            className="w-full bg-[#202b36] hover:bg-[#4f5b67] text-white py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors mt-auto"
            onClick={() => setSection("RFQ & Tenders")}
          >
            View RFQs <ArrowRight size={15} />
          </button>
        </section>
        
        <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-6 shadow-xl lg:col-span-2 flex flex-col relative overflow-hidden" id="buyer-demand">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 flex items-start gap-4 mb-6">
            <div className="bg-blue-500/20 text-blue-400 p-2.5 rounded-lg border border-blue-500/30 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Source with AI</h3>
              <p className="text-[#75818d] text-sm">Define requirement once; Tradevance builds the sourcing strategy.</p>
            </div>
          </div>
          
          <textarea
            className="relative z-10 w-full bg-[#070b10] border border-[#202b36] rounded-lg p-4 text-[#eef2f6] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all min-h-[120px] mb-4 text-sm resize-y"
            value={demandText}
            onChange={(e) => setDemandText(e.target.value)}
            placeholder="50,000 MT sulphur, CIF Tanga, September, confirmed DLC at sight..."
          />
          <button 
            className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg shadow-blue-500/20 self-start" 
            onClick={runParse}
          >
            Parse + Match Suppliers <ArrowRight size={15} />
          </button>
          
          {parsed && (
            <div className="relative z-10 mt-6 pt-6 border-t border-[#202b36]">
              <ParsedDemand
                parsed={parsed}
                matches={matches}
                onCreate={createDemand}
                busy={creatingRfQ}
              />
            </div>
          )}
        </section>
      </div>
      
      <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#202b36]">
          <div className="bg-[#202b36] text-white p-2.5 rounded-lg border border-[#4f5b67] shrink-0">
            <Send size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">My Active Demands</h3>
            <p className="text-[#75818d] text-sm">RFQs and supplier matching status</p>
          </div>
        </div>
        
        {myDemands.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDemands.map((d) => (
              <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 hover:border-[#4f5b67] transition-all group relative overflow-hidden" key={d.id}>
                <div className="absolute top-0 right-0 p-4 opacity-10 text-white group-hover:opacity-20 transition-opacity">
                    <Send size={64} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Send size={16} className="text-[#75818d]" />
                        <h3 className="font-mono text-sm font-bold text-white">{d.id}</h3>
                    </div>
                    <p className="text-[#eef2f6] text-lg font-bold mb-2">
                    {d.product}
                    </p>
                    <p className="text-blue-400 font-mono text-sm mb-4">
                        {d.quantity.toLocaleString()} {d.unit}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-[#202b36] text-[#eef2f6] text-[10px] rounded uppercase tracking-widest font-bold">{d.incoterm}</span>
                        <span className="px-2 py-1 bg-[#202b36] text-[#eef2f6] text-[10px] rounded uppercase tracking-widest font-bold">{d.destination}</span>
                        <span className="px-2 py-1 bg-[#202b36] text-[#eef2f6] text-[10px] rounded uppercase tracking-widest font-bold">{d.payment}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold tracking-widest uppercase rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        {d.status}
                    </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0c131b] border border-dashed border-[#202b36] rounded-xl p-12 text-center text-[#75818d]">
            No demands yet. Start an AI sourcing request above.
          </div>
        )}
      </section>
    </div>
  );
}
function SellerWorkspace({
  data,
  setToast,
  setSection,
}: {
  data: {
    suppliers: Supplier[];
    buyers: Buyer[];
    demands: Demand[];
    trades: Trade[];
  };
  setToast: (x: string) => void;
  setSection: (x: string) => void;
}) {
  const s = data.suppliers[0];
  const matched = data.demands.filter((d) =>
    s?.products.some((p) =>
      p.toLowerCase().includes(d.product.toLowerCase().split(" ")[0]),
    ),
  );
  return (
    <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
            <Building2 size={14} /> SELLER WORKSPACE
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Supply command center</h2>
          <p className="text-[#75818d] text-sm max-w-2xl">
            Complete your proof once, get discovered by qualified buyers and
            respond to the right demand with less noise.
          </p>
        </div>
        <button
          className="bg-[#202b36] hover:bg-[#4f5b67] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shrink-0"
          onClick={() => setSection("Profile & Verification")}
        >
          Update supplier profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#c29631]/20 text-[#c29631] border border-[#c29631]/30 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
            {s?.name.slice(0, 2).toUpperCase() || "SL"}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{s?.name || "Your Supplier Organization"}</h3>
          <p className="text-[#75818d] text-sm mb-6">
            {s?.country || "Global"} · {s?.port || "Port to confirm"}
          </p>
          <div className="bg-[#0c131b] border border-[#202b36] rounded-full px-6 py-3 flex items-center gap-3 mb-6">
            <b className="text-[#c29631] text-2xl font-mono">{s?.score || 0}</b>
            <span className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Trust Score</span>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-auto">
            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4">
              <b className="text-lg font-mono text-white block mb-1 truncate">{s?.capacity || "—"}</b>
              <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Capacity</small>
            </div>
            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4">
              <b className="text-sm text-green-400 block mb-1 truncate pt-1">{s?.verified || "—"}</b>
              <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Verification</small>
            </div>
          </div>
        </section>
        
        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl lg:col-span-2 flex flex-col">
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#202b36]">
            <div className="bg-blue-500/20 text-blue-400 p-2.5 rounded-lg border border-blue-500/30 shrink-0">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Matched Buyer Demand</h3>
              <p className="text-[#75818d] text-sm">AI-ranked opportunities for your supply profile</p>
            </div>
          </div>
          
          {matched.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
              {matched.map((d) => (
                <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 hover:border-blue-500/50 transition-all group flex flex-col" key={d.id}>
                  <div className="flex items-start gap-3 mb-3">
                    <Target size={16} className="text-blue-400 shrink-0 mt-1" />
                    <h3 className="text-white font-bold">{d.product}</h3>
                  </div>
                  <p className="text-blue-400 font-mono text-sm mb-3">
                    {d.quantity.toLocaleString()} {d.unit} <span className="text-[#75818d]">·</span> <span className="text-[#eef2f6]">{d.destination}</span>
                  </p>
                  <div className="flex gap-2 mb-5">
                    <span className="px-2 py-1 bg-[#202b36] text-[#eef2f6] text-[10px] rounded uppercase tracking-widest font-bold">{d.incoterm}</span>
                    <span className="px-2 py-1 bg-[#202b36] text-[#eef2f6] text-[10px] rounded uppercase tracking-widest font-bold">{d.payment}</span>
                  </div>
                  <button
                    className="mt-auto w-full bg-[#202b36] hover:bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                    onClick={() => setSection("RFQ & Tenders")}
                  >
                    Respond to RFQ
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#0c131b] border border-dashed border-[#202b36] rounded-xl p-8 text-center text-[#75818d]">
              No current buyer demand matches this profile.
            </div>
          )}
        </section>
      </div>
      
      <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#202b36]">
          <div className="bg-green-500/20 text-green-400 p-2.5 rounded-lg border border-green-500/30 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Seller Readiness</h3>
            <p className="text-[#75818d] text-sm">What increases your match probability</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            [
              "Proof of product",
              "Upload current stock/allocation evidence",
              "Critical",
            ],
            ["Export history", "Connect shipment evidence", "High value"],
            [
              "Quality certificates",
              "Keep COA/inspection current",
              "High value",
            ],
            [
              "Commercial terms",
              "Define Incoterms + payment terms",
              "High value",
            ],
            ["Capacity", "Keep monthly availability current", "Medium"],
          ].map((x) => (
            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-5 flex flex-col" key={x[0]}>
              <b className="text-white text-sm mb-2">{x[0]}</b>
              <span className="text-[#75818d] text-xs mb-4 flex-1">{x[1]}</span>
              <label className={`self-start px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${
                  x[2] === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  x[2] === 'High value' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>{x[2]}</label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
function ParsedDemand({
  parsed,
  matches,
  onCreate,
  busy,
}: {
  parsed: any;
  matches: Match[];
  onCreate: () => void;
  busy?: boolean;
}) {
  return (
    <div className="bg-[#0c131b] border border-blue-500/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-[#202b36] bg-[#101922]">
        <div>
          <small className="text-[#c29631] text-[10px] font-bold tracking-widest uppercase block mb-1">AI REQUIREMENT OBJECT</small>
          <b className="text-white text-lg">
            {parsed.product} <span className="text-[#75818d] mx-2">·</span> <span className="text-blue-400 font-mono">{Number(parsed.quantity || 0).toLocaleString()} {parsed.unit}</span>
          </b>
        </div>
        <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-2">
            <CheckSquare size={14} />
            {parsed.confidence}% confidence
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-[#202b36] border-b border-[#202b36]">
        {[
          ["Destination", parsed.destination],
          ["Incoterm", parsed.incoterm],
          ["Payment", parsed.payment],
          ["Delivery", parsed.delivery],
          ["Quality", parsed.quality],
        ].map(([k, v]) => (
          <div key={String(k)} className="p-4 flex flex-col justify-center">
            <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase mb-1">{k}</small>
            <b className="text-[#eef2f6] text-sm truncate">{v || "Flexible"}</b>
          </div>
        ))}
      </div>
      
      <div className="p-5 flex flex-col lg:flex-row items-center gap-6 bg-[#070b10]">
        <div className="flex-1 w-full">
          <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase block mb-2">TOP MATCHES</small>
          <div className="flex items-center gap-3 mb-3">
              <b className="text-white text-sm">{matches.length} qualified suppliers</b>
          </div>
          <div className="flex flex-wrap gap-2">
            {matches.slice(0, 3).map((m) => (
              <span key={m.supplier.id} className="bg-[#101922] border border-[#202b36] text-[#eef2f6] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                {m.supplier.name} <span className="text-blue-400 font-mono">{m.matchScore}%</span>
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0">
            <button 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg shadow-blue-500/20" 
                disabled={busy} 
                onClick={onCreate}
            >
                {busy
                ? "Creating RFQ & outreach…"
                : "Create RFQ & launch supplier outreach"}{" "}
                <ChevronRight size={18} />
            </button>
            <div className="text-[#75818d] text-[11px] text-center max-w-xs">
                {matches.length
                ? `Top ${Math.min(5, matches.length)} matched suppliers will receive a controlled introduction request after the RFQ is created.`
                : "The RFQ will be created first; supplier outreach starts when qualified matches are available."}
            </div>
        </div>
      </div>
    </div>
  );
}
function FocusBar({
  role,
  section,
  verified,
  onNavigate,
}: {
  role: string;
  section: string;
  verified: boolean;
  onNavigate: (x: string) => void;
}) {
  const isBuyer = role === "Buyer";
  const isSeller = role === "Seller";
  let title = "Operator control center";
  let text =
    "Monitor trust, compliance, opportunities and live trade operations. Start with the queue that needs a decision today.";
  let action = "Open Risk & Compliance";
  let target = "Risk & Compliance";
  if (isBuyer) {
    title = verified ? "Buyer workflow is ready" : "Finish verification first";
    text = verified
      ? "Describe one requirement, qualify supply, then launch an RFQ. Tradevance will guide you through the next commercial step."
      : "Complete Profile & Verification to unlock RFQs, introductions and other transactional actions.";
    action = verified ? "Start sourcing" : "Complete verification";
    target = verified ? "Buyer Workspace" : "Profile & Verification";
  } else if (isSeller) {
    title = verified ? "Seller workflow is ready" : "Finish verification first";
    text = verified
      ? "Keep your capability current, review matched buyer demand and respond to the opportunities that fit your supply."
      : "Complete Profile & Verification so buyers can trust and Tradevance can qualify your supply correctly.";
    action = verified ? "Open buyer demand" : "Complete verification";
    target = verified ? "Buyer Network" : "Profile & Verification";
  } else if (section === "Trade Room" || section === "Execution Center") {
    title = "One deal. One next action.";
    text =
      "Review the risk decision, commercial mandate and document readiness before moving the trade forward.";
    action = "Open Risk & Compliance";
    target = "Risk & Compliance";
  }
  return (
    <div className="bg-gradient-to-r from-blue-600/10 to-transparent border-l-4 border-blue-500 bg-[#101922] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-r-lg mb-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-blue-500/20 text-blue-400 p-2 rounded shrink-0 mt-0.5">
          <Sparkles size={16} />
        </div>
        <div>
          <b className="text-white text-sm block mb-1">{title}</b>
          <span className="text-[#75818d] text-xs leading-relaxed">{text}</span>
        </div>
      </div>
      <button 
        className="bg-[#202b36] hover:bg-[#4f5b67] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors shrink-0 whitespace-nowrap" 
        onClick={() => onNavigate(target)}
      >
        {action} <ArrowRight size={14} />
      </button>
    </div>
  );
}
function Metric({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
}) {
  return (
    <div className="bg-[#101922] border border-[#202b36] p-5 rounded-xl flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-3">
          <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">{title}</small>
          <div className="text-[#4f5b67]">
            <Icon size={16} />
          </div>
      </div>
      <strong className="text-white text-2xl font-mono mb-2">{value}</strong>
      <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
        <TrendingUp size={12} />
        {change}
      </span>
    </div>
  );
}
function PanelTitle({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: any;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[#202b36]">
      <div className="flex items-start gap-4">
          <div className="bg-[#202b36] text-[#eef2f6] p-2.5 rounded-lg border border-[#4f5b67] shrink-0">
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-[#75818d] text-sm">{subtitle}</p>
          </div>
      </div>
      <span className="text-[#4f5b67] cursor-pointer hover:text-white transition-colors" aria-hidden="true">
        •••
      </span>
    </div>
  );
}
function Status({ value }: { value: string }) {
    const isGood = ['Completed', 'Settled', 'Verified', 'Low', 'SUCCESS'].includes(value);
    const isWarn = ['Pending', 'Review', 'Processing', 'Medium'].includes(value);
    const isBad = ['Failed', 'Rejected', 'High', 'ERROR'].includes(value);
    
    let colors = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if(isGood) colors = 'bg-green-500/10 text-green-400 border-green-500/20';
    if(isWarn) colors = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    if(isBad) colors = 'bg-red-500/10 text-red-400 border-red-500/20';

  return (
    <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase border inline-flex items-center gap-1.5 ${colors}`}>
      {value}
    </span>
  );
}
function SectionView({
  section,
  suppliers,
  data,
  matches,
  setMatches,
  onCreate,
  onNavigate,
}: {
  section: string;
  suppliers: Supplier[];
  data: {
    suppliers: Supplier[];
    buyers: Buyer[];
    demands: Demand[];
    trades: Trade[];
  };
  matches: Match[];
  setMatches: (x: Match[]) => void;
  onCreate: () => void;
  onNavigate: (x: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Trade | null>(
    data.trades[0] || null,
  );
  const list = suppliers.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.products.join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  const head = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div>
        <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
          <Layers3 size={14} /> TRADEVANCE OS
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-white">{section}</h2>
        <p className="text-[#75818d] text-sm max-w-2xl">
          {section === "Suppliers"
            ? "Qualified supply intelligence and verification."
            : section === "Trades"
              ? "Transaction lifecycle and execution control."
              : "Structured workspace for the global trade network."}
        </p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shrink-0 shadow-lg shadow-blue-500/20" onClick={onCreate}>
        <Sparkles size={16} /> AI action
      </button>
    </div>
  );
  if (section === "Suppliers")
    return (
      <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
        {head}
        <section className="bg-[#101922] border border-[#202b36] rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-[#202b36] flex items-center justify-between bg-[#0c131b]">
            <div className="relative w-full max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75818d]">
                <Search size={16} />
              </div>
              <input
                className="w-full bg-[#101922] border border-[#202b36] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#eef2f6] focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Search supplier or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-[#75818d] text-xs font-bold tracking-widest uppercase ml-4 shrink-0">{list.length} suppliers</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {list.map((s) => (
              <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 hover:border-[#4f5b67] transition-all group flex flex-col" key={s.id}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#202b36] text-[#eef2f6] flex items-center justify-center font-bold border border-[#4f5b67]">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <b className="text-white text-sm block mb-0.5 group-hover:text-blue-400 transition-colors">{s.name}</b>
                        <span className="text-[#75818d] text-xs">
                          {s.country} · {s.port}
                        </span>
                      </div>
                  </div>
                  <div className="bg-[#101922] border border-[#202b36] rounded-lg px-2 py-1 text-center">
                    <strong className="text-[#c29631] font-mono text-sm block leading-none">{s.score}</strong>
                    <small className="text-[#75818d] text-[8px] font-bold tracking-widest uppercase">TRUST</small>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {s.products.map((p) => (
                    <span key={p} className="px-2 py-1 bg-[#101922] border border-[#202b36] text-[#eef2f6] text-[10px] rounded uppercase tracking-widest font-bold">{p}</span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#75818d] mb-5 mt-auto">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-green-500" /> {s.verified}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PackageSearch size={14} className="text-blue-400" /> {s.capacity}
                  </span>
                  <span className={`flex items-center gap-1.5 ${s.risk === "Low" ? "text-green-400" : "text-orange-400"}`}>
                    <AlertTriangle size={14} /> {s.risk} risk
                  </span>
                </div>
                <button
                  className="w-full bg-[#202b36] hover:bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                  onClick={() => onNavigate("Global Entities")}
                >
                  Open supplier dossier <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  if (section === "RFQ & Tenders")
    return (
      <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
        {head}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.demands.map((d) => (
            <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 hover:border-[#4f5b67] transition-all group flex flex-col sm:flex-row gap-6 items-start" key={d.id}>
              <div className="bg-blue-500/10 text-blue-400 p-4 rounded-xl border border-blue-500/20 shrink-0">
                  <Send size={24} />
              </div>
              <div className="flex-1 min-w-0">
                  <h3 className="text-white text-lg font-bold mb-1 truncate">
                    <span className="text-[#75818d] font-mono text-sm mr-2">{d.id}</span>
                    {d.product}
                  </h3>
                  <p className="text-[#eef2f6] text-sm mb-3">
                    <span className="text-blue-400 font-mono font-bold">{d.quantity.toLocaleString()} {d.unit}</span> <span className="text-[#75818d] mx-1">·</span> {d.incoterm} <span className="text-[#75818d] mx-1">·</span>{" "}
                    {d.destination}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                      <small className="text-[#75818d] text-xs font-mono">{d.payment}</small>
                      <Status value={d.status} />
                  </div>
                  <button
                    className="text-blue-400 hover:text-blue-300 font-bold text-sm flex items-center gap-1.5 transition-colors"
                    onClick={() => onNavigate("RFQ & Tenders")}
                  >
                    Open RFQ <ArrowRight size={14} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  if (section === "Trades")
    return (
      <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
        {head}
        <section className="bg-[#101922] border border-[#202b36] rounded-xl shadow-xl overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0c131b] text-[#75818d] text-[10px] font-bold tracking-widest uppercase border-b border-[#202b36]">
                <tr>
                  <th className="px-6 py-4">Trade ID</th>
                  <th className="px-6 py-4">Commodity</th>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202b36]">
                {data.trades.map((t) => (
                  <tr key={t.id} className={`hover:bg-[#131c26] transition-colors ${selected?.id === t.id ? 'bg-[#0c131b] border-l-2 border-l-blue-500' : ''}`}>
                    <td className="px-6 py-4">
                      <b className="text-white font-mono">{t.id}</b>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">{t.product}</td>
                    <td className="px-6 py-4 text-[#eef2f6]">{t.buyer}</td>
                    <td className="px-6 py-4 text-[#eef2f6]">{t.supplier}</td>
                    <td className="px-6 py-4 text-right font-mono text-blue-400">{t.qty.toLocaleString()} MT</td>
                    <td className="px-6 py-4 text-right font-mono text-green-400">{money(t.value)}</td>
                    <td className="px-6 py-4">
                      <Status value={t.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="text-blue-400 hover:text-blue-300 font-bold text-xs flex items-center gap-1.5 ml-auto transition-colors"
                        onClick={() => setSelected(t)}
                      >
                        Open Trade Room <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#0c131b] border-t border-blue-500/30 p-4 flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-4">
                  <b className="text-white font-mono">{selected.id}</b>
                  <span className="text-[#75818d] text-sm">
                    {selected.product} · {selected.status} · risk <span className={selected.risk < 30 ? 'text-green-400' : 'text-orange-400'}>{selected.risk}/100</span>
                  </span>
              </div>
              <div className="flex gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Action Required</button>
                  <button
                    className="bg-[#202b36] hover:bg-[#4f5b67] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  if (section === "Trade Room") return <ExecutionCenter />;
  if (section === "AI Agents")
    return (
      <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
        {head}
        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
          <PanelTitle
            title="AI Agent Control Plane"
            subtitle="Bounded autonomy, approval thresholds and auditability"
            icon={Bot}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              "Procurement Agent",
              "Verification Agent",
              "Pricing Agent",
              "Negotiation Agent",
              "Contract Agent",
              "Compliance Agent",
              "Finance Agent",
              "Logistics Agent",
              "Documentation Agent",
              "Monitoring Agent",
            ].map((x, i) => (
              <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 hover:border-[#4f5b67] transition-all group" key={x}>
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-4 border border-blue-500/20">
                    <Bot size={20} />
                </div>
                <h3 className="text-white font-bold mb-1">{x}</h3>
                <p className="text-[#75818d] text-xs mb-4 min-h-[32px]">
                  {i === 3
                    ? "Waiting for approved mandate"
                    : i === 5
                      ? "Screening counterparties"
                      : "Operating within policy bounds"}
                </p>
                <div className="flex gap-4 mb-5 pb-5 border-b border-[#202b36]">
                  <span className="flex flex-col gap-1">
                      <small className="text-[#4f5b67] text-[10px] font-bold tracking-widest uppercase">Confidence</small>
                      <b className="text-white text-sm font-mono">{Math.max(70, 88 - i * 2)}%</b>
                  </span>
                  <span className="flex flex-col gap-1">
                      <small className="text-[#4f5b67] text-[10px] font-bold tracking-widest uppercase">Authority</small>
                      <b className="text-white text-sm">{i === 3 ? "Approval" : "Recommend"}</b>
                  </span>
                </div>
                <button
                  className="w-full text-blue-400 hover:text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  onClick={() => onNavigate("AI Agents")}
                >
                  Open audit trail <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  const labels: { [key: string]: [string, string, any][] } = {
    Products: [
      [
        "Industrial Chemicals",
        "Sulphur · Caustic Soda · Activated Carbon · Industrial Salt · Carbon Black",
        PackageSearch,
      ],
      ["Energy", "Coal · EN590 · Fuel Oil · Jet Fuel", Ship],
      [
        "Metals & Minerals",
        "Copper Cathode · Nickel · Iron · Silica Sand",
        Globe2,
      ],
      ["Agriculture", "CPO · UCO · Sugar · Soybean", Target],
    ],
    Intelligence: [
      [
        "Fair Price Engine",
        "Market range, landed cost and quote normalization",
        BarChart3,
      ],
      [
        "Demand Radar",
        "Detect new buyer demand before RFQ issuance",
        TrendingUp,
      ],
      [
        "Supply Radar",
        "Detect new supply capacity and allocation signals",
        PackageSearch,
      ],
      [
        "What-if Simulator",
        "Compare origin, freight, terms and risk scenarios",
        Target,
      ],
    ],
    "Risk & Compliance": [
      ["KYB / UBO", "Identity and beneficial ownership workflow", ShieldCheck],
      ["Sanctions", "Licensed screening integration boundary", ShieldCheck],
      [
        "Product Compliance",
        "Origin, export controls and restricted goods",
        ShieldCheck,
      ],
      ["Document Integrity", "Cross-document consistency checks", FileCheck2],
    ],
    "Trade Finance": [
      [
        "Letters of Credit",
        "LC readiness and discrepancy prevention",
        CircleDollarSign,
      ],
      [
        "Receivables Finance",
        "Match approved receivable opportunities",
        CircleDollarSign,
      ],
      [
        "Inventory Finance",
        "Finance structured inventory exposure",
        CircleDollarSign,
      ],
      [
        "Partner Network",
        "Finance providers and insurer integration boundary",
        Users,
      ],
    ],
    Logistics: [
      [
        "Freight Intelligence",
        "Route, freight and transit scenario analysis",
        Ship,
      ],
      ["Shipment Monitoring", "ETA, delays and exception escalation", Ship],
      ["Port Intelligence", "Congestion and operational risk signals", Globe2],
      ["Insurance", "Cargo cover workflow and document readiness", ShieldCheck],
    ],
    Documents: [
      [
        "Contract Intelligence",
        "Clause extraction and deviation mapping",
        FileCheck2,
      ],
      [
        "Trade Documents",
        "Invoice, packing list, COO, COA and BL readiness",
        FileCheck2,
      ],
      ["Reconciliation", "Cross-document mismatch detection", ShieldCheck],
      [
        "Digital Trade Room",
        "Single source of truth for transaction documents",
        Layers3,
      ],
    ],
    Revenue: [
      ["Buyer Free", "Core sourcing, RFQ and supplier matching", "$0 / month"],
      ["Buyer Pro", "Advanced procurement intelligence", "$79 / month"],
      [
        "Seller Verified",
        "Verified profile + qualified buyer access",
        "$99 / month",
      ],
      [
        "Seller Pro",
        "Buyer intelligence + priority RFQ access",
        "$299 / month",
      ],
      [
        "Transaction Fee",
        "Self-service / managed deal monetization",
        "0.15–0.75%",
      ],
      [
        "Enterprise Intelligence",
        "Market + network intelligence + API",
        "Custom",
      ],
    ],
  };
  if (labels[section])
    return (
      <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
        {head}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {labels[section].map(([a, b, I]) => {
            const Icon = typeof I === "string" ? TrendingUp : I;
            return (
              <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 hover:border-[#4f5b67] transition-all group flex flex-col" key={String(a)}>
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-5 border border-blue-500/20">
                    <Icon size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{String(a)}</h3>
                <p className="text-[#75818d] text-sm mb-6 flex-1">{String(b)}</p>
                {typeof I === "string" && (
                    <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-3 mb-6 text-center">
                        <strong className="text-white font-mono">{I}</strong>
                    </div>
                )}
                <button className="w-full text-blue-400 hover:text-blue-300 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors mt-auto">
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  return (
    <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
      {head}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          [
            "Discover",
            "AI-powered supplier and buyer discovery",
            PackageSearch,
            "Global Entities",
          ],
          [
            "Verify",
            "KYB, product capability and trust intelligence",
            ShieldCheck,
            "Profile & Verification",
          ],
          [
            "Match",
            "Multi-factor demand/supply matching",
            Target,
            "Buyer Workspace",
          ],
          [
            "Execute",
            "RFQ, negotiation, contracts and trade room",
            BriefcaseBusiness,
            "RFQ & Tenders",
          ],
          [
            "Finance",
            "Trade finance matching and readiness",
            CircleDollarSign,
            "Trade Finance",
          ],
          [
            "Logistics",
            "Freight and shipment orchestration",
            Ship,
            "Logistics",
          ],
        ].map(([a, b, I, destination]) => {
          const Icon = I as any;
          return (
            <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 hover:border-[#4f5b67] transition-all group" key={String(a)}>
              <div className="w-12 h-12 bg-[#202b36] text-[#eef2f6] rounded-xl flex items-center justify-center mb-5 border border-[#4f5b67] group-hover:bg-blue-500/20 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors">
                  <Icon size={24} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{String(a)}</h3>
              <p className="text-[#75818d] text-sm mb-6">{String(b)}</p>
              <button
                className="text-blue-400 hover:text-blue-300 font-bold text-sm flex items-center gap-1.5 transition-colors"
                onClick={() => onNavigate(String(destination))}
              >
                Explore <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
