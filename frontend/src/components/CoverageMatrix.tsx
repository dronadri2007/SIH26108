import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Download,
  FileCheck2,
  LayoutGrid,
  Link2,
  MousePointerClick,
} from 'lucide-react';
import { CoverageMatrixData, RequirementType, Requirement } from '../types';
import { Badge, Button, Card, EmptyState, IconTile, PageHeader, ProgressBar, Segmented, cx } from './ui';
import type { Tone } from './ui';

interface CoverageMatrixProps {
  data: CoverageMatrixData;
  onSelectStandard?: (standardId: string) => void;
}

const REQUIREMENT_TYPE_TONE: Record<RequirementType, Tone> = {
  SAFETY: 'danger',
  TESTING: 'info',
  PRODUCT: 'brand',
  PERFORMANCE: 'violet',
  MATERIAL: 'success',
  TERMINOLOGY: 'neutral',
};

const TYPE_FILTERS = ['ALL', 'SAFETY', 'TESTING', 'PRODUCT', 'PERFORMANCE', 'MATERIAL'] as const;

const typeLabel = (t: string) => (t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase());

export const CoverageMatrix: React.FC<CoverageMatrixProps> = ({
  data,
  onSelectStandard
}) => {
  const [showGapsOnly, setShowGapsOnly] = useState(false);
  const [selectedType, setSelectedType] = useState<RequirementType | 'ALL'>('ALL');
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);

  const { requirements, standards, cells, gap_count, gaps } = data;
  const hasGaps = gap_count > 0;
  // Some analyses carry a coverage summary without the requirement-by-standard grid.
  const hasMatrix = requirements.length > 0 && standards.length > 0;
  const coveredCount = Math.max(0, requirements.length - gap_count);
  const coveragePct = Math.round(data.coverage_percentage);

  const filteredRequirements = requirements.filter(req => {
    if (showGapsOnly && !gaps.some(g => g.requirement_id === req.requirement_id)) {
      return false;
    }
    if (selectedType !== 'ALL' && req.requirement_type !== selectedType) {
      return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Requirement ID', 'Type', 'Requirement Text', ...standards.map(s => s.number), 'Covered Status'];
    const rows = requirements.map(r => {
      const isGap = gaps.some(g => g.requirement_id === r.requirement_id);
      const rowCells = standards.map(s => (cells[r.requirement_id]?.[s.standard_id]?.covered ? 'COVERED' : 'UNMET'));
      return [
        r.requirement_id,
        r.requirement_type,
        `"${r.requirement_text.replace(/"/g, '""')}"`,
        ...rowCells,
        isGap ? 'UNCOVERED_GAP' : 'COVERED'
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BIS_Tender_Coverage_Matrix_${data.query_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const typeOptions = TYPE_FILTERS.map(type => ({
    value: type,
    label: typeLabel(type),
    count: type === 'ALL' ? requirements.length : requirements.filter(r => r.requirement_type === type).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Requirement coverage"
        eyebrowIcon={LayoutGrid}
        title="Coverage matrix"
        description="Every decomposed tender requirement is checked against the candidate standards. A requirement with no covering standard is flagged as a gap for the procuring officer."
        actions={
          <Button icon={Download} onClick={handleExportCSV} disabled={!hasMatrix}>
            Export matrix CSV
          </Button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Summary banner                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Card padded={false} className="relative overflow-hidden">
        <div
          className={cx(
            'absolute inset-x-0 top-0 h-1',
            hasGaps ? 'bg-gradient-to-r from-amber-400 via-saffron-400 to-amber-300' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
          )}
          aria-hidden="true"
        />
        <div
          className={cx(
            'absolute -right-24 -top-28 w-72 h-72 rounded-full blur-3xl pointer-events-none',
            hasGaps ? 'bg-amber-100/70' : 'bg-emerald-100/70'
          )}
          aria-hidden="true"
        />

        <div className="relative p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-10 items-center">
          <div className="flex items-start gap-4">
            <IconTile icon={hasGaps ? AlertTriangle : FileCheck2} tone={hasGaps ? 'warn' : 'success'} size="lg" />
            <div className="min-w-0">
              <div className="eyebrow">Coverage verdict</div>
              <h2 className="mt-1.5 font-heading text-xl sm:text-2xl font-bold leading-snug tracking-tight text-slate-900">
                {hasGaps
                  ? `${gap_count} tender ${gap_count === 1 ? 'requirement lacks' : 'requirements lack'} sufficient standard coverage`
                  : 'All decomposed tender requirements have verified standard coverage'}
              </h2>
              <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-slate-600 max-w-xl">
                {hasGaps
                  ? 'The engine found tender specifications with no validated statutory standard match. Left unresolved, these gaps are a legal non-compliance hazard before contract award.'
                  : 'Every decomposed tender requirement maps to at least one validated statutory standard in the indexed catalog.'}
              </p>
            </div>
          </div>

          <div className="card-soft p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-5xl font-bold tracking-tight text-slate-900 tabular-nums">{coveragePct}%</span>
                <span className="text-sm font-medium text-slate-500">coverage</span>
              </div>
              {hasMatrix && (
                <div className="sm:text-right">
                  <div className="font-heading text-lg font-bold text-slate-900 tabular-nums">
                    {coveredCount} of {requirements.length}
                  </div>
                  <div className="text-sm text-slate-500">requirements covered</div>
                </div>
              )}
            </div>
            <ProgressBar value={data.coverage_percentage} tone={hasGaps ? 'warn' : 'success'} height="h-2.5" className="mt-4" />
            <dl className="mt-5 flex items-start justify-between gap-4 sm:justify-start sm:gap-10">
              {hasMatrix && <SummaryFigure label="Covered" value={coveredCount} tone="success" />}
              <SummaryFigure label={gap_count === 1 ? 'Gap' : 'Gaps'} value={gap_count} tone={hasGaps ? 'warn' : 'neutral'} />
              {hasMatrix && <SummaryFigure label="Standards" value={standards.length} tone="neutral" />}
            </dl>
          </div>
        </div>

        {hasGaps && gaps.length > 0 && (
          <div className="relative border-t border-amber-200/70 bg-amber-50/80 px-6 sm:px-8 py-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  No indexed standard covers {gap_count === 1 ? 'this requirement' : 'these requirements'}. Officer discretion is required.
                </p>
                <ul className="mt-3 space-y-2.5">
                  {gaps.map(g => (
                    <li key={g.requirement_id} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3 text-sm leading-relaxed text-amber-950">
                      <Badge tone="warn" mono className="self-start shrink-0">{g.requirement_id}</Badge>
                      <span className="min-w-0">{g.requirement_text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Matrix                                                             */}
      {/* ------------------------------------------------------------------ */}
      {!hasMatrix ? (
        <EmptyState
          icon={LayoutGrid}
          title="Requirement-level matrix unavailable"
          description="This analysis reports a coverage summary only. It has no requirement-by-standard detail to chart."
        />
      ) : (
        <Card padded={false} className="overflow-hidden">
          <div className="flex flex-col gap-4 p-4 sm:p-5 border-b border-line-soft lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setShowGapsOnly(!showGapsOnly)}
                aria-pressed={showGapsOnly}
                className={cx(
                  'inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer shrink-0',
                  showGapsOnly
                    ? 'bg-amber-50 text-amber-900 border-amber-300 ring-4 ring-amber-100'
                    : 'bg-white text-slate-700 border-line hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                )}
              >
                <AlertTriangle className={cx('w-4 h-4', showGapsOnly ? 'text-amber-600' : 'text-slate-400')} />
                Show gaps only ({gap_count})
              </button>
              <div className="max-w-full overflow-x-auto pb-1 sm:pb-0 -mb-1 sm:mb-0">
                <Segmented options={typeOptions} value={selectedType} onChange={setSelectedType} />
              </div>
            </div>
            <p className="text-sm text-slate-500 shrink-0">
              Showing <strong className="font-semibold text-slate-900 tabular-nums">{filteredRequirements.length}</strong> of{' '}
              <span className="tabular-nums">{requirements.length}</span> requirements
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th
                    scope="col"
                    className="sticky left-0 z-20 bg-slate-50 px-4 sm:px-5 py-3.5 min-w-[212px] sm:min-w-[320px] border-b border-r border-line shadow-[6px_0_8px_-6px_rgba(16,24,64,0.12)] sm:shadow-none"
                  >
                    Tender requirement
                  </th>
                  {standards.map(std => (
                    <th
                      key={std.standard_id}
                      scope="col"
                      className="bg-slate-50 px-2 py-2.5 min-w-[116px] text-center align-middle border-b border-r border-line-soft"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectStandard?.(std.standard_id)}
                        title={`${std.title} (open in knowledge graph)`}
                        aria-label={`Open ${std.number} in the knowledge graph`}
                        className="group w-full rounded-lg px-2 py-2 text-center transition-all cursor-pointer hover:bg-white hover:shadow-xs"
                      >
                        <span className="block font-mono text-[13px] font-semibold normal-case tracking-normal leading-snug text-slate-900 group-hover:text-brand-700">
                          {std.number}
                        </span>
                        <span className="mt-0.5 block text-xs font-medium normal-case tracking-normal text-slate-500">
                          {std.technical_committee}
                        </span>
                      </button>
                    </th>
                  ))}
                  <th scope="col" className="bg-slate-50 px-4 py-3.5 min-w-[108px] text-center border-b border-line">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="[&>tr:last-child>td]:border-b-0">
                {filteredRequirements.map(req => {
                  const isGap = gaps.some(g => g.requirement_id === req.requirement_id);
                  const anchorOpen = selectedReq?.requirement_id === req.requirement_id;

                  return (
                    <tr key={req.requirement_id} className={cx('group', isGap ? 'bg-amber-50' : 'bg-white hover:bg-slate-50')}>
                      {/* Requirement column (sticky) */}
                      <td
                        className={cx(
                          'sticky left-0 z-10 px-4 sm:px-5 py-4 align-top border-b border-r border-line-soft min-w-[212px] sm:min-w-[320px] max-w-[320px] shadow-[6px_0_8px_-6px_rgba(16,24,64,0.12)] sm:shadow-none',
                          isGap ? 'bg-amber-50' : 'bg-white group-hover:bg-slate-50'
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={REQUIREMENT_TYPE_TONE[req.requirement_type] ?? 'neutral'}>{req.requirement_type}</Badge>
                          <span className="font-mono text-xs font-semibold text-slate-500">{req.requirement_id}</span>
                        </div>
                        <p className="mt-2.5 text-sm font-medium leading-snug text-slate-900">{req.requirement_text}</p>
                        {isGap && (
                          <p className="mt-2 flex items-start gap-1.5 text-xs font-medium leading-snug text-amber-800">
                            <AlertTriangle className="w-3.5 h-3.5 mt-px shrink-0 text-amber-600" aria-hidden="true" />
                            No indexed standard covers this requirement.
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedReq(anchorOpen ? null : req)}
                          aria-expanded={anchorOpen}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 cursor-pointer"
                        >
                          <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
                          {anchorOpen ? 'Hide tender anchor' : 'Trace tender anchor'}
                        </button>
                        {anchorOpen && (
                          <div className="mt-3 rounded-xl border border-line bg-white p-3.5 animate-fade-in">
                            <div className="eyebrow">Original tender span</div>
                            <blockquote className="mt-1.5 text-[13px] italic leading-relaxed text-slate-600 border-l-2 border-brand-200 pl-3">
                              &ldquo;{req.source_span}&rdquo;
                            </blockquote>
                          </div>
                        )}
                      </td>

                      {/* Standard columns */}
                      {standards.map(std => {
                        const cell = cells[req.requirement_id]?.[std.standard_id];
                        const isCovered = cell?.covered;
                        const confidence = typeof cell?.match_confidence === 'number' ? Math.round(cell.match_confidence) : 0;

                        return (
                          <td
                            key={std.standard_id}
                            className="relative px-2 py-4 text-center align-middle border-b border-r border-line-soft"
                          >
                            {isCovered ? (
                              <span
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 text-sm font-semibold tabular-nums"
                                aria-label={`Covered by ${std.number}${confidence > 0 ? `, ${confidence}% match confidence` : ''}`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                                {confidence > 0 ? `${confidence}%` : 'Covered'}
                              </span>
                            ) : (
                              <span className="text-lg leading-none text-slate-300 select-none">
                                <span aria-hidden="true">&ndash;</span>
                                <span className="sr-only">Not mapped</span>
                              </span>
                            )}
                          </td>
                        );
                      })}

                      {/* Row status */}
                      <td className="px-4 py-4 text-center align-middle border-b border-line-soft">
                        {isGap ? (
                          <Badge tone="warn" icon={AlertTriangle}>Gap</Badge>
                        ) : (
                          <Badge tone="success" icon={Check}>Covered</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredRequirements.length === 0 && (
                  <tr>
                    <td colSpan={standards.length + 2} className="px-6 py-14 text-center text-sm text-slate-500">
                      No requirements match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 border-t border-line-soft bg-slate-50/70 text-xs text-slate-600">
            <span className="eyebrow">Legend</span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 text-xs font-semibold tabular-nums">
                <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                97%
              </span>
              Covered, with match confidence
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-6 text-center text-base leading-none text-slate-300" aria-hidden="true">&ndash;</span>
              Not mapped to this standard
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-6 h-4 rounded bg-amber-50 ring-1 ring-inset ring-amber-300" aria-hidden="true" />
              Gap: no standard covers the requirement
            </span>
            <span className="inline-flex items-center gap-2">
              <MousePointerClick className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              Select a standard header to open it in the knowledge graph
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

const SummaryFigure: React.FC<{ label: string; value: number; tone: 'success' | 'warn' | 'neutral' }> = ({ label, value, tone }) => (
  <div>
    <dt className="eyebrow">{label}</dt>
    <dd
      className={cx(
        'mt-1 font-heading text-2xl font-bold tabular-nums',
        tone === 'success' ? 'text-emerald-700' : tone === 'warn' ? 'text-amber-700' : 'text-slate-900'
      )}
    >
      {value}
    </dd>
  </div>
);
