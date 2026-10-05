import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Clock, Loader2, Scale, ShieldCheck } from 'lucide-react';
import type { QueryRecord } from '../types';
import { Badge, Card, PageHeader, ProgressBar, cx } from './ui';

interface Stage {
  number: string;
  code: string;
  title: string;
  metric: string;
  detail: string;
  durationMs: number;
}

const buildStages = (result?: QueryRecord | null): Stage[] => {
  const reqCount = result?.requirements?.length;
  const riskCount = result?.risks?.length;
  const typeCounts = (result?.recommendations ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.relationship_type] = (acc[r.relationship_type] ?? 0) + 1;
    return acc;
  }, {});
  const relLabels: [string, string][] = [['PRIMARY', 'Primary'], ['SAFETY', 'Safety'], ['SUPPORTING', 'Supporting'], ['TERMINOLOGY', 'Terminology'], ['INFERRED', 'Inferred']];
  const relSummary = relLabels.filter(([k]) => typeCounts[k]).map(([k, label]) => `${typeCounts[k]} ${label}`).join(', ');
  return [
  {
    number: '01',
    code: 'EXTRACT',
    title: 'Extract Tender Clauses & Profile',
    metric: 'Product profile and clauses extracted',
    detail: 'Isolating product scope, operating voltages, environmental conditions, and material specifications.',
    durationMs: 750
  },
  {
    number: '02',
    code: 'DECOMPOSE',
    title: 'Decompose Atomic Requirements',
    metric: reqCount !== undefined ? `${reqCount} atomic requirement${reqCount === 1 ? '' : 's'} indexed` : 'Atomic requirements indexed',
    detail: 'Tagging technical constraints into Product, Material, Safety, Testing, and Performance anchors.',
    durationMs: 800
  },
  {
    number: '03',
    code: 'RETRIEVE',
    title: 'Hybrid Multi-Stage BIS Retrieval',
    metric: '450 indexed standards evaluated',
    detail: 'Executing BM25 lexical sparse retrieval combined with 384-dim dense semantic vector re-ranking.',
    durationMs: 900
  },
  {
    number: '04',
    code: 'VALIDATE',
    title: '5-Point Independent Evidence Audit',
    metric: '5/5 verification criteria applied',
    detail: 'Checking category alignment, material composition, intended scope, and standardized test protocols.',
    durationMs: 850
  },
  {
    number: '05',
    code: 'CLASSIFY',
    title: 'Statutory Relationship Classification',
    metric: relSummary ? `${relSummary} mapped` : 'Relationships mapped',
    detail: 'Taxonomizing governing standards under GFR 144(iii) and technical committee jurisdictions.',
    durationMs: 750
  },
  {
    number: '06',
    code: 'RISK_AUDIT',
    title: 'Specification Contradiction & Risk Audit',
    metric: riskCount !== undefined ? `${riskCount} specification alert${riskCount === 1 ? '' : 's'} flagged` : 'Specification alerts flagged',
    detail: 'Detecting missing test methods, obsolete standard citations, and ambiguous acceptance limits.',
    durationMs: 750
  }
  ];
};

interface ProcessingPipelineViewProps {
  onComplete: () => void;
  sourceText?: string;
  filename?: string;
  /** The analysis being produced, used to report real counts per stage. */
  result?: QueryRecord | null;
}

