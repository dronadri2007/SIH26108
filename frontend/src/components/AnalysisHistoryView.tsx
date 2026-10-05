import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Building2, ChevronRight, Clock, History, Search, SearchX, ShieldCheck } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader, Segmented, cx } from './ui';
import type { Tone } from './ui';

export interface SavedDossier {
  id: string;
  tenderNumber: string;
  title: string;
  department: string;
  sector: 'Electrical Safety' | 'Packaging Materials' | 'Construction & Building Materials';
  createdAt: string;
  officerName: string;
  requirementCount: number;
  standardsCount: number;
  gapCount: number;
  riskCount: number;
  caseKey: 'case1' | 'case2' | 'case3';
}

const HISTORICAL_DOSSIERS: SavedDossier[] = [
  {
    id: 'DOS-2026-CPWD-491',
    tenderNumber: 'MOP/CPWD/NZ-2026/EL-8942',
    title: 'Supply, Installation & Commissioning of 415V LV Main Switchgear Panels and Earthing System',
    department: 'Central Public Works Department (CPWD)',
    sector: 'Electrical Safety',
    createdAt: '2026-09-28 14:32 IST',
    officerName: 'Dr. Rajesh Verma (Dir. Tech)',
    requirementCount: 6,
    standardsCount: 5,
    gapCount: 1,
    riskCount: 3,
    caseKey: 'case1'
  },
  {
    id: 'DOS-2026-DRDO-812',
    tenderNumber: 'DRDO/DFRL/PUR/PKG-2026/091',
    title: 'High-Barrier Multi-Layer Flexible Retort Pouches for Ready-to-Eat Army Field Rations',
    department: 'Defence Food Research Laboratory (DFRL / DRDO)',
    sector: 'Packaging Materials',
    createdAt: '2026-09-26 11:15 IST',
    officerName: 'Smt. Priya Sundaram (Dy. Dir. Proc)',
    requirementCount: 4,
    standardsCount: 4,
    gapCount: 1,
    riskCount: 2,
    caseKey: 'case2'
  },
  {
    id: 'DOS-2026-JNPA-104',
    tenderNumber: 'JNPA/ENGG/MARINE-BERTH/2026/18',
    title: 'Reinforced Concrete Piles & Deep Marine Structures for Container Terminal Berth Extension',
    department: 'Jawaharlal Nehru Port Authority (JNPA)',
    sector: 'Construction & Building Materials',
    createdAt: '2026-09-24 16:45 IST',
    officerName: 'Col. Anand K. Sharma (Chief Engr)',
    requirementCount: 4,
    standardsCount: 4,
    gapCount: 1,
    riskCount: 2,
    caseKey: 'case3'
  },
  {
    id: 'DOS-2026-RAIL-339',
    tenderNumber: 'CR/ELEC/TRS/2026/71',
    title: 'Dry-Type Cast Resin Power Transformers (33kV/433V, 2000kVA) for Traction Substations',
    department: 'Ministry of Railways (RDSO / Central Railway)',
    sector: 'Electrical Safety',
    createdAt: '2026-09-21 09:20 IST',
    officerName: 'Dr. Rajesh Verma (Dir. Tech)',
    requirementCount: 5,
    standardsCount: 4,
    gapCount: 0,
    riskCount: 1,
    caseKey: 'case1'
  },
  {
    id: 'DOS-2026-NHAI-502',
    tenderNumber: 'NHAI/TECH/HIGHWAY/CONC/2026/33',
    title: 'Precast Segmental Box Girders with Pozzolanic Slag Cement for Elevated Corridor',
    department: 'National Highways Authority of India (NHAI)',
    sector: 'Construction & Building Materials',
    createdAt: '2026-09-19 15:10 IST',
    officerName: 'Col. Anand K. Sharma (Chief Engr)',
    requirementCount: 6,
    standardsCount: 5,
    gapCount: 2,
    riskCount: 3,
    caseKey: 'case3'
  }
];

