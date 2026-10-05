import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  Building2,
  Check,
  Database,
  ExternalLink,
  FileSearch,
  Layers,
  Package,
  Search,
  SearchX,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { CURATED_SECTORS, CATALOG_STANDARDS } from '../mockData';
import { Standard, StandardStatus } from '../types';
import { Badge, Button, Card, EmptyState, IconTile, PageHeader, cx } from './ui';
import type { Tone } from './ui';

interface CatalogBrowserProps {
  onOpenGraph: (standardId: string) => void;
  onSelectStandard?: (standard: Standard) => void;
}

const STATUS_TONE: Record<StandardStatus, Tone> = {
  CURRENT: 'success',
  AMENDED: 'info',
  REVISED: 'violet',
  UNKNOWN: 'neutral',
};

const SECTOR_TONE: Record<number, Tone> = { 1: 'brand', 2: 'violet', 3: 'saffron' };

export const CatalogBrowser: React.FC<CatalogBrowserProps> = ({
  onOpenGraph,
  onSelectStandard
}) => {
  const [selectedSector, setSelectedSector] = useState<number | 'ALL'>('ALL');
  const [selectedCommittee, setSelectedCommittee] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const sectorIcons: Record<number, LucideIcon> = {
    1: Zap,
    2: Package,
    3: Building2
  };

  // Committees available inside the current sector selection, with counts.
  const inSector = CATALOG_STANDARDS.filter(std => selectedSector === 'ALL' || std.sector_id === selectedSector);
  const committeeCounts = inSector.reduce<Record<string, number>>((acc, std) => {
    acc[std.technical_committee] = (acc[std.technical_committee] || 0) + 1;
    return acc;
  }, {});
  const committees = Object.keys(committeeCounts).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const filteredStandards = CATALOG_STANDARDS.filter(std => {
    if (selectedSector !== 'ALL' && std.sector_id !== selectedSector) {
      return false;
    }
    if (selectedCommittee !== 'ALL' && std.technical_committee !== selectedCommittee) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        std.number.toLowerCase().includes(q) ||
        std.title.toLowerCase().includes(q) ||
        std.technical_committee.toLowerCase().includes(q) ||
        std.scope_text.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const hasFilters = selectedSector !== 'ALL' || selectedCommittee !== 'ALL' || searchQuery.trim() !== '';
  const clearAll = () => {
    setSelectedSector('ALL');
    setSelectedCommittee('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Knowledge base · Curated BIS catalog"
        eyebrowIcon={Database}
        title="Bureau of Indian Standards curated repository"
        description="Ground truth repository containing standard designations, technical committee scopes, and physical test protocols. The recommendation engine retrieves exclusively from this verified knowledge base, preventing LLM hallucination."
        meta={<Badge tone="brand" dot>450 standards indexed across 3 divisions</Badge>}
      />

      {/* Coverage disclosure */}
      <div className="flex items-start gap-3.5 rounded-2xl bg-amber-50/70 ring-1 ring-inset ring-amber-200 p-4 sm:px-5">
        <span className="w-8 h-8 rounded-lg bg-white text-amber-600 ring-1 ring-inset ring-amber-200 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-amber-900">Coverage disclosure</h2>
          <p className="mt-0.5 text-sm text-amber-900/80 leading-relaxed">
            Recommendations are restricted to indexed BIS catalog scopes. Full normative standard texts remain proprietary to the Bureau of Indian Standards.
          </p>
        </div>
      </div>

      {/* Sector selection */}
      <section aria-label="Sector divisions" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CURATED_SECTORS.map(sec => {
          const isSelected = selectedSector === sec.sector_id;
          const IconComponent = sectorIcons[sec.sector_id] || Database;

          return (
            <button
              type="button"
              key={sec.sector_id}
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedSector(isSelected ? 'ALL' : sec.sector_id);
                setSelectedCommittee('ALL');
              }}
              className={cx(
                'relative p-5 sm:p-6 text-left flex flex-col gap-4 cursor-pointer rounded-[18px] border transition-all duration-200',
                isSelected
                  ? 'bg-brand-50/50 border-brand-400 ring-2 ring-brand-200 shadow-md'
                  : 'bg-white border-line shadow-sm hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <IconTile icon={IconComponent} tone={SECTOR_TONE[sec.sector_id] || 'brand'} />
                {isSelected ? (
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center" aria-hidden="true">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                ) : (
                  <Badge tone="neutral" size="sm">{sec.total_standards} standards</Badge>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow">{sec.code} division</span>
                  {isSelected && <Badge tone="brand" size="sm">{sec.total_standards} standards</Badge>}
                </div>
                <h3 className="font-heading text-base font-semibold text-slate-900 tracking-tight leading-snug">{sec.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{sec.description}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-line-soft flex flex-wrap gap-1.5">
                {sec.technical_committees.map((tc, idx) => (
                  <span key={idx} className="text-xs font-mono font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                    {tc.split(' ')[0]} {tc.split(' ')[1]}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </section>

      {/* Search and filters */}
      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search standards"
              placeholder="Search IS number (e.g. IS 302-1), title, TC, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-white pl-11 pr-11 text-sm placeholder:text-slate-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <span className="text-sm text-slate-500" aria-live="polite">
              Showing <strong className="font-semibold text-slate-900 tabular-nums">{filteredStandards.length}</strong> of{' '}
              <span className="tabular-nums">{CATALOG_STANDARDS.length}</span> standards
            </span>
            {selectedSector !== 'ALL' && (
              <Button variant="secondary" size="sm" icon={X} onClick={() => { setSelectedSector('ALL'); setSelectedCommittee('ALL'); }}>
                Reset sector filter
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4 pt-4 border-t border-line-soft">
          <span className="eyebrow sm:pt-2 shrink-0">Committee</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by technical committee">
            {['ALL', ...committees].map(tc => {
              const active = selectedCommittee === tc;
              const count = tc === 'ALL' ? inSector.length : committeeCounts[tc];
              return (
                <button
                  type="button"
                  key={tc}
                  aria-pressed={active}
                  onClick={() => setSelectedCommittee(tc)}
                  className={cx(
                    'h-8 px-3 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 border transition-all cursor-pointer',
                    active
                      ? 'bg-brand-50 border-brand-200 text-brand-700'
                      : 'bg-white border-line text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  )}
                >
                  <span className={tc === 'ALL' ? '' : 'font-mono'}>{tc === 'ALL' ? 'All committees' : tc}</span>
                  <span className={cx('text-xs font-mono px-1.5 rounded-md', active ? 'bg-white text-brand-700' : 'bg-slate-100 text-slate-500')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Standards */}
      {filteredStandards.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No standards match your filters"
          description="Try a different IS number, keyword or technical committee, or clear the filters to browse the full indexed catalog."
          action={
            hasFilters ? (
              <Button variant="secondary" size="md" icon={X} onClick={clearAll} className="mt-2">
                Clear all filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredStandards.map(std => (
            <Card key={std.standard_id} hover padded={false} className="flex flex-col">
              <div className="p-5 sm:p-6 flex-1 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[15px] font-bold text-brand-700 tracking-tight">{std.number}</span>
                  <Badge tone={STATUS_TONE[std.status] || 'neutral'} dot size="sm">{std.status}</Badge>
                </div>

                <div className="space-y-3">
                  <h3 className="font-heading text-[17px] font-semibold text-slate-900 tracking-tight leading-snug">
                    {std.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral" mono size="sm">{std.technical_committee}</Badge>
                    {std.sector_name && <Badge tone="neutral" size="sm">{std.sector_name}</Badge>}
                    {std.mandatory_certification && (
                      <Badge tone="warn" size="sm" icon={ShieldCheck}>ISI mandatory</Badge>
                    )}
                  </div>
                </div>

                <div className="card-soft p-4">
                  <div className="eyebrow">Curated BIS scope definition</div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    &ldquo;{std.scope_text}&rdquo;
                  </p>
                </div>

                {std.key_test_methods && std.key_test_methods.length > 0 && (
                  <div>
                    <div className="eyebrow">Normative test protocols cited</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {std.key_test_methods.map((method, i) => (
                        <span
                          key={i}
                          className="text-xs font-mono font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 sm:px-6 py-4 border-t border-line-soft flex flex-wrap items-center gap-2">
                {onSelectStandard && (
                  <Button variant="secondary" size="sm" icon={FileSearch} onClick={() => onSelectStandard(std)}>
                    Inspect evidence
                  </Button>
                )}
                <Button variant="ghost" size="sm" icon={Layers} onClick={() => onOpenGraph(std.standard_id)}>
                  Knowledge graph
                </Button>

                {std.source_url && (
                  <a
                    href={std.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition-colors"
                  >
                    BIS portal
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
