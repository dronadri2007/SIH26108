import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  GitCompare,
  Info,
  Scale,
  Share2,
  X,
  XCircle,
} from 'lucide-react';
import { Recommendation, EvidenceCriterion } from '../types';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar, cx } from './ui';
import { RelationshipBadge } from './ResultsView';

interface ComparisonTableProps {
  recommendations: Recommendation[];
  onOpenEvidence: (recommendation: Recommendation) => void;
  onOpenGraph?: (standardId: string) => void;
}

/* Shared cell styling. Border-separate keeps hairlines visible under the sticky first column. */
const labelCell =
  'sticky left-0 z-10 bg-white group-hover:bg-slate-50 align-top text-left w-28 min-w-[7rem] sm:w-56 sm:min-w-[14rem] px-3 sm:px-4 py-3.5 border-b border-r border-line-soft transition-colors';
const dataCell =
  'align-top min-w-[230px] sm:min-w-[280px] px-3 sm:px-4 py-3.5 border-b border-line-soft group-hover:bg-slate-50/70 transition-colors';

const RowLabel: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <th scope="row" className={labelCell}>
    <div className="text-xs sm:text-sm font-semibold leading-snug text-slate-800">{title}</div>
    {hint && <div className="mt-0.5 text-xs font-normal leading-snug text-slate-500">{hint}</div>}
  </th>
);

const SectionRow: React.FC<{ title: string; span: number }> = ({ title, span }) => (
  <tr>
    <th
      scope="colgroup"
      className="sticky left-0 z-10 bg-slate-50 text-left px-3 sm:px-4 py-2.5 border-b border-r border-line-soft text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
    >
      {title}
    </th>
    <td colSpan={span} className="bg-slate-50 border-b border-line-soft" />
  </tr>
);

