import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Layers,
  Link2,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Gavel,
} from 'lucide-react';
import { Backdrop, Badge, Button, IconTile, cx } from './ui';
import type { Tone } from './ui';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DocTab = 'methodology' | 'gfr' | 'evidence' | 'taxonomy';

const TABS: Array<{ id: DocTab; label: string }> = [
  { id: 'methodology', label: 'Hybrid architecture' },
  { id: 'gfr', label: 'GFR Rule 144(iii) basis' },
  { id: 'evidence', label: '5-point evidence checklist' },
  { id: 'taxonomy', label: 'Relationship taxonomy' },
];

const STAGES: Array<{ icon: LucideIcon; stage: string; title: string; body: React.ReactNode }> = [
  {
    icon: Search,
    stage: 'Stage 1',
    title: 'Sparse lexical (BM25)',
    body: 'Exact keyword, product designation, voltage rating, and technical terminology matching with BM25 scoring over catalog text.',
  },
  {
    icon: Sparkles,
    stage: 'Stage 2',
    title: 'Dense semantic',
    body: (
      <>
        384-dimensional sentence embeddings (<code className="font-mono text-[13px] whitespace-nowrap bg-white ring-1 ring-inset ring-line px-1.5 py-0.5 rounded-md">all-MiniLM-L6-v2</code>) capturing operational context, industrial purpose, and synonyms.
      </>
    ),
  },
  {
    icon: Layers,
    stage: 'Stage 3',
    title: 'Fusion, re-ranking & evidence',
    body: 'Weighted score fusion (0.5 / 0.5 to start, tunable) merges the lexical and semantic candidate pools; Claude re-ranks the small pool, then a deterministic 5-point evidence checklist validates each pick, alongside rule-based defect screening.',
  },
];

const CHECKLIST: Array<{ title: string; text: string }> = [
  {
    title: 'Product Nomenclature Alignment',
    text: 'Does the standard title and scope explicitly cover the item being procured?',
  },
  {
    title: 'Material Composition Match',
    text: 'Are the raw materials, alloys, or composites specified in the tender aligned with standard clauses?',
  },
  {
    title: 'Operational Environment & Intended Use',
    text: 'Is the operating environment (e.g. marine coastal, high-altitude, indoor substation) covered by the standard rating?',
  },
  {
    title: 'Prescribed Acceptance Testing Protocols',
    text: 'Does the standard mandate type tests, routine tests, and factory acceptance criteria?',
  },
  {
    title: 'Normative Cross-Reference Integrity',
    text: 'Are auxiliary standards (safety, testing, glossary) verified as active and un-superseded?',
  },
];

