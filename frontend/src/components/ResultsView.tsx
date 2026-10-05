import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  GitCompare,
  HelpCircle,
  LayoutGrid,
  ListFilter,
  MessageSquare,
  Scale,
  Search,
  Share2,
  SlidersHorizontal,
  Table,
  X,
  XCircle,
} from 'lucide-react';
import { Recommendation, RelationshipType } from '../types';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar, Segmented, Tone, cx, toneDot } from './ui';

/* ------------------------------------------------------------------ */
/* Shared relationship badge (also used by the evidence drawer and the  */
/* comparison table so the three screens agree on colour and wording)   */
/* ------------------------------------------------------------------ */
const relationshipMeta: Record<RelationshipType, { label: string; tone: Tone; hint?: string }> = {
  PRIMARY: { label: 'Primary standard', tone: 'brand' },
  SAFETY: { label: 'Safety mandate', tone: 'danger' },
  SUPPORTING: { label: 'Supporting reference', tone: 'success' },
  TERMINOLOGY: { label: 'Terminology', tone: 'info' },
  INFERRED: {
    label: 'Inferred link',
    tone: 'warn',
    hint: 'Relationship inferred from catalog similarity and scope analysis; not a documented BIS citation.',
  },
};

export const RelationshipBadge: React.FC<{ type: RelationshipType; size?: 'sm' | 'md'; className?: string }> = ({
  type,
  size = 'md',
  className,
}) => {
  const meta = relationshipMeta[type];
  return (
    <span title={meta.hint} className="inline-flex">
      <Badge tone={meta.tone} dot size={size} className={className}>
        {meta.label}
      </Badge>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
const EvidencePips: React.FC<{ rec: Recommendation }> = ({ rec }) => {
  const items =
    rec.evidence.length > 0
      ? rec.evidence.map(e => e.matched)
      : Array.from({ length: rec.evidence_match_total }, (_, i) => i < rec.evidence_match_count);
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${rec.evidence_match_count} of ${rec.evidence_match_total} evidence criteria matched`}
    >
      {items.map((matched, i) => (
        <span key={i} className={cx('h-1.5 flex-1 rounded-full', matched ? 'bg-emerald-500' : 'bg-amber-400')} />
      ))}
    </div>
  );
};

const EvidenceChecklist: React.FC<{ rec: Recommendation; expanded: boolean; onToggle?: () => void; lockExpanded?: boolean; className?: string }> = ({
  rec,
  expanded,
  onToggle,
  lockExpanded,
  className,
}) => {
  const complete = rec.evidence_match_count >= rec.evidence_match_total;
  return (
    <div className={cx('card-soft p-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex items-center gap-2.5">
          <span className="eyebrow">Evidence checklist</span>
          <Badge tone={complete ? 'success' : 'warn'} mono>
            {rec.evidence_match_count}/{rec.evidence_match_total} verified
          </Badge>
        </div>
        {onToggle && !lockExpanded && rec.evidence.length > 0 && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 cursor-pointer"
          >
            {expanded ? 'Hide rationale' : 'Show rationale'}
            <ChevronDown className={cx('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')} />
          </button>
        )}
      </div>

      <div className="mt-3">
        <EvidencePips rec={rec} />
      </div>

      {rec.evidence.length > 0 && (
        <ul className={cx('mt-4 grid gap-x-6 gap-y-2.5', expanded ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
          {rec.evidence.map(ev => {
            const showRationale = expanded || !ev.matched;
            return (
              <li
                key={ev.evidence_id}
                className={cx(
                  'flex items-start gap-2.5',
                  !ev.matched && 'rounded-xl bg-amber-50/80 ring-1 ring-inset ring-amber-200 px-3 py-2.5',
                  !ev.matched && !expanded && 'sm:col-span-2'
                )}
              >
                {ev.matched ? (
                  <CheckCircle2 className="w-[18px] h-[18px] mt-px text-emerald-500 shrink-0" aria-label="Matched" />
                ) : (
                  <XCircle className="w-[18px] h-[18px] mt-px text-amber-500 shrink-0" aria-label="Not matched" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-800 leading-snug">{ev.criterion_label || ev.criterion}</div>
                  {showRationale && <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{ev.rationale}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const ScoreSignals: React.FC<{ rec: Recommendation; explain: boolean; className?: string }> = ({ rec, explain, className }) => {
  const fmt = (n: number) => (explain ? n.toFixed(1) : String(Math.round(n)));
  const rows: Array<{ key: string; label: string; hint: string; value: number; tone: Tone; lead?: boolean }> = [
    { key: 'hybrid', label: 'Hybrid match', hint: 'Weighted fusion of keyword and semantic scores', value: rec.semantic_relevance, tone: 'brand', lead: true },
    { key: 'keyword', label: 'Keyword', hint: 'BM25 lexical overlap with the tender text', value: rec.bm25_relevance, tone: 'info' },
    { key: 'semantic', label: 'Semantic', hint: 'Dense vector similarity of meaning', value: rec.vector_relevance, tone: 'violet' },
  ];
  return (
    <div className={cx('card-soft p-4', className)}>
      <div className="eyebrow">{explain ? 'Retrieval mathematical scoring' : 'Retrieval signals'}</div>
      <div className="mt-3.5 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
        {rows.map(row => (
          <div key={row.key}>
            <div className="flex items-center justify-between gap-2 h-7">
              <span className={cx('text-sm text-slate-700', row.lead ? 'font-semibold' : 'font-medium')}>{row.label}</span>
              <span
                className={cx(
                  'tabular-nums',
                  row.lead ? 'font-heading text-lg font-bold text-slate-900' : 'text-sm font-semibold text-slate-800'
                )}
              >
                {fmt(row.value)}%
              </span>
            </div>
            <ProgressBar value={row.value} tone={row.tone} height={row.lead ? 'h-2.5' : 'h-2'} className="mt-1.5" />
            {explain && <p className="mt-1.5 text-xs leading-snug text-slate-500">{row.hint}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const OfficerNote: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cx('flex items-start gap-2.5 rounded-xl bg-amber-50/80 ring-1 ring-inset ring-amber-200 px-3.5 py-3', className)}>
    <Scale className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
    <p className="text-[13px] leading-relaxed text-amber-900">
      <span className="font-semibold">Officer verification required.</span> Official applicability stays with the procuring officer.
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Ranked recommendation card                                          */
/* ------------------------------------------------------------------ */
interface RecommendationCardProps {
  rec: Recommendation;
  explain: boolean;
  copied: boolean;
  onCopy: (rec: Recommendation) => void;
  onOpenGraph: (standardId: string) => void;
  onOpenFeedback: (recommendation: Recommendation) => void;
  onOpenEvidenceDrawer?: (recommendation: Recommendation) => void;
  onOpenWhyNot?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  rec,
  explain,
  copied,
  onCopy,
  onOpenGraph,
  onOpenFeedback,
  onOpenEvidenceDrawer,
  onOpenWhyNot,
}) => {
  const [showRationale, setShowRationale] = useState(false);
  const featured = rec.rank === 1;
  const score = Math.round(rec.semantic_relevance);

  return (
    <Card padded={false} className="relative overflow-hidden">
      {featured && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-violet-500 to-saffron-400" aria-hidden="true" />
      )}

      <div className="p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <span
            className={cx(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-heading text-base font-bold tabular-nums',
              featured
                ? 'text-white bg-gradient-to-b from-brand-500 to-brand-600 shadow-md shadow-brand-600/30'
                : 'bg-slate-100 text-slate-600'
            )}
            aria-label={`Rank ${rec.rank}`}
          >
            #{rec.rank}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span className="font-mono text-sm font-bold text-brand-700">{rec.standard.number}</span>
              <RelationshipBadge type={rec.relationship_type} />
              <span className="text-xs text-slate-500">
                Technical committee <span className="font-semibold text-slate-700">{rec.standard.technical_committee}</span>
              </span>
            </div>
            <h3 className="mt-1.5 font-heading text-lg sm:text-xl font-semibold leading-snug tracking-tight text-slate-900">
              {rec.standard.title}
            </h3>
          </div>

          <div className="hidden sm:block text-right shrink-0">
            <div className="font-heading text-3xl font-bold tracking-tight text-slate-900 tabular-nums leading-none">{score}%</div>
            <div className="mt-1.5 text-xs font-medium text-slate-500">hybrid match</div>
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem]">
          <ScoreSignals rec={rec} explain={explain} className="xl:col-start-2 xl:row-start-1 self-start" />

          <div className="space-y-4 min-w-0 xl:col-start-1 xl:row-start-1">
            <div>
              <div className="eyebrow">Why this standard</div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{rec.justification}</p>
            </div>
            <EvidenceChecklist
              rec={rec}
              expanded={showRationale || explain}
              lockExpanded={explain}
              onToggle={() => setShowRationale(v => !v)}
            />
          </div>
        </div>

        <OfficerNote />
      </div>

      {/* Actions */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-line-soft bg-slate-50/60 flex flex-wrap items-center gap-x-2 gap-y-2.5">
        <div className="flex w-full sm:w-auto items-center gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
          {onOpenEvidenceDrawer && (
            <Button size="sm" variant="primary" icon={FileText} onClick={() => onOpenEvidenceDrawer(rec)}>
              <span className="sm:hidden">Evidence</span>
              <span className="hidden sm:inline">View evidence</span>
            </Button>
          )}
          <Button
            size="sm"
            icon={Share2}
            onClick={() => onOpenGraph(rec.standard_id)}
            title="Inspect knowledge graph citations"
            aria-label={`Open ${rec.standard.number} in the knowledge graph`}
          >
            Graph
          </Button>
          <Button
            size="sm"
            icon={MessageSquare}
            onClick={() => onOpenFeedback(rec)}
            title="Record an officer relevance decision"
            aria-label={`Give feedback on ${rec.standard.number}`}
          >
            Feedback
          </Button>
        </div>

        <div className="flex w-full sm:w-auto sm:ml-auto items-center justify-between sm:justify-end gap-1">
          {onOpenWhyNot && (
            <Button
              size="sm"
              variant="ghost"
              icon={HelpCircle}
              onClick={onOpenWhyNot}
              title="Inspect why alternative standards were disqualified"
            >
              Why not?
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            icon={copied ? Check : ClipboardCheck}
            onClick={() => onCopy(rec)}
            title="Copy gazette citation"
            aria-label="Copy gazette citation"
            className={copied ? 'text-emerald-700 hover:text-emerald-700' : undefined}
          >
            {copied ? 'Copied' : 'Cite'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Results view                                                        */
/* ------------------------------------------------------------------ */
interface ResultsViewProps {
  recommendations: Recommendation[];
  onOpenGraph: (standardId: string) => void;
  onOpenFeedback: (recommendation: Recommendation) => void;
  onOpenEvidenceDrawer?: (recommendation: Recommendation) => void;
  onOpenWhyNot?: () => void;
  onOpenCompare?: () => void;
  selectedReqId?: string | null;
  selectedReqText?: string | null;
  onClearReqFilter?: () => void;
}

const FILTER_CHIPS: Array<{ value: RelationshipType | 'ALL'; label: string; tone?: Tone }> = [
  { value: 'ALL', label: 'All' },
  { value: 'PRIMARY', label: 'Primary', tone: 'brand' },
  { value: 'SAFETY', label: 'Safety', tone: 'danger' },
  { value: 'SUPPORTING', label: 'Supporting', tone: 'success' },
];

export const ResultsView: React.FC<ResultsViewProps> = ({
  recommendations,
  onOpenGraph,
  onOpenFeedback,
  onOpenEvidenceDrawer,
  onOpenWhyNot,
  onOpenCompare,
  selectedReqId,
  selectedReqText,
  onClearReqFilter
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [explainabilityMode, setExplainabilityMode] = useState<boolean>(false);
  const [selectedStandardId, setSelectedStandardId] = useState<string>(
    recommendations[0]?.standard_id || ''
  );
  const [activeInspectorTab, setActiveInspectorTab] = useState<'justification' | 'evidence' | 'scope' | 'scoring'>('justification');
  const [filterType, setFilterType] = useState<RelationshipType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (rec: Recommendation) => {
    const text = `${rec.standard.number} - ${rec.standard.title} (Bureau of Indian Standards)`;
    navigator.clipboard.writeText(text);
    setCopiedId(rec.recommendation_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredRecommendations = recommendations.filter(r => {
    if (filterType !== 'ALL' && r.relationship_type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const numMatch = r.standard.number.toLowerCase().includes(q);
      const titleMatch = r.standard.title.toLowerCase().includes(q);
      const tcMatch = r.standard.technical_committee.toLowerCase().includes(q);
      return numMatch || titleMatch || tcMatch;
    }
    return true;
  });

  const selectedRec = recommendations.find(r => r.standard_id === selectedStandardId) || recommendations[0];

  const countFor = (type: RelationshipType | 'ALL') =>
    type === 'ALL' ? recommendations.length : recommendations.filter(r => r.relationship_type === type).length;

  const fullyVerified = recommendations.filter(r => r.evidence_match_count >= r.evidence_match_total).length;
  const hasActiveFilters = filterType !== 'ALL' || searchQuery.trim() !== '';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recommendations"
        eyebrowIcon={LayoutGrid}
        title="Recommended standards"
        description="Candidate BIS standards ranked by hybrid keyword and semantic match, each checked against a 5-point evidence list. Official applicability stays with the procuring officer."
        meta={
          recommendations.length > 0 ? (
            <>
              <Badge tone="brand">{recommendations.length} ranked {recommendations.length === 1 ? 'standard' : 'standards'}</Badge>
              <Badge tone={fullyVerified === recommendations.length ? 'success' : 'warn'} dot>
                {fullyVerified} fully verified
              </Badge>
            </>
          ) : undefined
        }
        actions={
          onOpenCompare && (
            <Button variant="secondary" icon={GitCompare} onClick={onOpenCompare}>
              Compare standards
            </Button>
          )
        }
      />

      {/* Selected requirement filter banner */}
      {selectedReqId && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 animate-fade-in">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ListFilter className="w-4 h-4" />
          </span>
          <div className="min-w-0 flex-1 basis-60">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800">Requirement filter</div>
            <p className="mt-0.5 text-sm text-amber-950 leading-snug">{selectedReqText}</p>
          </div>
          <Button size="sm" variant="secondary" icon={X} onClick={onClearReqFilter}>
            Clear filter
            <span className="hidden sm:inline">(show all standards)</span>
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <Card padded={false} className="p-3 sm:p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by relationship type">
          {FILTER_CHIPS.map(chip => {
            const active = filterType === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setFilterType(chip.value)}
                aria-pressed={active}
                className={cx(
                  'h-9 pl-3.5 pr-2.5 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ring-1 ring-inset',
                  active
                    ? 'bg-brand-600 text-white ring-brand-600 shadow-sm shadow-brand-600/30'
                    : 'bg-white text-slate-600 ring-line hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {chip.tone && <span className={cx('w-1.5 h-1.5 rounded-full', active ? 'bg-white' : toneDot[chip.tone])} />}
                {chip.label}
                <span
                  className={cx(
                    'min-w-[1.5rem] px-1.5 h-5 rounded-full inline-flex items-center justify-center text-[11px] font-mono font-semibold',
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {countFor(chip.value)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[10rem] sm:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Search standards by code, title or technical committee"
              placeholder="Search code, title, TC..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-10 w-full sm:w-64 rounded-xl border border-line bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              {
                value: 'cards',
                label: (
                  <>
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Dossiers
                  </>
                ),
              },
              {
                value: 'table',
                label: (
                  <>
                    <Table className="w-3.5 h-3.5" />
                    Ledger
                  </>
                ),
              },
            ]}
          />
        </div>
      </Card>

      {recommendations.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-1">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredRecommendations.length}</span> of {recommendations.length} candidate standards, ranked by hybrid match.
          </p>
          <button
            type="button"
            onClick={() => setExplainabilityMode(!explainabilityMode)}
            aria-pressed={explainabilityMode}
            title="Toggle between standard decision summary and mathematical retrieval metrics"
            className={cx(
              'h-9 px-3.5 rounded-xl text-[13px] font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ring-1 ring-inset',
              explainabilityMode
                ? 'bg-brand-50 text-brand-700 ring-brand-200'
                : 'bg-white text-slate-600 ring-line hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Explainability mode
            <span
              className={cx(
                'relative w-8 h-[18px] rounded-full transition-colors',
                explainabilityMode ? 'bg-brand-600' : 'bg-slate-300'
              )}
              aria-hidden="true"
            >
              <span
                className={cx(
                  'absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform',
                  explainabilityMode && 'translate-x-[14px]'
                )}
              />
            </span>
          </button>
        </div>
      )}

      {/* Empty states */}
      {filteredRecommendations.length === 0 && (
        <EmptyState
          icon={Search}
          title={recommendations.length === 0 ? 'No recommendations yet' : 'No standards match these filters'}
          description={
            recommendations.length === 0
              ? 'Run a tender analysis to see ranked BIS standards with their evidence.'
              : 'Try a different relationship type or clear the search to see every candidate standard.'
          }
          action={
            hasActiveFilters ? (
              <Button
                variant="secondary"
                size="sm"
                icon={X}
                onClick={() => {
                  setFilterType('ALL');
                  setSearchQuery('');
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}

      {/* ========================================================================= */}
      {/* MODE 1: decision dossier cards                                            */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && filteredRecommendations.length > 0 && (
        <div className="space-y-5">
          {filteredRecommendations.map(rec => (
            <RecommendationCard
              key={rec.recommendation_id}
              rec={rec}
              explain={explainabilityMode}
              copied={copiedId === rec.recommendation_id}
              onCopy={handleCopyCitation}
              onOpenGraph={onOpenGraph}
              onOpenFeedback={onOpenFeedback}
              onOpenEvidenceDrawer={onOpenEvidenceDrawer}
              onOpenWhyNot={onOpenWhyNot}
            />
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: audit ledger table and deep inspector                             */}
      {/* ========================================================================= */}
      {viewMode === 'table' && filteredRecommendations.length > 0 && (
        <div className="space-y-6">
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-line-soft whitespace-nowrap">
                    <th className="px-3 py-3.5 w-16 text-center">Rank</th>
                    <th className="px-3 py-3.5">Standard</th>
                    <th className="px-3 py-3.5">Role</th>
                    <th className="px-3 py-3.5 min-w-[220px]">Official title</th>
                    <th className="px-3 py-3.5">Hybrid match</th>
                    <th className="px-3 py-3.5 text-center">Evidence</th>
                    <th className="px-3 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {filteredRecommendations.map(rec => {
                    const isSelected = selectedStandardId === rec.standard_id;
                    const complete = rec.evidence_match_count >= rec.evidence_match_total;
                    return (
                      <tr
                        key={rec.recommendation_id}
                        onClick={() => setSelectedStandardId(rec.standard_id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedStandardId(rec.standard_id);
                          }
                        }}
                        tabIndex={0}
                        aria-selected={isSelected}
                        className={cx(
                          'cursor-pointer transition-colors align-top',
                          isSelected ? 'bg-brand-50/60' : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td
                          className={cx(
                            'px-3 py-3.5 text-center font-heading font-bold tabular-nums',
                            isSelected ? 'text-brand-700 shadow-[inset_3px_0_0_var(--color-brand-500)]' : 'text-slate-500'
                          )}
                        >
                          #{rec.rank}
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="font-mono text-[13px] font-bold text-slate-900 whitespace-nowrap">{rec.standard.number}</div>
                          <div className="mt-0.5 text-xs text-slate-500">TC {rec.standard.technical_committee}</div>
                        </td>
                        <td className="px-3 py-3.5">
                          <RelationshipBadge type={rec.relationship_type} />
                        </td>
                        <td className="px-3 py-3.5 text-slate-700 leading-snug">{rec.standard.title}</td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-16 shrink-0">
                              <ProgressBar value={rec.semantic_relevance} tone="brand" height="h-1.5" />
                            </div>
                            <span className="font-semibold text-slate-900 tabular-nums w-10">{Math.round(rec.semantic_relevance)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <Badge tone={complete ? 'success' : 'warn'} mono>
                            {rec.evidence_match_count}/{rec.evidence_match_total} passed
                          </Badge>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={FileText}
                              onClick={e => {
                                e.stopPropagation();
                                if (onOpenEvidenceDrawer) onOpenEvidenceDrawer(rec);
                              }}
                            >
                              Evidence
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Deep inspector for the selected table row */}
          {selectedRec && (
            <Card className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="eyebrow">Selected standard dossier</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-brand-700">{selectedRec.standard.number}</span>
                    <RelationshipBadge type={selectedRec.relationship_type} />
                  </div>
                  <h3 className="mt-1.5 font-heading text-lg font-semibold leading-snug tracking-tight text-slate-900">
                    {selectedRec.standard.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {onOpenEvidenceDrawer && (
                    <Button size="sm" variant="primary" icon={FileText} onClick={() => onOpenEvidenceDrawer(selectedRec)}>
                      Full evidence drawer
                    </Button>
                  )}
                  <Button size="sm" icon={Share2} onClick={() => onOpenGraph(selectedRec.standard_id)}>
                    Graph
                  </Button>
                  <Button size="sm" icon={MessageSquare} onClick={() => onOpenFeedback(selectedRec)}>
                    Feedback
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem]">
                <ScoreSignals rec={selectedRec} explain={explainabilityMode} className="xl:col-start-2 xl:row-start-1 self-start" />
                <div className="space-y-4 min-w-0 xl:col-start-1 xl:row-start-1">
                  <div>
                    <div className="eyebrow">Engineering justification</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{selectedRec.justification}</p>
                  </div>
                  <EvidenceChecklist rec={selectedRec} expanded />
                </div>
              </div>

              <OfficerNote />
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
