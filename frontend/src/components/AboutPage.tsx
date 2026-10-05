import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Layers,
  LayoutGrid,
  Link2,
  Scale,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { BrandLockup } from './BrandMark';
import { useRevealOnScroll } from '../hooks';

interface AboutPageProps {
  onEnter: () => void;
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */
const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-5 sm:px-8 ${className}`}>{children}</div>
);

const SectionIntro: React.FC<{ eyebrow: string; title: React.ReactNode; body: string }> = ({ eyebrow, title, body }) => (
  <div className="max-w-2xl mx-auto text-center space-y-4 reveal">
    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
      <span className="w-6 h-px bg-gradient-to-r from-transparent to-brand-500" />
      {eyebrow}
      <span className="w-6 h-px bg-gradient-to-l from-transparent to-brand-500" />
    </div>
    <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold tracking-tight text-slate-900">{title}</h2>
    <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{body}</p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Hero product preview                                                */
/* ------------------------------------------------------------------ */
const EVIDENCE_ROWS = [
  'Product category',
  'Enclosure & construction',
  'Intended use',
  'Scope coverage',
  'Testing protocol',
];

const HeroPreview: React.FC = () => (
  <div className="relative w-full max-w-[560px] mx-auto lg:mx-0 lg:ml-auto">
    {/* glow behind card */}
    <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-300/40 via-violet-300/25 to-saffron-300/30 blur-3xl" aria-hidden="true" />

    <div className="relative glass-strong ring-gradient rounded-3xl p-5 sm:p-6 animate-fade-up" style={{ animationDelay: '250ms' }}>
      {/* window chrome */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-[11px] text-slate-500">MOP/CPWD/NZ-2026/EL-8942</span>
      </div>

      {/* tender clause */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Tender clause 4</span>
        </div>
        <p className="text-[13.5px] leading-relaxed text-slate-700">
          The main distribution assemblies shall be{' '}
          <mark className="bg-brand-100 text-brand-800 rounded px-1 py-0.5 [box-decoration-break:clone]">
            factory-built, type-tested low-voltage power switchgear and controlgear assemblies
          </mark>{' '}
          for 415V, 3-phase, 50Hz supply with a rated short-circuit withstand strength of 50kA.
        </p>
      </div>

      {/* trace connector */}
      <div className="flex items-center gap-3 pl-6 py-2.5" aria-hidden="true">
        <div className="w-px h-6 bg-gradient-to-b from-brand-500 to-brand-500/0" />
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-600">
          <Link2 className="w-3 h-3" /> traced to source span
        </span>
      </div>

      {/* recommendation */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_10px_30px_-20px_rgba(36,52,130,0.35)] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 px-2.5 py-1 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> PRIMARY
          </span>
          <span className="font-mono text-[11px] text-slate-500">Committee ETD 07</span>
        </div>
        <div className="mt-3 font-mono text-lg font-semibold text-slate-900 tracking-tight">IS/IEC 61439-2:2020</div>
        <div className="text-[13px] text-slate-500 leading-snug mt-0.5">
          Low-voltage switchgear and controlgear assemblies: power switchgear and controlgear assemblies
        </div>

        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {EVIDENCE_ROWS.map((row, i) => (
            <li
              key={row}
              className="flex items-center gap-2 text-[13px] text-slate-700 animate-fade-up"
              style={{ animationDelay: `${900 + i * 260}ms` }}
            >
              <span className="w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" strokeWidth={3} />
              </span>
              {row}
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
            <span>Hybrid match</span>
            <span className="font-mono text-slate-800">95%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-saffron-500" />
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 ring-1 ring-inset ring-amber-200 text-amber-800 px-3 py-1.5 text-[12px] font-medium">
          <UserCheck className="w-3.5 h-3.5" />
          Requires officer verification
        </div>
      </div>
    </div>

    {/* floating chips (desktop only) */}
    <div className="hidden lg:flex absolute -bottom-9 left-4 glass rounded-2xl px-3.5 py-2.5 items-center gap-2.5 animate-float-y" style={{ animationDelay: '0.4s' }}>
      <span className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center"><Scale className="w-4 h-4" /></span>
      <div className="leading-tight">
        <div className="text-[12px] font-semibold text-slate-900">Near miss explained</div>
        <div className="text-[11px] text-slate-500">IS 302-1 rejected: appliance scope</div>
      </div>
    </div>
    <div className="hidden lg:flex absolute -right-3 -top-12 glass rounded-2xl px-3.5 py-2.5 items-center gap-2.5 animate-float-y" style={{ animationDelay: '1.4s' }}>
      <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><LayoutGrid className="w-4 h-4" /></span>
      <div className="leading-tight">
        <div className="text-[12px] font-semibold text-slate-900">5 of 6 requirements covered</div>
        <div className="text-[11px] text-slate-500">1 gap flagged</div>
      </div>
    </div>
    <div className="hidden lg:flex absolute -bottom-9 right-4 glass rounded-2xl px-3.5 py-2.5 items-center gap-2.5 animate-float-y" style={{ animationDelay: '2.2s' }}>
      <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></span>
      <div className="leading-tight">
        <div className="text-[12px] font-semibold text-slate-900">3 specification risks</div>
        <div className="text-[11px] text-slate-500">with suggested clauses</div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Pipeline                                                            */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    icon: FileText,
    title: 'Read the tender',
    body: 'Pulls out the product profile, quantities and tender reference from the notice text or PDF.',
    chip: 'Product profile',
  },
  {
    icon: Layers,
    title: 'Break it into requirements',
    body: 'Splits the tender into clause-level requirements, each pinned to the exact sentence it came from.',
    chip: 'Source-span trace',
  },
  {
    icon: Search,
    title: 'Retrieve candidates',
    body: 'Keyword search and meaning-based search run side by side and merge into one candidate pool.',
    chip: 'Hybrid search',
  },
  {
    icon: ShieldCheck,
    title: 'Check the evidence',
    body: 'A 5-point checklist (category, material, intended use, scope, test requirement) validates every pick.',
    chip: '5-point checklist',
  },
  {
    icon: UserCheck,
    title: 'Officer decides',
    body: 'Every result is marked as requiring officer verification. Near misses and gaps are shown, not hidden.',
    chip: 'Human in the loop',
  },
];

const Pipeline: React.FC = () => (
  <div className="relative mt-16">
    {/* connector line (desktop) */}
    <svg className="hidden lg:block absolute top-[34px] left-[10%] w-[80%] h-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden="true">
      <line x1="0" y1="1" x2="100" y2="1" stroke="rgba(66,98,242,0.35)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="flow-dash" />
    </svg>

    <ol className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-4 relative">
      {STEPS.map((step, i) => (
        <li key={step.title} className="reveal relative" style={{ ['--reveal-delay' as string]: `${i * 110}ms` }}>
          <div className="relative h-full glass rounded-2xl p-5 pt-6 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-5">
              <span className="relative w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(66,98,242,0.6)]">
                <step.icon className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white ring-1 ring-brand-300 shadow-sm text-[11px] font-mono font-bold text-brand-700 flex items-center justify-center">
                  {i + 1}
                </span>
              </span>
            </div>
            <h3 className="font-heading text-[17px] font-semibold text-slate-900 leading-snug">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.body}</p>
            <span className="mt-4 inline-flex items-center rounded-full bg-brand-50 ring-1 ring-inset ring-brand-100 px-2.5 py-1 text-[11px] font-medium text-brand-700">
              {step.chip}
            </span>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

/* ------------------------------------------------------------------ */
/* Feature visuals                                                     */
/* ------------------------------------------------------------------ */
const MatrixVisual: React.FC = () => {
  const cols = ['61439-2', '12640', '3043', '732'];
  // 0 = none, 1 = covered, 2 = partial
  const rows: Array<{ label: string; cells: number[]; gap?: boolean }> = [
    { label: 'Req 1', cells: [1, 0, 0, 0] },
    { label: 'Req 2', cells: [0, 1, 0, 0] },
    { label: 'Req 3', cells: [0, 0, 1, 0] },
    { label: 'Req 4', cells: [0, 0, 0, 1] },
    { label: 'Req 5', cells: [2, 0, 0, 0] },
    { label: 'Req 6', cells: [0, 0, 0, 0], gap: true },
  ];
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <div className="grid grid-cols-[52px_repeat(4,1fr)] gap-1.5 items-center">
        <span />
        {cols.map(c => (
          <span key={c} className="text-[10px] font-mono text-slate-500 text-center truncate">{c}</span>
        ))}
        {rows.map(r => (
          <React.Fragment key={r.label}>
            <span className={`text-[11px] font-medium ${r.gap ? 'text-amber-700' : 'text-slate-600'}`}>{r.label}</span>
            {r.cells.map((c, idx) => (
              <span
                key={idx}
                className={`h-7 rounded-md flex items-center justify-center ${
                  c === 1
                    ? 'bg-emerald-100 ring-1 ring-inset ring-emerald-300 text-emerald-700'
                    : c === 2
                    ? 'bg-amber-100 ring-1 ring-inset ring-amber-300 text-amber-700'
                    : r.gap
                    ? 'bg-amber-50 border border-dashed border-amber-400'
                    : 'bg-white ring-1 ring-inset ring-slate-200'
                }`}
              >
                {c === 1 && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                {c === 2 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Covered</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500" /> Partial</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm border border-dashed border-amber-500" /> Gap</span>
      </div>
    </div>
  );
};

const RiskVisual: React.FC = () => (
  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Clause 1</span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 ring-1 ring-inset ring-rose-200 text-rose-700 px-2 py-0.5 text-[11px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> HIGH
      </span>
    </div>
    <p className="text-[13px] leading-relaxed text-slate-700">
      The cubicle shall be fabricated from 2.0mm CRCA sheet steel, fully compartmented,{' '}
      <span className="underline decoration-wavy decoration-rose-500 underline-offset-4">dust and vermin proof</span>.
    </p>
    <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[12px] text-rose-800 leading-snug">
      No measurable test or rating. Suppliers can bid an IP 20 enclosure and still comply.
    </div>
    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 mb-1">
        <Sparkles className="w-3 h-3" /> Suggested clause
      </div>
      <p className="text-[12.5px] text-emerald-900 leading-snug">
        Enclosure shall have a verified degree of protection of at least IP 54 in accordance with IS/IEC 60529.
      </p>
    </div>
  </div>
);

const GraphVisual: React.FC = () => {
  const cx = 160;
  const cy = 112;
  const r = 84;
  const nodes = [
    { label: 'RCCB', color: '#f43f5e', angle: -90 },
    { label: 'Earthing', color: '#10b981', angle: -18 },
    { label: 'Wiring', color: '#10b981', angle: 54 },
    { label: 'Vocabulary', color: '#0ea5e9', angle: 126 },
    { label: 'PVC cable', color: '#f59e0b', angle: 198 },
  ];
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
      <svg viewBox="0 0 320 224" className="w-full h-auto" role="img" aria-label="Standards knowledge graph preview">
        <defs>
          <radialGradient id="kg-center" cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="#6a4dff" />
            <stop offset="1" stopColor="#4262f2" />
          </radialGradient>
        </defs>
        {nodes.map(n => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad) * 0.9;
          return (
            <g key={n.label}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={n.color} strokeOpacity="0.75" strokeWidth="1.5" className="flow-dash" />
              <circle cx={x} cy={y} r="13" fill="#ffffff" stroke={n.color} strokeWidth="1.8" />
              <circle cx={x} cy={y} r="4" fill={n.color} />
              <text
                x={x}
                y={y + (y > cy ? 28 : -20)}
                textAnchor="middle"
                fontSize="10"
                fill="#475569"
                fontFamily="Inter Variable, Inter, sans-serif"
              >
                {n.label}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="34" fill="#4262f2" fillOpacity="0.12" />
        <circle cx={cx} cy={cy} r="26" fill="url(#kg-center)" />
        <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="JetBrains Mono Variable, monospace">
          61439-2
        </text>
      </svg>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 pb-1 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Safety</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Supporting</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> Terminology</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Inferred</span>
      </div>
    </div>
  );
};

const FEATURES = [
  {
    icon: LayoutGrid,
    kicker: 'Requirement Coverage Matrix',
    title: 'See what is covered, and what is not',
    body: 'Every tender requirement is mapped against the recommended standards. Gaps stand out before the tender is published, not after bids arrive.',
    visual: <MatrixVisual />,
  },
  {
    icon: AlertTriangle,
    kicker: 'Specification Risk Detector',
    title: 'Catch clauses that can be read two ways',
    body: 'Vague or untestable wording is flagged with a severity, the reason it is risky, and a measurable replacement clause drafted for the officer to review.',
    visual: <RiskVisual />,
  },
  {
    icon: Share2,
    kicker: 'Standards Knowledge Graph',
    title: 'Explore how standards relate',
    body: 'See a recommended standard alongside its companions. Links the engine inferred are labelled as inferences, never presented as official references.',
    visual: <GraphVisual />,
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export const AboutPage: React.FC<AboutPageProps> = ({ onEnter }) => {
  const rootRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={rootRef} className="landing noise min-h-screen font-sans overflow-x-clip">
      <div className="aurora"><span /></div>
      <div className="grid-fade" />

      {/* Nav */}
      <header className="sticky top-0 z-50">
        <div className="backdrop-blur-xl bg-white/75 border-b border-slate-200/70">
          <Container className="h-[68px] flex items-center justify-between">
            <BrandLockup tone="light" />
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
              <a href="#how" className="hover:text-brand-700 transition-colors">How it works</a>
              <a href="#features" className="hover:text-brand-700 transition-colors">Features</a>
              <a href="#start" className="hover:text-brand-700 transition-colors">Get started</a>
            </nav>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-inset ring-slate-200 px-3 py-1.5 text-[11px] font-mono text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                SIH26108
              </span>
              <button onClick={onEnter} className="btn-glow rounded-xl h-10 px-4 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
                Enter workspace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Container>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 sm:pt-24 pb-24 sm:pb-32">
        <Container>
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-10 items-center">
            <div className="space-y-8">
              <div
                className="inline-flex items-center gap-2.5 rounded-full glass pl-2 pr-4 py-1.5 text-[12px] font-medium text-slate-700 animate-fade-up"
              >
                <span className="rounded-full bg-gradient-to-r from-brand-500 to-violet-500 text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wider whitespace-nowrap shrink-0">SIH 2026</span>
                Decision-support prototype for procurement officers
              </div>

              <h1
                className="font-heading font-extrabold text-[2.6rem] sm:text-6xl lg:text-[3.55rem] xl:text-[3.85rem] leading-[1.05] tracking-[-0.03em] text-slate-900 animate-fade-up"
                style={{ animationDelay: '90ms' }}
              >
                Every tender clause,{' '}
                <span className="block">
                  traced to the{' '}
                  <span className="font-serif italic font-normal text-gradient-brand pr-1 whitespace-nowrap">Indian Standard</span>
                </span>
                that governs it.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: '180ms' }}>
                Officers cite standards from memory and scattered PDFs, and a wrong citation can stall a tender. This engine reads the tender, recommends the
                standards that apply, and shows the evidence behind each one.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 animate-fade-up" style={{ animationDelay: '270ms' }}>
                <button onClick={onEnter} className="btn-glow rounded-2xl h-14 px-7 text-base font-semibold inline-flex items-center gap-2.5 cursor-pointer">
                  Enter the workspace <ArrowRight className="w-5 h-5" />
                </button>
                <a href="#how" className="btn-outline-light rounded-2xl h-14 px-7 text-base font-semibold inline-flex items-center gap-2.5">
                  See how it works
                </a>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-slate-600 animate-fade-up" style={{ animationDelay: '360ms' }}>
                {['Explainable by design', 'Keyword and semantic search together', 'An officer always verifies'].map(t => (
                  <li key={t} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <HeroPreview />
          </div>

          {/* mobile chips */}
          <div className="lg:hidden mt-8 flex flex-wrap gap-2.5 justify-center">
            {['5 of 6 requirements covered', '3 specification risks', 'Near miss explained'].map(t => (
              <span key={t} className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-700">{t}</span>
            ))}
          </div>
          <p className="mt-14 text-center lg:text-right text-xs text-slate-500">
            Illustrative output from the CPWD low-voltage switchgear demo tender.
          </p>
        </Container>
      </section>

      {/* Principle band */}
      <section className="relative pb-24">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { big: 'Clause-level', small: 'Every requirement keeps a link to its source sentence' },
              { big: '5-point', small: 'Evidence checklist behind each recommendation' },
              { big: 'Hybrid', small: 'Keyword and semantic retrieval, fused and re-ranked' },
              { big: 'Human', small: 'Final applicability is always the officer’s call' },
            ].map((s, i) => (
              <div key={s.big} className="reveal glass rounded-2xl p-5 sm:p-6" style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}>
                <div className="font-heading text-xl sm:text-3xl font-bold text-gradient whitespace-nowrap">{s.big}</div>
                <div className="mt-2 text-sm text-slate-600 leading-relaxed">{s.small}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-20 sm:py-28 scroll-mt-20">
        <Container>
          <SectionIntro
            eyebrow="How it works"
            title={<>From tender text to cited standards in <span className="font-serif italic font-normal text-gradient-brand">five steps</span></>}
            body="Retrieval finds the candidates. A checklist, not a hunch, decides which ones stay. The officer has the last word."
          />
          <Pipeline />
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 sm:py-28 scroll-mt-20">
        <Container>
          <SectionIntro
            eyebrow="Built to be reviewed"
            title={<>Three views that make a tender <span className="font-serif italic font-normal text-gradient-brand">reviewable</span></>}
            body="Recommendations are only useful if an officer can check them quickly. These views are built for that."
          />

          <div className="mt-16 grid lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <article
                key={f.kicker}
                className="reveal ring-gradient glass rounded-3xl p-6 sm:p-7 flex flex-col gap-6 hover:-translate-y-1 transition-transform duration-300"
                style={{ ['--reveal-delay' as string]: `${i * 120}ms` }}
              >
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                    <span className="w-8 h-8 rounded-lg bg-brand-50 ring-1 ring-inset ring-brand-200 text-brand-700 flex items-center justify-center">
                      <f.icon className="w-4 h-4" />
                    </span>
                    {f.kicker}
                  </span>
                  <h3 className="font-heading text-xl sm:text-[1.4rem] font-bold text-slate-900 leading-snug">{f.title}</h3>
                  <p className="text-[15px] text-slate-600 leading-relaxed">{f.body}</p>
                </div>
                <div className="mt-auto">{f.visual}</div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section id="start" className="relative py-20 sm:py-28 scroll-mt-20">
        <Container>
          <div className="reveal relative overflow-hidden rounded-[2rem] ring-gradient glass-strong px-6 sm:px-14 py-14 sm:py-20 text-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(640px_280px_at_50%_0%,rgba(66,98,242,0.14),transparent_70%)]" aria-hidden="true" />
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              Review a tender{' '}
              <span className="font-serif italic font-normal text-gradient-brand">with evidence</span> in hand
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Open the demo workspace, load a sample tender, and trace any recommendation back to the clause that triggered it.
            </p>
            <div className="mt-9 flex justify-center">
              <button onClick={onEnter} className="btn-glow rounded-2xl h-14 px-8 text-base font-semibold inline-flex items-center gap-2.5 cursor-pointer">
                Enter the workspace <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-200/80">
        <Container className="py-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <BrandLockup tone="light" />
            <p className="text-sm text-slate-500 leading-relaxed">
              Prototype built for Smart India Hackathon 2026, problem statement SIH26108 (Ministry of Consumer Affairs, Food &amp; Public Distribution).
            </p>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md md:text-right">
            Decision support only. Whether a standard officially applies stays with the procuring officer. This is a hackathon prototype, not an official
            Government of India or Bureau of Indian Standards portal.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default AboutPage;