interface AnalysisHistoryViewProps {
  onLoadDossier: (caseKey: 'case1' | 'case2' | 'case3') => void;
  onNewAnalysis: () => void;
}

const SECTOR_TONE: Record<SavedDossier['sector'], Tone> = {
  'Electrical Safety': 'warn',
  'Packaging Materials': 'info',
  'Construction & Building Materials': 'success',
};

/** Wide (table-like) layout: subject | four counters | analyst + time | action. */
const WIDE_COLUMNS = '@5xl:grid-cols-[minmax(0,1fr)_312px_200px_124px]';

const metricLabel = 'text-[11px] font-semibold uppercase tracking-wide text-slate-500 @5xl:hidden';

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({
  onLoadDossier,
  onNewAnalysis
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const filteredDossiers = HISTORICAL_DOSSIERS.filter(item => {
    if (selectedSector !== 'ALL' && item.sector !== selectedSector) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const idMatch = item.id.toLowerCase().includes(q);
      const tenderMatch = item.tenderNumber.toLowerCase().includes(q);
      const titleMatch = item.title.toLowerCase().includes(q);
      const deptMatch = item.department.toLowerCase().includes(q);
      return idMatch || tenderMatch || titleMatch || deptMatch;
    }
    return true;
  });

  const sectorCount = (sector: string) =>
    sector === 'ALL' ? HISTORICAL_DOSSIERS.length : HISTORICAL_DOSSIERS.filter(d => d.sector === sector).length;

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        eyebrow="Procurement records · Archival audit trails"
        eyebrowIcon={History}
        title="Tender analysis history & evaluation dossiers"
        description="Immutable repository of previous procurement technical specification audits conducted under GFR 2017 Rule 144(iii). Reopen any dossier to review requirement decompositions, coverage matrices, or export statutory compliance packages."
        meta={
          <>
            <Badge tone="neutral" icon={History}>
              {HISTORICAL_DOSSIERS.length} dossiers archived
            </Badge>
            <Badge tone="success" icon={ShieldCheck}>Immutable audit trail</Badge>
          </>
        }
        actions={
          <Button variant="primary" size="lg" iconRight={ArrowRight} onClick={onNewAnalysis} className="w-full sm:w-auto">
            Initiate new tender intake
          </Button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Filter and search                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="@container">
      <div className="flex flex-col @5xl:flex-row @5xl:items-center justify-between gap-3">
        <div className="relative w-full @5xl:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            aria-label="Search dossiers"
            placeholder="Search by tender ref, title, or ministry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all"
          />
        </div>

        <div className="overflow-x-auto -mx-1 px-1 py-1" role="group" aria-label="Filter by sector">
          <Segmented<string>
            className="min-w-max"
            value={selectedSector}
            onChange={setSelectedSector}
            options={[
              { value: 'ALL', label: 'All sectors', count: sectorCount('ALL') },
              { value: 'Electrical Safety', label: 'Electrical safety', count: sectorCount('Electrical Safety') },
              { value: 'Packaging Materials', label: 'Packaging materials', count: sectorCount('Packaging Materials') },
              {
                value: 'Construction & Building Materials',
                label: 'Construction & building',
                count: sectorCount('Construction & Building Materials'),
              },
            ]}
          />
        </div>
      </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Dossier list                                                       */}
      {/* ------------------------------------------------------------------ */}
      {filteredDossiers.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No dossiers match"
          description="Try a different sector or clear the search to see every archived tender analysis."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('ALL');
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="@container">
          <Card padded={false} className="overflow-hidden">
            <div role="table" aria-label="Archived tender analysis dossiers">
              {/* Column headers (wide layout only) */}
              <div
                role="row"
                className={cx(
                  'hidden @5xl:grid gap-x-4 px-5 py-3 bg-slate-50/80 border-b border-line-soft text-xs font-semibold uppercase tracking-wider text-slate-500',
                  WIDE_COLUMNS
                )}
              >
                <div role="columnheader">Dossier ID, tender subject &amp; department</div>
                <div className="grid grid-cols-4 gap-x-2 text-center">
                  <div role="columnheader">Reqs</div>
                  <div role="columnheader">Standards</div>
                  <div role="columnheader">Gaps</div>
                  <div role="columnheader">Risks</div>
                </div>
                <div role="columnheader">Analyzed by / timestamp</div>
                <div role="columnheader" className="text-right">Actions</div>
              </div>

              <div role="rowgroup" className="divide-y divide-line-soft">
                {filteredDossiers.map(dossier => (
                  <div
                    key={dossier.id}
                    role="row"
                    className={cx(
                      'flex flex-col gap-4 p-5 hover:bg-slate-50/70 transition-colors',
                      '@5xl:grid @5xl:items-center @5xl:gap-x-4 @5xl:py-4',
                      WIDE_COLUMNS
                    )}
                  >
                    {/* ID, tender, subject, department */}
                    <div role="cell" className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                        <span className="font-mono text-[13px] font-semibold text-brand-700">{dossier.id}</span>
                        <Badge tone={SECTOR_TONE[dossier.sector]} size="sm">{dossier.sector}</Badge>
                      </div>
                      <div className="text-[15px] font-semibold text-slate-900 leading-snug">{dossier.title}</div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                        <span className="font-mono text-xs text-slate-500">{dossier.tenderNumber}</span>
                        <span className="inline-flex items-start gap-1.5 min-w-0">
                          <Building2 className="w-3.5 h-3.5 mt-[3px] shrink-0" aria-hidden="true" />
                          <span>{dossier.department}</span>
                        </span>
                      </div>
                    </div>

                    {/* Counters */}
                    <div className="grid grid-cols-4 gap-2 rounded-xl bg-slate-50 p-3 max-w-lg @5xl:max-w-none @5xl:bg-transparent @5xl:p-0 @5xl:gap-x-2">
                      <div role="cell" className="flex flex-col items-center gap-1 @5xl:gap-0">
                        <span className={metricLabel}>Reqs</span>
                        <span className="text-sm font-semibold text-slate-800 tabular-nums">{dossier.requirementCount}</span>
                      </div>
                      <div role="cell" className="flex flex-col items-center gap-1 @5xl:gap-0">
                        <span className={metricLabel}>Standards</span>
                        <span className="text-sm font-semibold text-brand-700 tabular-nums">{dossier.standardsCount}</span>
                      </div>
                      <div role="cell" className="flex flex-col items-center gap-1 @5xl:gap-0">
                        <span className={metricLabel}>Gaps</span>
                        {dossier.gapCount > 0 ? (
                          <Badge tone="danger" size="sm" icon={AlertTriangle} className="tabular-nums">{dossier.gapCount}</Badge>
                        ) : (
                          <span className="text-sm font-semibold text-emerald-700 tabular-nums">0</span>
                        )}
                      </div>
                      <div role="cell" className="flex flex-col items-center gap-1 @5xl:gap-0">
                        <span className={metricLabel}>Risks</span>
                        {dossier.riskCount > 0 ? (
                          <Badge tone="warn" size="sm" className="tabular-nums">{dossier.riskCount}</Badge>
                        ) : (
                          <span className="text-sm font-semibold text-slate-500 tabular-nums">0</span>
                        )}
                      </div>
                    </div>

                    {/* Analyst, timestamp, action */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 @5xl:contents">
                      <div role="cell" className="min-w-0">
                        <div className="text-sm font-medium text-slate-800">{dossier.officerName}</div>
                        <div className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{dossier.createdAt}</span>
                        </div>
                      </div>

                      <div role="cell" className="@5xl:justify-self-end">
                        <Button variant="secondary" size="sm" iconRight={ChevronRight} onClick={() => onLoadDossier(dossier.caseKey)}>
                          Load dossier
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50/60 border-t border-line-soft text-sm text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>Showing {filteredDossiers.length} indexed dossiers in local cache</span>
              <span className="font-mono text-xs">Bureau of Indian Standards — e-Procurement Audit Trail</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
