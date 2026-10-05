import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Copy,
  FileText,
  Info,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SpecificationRisk, RiskSeverity } from '../types';
import { Badge, Button, Card, EmptyState, IconTile, PageHeader, cx } from './ui';
import type { Tone } from './ui';

interface RiskPanelProps {
  risks: SpecificationRisk[];
}

interface SeverityStyle {
  tone: Tone;
  tileLabel: string;
  badge: string;
  icon: LucideIcon;
  accent: string;
  activeTile: string;
}

const SEVERITY: Record<RiskSeverity, SeverityStyle> = {
  HIGH: {
    tone: 'danger',
    tileLabel: 'High',
    badge: 'Critical hazard',
    icon: ShieldAlert,
    accent: 'bg-rose-500',
    activeTile: 'border-rose-300! ring-4! ring-rose-100',
  },
  MEDIUM: {
    tone: 'warn',
    tileLabel: 'Medium',
    badge: 'Elevated risk',
    icon: AlertTriangle,
    accent: 'bg-amber-500',
    activeTile: 'border-amber-300! ring-4! ring-amber-100',
  },
  ADVISORY: {
    tone: 'info',
    tileLabel: 'Advisory',
    badge: 'Advisory notice',
    icon: Info,
    accent: 'bg-sky-500',
    activeTile: 'border-sky-300! ring-4! ring-sky-100',
  },
};

const SEVERITY_ORDER = ['HIGH', 'MEDIUM', 'ADVISORY'] as const;

const humanizeRiskType = (t: string) => {
  const s = t.replace(/_/g, ' ').toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const RiskPanel: React.FC<RiskPanelProps> = ({ risks }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<RiskSeverity | 'ALL'>('ALL');

  const handleCopyClause = (risk: SpecificationRisk) => {
    navigator.clipboard.writeText(risk.suggested_clause);
    setCopiedId(risk.risk_id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredRisks = risks.filter(r => {
    if (filterSeverity === 'ALL') return true;
    return r.severity === filterSeverity;
  });

  const countBy = (sev: RiskSeverity) => risks.filter(r => r.severity === sev).length;

  const filterTiles: Array<{ value: RiskSeverity | 'ALL'; label: string; count: number; icon: LucideIcon; tone: Tone; active: string }> = [
    { value: 'ALL', label: 'All', count: risks.length, icon: ShieldCheck, tone: 'brand', active: 'border-brand-300! ring-4! ring-brand-100' },
    ...SEVERITY_ORDER.map(sev => ({
      value: sev as RiskSeverity | 'ALL',
      label: SEVERITY[sev].tileLabel,
      count: countBy(sev),
      icon: SEVERITY[sev].icon,
      tone: SEVERITY[sev].tone,
      active: SEVERITY[sev].activeTile,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pre-award audit"
        eyebrowIcon={ShieldAlert}
        title="Specification risk review"
        description="Rather than only suggesting standards, this pass audits the tender's own specifications for missing test protocols, unmeasurable metrics and ambiguous safety clauses, before the tender is issued to vendors."
        meta={
          <>
            <Badge tone="neutral">Clause defect evaluator</Badge>
            <Badge tone={risks.length > 0 ? 'danger' : 'success'} dot>
              {risks.length} {risks.length === 1 ? 'vulnerability' : 'vulnerabilities'} identified
            </Badge>
          </>
        }
      />

      {/* Severity summary doubles as the filter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" role="group" aria-label="Filter by severity">
        {filterTiles.map(tile => {
          const active = filterSeverity === tile.value;
          return (
            <button
              key={tile.value}
              type="button"
              onClick={() => setFilterSeverity(tile.value)}
              aria-pressed={active}
              className={cx(
                'card card-hover text-left p-4 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer',
                active && tile.active
              )}
            >
              <IconTile icon={tile.icon} tone={tile.tone} />
              <span className="min-w-0">
                <span className="block eyebrow truncate">{tile.label}</span>
                <span className="block mt-0.5 font-heading text-3xl font-bold leading-none tracking-tight text-slate-900 tabular-nums">
                  {tile.count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-slate-500">
        Showing <strong className="font-semibold text-slate-900 tabular-nums">{filteredRisks.length}</strong> of{' '}
        <span className="tabular-nums">{risks.length}</span> identified deficiencies
      </p>

      {/* Risk cards */}
      <div className="space-y-5">
        {filteredRisks.map(risk => {
          const sev = SEVERITY[risk.severity];
          const copied = copiedId === risk.risk_id;

          return (
            <Card key={risk.risk_id} padded={false} className="relative overflow-hidden">
              <div className={cx('absolute inset-y-0 left-0 w-1.5', sev.accent)} aria-hidden="true" />

              <div className="pl-6 pr-5 sm:pl-8 sm:pr-7 py-6 sm:py-7 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={sev.tone} dot>{sev.badge}</Badge>
                    <Badge tone="neutral">{humanizeRiskType(risk.risk_type)}</Badge>
                    {risk.requirement_ref && (
                      <span className="text-sm text-slate-500">
                        Linked to <strong className="font-semibold text-slate-800">{risk.requirement_ref}</strong>
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-heading text-lg sm:text-xl font-semibold leading-snug tracking-tight text-slate-900">
                    {risk.title}
                  </h3>
                </div>

                {/* Why risky / remedy */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <section className="rounded-2xl bg-rose-50/60 ring-1 ring-inset ring-rose-100 p-5">
                    <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700">
                      <AlertCircle className="w-4 h-4" aria-hidden="true" />
                      Why it is risky
                    </h4>
                    <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-slate-700">{risk.description}</p>
                  </section>

                  <section className="rounded-2xl bg-emerald-50/60 ring-1 ring-inset ring-emerald-100 p-5">
                    <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      <Lightbulb className="w-4 h-4" aria-hidden="true" />
                      Recommended remedy and standards citation
                    </h4>
                    <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-slate-700">{risk.recommended_remedy}</p>
                  </section>
                </div>

                {/* Suggested clause */}
                <section className="rounded-2xl border border-brand-200/80 bg-brand-50/50 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-brand-100 bg-brand-50/70">
                    <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                      <FileText className="w-4 h-4" aria-hidden="true" />
                      Suggested replacement clause
                    </h4>
                    <Button
                      size="sm"
                      variant={copied ? 'success' : 'secondary'}
                      icon={copied ? Check : Copy}
                      onClick={() => handleCopyClause(risk)}
                      aria-label={`Copy suggested clause for ${risk.title}`}
                    >
                      <span aria-live="polite">{copied ? 'Copied to clipboard' : 'Copy clause'}</span>
                    </Button>
                  </div>
                  <blockquote className="px-5 py-4 sm:py-5 text-[15px] leading-relaxed text-slate-800 border-l-4 border-brand-400 selection:bg-brand-200">
                    {risk.suggested_clause}
                  </blockquote>
                </section>
              </div>
            </Card>
          );
        })}

        {filteredRisks.length === 0 && (
          <EmptyState
            icon={ShieldCheck}
            title={risks.length === 0 ? 'No specification risks detected' : 'No findings at this severity'}
            description={
              risks.length === 0
                ? 'The clause defect evaluator found no missing test methods, unmeasurable metrics or ambiguous safety clauses.'
                : 'Choose another severity above to see the remaining findings.'
            }
          />
        )}
      </div>
    </div>
  );
};
