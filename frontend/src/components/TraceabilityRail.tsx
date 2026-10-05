import React from 'react';
import { ArrowRight, Check, FileText, Link2, Scale, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Recommendation, Requirement } from '../types';
import { Card, cx } from './ui';

interface TraceabilityRailProps {
  requirement?: Requirement | null;
  recommendation?: Recommendation | null;
  isOfficerEndorsed?: boolean;
  onOpenEvidence?: () => void;
  onOpenWhyNot?: () => void;
}

export const TraceabilityRail: React.FC<TraceabilityRailProps> = ({
  requirement,
  recommendation,
  isOfficerEndorsed = false,
  onOpenEvidence,
  onOpenWhyNot
}) => {
  const reqCode = requirement?.requirement_id?.toUpperCase() || 'REQ-1';
  const reqText = requirement?.requirement_text || '415V, 3-Phase, 50Hz Low-Voltage Switchgear and Controlgear Assembly with copper busbar and 50kA short-circuit rating';
  const stdNumber = recommendation?.standard?.number || 'IS/IEC 61439-2:2020';
  const stdTitle = recommendation?.standard?.title || 'Low-Voltage Switchgear and Controlgear Assemblies — Power Switchgear and Controlgear Assemblies';
  const firstEvidence = recommendation?.evidence?.[0];
  const clauseDetail = firstEvidence?.criterion_label || 'Product Category Alignment';
  const evidenceQuote = firstEvidence?.rationale || 'Applies to commercial and industrial installation environments. Scope text verifies operational parameters.';
  const scorePercent = recommendation ? Math.round(recommendation.semantic_relevance) : 94;

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="px-6 sm:px-8 pt-6 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line-soft">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-heading text-lg font-semibold text-slate-900 tracking-tight">Traceability rail</h2>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 rounded-full px-2.5 py-1">End-to-end audit chain</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Every recommended standard is bound to the tender clause it answers and the evidence that supports it.</p>
        </div>
        {onOpenEvidence && (
          <button
            onClick={onOpenEvidence}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 cursor-pointer group shrink-0"
          >
            Inspect full evidence
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-5 gap-px bg-line-soft">
        {/* 1 Tender clause */}
        <RailStep n={1} icon={FileText} label="Tender clause" meta={reqCode} metaMono>
          <div className="text-sm font-semibold text-slate-900 leading-snug line-clamp-3" title={reqText}>{reqText}</div>
          <div className="mt-auto pt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Link2 className="w-3.5 h-3.5" /> {requirement ? 'Pinned to source span' : 'Source span'}
          </div>
        </RailStep>

        {/* 2 Standard */}
        <RailStep n={2} icon={ShieldCheck} label="BIS standard" meta={stdNumber} metaMono>
          <div className="text-sm font-semibold text-slate-900 leading-snug line-clamp-3" title={stdTitle}>{stdTitle}</div>
          <div className="mt-auto pt-3 text-xs text-slate-500">Committee {recommendation?.standard?.technical_committee || '–'}</div>
        </RailStep>

        {/* 3 Evidence */}
        <RailStep n={3} icon={Sparkles} label="Verified criterion" meta={clauseDetail}>
          <div className="text-sm text-slate-600 italic leading-snug line-clamp-3" title={evidenceQuote}>&ldquo;{evidenceQuote}&rdquo;</div>
          <div className="mt-auto pt-3 text-xs text-slate-500">Scope and clause text match</div>
        </RailStep>

        {/* 4 Match */}
        <RailStep n={4} icon={Check} label="Hybrid match" meta={`${scorePercent}%`}>
          <div className="font-heading text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{scorePercent}%</div>
          <div className="mt-auto pt-3 text-xs text-slate-500">Keyword + semantic, weighted fusion</div>
        </RailStep>

        {/* 5 Officer */}
        <RailStep
          n={5}
          icon={isOfficerEndorsed ? UserCheck : Scale}
          label="Officer verification"
          tone={isOfficerEndorsed ? 'done' : 'pending'}
        >
          <div className={cx('text-sm font-semibold leading-snug', isOfficerEndorsed ? 'text-emerald-800' : 'text-slate-900')}>
            {isOfficerEndorsed ? 'Verified by officer' : 'Awaiting officer review'}
          </div>
          <div className="mt-auto pt-3 text-xs text-slate-500">
            {isOfficerEndorsed ? 'Applicability confirmed by the procuring officer' : 'Requires officer sign-off'}
          </div>
        </RailStep>
      </ol>
    </Card>
  );
};

interface RailStepProps {
  n: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  meta?: string;
  metaMono?: boolean;
  tone?: 'default' | 'done' | 'pending';
  children: React.ReactNode;
}

const RailStep: React.FC<RailStepProps> = ({ n, icon: Icon, label, meta, metaMono, tone = 'default', children }) => (
  <li className={cx('relative bg-white p-5 flex flex-col gap-3 min-h-[168px]', tone === 'done' && 'bg-emerald-50/60')}>
    <div className="flex items-center gap-2.5">
      <span
        className={cx(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          tone === 'done' ? 'bg-emerald-100 text-emerald-700' : tone === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-brand-50 text-brand-600'
        )}
      >
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0 leading-tight">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {String(n).padStart(2, '0')} · {label}
        </div>
        {meta && <div className={cx('text-xs font-semibold text-slate-700 truncate', metaMono && 'font-mono')}>{meta}</div>}
      </div>
    </div>
    {children}
  </li>
);
