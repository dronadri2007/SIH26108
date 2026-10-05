import React from 'react';
import { ArrowRight, ChevronRight, Scale } from 'lucide-react';
import type { Recommendation } from '../../types';
import { Card, cx } from '../ui';
import { REL_META } from './meta';

interface TopRecommendationsProps {
  recommendations: Recommendation[];
  nearMissCount: number;
  onOpenEvidence: (rec: Recommendation) => void;
  onViewAll: () => void;
  onOpenWhyNot: () => void;
}

export const TopRecommendations: React.FC<TopRecommendationsProps> = ({ recommendations, nearMissCount, onOpenEvidence, onViewAll, onOpenWhyNot }) => {
  const ranked = [...recommendations].sort((a, b) => a.rank - b.rank);

  return (
    <Card padded={false} className="flex flex-col h-full">
      <div className="px-5 sm:px-6 pt-5 pb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-slate-900">Recommended standards</h2>
          <p className="text-sm text-slate-500 mt-0.5">Ranked by hybrid match. Select one to open its evidence.</p>
        </div>
        <button onClick={onViewAll} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 cursor-pointer shrink-0">
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <ol className="px-3 sm:px-4 pb-2 flex-1">
        {ranked.map(rec => {
          const score = Math.round(rec.semantic_relevance);
          const meta = REL_META[rec.relationship_type];
          const full = rec.evidence_match_count === rec.evidence_match_total;
          return (
            <li key={rec.recommendation_id}>
              <button
                onClick={() => onOpenEvidence(rec)}
                className="w-full text-left grid grid-cols-[28px_minmax(0,1fr)_auto] sm:grid-cols-[28px_minmax(0,1fr)_150px_auto] items-center gap-3 sm:gap-4 rounded-xl px-2 sm:px-3 py-3 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <span
                  className={cx(
                    'w-7 h-7 rounded-lg flex items-center justify-center font-heading text-[13px] font-bold',
                    rec.rank === 1 ? 'bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {rec.rank}
                </span>

                <span className="min-w-0">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[13px] font-semibold text-slate-900 truncate">{rec.standard.number}</span>
                    <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 shrink-0">
                      <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} aria-hidden="true" />
                      {meta.label}
                    </span>
                  </span>
                  <span className="block text-[13px] text-slate-500 truncate">{rec.standard.title}</span>
                </span>

                <span className="hidden sm:flex items-center gap-2.5" title={`Hybrid match ${score}%: keyword ${Math.round(rec.bm25_relevance)}%, semantic ${Math.round(rec.vector_relevance)}%`}>
                  <span className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <span className="block h-full rounded-full bg-brand-500" style={{ width: `${score}%` }} />
                  </span>
                  <span className="w-9 text-right text-[13px] font-semibold text-slate-800 tabular-nums">{score}%</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <span
                    className={cx(
                      'rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ring-1 ring-inset',
                      full ? 'bg-emerald-50 text-emerald-800 ring-emerald-100' : 'bg-amber-50 text-amber-800 ring-amber-100'
                    )}
                    title="Evidence checks passed"
                  >
                    {rec.evidence_match_count}/{rec.evidence_match_total}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" aria-hidden="true" />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {nearMissCount > 0 && (
        <button
          onClick={onOpenWhyNot}
          className="mx-4 mb-4 rounded-xl bg-violet-50/70 ring-1 ring-inset ring-violet-100 px-4 py-3 flex items-center gap-3 text-left hover:bg-violet-50 transition-colors cursor-pointer group"
        >
          <span className="w-8 h-8 rounded-lg bg-white ring-1 ring-violet-100 text-violet-600 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-slate-900">
              {nearMissCount} near {nearMissCount === 1 ? 'miss' : 'misses'} rejected
            </span>
            <span className="block text-xs text-slate-500">Familiar standards that looked relevant, and why they failed the evidence check.</span>
          </span>
          <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true" />
        </button>
      )}
    </Card>
  );
};