const Verdict: React.FC<{ matched: boolean; yes: string; no: string; rationale: string }> = ({ matched, yes, no, rationale }) => (
  <div>
    <div className={cx('flex items-start gap-2 text-sm font-semibold leading-snug', matched ? 'text-emerald-800' : 'text-amber-800')}>
      {matched ? (
        <CheckCircle2 className="w-[18px] h-[18px] mt-px text-emerald-500 shrink-0" aria-label="Matched" />
      ) : (
        <XCircle className="w-[18px] h-[18px] mt-px text-amber-500 shrink-0" aria-label="Not matched" />
      )}
      <span>{matched ? yes : no}</span>
    </div>
    <p className="mt-1.5 pl-[26px] text-xs leading-relaxed text-slate-500 line-clamp-3" title={rationale}>
      {rationale}
    </p>
  </div>
);

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  recommendations,
  onOpenEvidence,
  onOpenGraph
}) => {
  // Default to selecting top 3 recommendations
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return recommendations.slice(0, 3).map(r => r.standard_id);
  });

  const selectedRecs = recommendations.filter(r => selectedIds.includes(r.standard_id));
  const unselectedRecs = recommendations.filter(r => !selectedIds.includes(r.standard_id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return; // Keep at least 1
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert("Maximum 4 standards can be compared side-by-side for readable analysis.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getEvidenceMatch = (rec: Recommendation, criterion: EvidenceCriterion): boolean => {
    const item = rec.evidence.find(e => e.criterion === criterion);
    return item ? item.matched : false;
  };

  const getEvidenceRationale = (rec: Recommendation, criterion: EvidenceCriterion): string => {
    const item = rec.evidence.find(e => e.criterion === criterion);
    return item ? item.rationale : 'Not evaluated';
  };

  const handleExportComparison = () => {
    const headers = [
      'Attribute',
      ...selectedRecs.map(r => `${r.standard.number} - ${r.standard.title.replace(/"/g, '""')}`)
    ];

    const rows = [
      ['Relationship Type', ...selectedRecs.map(r => r.relationship_type)],
      ['Technical Committee', ...selectedRecs.map(r => r.standard.technical_committee)],
      ['Catalog Status', ...selectedRecs.map(r => r.standard.status)],
      ['Mandatory ISI Mark Order', ...selectedRecs.map(r => r.standard.mandatory_certification ? 'MANDATORY (QCO Order)' : 'Voluntary / General Specification')],
      ['Hybrid Relevance Score', ...selectedRecs.map(r => `${r.semantic_relevance.toFixed(1)}% (BM25: ${r.bm25_relevance}%, Vector: ${r.vector_relevance}%)`)],
      ['Product Scope Match', ...selectedRecs.map(r => getEvidenceMatch(r, 'PRODUCT_CATEGORY') ? 'Matched' : 'Parent Category Only')],
      ['Material Specification', ...selectedRecs.map(r => getEvidenceMatch(r, 'MATERIAL') ? 'Clause Matched' : 'Not Matched / General')],
      ['Operational Context', ...selectedRecs.map(r => getEvidenceMatch(r, 'INTENDED_USE') ? 'Matched Requirement Scope' : 'Standard / Generalized Context')],
      ['Testing / Protocol Clause', ...selectedRecs.map(r => getEvidenceMatch(r, 'TEST_REQUIREMENT') ? 'Clause Verified' : 'Standard Routine Testing')],
      ['Evidence Ratio', ...selectedRecs.map(r => `${r.evidence_match_count} of ${r.evidence_match_total} Passed`)],
      ['Statutory Directive', ...selectedRecs.map(() => 'Requires procurement officer verification')]
    ];

    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BIS_Standards_Comparison_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const span = selectedRecs.length;

  return (
    <div className="space-y-6">
      {/* 1. Header and controls */}
      <PageHeader
        eyebrow="Multi-standard comparative analysis"
        eyebrowIcon={GitCompare}
        title="Side-by-side standards evaluation"
        description="Compare scope boundaries, mandatory Quality Control Orders (QCO), testing coverage, and evidence match attributes to finalize procurement specification citations under GFR 144(iii)."
        meta={<Badge tone="neutral">Section 16 specification</Badge>}
        actions={
          <Button variant="secondary" icon={Download} onClick={handleExportComparison} disabled={recommendations.length === 0}>
            Export matrix (.CSV)
          </Button>
        }
      />

      {recommendations.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="Nothing to compare yet"
          description="Run a tender analysis to compare candidate BIS standards side by side."
        />
      ) : (
        <>
          {/* 2. Selection bar */}
          <Card padded={false} className="p-4 sm:p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-sm font-semibold text-slate-800">Active comparison</span>
                <Badge tone="brand" mono>
                  {selectedRecs.length} of max 4 selected
                </Badge>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {selectedRecs.map(rec => (
                  <li
                    key={rec.standard_id}
                    className={cx(
                      'inline-flex items-center gap-1 h-8 rounded-full bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 font-mono text-xs font-semibold',
                      selectedRecs.length > 1 ? 'pl-3 pr-1' : 'px-3'
                    )}
                  >
                    {rec.standard.number}
                    {selectedRecs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleSelect(rec.standard_id)}
                        aria-label={`Remove ${rec.standard.number} from comparison`}
                        title="Remove from comparison"
                        className="w-6 h-6 rounded-full inline-flex items-center justify-center text-brand-600 hover:bg-brand-100 hover:text-brand-800 cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {unselectedRecs.length > 0 && selectedRecs.length < 4 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:shrink-0">
                <span className="text-sm text-slate-500">Add to comparison:</span>
                <div className="relative">
                  <select
                    aria-label="Add a candidate standard to the comparison"
                    onChange={(e) => {
                      if (e.target.value) {
                        toggleSelect(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="h-11 w-full sm:w-80 appearance-none rounded-xl border border-line bg-white pl-4 pr-10 text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                    defaultValue=""
                  >
                    <option value="" disabled>Select candidate standard...</option>
                    {unselectedRecs.map(r => (
                      <option key={r.standard_id} value={r.standard_id}>
                        {r.standard.number} — {r.standard.title.slice(0, 45)}...
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}
          </Card>

          {/* 3. The comparison grid */}
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-20 bg-slate-50 align-bottom text-left w-28 min-w-[7rem] sm:w-56 sm:min-w-[14rem] px-3 sm:px-4 py-4 border-b border-r border-line text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Evaluation criteria
                    </th>
                    {selectedRecs.map(rec => (
                      <th
                        key={rec.standard_id}
                        scope="col"
                        className="align-top min-w-[230px] sm:min-w-[280px] px-3 sm:px-4 py-4 bg-slate-50/80 border-b border-line text-left font-normal"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="font-mono text-sm font-bold text-brand-700">{rec.standard.number}</span>
                              {rec.standard.mandatory_certification && (
                                <Badge tone="warn">
                                  ISI mandate
                                </Badge>
                              )}
                            </div>
                            <div className="mt-1.5 text-sm font-medium text-slate-800 leading-snug line-clamp-2" title={rec.standard.title}>
                              {rec.standard.title}
                            </div>
                          </div>

                          {selectedRecs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => toggleSelect(rec.standard_id)}
                              title="Remove from comparison"
                              aria-label={`Remove ${rec.standard.number} from comparison`}
                              className="w-8 h-8 -mr-1.5 -mt-1 rounded-lg inline-flex items-center justify-center shrink-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* Actions */}
                  <tr className="group">
                    <RowLabel title="Actions" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button size="sm" variant="secondary" icon={FileText} onClick={() => onOpenEvidence(rec)}>
                            Inspect dossier
                          </Button>
                          {onOpenGraph && (
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={Share2}
                              onClick={() => onOpenGraph(rec.standard_id)}
                              title="View knowledge graph"
                              aria-label={`View ${rec.standard.number} in the knowledge graph`}
                            >
                              Graph
                            </Button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <SectionRow title="Overview" span={span} />

                  {/* Relationship taxonomy */}
                  <tr className="group">
                    <RowLabel title="Relationship classification" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <RelationshipBadge type={rec.relationship_type} />
                      </td>
                    ))}
                  </tr>

                  {/* Retrieval relevance score */}
                  <tr className="group">
                    <RowLabel title="Hybrid relevance score" hint="Lexical BM25 + dense semantic" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <div className="flex items-center gap-3">
                          <ProgressBar value={rec.semantic_relevance} tone="brand" className="flex-1" />
                          <span className="font-heading text-lg font-bold text-slate-900 tabular-nums">
                            {rec.semantic_relevance.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-1.5 text-xs text-slate-500 tabular-nums">
                          BM25 {rec.bm25_relevance}% · Vector {rec.vector_relevance}%
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Evidence ratio */}
                  <tr className="group">
                    <RowLabel title="Evidence checklist" hint="5-point validation" />
                    {selectedRecs.map(rec => {
                      const complete = rec.evidence_match_count >= rec.evidence_match_total;
                      return (
                        <td key={rec.standard_id} className={dataCell}>
                          <div className="flex items-center gap-3">
                            <ProgressBar
                              value={rec.evidence_match_total > 0 ? (rec.evidence_match_count / rec.evidence_match_total) * 100 : 0}
                              tone={complete ? 'success' : 'warn'}
                              className="flex-1"
                            />
                            <Badge tone={complete ? 'success' : 'warn'} mono>
                              {rec.evidence_match_count}/{rec.evidence_match_total} passed
                            </Badge>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Technical committee */}
                  <tr className="group">
                    <RowLabel title="Technical committee (TC)" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <Badge tone="neutral" mono>
                          {rec.standard.technical_committee}
                        </Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Mandatory QCO / ISI mark */}
                  <tr className="group">
                    <RowLabel title="Mandatory QCO / ISI mark" hint="Statutory order issued by Ministry" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        {rec.standard.mandatory_certification ? (
                          <div className="flex items-start gap-2 text-sm font-semibold text-amber-800 leading-snug">
                            <AlertCircle className="w-[18px] h-[18px] mt-px text-amber-500 shrink-0" />
                            <span>Mandatory ISI mark under QCO</span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 text-sm text-slate-500 leading-snug">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 ml-1" />
                            <span>Voluntary / general specification</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  <SectionRow title="Evidence" span={span} />

                  {/* Product scope match */}
                  <tr className="group">
                    <RowLabel title="Product category alignment" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <Verdict
                          matched={getEvidenceMatch(rec, 'PRODUCT_CATEGORY')}
                          yes="Direct product match"
                          no="Parent category"
                          rationale={getEvidenceRationale(rec, 'PRODUCT_CATEGORY')}
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Material match */}
                  <tr className="group">
                    <RowLabel title="Material composition match" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <Verdict
                          matched={getEvidenceMatch(rec, 'MATERIAL')}
                          yes="Matched in standard clause"
                          no="Unspecified / parent alloy"
                          rationale={getEvidenceRationale(rec, 'MATERIAL')}
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Intended use */}
                  <tr className="group">
                    <RowLabel title="Intended operating context" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <Verdict
                          matched={getEvidenceMatch(rec, 'INTENDED_USE')}
                          yes="Aligns with operating context"
                          no="General / multi-domain use"
                          rationale={getEvidenceRationale(rec, 'INTENDED_USE')}
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Testing clause match */}
                  <tr className="group">
                    <RowLabel title="Prescribed testing protocol" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <Verdict
                          matched={getEvidenceMatch(rec, 'TEST_REQUIREMENT')}
                          yes="Mandatory test methods included"
                          no="Routine specifications only"
                          rationale={getEvidenceRationale(rec, 'TEST_REQUIREMENT')}
                        />
                      </td>
                    ))}
                  </tr>

                  <SectionRow title="Scope" span={span} />

                  {/* Standard scope excerpt */}
                  <tr className="group">
                    <RowLabel title="Official scope excerpt" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <p className="text-sm leading-relaxed text-slate-600 italic line-clamp-4" title={rec.standard.scope_text}>
                          &ldquo;{rec.standard.scope_text}&rdquo;
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Statutory compliance notice */}
                  <tr className="group">
                    <RowLabel title="Official applicability directive" />
                    {selectedRecs.map(rec => (
                      <td key={rec.standard_id} className={dataCell}>
                        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/80 ring-1 ring-inset ring-amber-200 p-3">
                          <Scale className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                          <div>
                            <div className="text-[13px] font-semibold leading-snug text-amber-950">Requires procurement officer verification</div>
                            <p className="mt-1 text-xs leading-relaxed text-amber-900">
                              Recommended based on candidate evidence. Not an automated certification.
                            </p>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer info banner */}
            <div className="px-5 py-3.5 bg-slate-50/70 border-t border-line-soft text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 mt-0.5 text-brand-600 shrink-0" />
                <span>Differences between selected standards are structured side-by-side to assist technical specification drafting.</span>
              </div>
              <Badge tone="neutral" mono className="self-start sm:self-auto">
                GFR Rule 144(iii) compliance matrix
              </Badge>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
