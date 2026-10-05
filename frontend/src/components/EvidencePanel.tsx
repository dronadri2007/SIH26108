import React from 'react';
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  MessageSquare,
  Scale,
  Share2,
  X,
  XCircle,
} from 'lucide-react';
import { Recommendation } from '../types';
import { Backdrop, Badge, Button, IconTile, ProgressBar, Tone, cx } from './ui';
import { RelationshipBadge } from './ResultsView';

interface EvidencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
  onOpenGraph?: (standardId: string) => void;
  onOpenFeedback?: (recommendation: Recommendation) => void;
}

const statusTone = (status: string): Tone => (status === 'CURRENT' ? 'success' : status === 'UNKNOWN' ? 'neutral' : 'warn');

const SectionHeading: React.FC<{ title: string; aside?: React.ReactNode }> = ({ title, aside }) => (
  <div className="flex items-center justify-between gap-3">
    <h3 className="font-heading text-[15px] font-semibold tracking-tight text-slate-900">{title}</h3>
    {aside}
  </div>
);

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  isOpen,
  onClose,
  recommendation,
  onOpenGraph,
  onOpenFeedback
}) => {
  const [copied, setCopied] = React.useState(false);

  const visible = isOpen && Boolean(recommendation);

  React.useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!isOpen || !recommendation) return null;

  const { standard, evidence } = recommendation;
  const complete = recommendation.evidence_match_count >= recommendation.evidence_match_total;
  const evidencePercent =
    recommendation.evidence_match_total > 0
      ? (recommendation.evidence_match_count / recommendation.evidence_match_total) * 100
      : 0;

  const handleCopyCitation = () => {
    const text = `${standard.number} - ${standard.title} (Bureau of Indian Standards)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="evidence-drawer-title">
      <Backdrop onClick={onClose} />

      <div className="absolute z-50 inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl flex flex-col animate-slide-in">
        {/* Drawer header */}
        <div className="px-5 sm:px-6 py-5 border-b border-line-soft flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                <FileText className="w-3.5 h-3.5" />
                Research workstation
              </span>
              <RelationshipBadge type={recommendation.relationship_type} />
            </div>
            <h2 id="evidence-drawer-title" className="font-heading text-xl font-bold tracking-tight text-slate-900">
              Evidence &amp; applicability dossier
            </h2>
          </div>

          <Button variant="ghost" size="md" icon={X} onClick={onClose} aria-label="Close drawer" title="Close drawer" className="w-10 px-0! shrink-0 -mr-2 -mt-1" />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-8">
          {/* 1. Standard metadata */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-lg font-bold text-brand-700">{standard.number}</span>
              <Badge tone={statusTone(standard.status)} dot>
                Status: {standard.status}
              </Badge>
            </div>

            <h3 className="font-heading text-base font-semibold leading-snug tracking-tight text-slate-900">{standard.title}</h3>

            <dl className="grid grid-cols-2 gap-3">
              <div className="card-soft p-3.5">
                <dt className="eyebrow">Technical committee</dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-slate-900">{standard.technical_committee}</dd>
              </div>
              <div className="card-soft p-3.5">
                <dt className="eyebrow">Sector</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{standard.sector_name || 'General Engineering'}</dd>
              </div>
            </dl>

            <figure className="rounded-2xl bg-brand-50/60 ring-1 ring-inset ring-brand-100 p-4">
              <figcaption className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                Official catalog scope definition
              </figcaption>
              <blockquote className="mt-2 text-sm leading-relaxed text-slate-700 italic">&ldquo;{standard.scope_text}&rdquo;</blockquote>
            </figure>
          </section>

          {/* 2. Evidence validation (5-point match) */}
          <section className="space-y-4">
            <SectionHeading
              title="Evidence layer (5-point validation)"
              aside={
                <Badge tone={complete ? 'success' : 'warn'} mono>
                  {recommendation.evidence_match_count} of {recommendation.evidence_match_total} passed
                </Badge>
              }
            />
            <ProgressBar value={evidencePercent} tone={complete ? 'success' : 'warn'} height="h-1.5" />

            <ul className="space-y-2.5">
              {evidence.map(ev => (
                <li
                  key={ev.evidence_id}
                  className={cx(
                    'flex items-start gap-3 rounded-2xl p-3.5 ring-1 ring-inset',
                    ev.matched ? 'bg-emerald-50/50 ring-emerald-100' : 'bg-amber-50/70 ring-amber-200'
                  )}
                >
                  <span
                    className={cx(
                      'mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                      ev.matched ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    )}
                  >
                    {ev.matched ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <span className="text-sm font-semibold text-slate-900">{ev.criterion_label || ev.criterion}</span>
                      <Badge tone={ev.matched ? 'success' : 'warn'}>
                        {ev.matched ? 'Match' : 'Unmet'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{ev.rationale}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Retrieval signals */}
          <section className="space-y-4">
            <SectionHeading title="Retrieval signals and scoring math" />
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'BM25 overlap', value: recommendation.bm25_relevance, tone: 'info' as Tone, text: 'text-sky-700' },
                { label: 'Semantic vector', value: recommendation.vector_relevance, tone: 'violet' as Tone, text: 'text-violet-700' },
                { label: 'Hybrid score', value: recommendation.semantic_relevance, tone: 'brand' as Tone, text: 'text-brand-700' },
              ].map(sig => (
                <div key={sig.label} className="card-soft p-3.5">
                  <div className="eyebrow">{sig.label}</div>
                  <div className={cx('mt-1.5 font-heading text-2xl font-bold tabular-nums tracking-tight', sig.text)}>
                    {sig.label === 'Hybrid score' ? sig.value.toFixed(1) : sig.value}%
                  </div>
                  <ProgressBar value={sig.value} tone={sig.tone} height="h-1.5" className="mt-2.5" />
                </div>
              ))}
            </div>
          </section>

          {/* 4. Explanation */}
          <section className="space-y-3">
            <SectionHeading title="Engineering applicability explanation" />
            <p className="text-sm leading-relaxed text-slate-700 border-l-2 border-brand-300 pl-4">{recommendation.justification}</p>
          </section>

          {/* 5. Official applicability verification banner */}
          <section className="flex items-start gap-3.5 rounded-2xl bg-amber-50/80 ring-1 ring-inset ring-amber-200 p-4">
            <IconTile icon={Scale} tone="warn" size="sm" />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800">Statutory governance directive</div>
              <div className="mt-1 font-heading text-[15px] font-semibold leading-snug text-amber-950">
                Official applicability: Requires procurement officer verification
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-amber-900">
                Algorithmic surfacing does not substitute for the designated procurement officer's technical determination. Specifications themselves follow GFR 2017 Rule 144(iii).
              </p>
            </div>
          </section>

          {/* 6. Public BIS catalog reference */}
          {standard.source_url && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
              <span>Public BIS reference</span>
              <a
                href={standard.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800 hover:underline"
              >
                bis.gov.in catalog record
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Drawer action footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-line-soft bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="md" icon={copied ? Check : ClipboardCheck} onClick={handleCopyCitation}>
              {copied ? 'Copied' : 'Copy citation'}
            </Button>

            {onOpenGraph && (
              <Button
                size="md"
                icon={Share2}
                onClick={() => {
                  onClose();
                  onOpenGraph(standard.standard_id);
                }}
              >
                Open in graph
              </Button>
            )}
          </div>

          {onOpenFeedback && (
            <Button
              variant="primary"
              size="md"
              icon={MessageSquare}
              onClick={() => {
                onClose();
                onOpenFeedback(recommendation);
              }}
            >
              Officer feedback
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
