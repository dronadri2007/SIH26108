import React from 'react';
import {
  Check,
  FileQuestion,
  Scale,
  ShieldAlert,
  X,
  XCircle,
} from 'lucide-react';
import { WhyNotCandidate, Recommendation } from '../types';
import { Badge, Card, EmptyState, IconTile, PageHeader, ProgressBar, SectionTitle, cx } from './ui';

interface WhyNotPanelProps {
  whyNotCandidates: WhyNotCandidate[];
  primaryRecommendations: Recommendation[];
}

type FitKind = 'full' | 'muted' | 'fail';

const Fit: React.FC<{ kind: FitKind; children: React.ReactNode }> = ({ kind, children }) => (
  <span
    className={cx(
      'inline-flex items-center gap-1.5 text-sm',
      kind === 'full' && 'font-medium text-emerald-700',
      kind === 'muted' && 'text-slate-600',
      kind === 'fail' && 'font-semibold text-rose-700'
    )}
  >
    {kind === 'fail' ? (
      <X className="w-4 h-4 shrink-0" aria-hidden="true" />
    ) : (
      <Check className={cx('w-4 h-4 shrink-0', kind === 'muted' && 'text-slate-400')} aria-hidden="true" />
    )}
    {children}
  </span>
);

export const WhyNotPanel: React.FC<WhyNotPanelProps> = ({
  whyNotCandidates,
  primaryRecommendations
}) => {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Explainability"
        eyebrowIcon={FileQuestion}
        title="Why not these standards?"
        description="Procurement officers often ask why a familiar standard was not recommended. The engine surfaces near-miss candidates retrieved by lexical search and shows why independent criteria validation rejected them."
        meta={
          <>
            <Badge tone="neutral">Contrastive semantic filter</Badge>
            <Badge tone={whyNotCandidates.length > 0 ? 'danger' : 'success'} dot>
              {whyNotCandidates.length} rejected near-miss{whyNotCandidates.length === 1 ? '' : 'es'}
            </Badge>
          </>
        }
      />

      {whyNotCandidates.length === 0 && (
        <EmptyState
          icon={FileQuestion}
          title="No near-miss standards to explain"
          description="No near-miss standards were rejected for this analysis, so there is nothing to contrast."
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Near-miss cards                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-6">
        {whyNotCandidates.map(candidate => (
          <Card key={candidate.why_not_id} padded={false} className="overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-7 flex flex-col md:flex-row md:items-start justify-between gap-5 border-b border-line-soft">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral" mono>{candidate.standard.number}</Badge>
                  <Badge tone="danger" icon={XCircle}>Disqualified near-miss</Badge>
                  <span className="text-sm text-slate-500">
                    Technical committee <span className="font-medium text-slate-700">{candidate.standard.technical_committee}</span>
                  </span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold leading-snug tracking-tight text-slate-900">
                  {candidate.standard.title}
                </h3>
              </div>

              <div className="card-soft p-4 md:w-64 shrink-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="eyebrow whitespace-nowrap">Near-miss score</span>
                  <span className="font-heading text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {candidate.near_miss_score}%
                  </span>
                </div>
                <ProgressBar value={candidate.near_miss_score} tone="warn" className="mt-3" />
                <p className="mt-2.5 text-xs leading-snug text-slate-500">
                  Lexical retrieval score. Failed the final evidence gate.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-7 space-y-5">
              {/* Crucial mismatch */}
              <div className="flex items-start gap-4 rounded-2xl bg-rose-50 ring-1 ring-inset ring-rose-200 p-5">
                <IconTile icon={ShieldAlert} tone="danger" size="sm" />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700">Crucial technical mismatch</div>
                  <p className="mt-1.5 text-base font-semibold leading-snug text-rose-950">{candidate.crucial_mismatch}</p>
                </div>
              </div>

              {/* Shared vs differing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="card-soft p-5">
                  <header className="flex items-center gap-3">
                    <IconTile icon={Check} tone="success" size="sm" />
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-slate-900">Shared traits</h4>
                      <p className="text-xs text-slate-500">Why retrieval surfaced it</p>
                    </div>
                  </header>
                  <ul className="mt-4 space-y-3">
                    {candidate.shared_traits.map((trait, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="card-soft p-5">
                  <header className="flex items-center gap-3">
                    <IconTile icon={X} tone="danger" size="sm" />
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-slate-900">Differing traits</h4>
                      <p className="text-xs text-slate-500">Why validation disqualified it</p>
                    </div>
                  </header>
                  <ul className="mt-4 space-y-3">
                    {candidate.differing_traits.map((trait, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700">
                        <X className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" aria-hidden="true" />
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Rejection reasoning */}
              <section className="pl-4 border-l-2 border-slate-200">
                <h4 className="eyebrow">Rejection reasoning</h4>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-slate-600">{candidate.rejection_text}</p>
              </section>
            </div>
          </Card>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Side-by-side comparison                                            */}
      {/* ------------------------------------------------------------------ */}
      {primaryRecommendations.length > 0 && whyNotCandidates.length > 0 && (
        <Card padded={false} className="overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-line-soft">
            <SectionTitle
              icon={Scale}
              title="Direct candidate comparison"
              subtitle="Recommended standards set against the rejected near-misses, criterion by criterion."
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-5 sm:px-7 py-3.5">Standard</th>
                  <th scope="col" className="px-4 py-3.5">Determination</th>
                  <th scope="col" className="px-4 py-3.5">Category match</th>
                  <th scope="col" className="px-4 py-3.5">Material fit</th>
                  <th scope="col" className="px-4 py-3.5">Application fit</th>
                  <th scope="col" className="px-4 py-3.5">Test protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {primaryRecommendations.slice(0, 2).map(rec => (
                  <tr key={rec.recommendation_id} className="hover:bg-slate-50/70">
                    <td className="px-5 sm:px-7 py-4 font-mono text-[13px] font-semibold text-slate-900">{rec.standard.number}</td>
                    <td className="px-4 py-4"><Badge tone="success" dot>Recommended</Badge></td>
                    <td className="px-4 py-4"><Fit kind="full">Full match</Fit></td>
                    <td className="px-4 py-4"><Fit kind="full">Full match</Fit></td>
                    <td className="px-4 py-4"><Fit kind="full">Full match</Fit></td>
                    <td className="px-4 py-4"><Fit kind="full">Verified protocol</Fit></td>
                  </tr>
                ))}
                {whyNotCandidates.map(cand => (
                  <tr key={cand.why_not_id} className="hover:bg-slate-50/70">
                    <td className="px-5 sm:px-7 py-4 font-mono text-[13px] font-semibold text-slate-700">{cand.standard.number}</td>
                    <td className="px-4 py-4"><Badge tone="danger" dot>Disqualified</Badge></td>
                    <td className="px-4 py-4"><Fit kind="muted">Lexical overlap</Fit></td>
                    <td className="px-4 py-4"><Fit kind="muted">Partial match</Fit></td>
                    <td className="px-4 py-4"><Fit kind="fail">Divergent scope</Fit></td>
                    <td className="px-4 py-4"><Fit kind="fail">Incompatible test</Fit></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