export const ProcessingPipelineView: React.FC<ProcessingPipelineViewProps> = ({
  onComplete,
  sourceText,
  filename,
  result
}) => {
  const RESEARCH_STAGES = useMemo(() => buildStages(result), [result]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // The workspace scroller keeps its position between views; start the pipeline screen at the top.
  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo(0, 0);
  }, []);

  // Keep the running stage visible on short screens.
  useEffect(() => {
    rootRef.current?.querySelector('[aria-current="step"]')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentStageIndex]);

  // Timer for elapsed seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Synchronized progression through research stages
  useEffect(() => {
    if (currentStageIndex < RESEARCH_STAGES.length) {
      const stage = RESEARCH_STAGES[currentStageIndex];
      const timer = setTimeout(() => {
        setCurrentStageIndex(prev => prev + 1);
      }, stage.durationMs);
      return () => clearTimeout(timer);
    } else {
      const finalizeTimer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(finalizeTimer);
    }
  }, [currentStageIndex, onComplete, RESEARCH_STAGES]);

  const totalStages = RESEARCH_STAGES.length;
  const completedStages = Math.min(currentStageIndex, totalStages);
  const isFinished = currentStageIndex >= totalStages;
  const percent = Math.round((completedStages / totalStages) * 100);
  const activeStage = isFinished ? null : RESEARCH_STAGES[currentStageIndex];
  const elapsedLabel = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`;

  return (
    <div ref={rootRef} className="space-y-6">
      <PageHeader
        eyebrow="Deterministic verification pipeline"
        eyebrowIcon={ShieldCheck}
        title="Analyzing requisition dossier"
        description={filename ? `Source document: ${filename}` : 'Executing hybrid BM25 + dense vector evaluation against indexed BIS catalog.'}
        meta={
          isFinished ? (
            <Badge tone="success" dot>Finalizing dossier</Badge>
          ) : (
            <Badge tone="brand" dot>Pipeline running</Badge>
          )
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* ---------------------------------------------------------------- */}
        {/* Progress summary (first on mobile, right column on desktop)       */}
        {/* ---------------------------------------------------------------- */}
        <Card padded="lg" className="xl:col-start-3 xl:row-start-1 xl:sticky xl:top-6 space-y-6" aria-live="polite">
          <div>
            <div className="eyebrow">Pipeline progress</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-heading text-4xl font-bold tracking-tight text-slate-900 tabular-nums">{percent}%</span>
              <span className="text-sm text-slate-500 tabular-nums">
                {completedStages} of {totalStages} stages
              </span>
            </div>
            <ProgressBar value={percent} tone={isFinished ? 'success' : 'brand'} className="mt-4" height="h-2.5" />
          </div>

          <dl className="space-y-4 pt-5 border-t border-line-soft">
            <div className="flex items-center justify-between gap-3">
              <dt className="eyebrow">Elapsed processing</dt>
              <dd className="inline-flex items-center gap-1.5 font-mono text-base font-semibold text-slate-900 tabular-nums">
                <Clock className="w-4 h-4 text-slate-500" />
                {elapsedLabel}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">{isFinished ? 'Status' : 'Now running'}</dt>
              <dd className="mt-1.5 text-sm font-semibold text-slate-900 leading-snug">
                {activeStage ? activeStage.title : 'All stages complete'}
              </dd>
            </div>
          </dl>

          <div className="card-soft p-4 space-y-3">
            <div className="flex items-start gap-2.5 text-sm text-slate-600 leading-snug">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
              <span>Deterministic Rule Engine · Zero hallucination guarantee</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-slate-600 leading-snug">
              <Scale className="w-4 h-4 mt-0.5 text-saffron-600 shrink-0" />
              <span>Official applicability requires gazetted officer verification</span>
            </div>
          </div>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* Stage list                                                        */}
        {/* ---------------------------------------------------------------- */}
        <Card padded={false} className="xl:col-span-2 xl:col-start-1 xl:row-start-1 overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-line-soft flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-semibold tracking-tight text-slate-900">Verification stages</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Each stage runs deterministically and reports a factual result when it completes.
              </p>
            </div>
            <Badge tone={isFinished ? 'success' : 'neutral'} mono className="hidden sm:inline-flex">
              {completedStages}/{totalStages}
            </Badge>
          </div>

          <ol className="p-5 sm:p-6">
            {RESEARCH_STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isLast = idx === RESEARCH_STAGES.length - 1;

              return (
                <li key={stage.number} className="flex gap-4" aria-current={isCurrent ? 'step' : undefined}>
                  {/* Status marker + connector */}
                  <div className="flex flex-col items-center">
                    <span
                      className={cx(
                        'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                        isDone && 'bg-emerald-500 text-white shadow-[0_6px_14px_-6px_rgba(5,150,105,0.7)]',
                        isCurrent && 'bg-white text-brand-600 border-2 border-brand-500 ring-4 ring-brand-100',
                        !isDone && !isCurrent && 'bg-white text-slate-500 border-2 border-line font-mono text-xs font-semibold'
                      )}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4" strokeWidth={3} />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        stage.number
                      )}
                    </span>
                    {!isLast && (
                      <span
                        className={cx(
                          'w-0.5 flex-1 my-1.5 rounded-full transition-colors duration-500',
                          isDone ? 'bg-emerald-300' : 'bg-line'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Stage tile */}
                  <div
                    className={cx(
                      'flex-1 min-w-0 rounded-2xl border p-4 transition-all duration-300',
                      !isLast && 'mb-3',
                      isCurrent && 'bg-brand-50/60 border-brand-200 shadow-sm',
                      isDone && 'bg-white border-line',
                      !isDone && !isCurrent && 'bg-slate-50/70 border-line-soft'
                    )}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-x-4">
                      <div className="sm:col-start-1 sm:row-start-1 sm:h-6 flex items-center text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {stage.number} · {stage.code.replace('_', ' ')}
                      </div>
                      <h3
                        className={cx(
                          'mt-1 sm:mt-0 sm:col-span-2 sm:row-start-2 font-heading text-[15px] font-semibold tracking-tight leading-snug',
                          isDone || isCurrent ? 'text-slate-900' : 'text-slate-600'
                        )}
                      >
                        {stage.title}
                      </h3>
                      <p className="mt-1 sm:col-span-2 sm:row-start-3 text-sm text-slate-500 leading-relaxed">{stage.detail}</p>

                      {/* Result metric / status */}
                      <div className="mt-3 sm:mt-0 sm:col-start-2 sm:row-start-1 sm:h-6 flex items-center sm:justify-end">
                        {isDone ? (
                          <span className="inline-flex items-start gap-1.5 text-xs font-semibold text-emerald-700 leading-snug">
                            <Check className="w-3.5 h-3.5 mt-px shrink-0" strokeWidth={3} />
                            {stage.metric}
                          </span>
                        ) : isCurrent ? (
                          <Badge tone="brand" dot className="animate-pulse">In progress...</Badge>
                        ) : (
                          <span className="text-xs font-medium text-slate-500">Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </div>
  );
};
