import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight, Github, Linkedin, Mail, Download, Sparkles,
  Code2, Smartphone, Server, Database, Brain, Layers,
  Workflow, Rocket, Zap, Globe, Cpu, Cloud, ChevronRight,
  CircleDot, GitBranch, Star, Send, Sun, Moon, CheckCircle2, Loader2, X, AlertCircle,
} from "lucide-react";
import { trackEvent, initScrollDepth } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mukul Bushi Reddy M — Product Engineer & AI Application Builder" },
      { name: "description", content: "I build products that solve real problems. Flutter, Angular, React, Spring Boot, Firebase, and AI-powered platforms." },
      { property: "og:title", content: "Mukul Bushi Reddy M — Product Engineer" },
      { property: "og:description", content: "From AI-powered platforms to IoT systems and production mobile apps — I take ideas from zero to production." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Portfolio,
});

const LINKEDIN = "https://www.linkedin.com/in/mukul-bushi-reddy-m-0170471a2/";
const GITHUB = "https://github.com/MukulMBR";
const CONTACT_EMAIL = "mukulmotakatla@gmail.com";
const EMAIL = `mailto:${CONTACT_EMAIL}`;
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

/* ---------- theme ---------- */
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      const r = document.documentElement;
      if (next === "dark") r.classList.add("dark"); else r.classList.remove("dark");
      r.style.colorScheme = next;
      try { localStorage.setItem("theme", next); } catch {}
      trackEvent("theme_switch", { theme: next });
      return next;
    });
  }, []);
  return { theme, toggle };
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border glass transition hover:bg-foreground/5"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="grid place-items-center"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.span>
    </button>
  );
}

