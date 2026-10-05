import React, { useMemo } from 'react';
import { ArrowRight, Building2, Check, Download, FileText, Lightbulb, Scale } from 'lucide-react';
import type { QueryRecord, Recommendation } from '../types';
import type { MainNavView } from './AppSidebar';
import { Button, Card } from './ui';
import { ReadinessRing, ReadinessStep } from './overview/ReadinessRing';
import { KpiTiles } from './overview/KpiTiles';
import { ClauseMap } from './overview/ClauseMap';
import { DecisionQueue, buildQueue } from './overview/DecisionQueue';
import { TopRecommendations } from './overview/TopRecommendations';
import { AnalysisRun } from './overview/AnalysisRun';
import { PARTIAL_BELOW } from './overview/meta';

interface DossierOverviewProps {
  query: QueryRecord;
  officerName: string;
  filename?: string;
  isOfficerEndorsed: boolean;
  endorsementTimestamp: string;
  onToggleEndorsement: () => void;
  onNavigate: (view: MainNavView) => void;
  onOpenTenderDrawer: () => void;
  onExportCsv: () => void;
  onOpenEvidence: (rec: Recommendation) => void;
  /** Officer review marks, keyed by `${query_id}:${itemId}`. */
  reviewed: Record<string, boolean>;
  onToggleReviewed: (key: string) => void;
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const DossierOverview: React.FC<DossierOverviewProps> = ({
  query,
  officerName,
  filename,
  isOfficerEndorsed,
  endorsementTimestamp,
  onToggleEndorsement,
  onNavigate,
  onOpenTenderDrawer,
  onExportCsv,
  onOpenEvidence,
  reviewed,
  onToggleReviewed,
}) => {
  const profile = query.profile;
  const requirements = query.requirements ?? [];
  const recommendations = query.recommendations ?? [];
  const risks = query.risks ?? [];
  const matrix = query.coverage_matrix;
  const gaps = matrix?.gaps ?? [];
  const gapIds = gaps.map(g => g.requirement_id);

  const keyOf = (id: string) => `${query.query_id}:${id}`;
  const isReviewed = (id: string) => Boolean(reviewed[keyOf(id)]);
  const toggle = (id: string) => onToggleReviewed(keyOf(id));

  const queue = useMemo(() => buildQueue(gaps, risks), [gaps, risks]);
  const gapItems = queue.filter(q => q.kind === 'gap');
  const riskItems = queue.filter(q => q.kind === 'risk');
  const gapsDecided = gapItems.filter(q => isReviewed(q.id)).length;
  const risksReviewed = riskItems.filter(q => isReviewed(q.id)).length;

  // coverage numbers
  const coveredCount = requirements.length - gapIds.length;
  const partialCount = requirements.filter(r => {
    if (gapIds.includes(r.requirement_id)) return false;
    const row = matrix?.cells?.[r.requirement_id] ?? {};
    const best = Math.max(0, ...Object.values(row).filter(c => c.covered).map(c => c.match_confidence));
    return best > 0 && best < PARTIAL_BELOW;
  }).length;
  const coveragePercent =
    typeof matrix?.coverage_percentage === 'number'
      ? matrix.coverage_percentage
      : requirements.length
      ? (coveredCount / requirements.length) * 100
      : 0;

  /* ------------------------------------------------ review progress */
  const traced = requirements.filter(r => r.source_span?.trim()).length;
  const steps: ReadinessStep[] = [
    {
      key: 'trace',
      label: 'Requirements traced',
      detail: `${traced} of ${requirements.length} pinned to a clause`,
      state: requirements.length > 0 && traced === requirements.length ? 'done' : traced > 0 ? 'partial' : 'todo',
      onClick: () => onNavigate('requirements'),
    },
    {
      key: 'gaps',
      label: 'Coverage gaps decided',
      detail: gapItems.length === 0 ? 'No gaps found' : `${gapsDecided} of ${gapItems.length} decided`,
      state: gapItems.length === 0 || gapsDecided === gapItems.length ? 'done' : gapsDecided > 0 ? 'partial' : 'todo',
      onClick: () => onNavigate('coverage'),
    },
    {
      key: 'alerts',
      label: 'Spec alerts reviewed',
      detail: riskItems.length === 0 ? 'No alerts raised' : `${risksReviewed} of ${riskItems.length} reviewed`,
      state: riskItems.length === 0 || risksReviewed === riskItems.length ? 'done' : risksReviewed > 0 ? 'partial' : 'todo',
      onClick: () => onNavigate('risks'),
    },
    {
      key: 'verify',
      label: 'Officer verification',
      detail: isOfficerEndorsed ? `Verified ${endorsementTimestamp}` : 'Awaiting your sign-off',
      state: isOfficerEndorsed ? 'done' : 'todo',
    },
  ];

  /* ------------------------------------------------ next step */
  const openGap = gapItems.find(q => !isReviewed(q.id));
  const openRisks = riskItems.filter(q => !isReviewed(q.id));
  const openHigh = openRisks.filter(q => q.severity === 'HIGH').length;
  const next = openGap
    ? {
        text: (
          <>
            <span className="font-mono">{openGap.reqRef?.toUpperCase()}</span> has no indexed standard. Decide how the tender should specify it.
          </>
        ),
        cta: 'Inspect the gap',
        action: () => onNavigate('coverage'),
      }
    : openRisks.length
    ? {
        text: (
          <>
            {openRisks.length} specification {openRisks.length === 1 ? 'alert is' : 'alerts are'} waiting
            {openHigh ? `, ${openHigh} of them high severity` : ''}. Fix them before the tender goes out.
          </>
        ),
        cta: 'Review alerts',
        action: () => onNavigate('risks'),
      }
    : !isOfficerEndorsed
    ? { text: <>Everything flagged has been reviewed. Verify the dossier as procuring officer.</>, cta: 'Verify now', action: onToggleEndorsement }
    : { text: <>Dossier verified. Export the citation set for the tender file.</>, cta: 'Export CSV', action: onExportCsv };

  const firstName = officerName.replace(/^(Dr\.|Smt\.|Shri|Col\.|Mr\.|Ms\.)\s+/i, '').split(' ')[0];

  return (
    <div className="space-y-6">
      {/* ================================================================ hero */}
      <Card padded={false} className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-violet-500 to-saffron-400" aria-hidden="true" />
        <div className="absolute -right-32 -top-40 w-[28rem] h-[28rem] rounded-full bg-brand-100/50 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute right-[26rem] -bottom-40 w-80 h-80 rounded-full bg-saffron-100/40 blur-3xl pointer-events-none hidden xl:block" aria-hidden="true" />

        <div className="relative grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_440px]">
          {/* left */}
          <div className="p-6 sm:p-8 min-w-0">
            <p className="text-sm text-slate-500">
              {greeting()}, <span className="font-semibold text-slate-700">{firstName}</span>. Here is where this tender stands.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex max-w-full items-center rounded-full bg-brand-50 px-2.5 py-1 font-mono text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="truncate">NIT {profile?.tender_reference ?? query.query_id}</span>
              </span>
              {profile?.department && (
                <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                  <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{profile.department}</span>
                </span>
              )}
            </div>

            <h1 className="mt-4 font-heading text-[1.7rem] sm:text-[2.1rem] leading-[1.15] font-bold text-slate-900 max-w-3xl">
              {profile?.product ?? 'Tender dossier'}
            </h1>
            <p className="mt-2 text-[15px] text-slate-500 max-w-2xl">
              {[profile?.category, profile?.quantity].filter(Boolean).join(' · ')}
            </p>

            {filename && (
              <button
                onClick={onOpenTenderDrawer}
                className="mt-4 inline-flex max-w-full items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-left ring-1 ring-inset ring-slate-200 hover:bg-white hover:ring-brand-200 transition-colors cursor-pointer group"
              >
                <FileText className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                <span className="truncate font-mono text-xs text-slate-600">{filename}</span>
                <span className="text-xs font-semibold text-brand-700 shrink-0 group-hover:underline">View source</span>
              </button>
            )}

            {/* next step */}
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-50 to-violet-50/60 ring-1 ring-inset ring-brand-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="w-10 h-10 rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-brand-100 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">Next step</div>
                <p className="mt-0.5 text-sm font-medium text-slate-800 leading-snug">{next.text}</p>
              </div>
              <Button size="sm" variant="primary" iconRight={ArrowRight} onClick={next.action} className="shrink-0 self-start sm:self-auto">
                {next.cta}
              </Button>
            </div>
          </div>

          {/* right: review progress */}
          <div className="relative p-6 sm:p-8 border-t xl:border-t-0 xl:border-l border-line-soft bg-white/50 grid gap-5 md:grid-cols-[minmax(0,1fr)_268px] md:items-center md:gap-x-8 xl:flex xl:flex-col xl:items-stretch">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 md:col-span-2">Review progress</div>
            <ReadinessRing steps={steps} />
            <div className="flex flex-col gap-2.5">
              <Button
                size="lg"
                variant={isOfficerEndorsed ? 'success' : 'primary'}
                icon={isOfficerEndorsed ? Check : Scale}
                onClick={onToggleEndorsement}
                title="Toggle officer verification. Official applicability stays with the procuring officer."
                className="w-full"
              >
                <span className="md:hidden xl:inline">{isOfficerEndorsed ? 'Verified as procuring officer' : 'Verify as procuring officer'}</span>
                <span className="hidden md:inline xl:hidden">{isOfficerEndorsed ? 'Verified' : 'Verify as officer'}</span>
              </Button>
              <div className="grid grid-cols-2 gap-2.5">
                <Button size="md" icon={FileText} onClick={onOpenTenderDrawer} className="whitespace-nowrap px-3">Tender</Button>
                <Button size="md" icon={Download} onClick={onExportCsv} className="whitespace-nowrap px-3">Export CSV</Button>
              </div>
            </div>
            <p className="mt-auto md:col-span-2 flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
              <Scale className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
              Recommendations are decision support. Whether a standard officially applies stays with you.
            </p>
          </div>
        </div>
      </Card>

      {/* ================================================================ KPIs */}
      <KpiTiles
        requirements={requirements}
        recommendations={recommendations}
        coveredCount={coveredCount}
        partialCount={partialCount}
        gapIds={gapIds}
        coveragePercent={coveragePercent}
        risks={risks}
        reviewedRiskCount={risksReviewed}
        onNavigate={onNavigate}
      />

      {/* ================================================================ map, queue, recommendations, run */}
      {/* Below xl the four cards form one column in task order; on xl they split into two independent columns. */}
      <div className="flex flex-col gap-6 xl:grid xl:grid-cols-3 xl:items-start">
        <div className="contents xl:block xl:col-span-2 xl:space-y-6 min-w-0">
          <div className="order-1 min-w-0">
            <ClauseMap
              requirements={requirements}
              recommendations={recommendations}
              matrix={matrix}
              isOfficerEndorsed={isOfficerEndorsed}
              onOpenEvidence={onOpenEvidence}
              onOpenTender={onOpenTenderDrawer}
              onOpenCoverage={() => onNavigate('coverage')}
            />
          </div>
          <div className="order-3 min-w-0">
            <TopRecommendations
              recommendations={recommendations}
              nearMissCount={query.why_not?.length ?? 0}
              onOpenEvidence={onOpenEvidence}
              onViewAll={() => onNavigate('results')}
              onOpenWhyNot={() => onNavigate('whynot')}
            />
          </div>
        </div>
        <div className="contents xl:block xl:space-y-6 min-w-0">
          <div className="order-2 min-w-0">
            <DecisionQueue
              items={queue}
              isReviewed={isReviewed}
              onToggle={toggle}
              onOpen={kind => onNavigate(kind === 'gap' ? 'coverage' : 'risks')}
              isOfficerEndorsed={isOfficerEndorsed}
              onVerify={onToggleEndorsement}
            />
          </div>
          <div className="order-4 min-w-0">
            <AnalysisRun logs={query.audit_logs ?? []} submittedAt={query.submitted_at} onOpenAudit={() => onNavigate('audit')} />
          </div>
        </div>
      </div>
    </div>
  );
};
