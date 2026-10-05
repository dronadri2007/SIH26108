import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, FileText, Layers, Link2, Search, SearchX } from 'lucide-react';
import { Requirement, RequirementType, Recommendation } from '../types';
import { Badge, Button, Card, EmptyState, PageHeader, Segmented, Stat, cx } from './ui';
import type { Tone } from './ui';

interface RequirementDecompositionViewProps {
  requirements: Requirement[];
  recommendations: Recommendation[];
  onSelectRequirementFilter?: (reqId: string, reqText: string) => void;
}

const TYPE_FILTERS = ['ALL', 'PRODUCT', 'MATERIAL', 'SAFETY', 'TESTING', 'PERFORMANCE', 'TERMINOLOGY'] as const;

const TYPE_TONE: Record<RequirementType, Tone> = {
  PRODUCT: 'brand',
  MATERIAL: 'success',
  SAFETY: 'danger',
  TESTING: 'info',
  PERFORMANCE: 'violet',
  TERMINOLOGY: 'neutral',
};

const typeLabel = (type: string) => type.charAt(0) + type.slice(1).toLowerCase();

/** Shared column template for the wide (table-like) layout. */
const ROW_COLUMNS = '@3xl:grid-cols-[80px_130px_minmax(0,1fr)_180px]';

export const RequirementDecompositionView: React.FC<RequirementDecompositionViewProps> = ({
  requirements,
  recommendations,
  onSelectRequirementFilter
}) => {
  const [selectedType, setSelectedType] = useState<RequirementType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSpanId, setExpandedSpanId] = useState<string | null>(null);

  const filteredRequirements = requirements.filter(req => {
    if (selectedType !== 'ALL' && req.requirement_type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.requirement_id.toLowerCase().includes(q) ||
        req.requirement_text.toLowerCase().includes(q) ||
        req.source_span.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const typeCount = (t: (typeof TYPE_FILTERS)[number]) =>
    t === 'ALL' ? requirements.length : requirements.filter(r => r.requirement_type === t).length;

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        eyebrow="Decomposition & clause traceability (§10)"
        eyebrowIcon={Layers}
        title="Tender requirement decomposition"
        description={
          <>
            The query decomposition stage converts unstructured procurement language into verified atomic requirements. Each specification is linked to its verbatim{' '}
            <strong className="font-semibold text-slate-700">source span</strong> in the tender document for complete legal traceability.
          </>
        }
        meta={
          <Badge tone="brand" icon={CheckCircle2}>
            {requirements.length} atomic {requirements.length === 1 ? 'specification' : 'specifications'} extracted
          </Badge>
        }
        actions={
          <Card padded={false} className="hidden sm:block px-6 py-4 min-w-[190px]">
            <Stat label="Traceability anchors" value={requirements.length} suffix="active" />
          </Card>
        }
      />

      {requirements.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No requirements extracted yet"
          description="Run a tender analysis to decompose the specification into atomic, source-linked requirements."
        />
      ) : (
        <>
          {/* ---------------------------------------------------------------- */}
          {/* Filter and search                                                 */}
          {/* ---------------------------------------------------------------- */}
          <div className="@container">
            <div className="flex flex-col @5xl:flex-row @5xl:items-center justify-between gap-3">
              <div className="overflow-x-auto -mx-1 px-1 py-1" role="group" aria-label="Filter by requirement type">
                <Segmented<RequirementType | 'ALL'>
                  className="min-w-max"
                  value={selectedType}
                  onChange={setSelectedType}
                  options={TYPE_FILTERS.map(t => ({
                    value: t,
                    label: t === 'ALL' ? 'All' : typeLabel(t),
                    count: typeCount(t),
                  }))}
                />
              </div>

              <div className="relative w-full @5xl:w-72 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  aria-label="Search requirements"
                  placeholder="Search requirement or anchor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Requirements list                                                 */}
          {/* ---------------------------------------------------------------- */}
          {filteredRequirements.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No requirements match"
              description="Try a different requirement type or clear the search to see every decomposed requirement."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedType('ALL');
                    setSearchQuery('');
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className="@container">
              <Card padded={false} className="overflow-hidden">
                <div role="table" aria-label="Decomposed requirements">
                  {/* Column headers (wide layout only) */}
                  <div
                    role="row"
                    className={cx(
                      'hidden @3xl:grid gap-4 px-5 py-3 bg-slate-50/80 border-b border-line-soft text-xs font-semibold uppercase tracking-wider text-slate-500',
                      ROW_COLUMNS
                    )}
                  >
                    <div role="columnheader">ID</div>
                    <div role="columnheader">Classification</div>
                    <div role="columnheader">Decomposed requirement text</div>
                    <div role="columnheader" className="text-right">Source traceability</div>
                  </div>

                  <div role="rowgroup" className="divide-y divide-line-soft">
                    {filteredRequirements.map(req => {
                      const isExpanded = expandedSpanId === req.requirement_id;

                      return (
                        <div key={req.requirement_id} className={cx('transition-colors', isExpanded && 'bg-brand-50/30')}>
                          <div
                            role="row"
                            className={cx(
                              'flex flex-wrap items-center gap-x-3 gap-y-3 px-5 py-4 @3xl:grid @3xl:gap-x-4 hover:bg-slate-50/70 transition-colors',
                              ROW_COLUMNS
                            )}
                          >
                            {/* ID */}
                            <div role="cell" className="font-mono text-[13px] font-semibold uppercase text-slate-700">
                              {req.requirement_id}
                            </div>

                            {/* Type badge */}
                            <div role="cell">
                              <Badge tone={TYPE_TONE[req.requirement_type] ?? 'neutral'}>{typeLabel(req.requirement_type)}</Badge>
                            </div>

                            {/* Requirement text */}
                            <div role="cell" className="basis-full @3xl:basis-auto min-w-0">
                              <p className="text-sm font-medium text-slate-900 leading-relaxed">{req.requirement_text}</p>
                            </div>

                            {/* Source traceability anchor toggle */}
                            <div role="cell" className="@3xl:justify-self-end">
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={Link2}
                                iconRight={isExpanded ? ChevronUp : ChevronDown}
                                aria-expanded={isExpanded}
                                onClick={() => setExpandedSpanId(isExpanded ? null : req.requirement_id)}
                              >
                                {isExpanded ? 'Hide span' : 'Inspect span'}
                              </Button>
                            </div>
                          </div>

                          {/* Expandable traceability anchor */}
                          {isExpanded && (
                            <div role="row" className="px-5 pb-5 pt-1 animate-fade-in">
                              <div role="cell" className="rounded-xl border border-line bg-white p-4 sm:p-5 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <span className="eyebrow inline-flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5 text-brand-600" />
                                    Verbatim tender span (traceability anchor)
                                  </span>
                                  {onSelectRequirementFilter && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      iconRight={ArrowRight}
                                      className="text-brand-700 hover:text-brand-800 hover:bg-brand-50"
                                      onClick={() => onSelectRequirementFilter(req.requirement_id, req.requirement_text)}
                                    >
                                      <span className="sm:hidden">Filter recommendations</span>
                                      <span className="hidden sm:inline">Filter recommendations for this requirement</span>
                                    </Button>
                                  )}
                                </div>

                                <blockquote className="border-l-2 border-brand-300 pl-4 text-sm text-slate-700 leading-relaxed italic">
                                  &ldquo;{req.source_span}&rdquo;
                                </blockquote>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-line-soft bg-slate-50/60 text-sm text-slate-500">
                  Showing {filteredRequirements.length} of {requirements.length} requirements
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};
