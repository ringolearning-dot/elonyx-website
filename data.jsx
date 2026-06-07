/* =====================================================
   Elonyx Technologies — Data + shared helpers
   ===================================================== */

const CASE_STUDIES = [
  {
    id: "yno",
    name: "Y-NO",
    type: "Mobile App",
    industry: "Consumer · Productivity",
    year: 2025,
    summary:
      "AI-powered smart inventory assistant. Scan items with your camera, find them with voice, and manage everything through natural conversation. Built for iOS, Android, and web.",
    metrics: [
      { k: "Platforms", v: "3" },
      { k: "AI features", v: "Vision + Voice" },
      { k: "Stack", v: "Full-stack" },
    ],
    stack: ["React", "TypeScript", "Capacitor", "Express", "Postgres", "Gemini", "Stripe"],
    color: "oklch(0.58 0.22 263)",
  },
  {
    id: "elonyx-site",
    name: "Elonyx Technologies",
    type: "Web Platform",
    industry: "Corporate · Portfolio",
    year: 2025,
    summary:
      "Company website and portfolio showcase for Elonyx Technologies. Built as a single-page React app with dark/light theme, animated UI, and integrated AI chat assistant.",
    metrics: [
      { k: "Pages", v: "9" },
      { k: "Theme modes", v: "2" },
      { k: "Performance", v: "100" },
    ],
    stack: ["React", "JavaScript", "CSS3"],
    color: "oklch(0.62 0.15 160)",
  },
];

const TEAM = [
  { name: "Anthony T.",  role: "Co-Founder · CEO",       initials: "AT" },
];

const SERVICES = [
  {
    code: "01",
    name: "Mobile Apps",
    desc: "Cross-platform mobile apps built with modern frameworks. Native performance, clean UX, shipped to both app stores.",
    bullets: ["React Native / Capacitor", "iOS & Android", "App Store optimization", "Push notifications & offline"],
  },
  {
    code: "02",
    name: "Web Apps",
    desc: "Full-stack web applications from landing pages to complex SaaS platforms. Responsive, fast, and production-ready.",
    bullets: ["React · TypeScript · Node.js", "Postgres · Supabase", "Stripe payments", "Auth & user management"],
  },
  {
    code: "03",
    name: "AI Integration",
    desc: "Smart features powered by AI — computer vision, natural language, voice recognition, and generative AI baked into real products.",
    bullets: ["Vision & image recognition", "Voice & speech-to-text", "LLM-powered features", "Google Gemini · OpenAI"],
  },
  {
    code: "04",
    name: "Product Strategy",
    desc: "From idea to launch. We help scope, design, build, and ship software products that solve real problems for real users.",
    bullets: ["Product scoping & roadmap", "UI/UX design", "MVP development", "Launch & iteration"],
  },
];

const BLOG = [
  {
    id: "ai-inventory",
    title: "How we built an AI-powered inventory app from scratch",
    excerpt: "The architecture decisions behind Y-NO — from vision AI to real-time sync across devices.",
    author: "Anthony T.", tag: "Engineering", date: "May 2026", read: "6 min",
  },
  {
    id: "capacitor-native",
    title: "Capacitor vs React Native in 2026: what we chose and why",
    excerpt: "A practical comparison after shipping a production app with Capacitor on both platforms.",
    author: "Anthony T.", tag: "Mobile", date: "Apr 2026", read: "5 min",
  },
  {
    id: "stripe-subscriptions",
    title: "Implementing Stripe subscriptions the right way",
    excerpt: "Lessons learned handling edge cases — stale customers, webhook race conditions, and failed payments.",
    author: "Anthony T.", tag: "Engineering", date: "Mar 2026", read: "7 min",
  },
];

const JOBS = [];

const PRICING = [
  {
    tier: "Starter",
    price: "$5k", per: "/ project",
    note: "Landing pages, portfolios, and simple web apps. Perfect for getting your idea online fast.",
    features: [
      "Single-page or multi-page site",
      "Responsive design",
      "Basic SEO setup",
      "1 round of revisions",
    ],
  },
  {
    tier: "Build",
    price: "$15k", per: "/ project",
    note: "Full-stack apps with auth, payments, and AI features. The sweet spot for MVPs and v1 products.",
    features: [
      "Full-stack web or mobile app",
      "User auth & database",
      "Payment integration",
      "AI feature integration",
      "3 months bug support",
    ],
    featured: true,
  },
  {
    tier: "Scale",
    price: "Custom", per: "",
    note: "Complex platforms, multi-app ecosystems, or ongoing development partnerships.",
    features: [
      "Custom architecture",
      "Multiple platforms",
      "Dedicated development",
      "Priority support",
      "Ongoing maintenance",
    ],
  },
];

const DOCS = [
  {
    section: "Getting started",
    items: [
      { id: "introduction", title: "Introduction" },
      { id: "quick-start",  title: "Quick start" },
      { id: "tech-stack",   title: "Our tech stack" },
    ],
  },
  {
    section: "Services",
    items: [
      { id: "mobile-apps",  title: "Mobile apps" },
      { id: "web-apps",     title: "Web apps" },
      { id: "ai-features",  title: "AI integration" },
    ],
  },
  {
    section: "Process",
    items: [
      { id: "how-we-work",   title: "How we work" },
      { id: "timeline",      title: "Project timeline" },
      { id: "deliverables",  title: "Deliverables" },
    ],
  },
];

// ----- Admin mock data -----
const ADMIN_METRICS = [
  { k: "Active projects",    v: 2,      delta: "+1",   trend: "up" },
  { k: "Completed projects", v: 3,      delta: "+1",   trend: "up" },
  { k: "Technologies used",  v: "12+",  delta: "+3",   trend: "up" },
  { k: "Platforms shipped",  v: "3",    delta: "—",    trend: "up" },
];

const ADMIN_LEADS = [];
const ADMIN_CLIENTS = [
  { id: "C-001", name: "Y-NO",               tier: "Build",   contact: "Internal",  mrr: "—", since: "Jan 2025", health: "Healthy" },
  { id: "C-002", name: "Elonyx Technologies", tier: "Starter", contact: "Internal",  mrr: "—", since: "Mar 2025", health: "Healthy" },
];

const ADMIN_AGENTS = [];
const ADMIN_INVOICES = [];

const ADMIN_TEAM_FULL = [
  { id: "u-01", name: "Anthony T.", role: "Co-Founder · CEO", email: "elonyxtechnologies@gmail.com", status: "Active", perms: "Owner" },
];

// Chart series: projects over 12 months
const RUNS_SERIES = [
  0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3,
];

// Growth over 12 months
const MRR_SERIES = [
  0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 6, 8,
];

// Filter categories used on /work
const WORK_FILTERS = ["All", "Mobile App", "Web Platform"];

Object.assign(window, {
  CASE_STUDIES, TEAM, SERVICES, BLOG, JOBS, PRICING, DOCS,
  ADMIN_METRICS, ADMIN_LEADS, ADMIN_CLIENTS, ADMIN_AGENTS,
  ADMIN_INVOICES, ADMIN_TEAM_FULL, RUNS_SERIES, MRR_SERIES,
  WORK_FILTERS,
});