const TAXONOMY: Array<{ name: string; tone: Tone; line: string; dashed?: boolean; text: string }> = [
  {
    name: 'PRIMARY',
    tone: 'brand',
    line: 'border-brand-500',
    text: 'Central product specification defining core ratings, construction, and primary compliance criteria.',
  },
  {
    name: 'SAFETY',
    tone: 'danger',
    line: 'border-rose-500',
    text: 'Statutory safety mandate (e.g. earthing, ingress protection, non-toxic migration limits) that must accompany the tender.',
  },
  {
    name: 'SUPPORTING',
    tone: 'success',
    line: 'border-emerald-500',
    text: 'Normatively referenced test methods, sampling procedures, or material sub-component specifications.',
  },
  {
    name: 'TERMINOLOGY',
    tone: 'info',
    line: 'border-sky-500',
    text: 'Vocabulary, symbols, units, and classification standards establishing common commercial and engineering definitions.',
  },
  {
    name: 'INFERRED',
    tone: 'warn',
    line: 'border-amber-500',
    dashed: true,
    text: 'Relationship inferred by the retrieval engine from shared technical committee or keyword co-occurrence. Not an explicit citation in the BIS standard text; requires officer review.',
  },
];

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<DocTab>('methodology');

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <Backdrop onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doc-modal-title"
        className="relative z-50 w-full max-w-5xl max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl animate-pop overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 px-5 sm:px-8 pt-5 pb-4 sm:py-5 flex items-start gap-4">
          <span className="hidden sm:block"><IconTile icon={BookOpen} tone="brand" size="lg" /></span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id="doc-modal-title" className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
              System methodology &amp; statutory compliance guide
            </h2>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
              Technical architecture &amp; standards verification framework (GFR 2017 Rule 144(iii))
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close methodology guide"
            className="-mr-2 w-9 h-9 shrink-0 rounded-xl inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="shrink-0 border-b border-line-soft px-3 sm:px-6">
          <div role="tablist" aria-label="Methodology sections" className="flex items-center gap-1 overflow-x-auto">
            {TABS.map((tab, i) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`doc-tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls={`doc-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cx(
                    'relative h-12 px-3 sm:px-4 inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors cursor-pointer',
                    'after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors',
                    active
                      ? 'text-brand-700 after:bg-brand-600'
                      : 'text-slate-500 hover:text-slate-800 after:bg-transparent hover:after:bg-slate-200'
                  )}
                >
                  <span
                    className={cx(
                      'w-6 h-6 rounded-md text-xs font-mono font-bold inline-flex items-center justify-center',
                      active ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
                    )}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal body */}
        <div
          role="tabpanel"
          id={`doc-panel-${activeTab}`}
          aria-labelledby={`doc-tab-${activeTab}`}
          className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:flex-none sm:h-[32rem] text-sm text-slate-600 leading-relaxed"
        >
          {/* TAB 1: METHODOLOGY */}
          {activeTab === 'methodology' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl bg-brand-50/60 ring-1 ring-inset ring-brand-100 p-5 flex items-start gap-4">
                <IconTile icon={ShieldCheck} tone="brand" size="sm" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900">The core design principle</h3>
                  <p className="mt-1.5 text-[15px] text-slate-700 leading-relaxed max-w-3xl">
                    This platform does <strong className="font-semibold text-slate-900">not</strong> rely on an unconstrained Large Language Model to invent or
                    certify applicable Indian Standards. Instead, it utilizes a rigorous <strong className="font-semibold text-slate-900">Hybrid Multi-Stage Pipeline</strong>:
                  </p>
                </div>
              </div>

              <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STAGES.map(st => (
                  <li key={st.stage} className="card-soft p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <IconTile icon={st.icon} tone="brand" size="sm" />
                      <span className="eyebrow">{st.stage}</span>
                    </div>
                    <h4 className="font-heading text-[15px] font-semibold text-slate-900 leading-snug">{st.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{st.body}</p>
                  </li>
                ))}
              </ol>

              <div className="flex items-start gap-4 pt-5 border-t border-line-soft">
                <IconTile icon={Link2} tone="success" size="sm" />
                <div>
                  <h4 className="font-heading text-base font-semibold text-slate-900">Deterministic traceability</h4>
                  <p className="mt-1.5 text-[15px] text-slate-600 leading-relaxed max-w-3xl">
                    Every recommendation is linked to explicit spans in the tender document. If a standard is recommended,
                    the officer can view exactly which clause in the standard matched which requirement in their NIT.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GFR MANDATE */}
          {activeTab === 'gfr' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl bg-amber-50/70 ring-1 ring-inset ring-amber-200 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white text-amber-600 ring-1 ring-inset ring-amber-200 flex items-center justify-center shrink-0">
                    <Scale className="w-4 h-4" />
                  </span>
                  <h3 className="font-heading text-base font-semibold text-amber-900">
                    General Financial Rules (GFR) 2017 — Rule 144(iii)
                  </h3>
                </div>
                <blockquote className="mt-4 border-l-4 border-amber-400 pl-4 text-[15px] text-slate-800 leading-relaxed">
                  Paraphrase: where applicable and to the extent practicable, technical specifications are to be based on
                  national technical regulations or recognised national standards (for goods, Indian Standards published by BIS)
                  wherever such standards exist, and on relevant international standards only in their absence.
                </blockquote>
                <p className="mt-4 text-sm text-amber-900/90 leading-relaxed">
                  The engine surfaces candidate BIS standards with clause-level evidence. Whether a standard officially applies
                  remains the procuring officer&apos;s determination.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <IconTile icon={Gavel} tone="danger" size="sm" />
                <div>
                  <h4 className="font-heading text-base font-semibold text-slate-900">Mandatory Quality Control Orders (QCO)</h4>
                  <p className="mt-1.5 text-[15px] text-slate-600 leading-relaxed max-w-3xl">
                    When a standard is notified under a Quality Control Order issued by the Ministry of Consumer Affairs
                    or relevant Line Ministry, compliance becomes statutory law. Goods manufactured, imported, or procured
                    without the Standard Mark (ISI logo) violate Section 16 of the BIS Act, 2016.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE CHECKLIST */}
          {activeTab === 'evidence' && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-[15px] text-slate-600 leading-relaxed max-w-3xl">
                To eliminate subjective opinions, candidate standards are evaluated against an objective{' '}
                <strong className="font-semibold text-slate-900">5-Point Evidence Checklist</strong>:
              </p>

              <ol className="space-y-3">
                {CHECKLIST.map((item, i) => (
                  <li key={item.title} className="card-soft p-4 sm:p-5 flex items-start gap-4">
                    <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100 font-heading font-bold text-sm flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-slate-900 leading-snug">{item.title}</div>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* TAB 4: TAXONOMY */}
          {activeTab === 'taxonomy' && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-[15px] text-slate-600 leading-relaxed max-w-3xl">
                Relationships between standards in the recommendation package are classified into five distinct statutory types:
              </p>

              <ul className="space-y-3">
                {TAXONOMY.map(t => (
                  <li key={t.name} className="card-soft p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                    <div className="sm:w-40 shrink-0 space-y-2.5">
                      <Badge tone={t.tone} mono>{t.name}</Badge>
                      <span
                        className={cx('block w-16 border-t-[3px] rounded-full', t.line, t.dashed && 'border-dashed')}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{t.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 sm:px-8 py-4 border-t border-line-soft bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ministry of Consumer Affairs, Food &amp; Public Distribution — Government of India</span>
          </div>
          <Button variant="primary" onClick={onClose} className="shrink-0 w-full sm:w-auto">Acknowledge &amp; close</Button>
        </div>
      </div>
    </div>
  );
};