/* ---------- shared primitives ---------- */

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand animate-pulse-glow" />
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- nav ---------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { href: "#work", label: "Work" },
    { href: "#expertise", label: "Expertise" },
    { href: "#timeline", label: "Journey" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-10">
        <a href="#top" className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition ${scrolled ? "glass-strong shadow-card" : ""}`}>
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand text-[11px] font-bold text-primary-foreground">M</span>
          <span className="font-display text-sm font-semibold">Mukul B. R. M</span>
        </a>
        <nav className={`hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex ${scrolled ? "glass-strong shadow-card" : "glass"}`}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            onClick={() => trackEvent("cta_click", { id: "nav_lets_build" })}
            className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]"
          >
            Let's build <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------- hero ---------- */

function FloatingNode({ icon: Icon, x, y, delay, size = 56 }: { icon: any; x: string; y: string; delay: number; size?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay }}
    >
      <div
        className="glass-strong grid place-items-center rounded-2xl shadow-glow animate-float-slow"
        style={{ width: size, height: size, animationDelay: `${delay}s` }}
      >
        <Icon className="h-1/2 w-1/2 text-foreground/80" />
      </div>
    </motion.div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} id="top" className="relative overflow-hidden">
      {/* ambient layers */}
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <motion.div style={{ y: y2 }} className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        aria-hidden
      >
        <div className="h-full w-full bg-gradient-brand animate-aurora" />
      </motion.div>

      <Section className="!pt-40 md:!pt-48">
        <motion.div style={{ y: y1, opacity }} className="relative">
          <Reveal>
            <Eyebrow>Product Engineer · AI Builder · Available for collaborations</Eyebrow>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-7 max-w-5xl font-display text-[44px] font-semibold leading-[1.02] tracking-tight md:text-[88px]">
              I build <span className="text-gradient">products</span> that solve <br className="hidden md:block" />
              <span className="shimmer-text">real problems.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-7 max-w-2xl text-base text-muted-foreground md:text-lg">
              Frontend Developer with deep expertise in <span className="text-foreground">Flutter, Angular, React, Firebase, Spring Boot</span>, and <span className="text-foreground">AI integration</span>. From AI-powered platforms and intelligent chatbots to IoT monitoring systems and production-ready mobile apps — I transform ideas into scalable digital products.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#work" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]">
                View my work <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-border glass px-6 py-3 text-sm font-semibold transition hover:bg-white/5">
                Let's build something <Sparkles className="h-4 w-4 text-accent" />
              </a>
            </div>
          </Reveal>

          {/* floating tech nodes — desktop only */}
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <FloatingNode icon={Code2}    x="78%" y="-2%"  delay={0.2} size={64} />
            <FloatingNode icon={Smartphone} x="92%" y="35%" delay={0.5} size={56} />
            <FloatingNode icon={Brain}    x="70%" y="68%" delay={0.8} size={68} />
            <FloatingNode icon={Cloud}    x="85%" y="92%" delay={1.0} size={52} />
            <FloatingNode icon={Cpu}      x="60%" y="100%" delay={1.2} size={48} />
          </div>

          {/* stats */}
          <Reveal delay={0.45}>
            <div className="mt-20 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {[
                { k: "12+", v: "Products Built" },
                { k: "20+", v: "Technologies" },
                { k: "7", v: "Featured Platforms" },
                { k: "3+", v: "Years Shipping" },
              ].map(s => (
                <div key={s.v} className="glass relative overflow-hidden rounded-2xl p-5 shadow-card">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-brand opacity-20 blur-2xl" />
                  <div className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{s.k}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>
      </Section>
    </div>
  );
}

/* ---------- about ---------- */

function About() {
  return (
    <Section id="about">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal><Eyebrow>About</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
              A software engineer who <span className="text-gradient">designs and ships</span> real products.
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Reveal delay={0.15}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              My focus is building <span className="text-foreground">complete solutions</span> — from idea validation and architecture planning to deployment and the polish of the final user experience. I think in products, not tickets.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              I move fluidly between mobile, web, backend, and AI — pairing strong product thinking with end-to-end execution. The work spans AI-powered platforms, IoT monitoring systems, intelligent chatbots, and production mobile applications.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
              {[
                { i: Workflow, t: "Product thinking" },
                { i: Brain, t: "Problem solving" },
                { i: Layers, t: "End-to-end" },
                { i: Globe, t: "Real-world impact" },
                { i: Rocket, t: "Ship fast" },
                { i: Zap, t: "Continuous innovation" },
              ].map(({ i: Icon, t }) => (
                <div key={t} className="glass flex items-center gap-3 rounded-xl p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand/20 text-foreground"><Icon className="h-4.5 w-4.5" /></span>
                  <span className="text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ---------- expertise ---------- */

const expertise = [
  {
    title: "Frontend Engineering",
    icon: Code2,
    items: ["Angular", "React", "Flutter", "TypeScript", "JavaScript"],
    blurb: "Production-grade interfaces with motion, accessibility, and craft.",
  },
  {
    title: "Backend Development",
    icon: Server,
    items: ["Spring Boot", "Node.js", "REST APIs", "Auth & RBAC"],
    blurb: "APIs, services and integrations that scale with the product.",
  },
  {
    title: "Cloud & Data",
    icon: Database,
    items: ["Firebase", "Firestore", "Realtime DB", "MySQL", "PostgreSQL", "MongoDB"],
    blurb: "Realtime systems, structured data and reliable persistence.",
  },
  {
    title: "Artificial Intelligence",
    icon: Brain,
    items: ["Gemini API", "AI Integration", "Intelligent Automation", "Prompt Engineering"],
    blurb: "Embedding intelligence into real product workflows.",
  },
];

function Expertise() {
  return (
    <Section id="expertise">
      <Reveal><Eyebrow>Core Expertise</Eyebrow></Reveal>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <Reveal delay={0.1}>
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight md:text-5xl">
            A full <span className="text-gradient">product engineering</span> stack.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-md text-muted-foreground">An ecosystem of skills I compose into shipped products — not a checklist.</p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {expertise.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="glass group relative overflow-hidden rounded-3xl p-7 shadow-card"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-brand opacity-15 blur-3xl transition group-hover:opacity-30" />
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand/20 ring-1 ring-white/10">
                  <e.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-semibold">{e.title}</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{e.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {e.items.map(t => (
                  <span key={t} className="rounded-full border border-border bg-white/5 px-3 py-1 text-xs font-medium text-foreground/90">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- featured products ---------- */

const projects = [
  {
    n: "01", name: "Emergent",
    tag: "AI Product Platform",
    overview: "AI-powered platform that turns raw ideas into structured software solutions, project plans, architecture designs and roadmaps.",
    problem: "Founders lose weeks translating a fuzzy idea into a buildable plan.",
    architecture: "Gemini-driven planning engine, structured output schemas, modular React UI.",
    stack: ["React", "Gemini API", "Node.js", "Firebase"],
    impact: "Compresses ideation-to-blueprint from weeks to minutes.",
    accent: "from-violet-500/30 to-cyan-400/20",
  },
  {
    n: "02", name: "Smart Posture",
    tag: "Health · Mobile",
    overview: "Intelligent posture monitoring app with realtime analytics, animated feedback and health insights.",
    problem: "Bad posture damages health silently — users need live, kind feedback.",
    architecture: "Sensor pipeline + Firebase realtime sync + Flutter animated UI layer.",
    stack: ["Flutter", "Firebase", "Realtime DB"],
    impact: "Live posture coaching with delightful, calm feedback.",
    accent: "from-emerald-400/30 to-cyan-400/20",
  },
  {
    n: "03", name: "Telegram Gemini Bot",
    tag: "AI · Automation",
    overview: "AI-powered Telegram assistant leveraging Gemini for intelligent conversations and scalable chatbot interactions.",
    problem: "Communities want an assistant that actually understands context.",
    architecture: "Webhook-driven Node service, Gemini prompt orchestration, session memory.",
    stack: ["Node.js", "Gemini API", "Telegram Bot API"],
    impact: "Always-on AI co-pilot inside Telegram.",
    accent: "from-cyan-400/30 to-violet-500/20",
  },
  {
    n: "04", name: "BDM Travels",
    tag: "Mobile · Travel",
    overview: "Travel platform simplifying itinerary planning, bookings and user experiences with mobile-first design.",
    problem: "Travel planning is fragmented across tools.",
    architecture: "Flutter front-end + Firebase backend with structured trip schemas.",
    stack: ["Flutter", "Firebase", "Firestore"],
    impact: "End-to-end trip planning in a single app.",
    accent: "from-pink-500/30 to-violet-500/20",
  },
  {
    n: "05", name: "Coupons App",
    tag: "Cross-platform",
    overview: "Cross-platform Flutter app for discovering, managing and organizing deals and discount opportunities.",
    problem: "Deals are scattered and forgotten — users miss savings.",
    architecture: "Flutter + cloud sync + categorized deal feed.",
    stack: ["Flutter", "Firebase"],
    impact: "Deals, organized — never miss a savings window.",
    accent: "from-amber-400/30 to-violet-500/20",
  },
  {
    n: "06", name: "Water Level Monitoring",
    tag: "IoT · Realtime",
    overview: "IoT-powered platform using Firebase Realtime Database for live environmental tracking and visualization.",
    problem: "Manual water-level checks are unreliable and slow.",
    architecture: "Sensor → MCU → Firebase Realtime DB → live dashboard.",
    stack: ["IoT", "Firebase Realtime DB", "Web Dashboard"],
    impact: "Live, remote monitoring with alerting and history.",
    accent: "from-cyan-400/30 to-emerald-400/20",
  },
  {
    n: "07", name: "Asthachamma",
    tag: "Web · Culture",
    overview: "React-based web platform delivering cultural and educational content with modern frontend architecture.",
    problem: "Cultural knowledge needs a modern, accessible home.",
    architecture: "React app with structured content modules and responsive layout.",
    stack: ["React", "TypeScript"],
    impact: "Modern home for cultural & educational content.",
    accent: "from-violet-500/30 to-pink-500/20",
  },
];

function ProjectCard({ p, i }: { p: typeof projects[number]; i: number }) {
  return (
    <Reveal delay={(i % 2) * 0.1}>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 shadow-card"
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60 transition group-hover:opacity-100`} />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="relative flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Product {p.n}</span>
          <span className="rounded-full border border-border surface-soft px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{p.tag}</span>
        </div>
        <h3 className="relative mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">{p.name}</h3>
        <p className="relative mt-3 text-sm text-muted-foreground">{p.overview}</p>

        <dl className="relative mt-6 grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm sm:grid-cols-[8rem_minmax(0,1fr)]">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">Problem</dt>
          <dd className="min-w-0 break-words text-foreground/90">{p.problem}</dd>

          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">Architecture</dt>
          <dd className="min-w-0 break-words text-foreground/90">{p.architecture}</dd>

          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">Impact</dt>
          <dd className="min-w-0 break-words text-foreground/90">{p.impact}</dd>
        </dl>

        <div className="relative mt-6 flex flex-wrap gap-1.5">
          {p.stack.map(t => (
            <span key={t} className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] font-medium">{t}</span>
          ))}
        </div>

        <div className="relative mt-7 flex items-center gap-2 pt-2">
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("project_click", { project: p.name, dest: "github" })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border surface-soft px-3.5 py-1.5 text-xs font-medium transition hover:surface-softer"
          >
            <Github className="h-3.5 w-3.5" /> Code
          </a>
          <a
            href="#contact"
            onClick={() => trackEvent("project_click", { project: p.name, dest: "contact" })}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition hover:scale-[1.03]"
          >
            Live demo <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </motion.article>
    </Reveal>
  );
}

