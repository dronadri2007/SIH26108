import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowUpRight, FileText, LayoutGrid, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Recommendation, Requirement, SpecificationRisk, RelationshipType, RequirementType } from '../../types';
import { cx } from '../ui';
import { REL_META, REL_ORDER, REQ_TYPE_LABEL, prefersReducedMotion } from './meta';

/** Count up once on mount; jumps straight to the value when reduced motion is requested. */
const useCountTo = (target: number, ms = 900) => {
  const [v, setV] = useState(() => (prefersReducedMotion() ? target : 0));
  useEffect(() => {
    if (prefersReducedMotion()) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
};

interface TileProps {
  icon: LucideIcon;
  iconClass: string;
  label: string;
  value: number;
  suffix?: string;
  caption: string;
  onClick: () => void;
  actionLabel: string;
  children: React.ReactNode;
}

const Tile: React.FC<TileProps> = ({ icon: Icon, iconClass, label, value, suffix, caption, onClick, actionLabel, children }) => {
  const shown = useCountTo(value);
  return (
    <button
      onClick={onClick}
      aria-label={`${label}: ${value}${suffix ?? ''}. ${actionLabel}`}
      className="card card-hover group text-left p-5 flex flex-col gap-4 cursor-pointer focus-visible:ring-4 focus-visible:ring-brand-100"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-600">
          <span className={cx('w-8 h-8 rounded-lg flex items-center justify-center', iconClass)}>
            <Icon className="w-4 h-4" />
          </span>
          {label}
        </span>
        <ArrowUpRight className="w-4 h-4 text-slate-300 transition-all group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-[2.4rem] leading-none font-bold text-slate-900">{Math.round(shown)}</span>
          {suffix && <span className="font-heading text-xl font-bold text-slate-400">{suffix}</span>}
        </div>
        <div className="mt-1.5 text-[13px] text-slate-500">{caption}</div>
      </div>
      <div className="mt-auto">{children}</div>
    </button>
  );
};

interface KpiTilesProps {
  requirements: Requirement[];
  recommendations: Recommendation[];
  coveredCount: number;
  partialCount: number;
  gapIds: string[];
  coveragePercent: number;
  risks: SpecificationRisk[];
  reviewedRiskCount: number;
  onNavigate: (view: 'requirements' | 'results' | 'coverage' | 'risks') => void;
}

export const KpiTiles: React.FC<KpiTilesProps> = ({
  requirements,
  recommendations,
  coveredCount,
  partialCount,
  gapIds,
  coveragePercent,
  risks,
  reviewedRiskCount,
  onNavigate,
}) => {
  // requirement types, most frequent first
  const typeCounts = requirements.reduce<Partial<Record<RequirementType, number>>>((acc, r) => {
    acc[r.requirement_type] = (acc[r.requirement_type] ?? 0) + 1;
    return acc;
  }, {});
  const types = (Object.entries(typeCounts) as [RequirementType, number][]).sort((a, b) => b[1] - a[1]);

  // relationship mix, fixed order so colour follows the type, never the rank
  const relCounts = recommendations.reduce<Partial<Record<RelationshipType, number>>>((acc, r) => {
    acc[r.relationship_type] = (acc[r.relationship_type] ?? 0) + 1;
    return acc;
  }, {});
  const rels = REL_ORDER.filter(k => relCounts[k]);

  const high = risks.filter(r => r.severity === 'HIGH').length;
  const medium = risks.filter(r => r.severity === 'MEDIUM').length;
  const advisory = risks.filter(r => r.severity === 'ADVISORY').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* Requirements */}
      <Tile
        icon={FileText}
        iconClass="bg-slate-100 text-slate-600"
        label="Requirements"
        value={requirements.length}
        caption="atomic requirements, each pinned to a clause"
        actionLabel="Open requirements"
        onClick={() => onNavigate('requirements')}
      >
        <div className="flex flex-wrap gap-1.5">
          {types.slice(0, 4).map(([t, n]) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {REQ_TYPE_LABEL[t]} <span className="text-slate-400">{n}</span>
            </span>
          ))}
          {types.length > 4 && <span className="text-xs text-slate-500 py-0.5">+{types.length - 4} more</span>}
        </div>
      </Tile>

      {/* Standards */}
      <Tile
        icon={ShieldCheck}
        iconClass="bg-brand-50 text-brand-600"
        label="Standards"
        value={recommendations.length}
        caption="recommended, each with a 5-point check"
        actionLabel="Open recommendations"
        onClick={() => onNavigate('results')}
      >
        {recommendations.length > 0 && (
          <>
            <div className="flex h-2 gap-[2px] rounded-full overflow-hidden" aria-hidden="true">
              {rels.map(k => (
                <span key={k} style={{ flexGrow: relCounts[k], background: REL_META[k].color }} className="first:rounded-l-full last:rounded-r-full" />
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
              {rels.map(k => (
                <span key={k} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-2 h-2 rounded-sm" style={{ background: REL_META[k].color }} aria-hidden="true" />
                  {REL_META[k].label} <span className="text-slate-400">{relCounts[k]}</span>
                </span>
              ))}
            </div>
          </>
        )}
      </Tile>

      {/* Coverage */}
      <Tile
        icon={LayoutGrid}
        iconClass={gapIds.length ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}
        label="Coverage"
        value={Math.round(coveragePercent)}
        suffix="%"
        caption={`${coveredCount} of ${requirements.length} requirements have a governing standard`}
        actionLabel="Open coverage matrix"
        onClick={() => onNavigate('coverage')}
      >
        <div className="flex gap-1" role="img" aria-label={`${coveredCount} covered, ${partialCount} of them partial, ${gapIds.length} without a standard`}>
          {requirements.map(r => {
            const gap = gapIds.includes(r.requirement_id);
            return (
              <span
                key={r.requirement_id}
                title={`${r.requirement_id.toUpperCase()}: ${gap ? 'no indexed standard' : 'covered'}`}
                className={cx(
                  'h-2 flex-1 rounded-full',
                  gap ? 'bg-amber-50 ring-1 ring-inset ring-amber-400' : 'bg-emerald-500'
                )}
              />
            );
          })}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500" aria-hidden="true" />Covered {coveredCount}</span>
          {gapIds.length > 0 && (
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm ring-1 ring-inset ring-amber-400 bg-amber-50" aria-hidden="true" />Gap {gapIds.length}</span>
          )}
          {partialCount > 0 && <span className="text-slate-500">{partialCount} partial match</span>}
        </div>
      </Tile>

      {/* Alerts */}
      <Tile
        icon={AlertTriangle}
        iconClass={risks.length ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}
        label="Spec alerts"
        value={risks.length}
        caption={risks.length ? `${reviewedRiskCount} of ${risks.length} reviewed by you` : 'no vague or untestable clauses found'}
        actionLabel="Open specification review"
        onClick={() => onNavigate('risks')}
      >
        <div className="flex flex-wrap gap-1.5">
          {high > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-100">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" /> {high} high
            </span>
          )}
          {medium > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-100">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" /> {medium} medium
            </span>
          )}
          {advisory > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800 ring-1 ring-inset ring-sky-100">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" aria-hidden="true" /> {advisory} advisory
            </span>
          )}
          {risks.length === 0 && <span className="text-xs text-emerald-700 font-medium">All clear</span>}
        </div>
      </Tile>
    </div>
  );
};