function Projects() {
  return (
    <Section id="work">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal><Eyebrow>Featured Products</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">
              Real products. <span className="text-gradient">Real outcomes.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm font-medium transition hover:bg-white/5">
            <Github className="h-4 w-4" /> See all on GitHub <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => <ProjectCard key={p.n} p={p} i={i} />)}
      </div>
    </Section>
  );
}

/* ---------- product builder ---------- */

const capabilities = [
  { i: Layers, t: "Product Architecture" },
  { i: Smartphone, t: "Mobile App Development" },
  { i: Globe, t: "Web Application Development" },
  { i: Brain, t: "AI Integration" },
  { i: Cloud, t: "Firebase Solutions" },
  { i: Server, t: "Full Stack Development" },
  { i: Workflow, t: "Automation Systems" },
  { i: Sparkles, t: "Scalable User Experiences" },
];

function Builder() {
  return (
    <Section id="builder">
      <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong p-10 shadow-card md:p-16">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-brand opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent opacity-25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 grid-bg" />

        <div className="relative">
          <Reveal><Eyebrow>Product Builder</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl">
              I don't just write code. <br className="hidden md:block" />
              I <span className="text-gradient">build products.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-4">
            {capabilities.map(({ i: Icon, t }, idx) => (
              <Reveal key={t} delay={idx * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass flex h-full items-center gap-3 rounded-2xl p-4"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand/25"><Icon className="h-5 w-5" /></span>
                  <span className="text-sm font-medium">{t}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- timeline ---------- */

const timeline = [
  { year: "Recent", title: "Emergent — AI Product Planner", body: "Designed and shipped an AI-driven platform that turns ideas into structured software plans." },
  { year: "Recent", title: "Telegram Gemini Bot", body: "Built a scalable AI assistant on Telegram with prompt orchestration and session memory." },
  { year: "Mid", title: "Smart Posture & Health App", body: "Delivered a Flutter app with realtime analytics and animated health feedback." },
  { year: "Mid", title: "IoT Water Level Platform", body: "Engineered an IoT pipeline with Firebase Realtime DB for live environmental monitoring." },
  { year: "Early", title: "BDM Travels & Coupons App", body: "Released cross-platform Flutter products with Firebase backends and modern UX." },
  { year: "Foundation", title: "Frontend & Full-Stack Mastery", body: "Mastered Angular, React, TypeScript, Spring Boot — built reusable systems and APIs." },
];

function Timeline() {
  return (
    <Section id="timeline">
      <Reveal><Eyebrow>Product Evolution Timeline</Eyebrow></Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">
          Milestones, not <span className="text-gradient">semesters.</span>
        </h2>
      </Reveal>

      <div className="relative mt-16">
        <div className="pointer-events-none absolute left-[15px] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:left-1/2" />
        <div className="space-y-8">
          {timeline.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.05}>
              <div className={`relative grid gap-4 md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className={`relative pl-10 md:pl-0 ${i % 2 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.year}</span>
                  <h3 className="mt-1 font-display text-xl font-semibold md:text-2xl">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                </div>
                <div className="hidden md:block" />
                <span className="absolute left-0 top-1.5 grid h-8 w-8 place-items-center rounded-full glass-strong shadow-glow md:left-1/2 md:-translate-x-1/2">
                  <CircleDot className="h-3.5 w-3.5 text-foreground" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- github + linkedin ---------- */

function GithubLinkedin() {
  const repos = [
    { name: "Emergent", lang: "TypeScript", stars: 12, branch: "main" },
    { name: "Smart-Posture", lang: "Dart", stars: 8, branch: "main" },
    { name: "Telegram-Gemini-Bot", lang: "JavaScript", stars: 14, branch: "main" },
    { name: "Asthachamma", lang: "TypeScript", stars: 6, branch: "main" },
    { name: "Water-Level-Monitor", lang: "Dart", stars: 9, branch: "main" },
    { name: "Coupons-App", lang: "Dart", stars: 5, branch: "main" },
  ];
  return (
    <Section id="open-source">
      <div className="grid gap-8 md:grid-cols-2">
        {/* GitHub */}
        <Reveal>
          <div className="glass relative h-full overflow-hidden rounded-3xl p-8 shadow-card">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-brand opacity-25 blur-3xl" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl glass-strong"><Github className="h-5 w-5" /></span>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Open Source</div>
                  <div className="font-display text-lg font-semibold">@MukulMBR</div>
                </div>
              </div>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3.5 py-1.5 text-xs font-semibold text-primary-foreground">
                Visit <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* contribution-style grid */}
            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Contribution activity</span><span>last ~6 months</span>
              </div>
              <div className="grid grid-cols-26 gap-[3px]" style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}>
                {Array.from({ length: 26 * 7 }).map((_, i) => {
                  const r = (Math.sin(i * 0.7) + Math.cos(i * 0.3) + 2) / 4;
                  const level = r > 0.78 ? 4 : r > 0.6 ? 3 : r > 0.42 ? 2 : r > 0.25 ? 1 : 0;
                  const bg = ["bg-white/5", "bg-violet-500/30", "bg-violet-500/55", "bg-cyan-400/70", "bg-emerald-400/85"][level];
                  return <span key={i} className={`h-2.5 w-2.5 rounded-[3px] ${bg}`} />;
                })}
              </div>
            </div>

            <div className="mt-7 space-y-2">
              {repos.map(r => (
                <div key={r.name} className="group flex items-center justify-between rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm transition hover:bg-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{r.name}</span>
                    <span className="text-xs text-muted-foreground">· {r.lang}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5" /> {r.stars}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* LinkedIn */}
        <Reveal delay={0.1}>
          <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-8 shadow-card">
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent opacity-25 blur-3xl" />
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl glass-strong"><Linkedin className="h-5 w-5" /></span>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Network</div>
                <div className="font-display text-lg font-semibold">Mukul Bushi Reddy M</div>
              </div>
            </div>
            <p className="mt-5 text-muted-foreground">
              Connect for product collaborations, founder conversations, AI integrations, or to talk through an idea. I work best with teams that ship.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Frontend Developer · Flutter · Angular · React",
                "Spring Boot · Firebase · AI Integration",
                "Open to product builds, MVPs, and consulting",
              ].map(x => (
                <li key={x} className="flex items-start gap-2.5">
                  <ChevronRight className="mt-0.5 h-4 w-4 text-foreground/70" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
              Connect on LinkedIn <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- services ---------- */

const services = [
  "Flutter Applications", "Angular Platforms", "React Applications",
  "Spring Boot APIs", "Firebase Ecosystems", "AI Integrations",
  "Full Stack Solutions", "SaaS Products", "MVP Development",
];

function Services() {
  return (
    <Section id="services">
      <Reveal><Eyebrow>Services</Eyebrow></Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">
          What I can <span className="text-gradient">build with you.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s} delay={i * 0.04}>
            <motion.div whileHover={{ y: -4 }} className="glass group relative flex items-center justify-between overflow-hidden rounded-2xl p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-brand opacity-0 transition group-hover:opacity-15" />
              <span className="relative font-display text-base font-semibold">{s}</span>
              <ArrowUpRight className="relative h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- achievements ---------- */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setN(to); return; }
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now(); const dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.4 });
    obs.observe(el); return () => obs.disconnect();
  }, [to, reduce]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Achievements() {
  const stats = [
    { v: 12, s: "+", l: "Products Delivered" },
    { v: 80, s: "+", l: "Features Built" },
    { v: 30, s: "+", l: "APIs Integrated" },
    { v: 20, s: "+", l: "Technologies Used" },
    { v: 5000, s: "+", l: "Hours Invested" },
  ];
  return (
    <Section id="achievements">
      <Reveal><Eyebrow>Achievements</Eyebrow></Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">
          Measured in <span className="text-gradient">products shipped.</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.05}>
            <div className="glass relative overflow-hidden rounded-2xl p-6 shadow-card">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-brand opacity-20 blur-2xl" />
              <div className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                <Counter to={s.v} suffix={s.s} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- contact ---------- */

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Section id="contact">
      <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong p-10 shadow-card md:p-16">
        <div className="pointer-events-none absolute -inset-px bg-gradient-brand opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 grid-bg" />

        <div className="relative grid gap-12 md:grid-cols-2">
          <div>
            <Reveal><Eyebrow>Contact</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-6xl">
                Have an idea worth <span className="text-gradient">building?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-md text-muted-foreground">Let's transform it into a real product. Send a brief, a Loom, or a single sentence — I'll come back fast.</p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
                <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href={EMAIL} className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10">
                  <Mail className="h-4 w-4" /> Email
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
                  <Download className="h-4 w-4" /> Resume
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="glass rounded-2xl p-6 md:p-7"
            >
              <div className="grid gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Name</label>
                  <input required className="mt-1.5 w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm outline-none ring-0 transition focus:border-foreground/30" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Email</label>
                  <input required type="email" className="mt-1.5 w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm outline-none transition focus:border-foreground/30" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">The idea</label>
                  <textarea required rows={5} className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-sm outline-none transition focus:border-foreground/30" placeholder="What are you building?" />
                </div>
                <button type="submit" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]">
                  {sent ? "Message sent — talk soon" : (<>Send message <Send className="h-4 w-4 transition group-hover:translate-x-0.5" /></>)}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="relative border-t border-border/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center md:px-10">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-brand text-sm font-bold text-primary-foreground">M</span>
          <div>
            <div className="font-display font-semibold">Mukul Bushi Reddy M</div>
            <div className="text-xs text-muted-foreground">Product Engineer · AI Application Builder</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={LINKEDIN} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white/5 transition hover:bg-white/10"><Linkedin className="h-4 w-4" /></a>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white/5 transition hover:bg-white/10"><Github className="h-4 w-4" /></a>
          <a href={EMAIL} className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white/5 transition hover:bg-white/10"><Mail className="h-4 w-4" /></a>
        </div>
        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} — Built from zero to production.</div>
      </div>
    </footer>
  );
}

/* ---------- page ---------- */

function Portfolio() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <About />
      <Expertise />
      <Projects />
      <Builder />
      <Timeline />
      <GithubLinkedin />
      <Services />
      <Achievements />
      <Contact />
      <Footer />
    </main>
  );
}
