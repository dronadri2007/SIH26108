import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, Check, FileText, MousePointerClick, Quote, ShieldCheck, UserCheck } from 'lucide-react';
import type { CoverageMatrixData, Recommendation, Requirement } from '../../types';
import { Card, cx } from '../ui';
import { PARTIAL_BELOW, REL_META, REQ_TYPE_LABEL } from './meta';

const GAP_ID = '__gap__';

interface MapLink {
  id: string;
  reqId: string;
  stdId: string; // GAP_ID for requirements with no covering standard
  confidence: number;
  partial: boolean;
  gap: boolean;
}

type Hover = { kind: 'req' | 'std' | 'link'; id: string } | null;

interface Geometry {
  w: number;
  h: number;
  req: Record<string, { x: number; y: number }>;
  std: Record<string, { x: number; y: number }>;
}

interface ClauseMapProps {
  requirements: Requirement[];
  recommendations: Recommendation[];
  matrix?: CoverageMatrixData;
  isOfficerEndorsed: boolean;
  onOpenEvidence: (rec: Recommendation) => void;
  onOpenTender: () => void;
  onOpenCoverage: () => void;
}

const COLS = 'minmax(0,1fr) clamp(72px,17%,170px) minmax(0,0.85fr)';

export const ClauseMap: React.FC<ClauseMapProps> = ({
  requirements,
  recommendations,
  matrix,
  isOfficerEndorsed,
  onOpenEvidence,
  onOpenTender,
  onOpenCoverage,
}) => {
  /* ---------------------------------------------------------------- data */
  const links = useMemo<MapLink[]>(() => {
    const out: MapLink[] = [];
    requirements.forEach(req => {
      const row = matrix?.cells?.[req.requirement_id] ?? {};
      const covering = recommendations.filter(rec => row[rec.standard_id]?.covered);
      if (covering.length === 0) {
        out.push({ id: `${req.requirement_id}>${GAP_ID}`, reqId: req.requirement_id, stdId: GAP_ID, confidence: 0, partial: false, gap: true });
        return;
      }
      covering.forEach(rec => {
        const conf = Math.round(row[rec.standard_id].match_confidence);
        out.push({
          id: `${req.requirement_id}>${rec.standard_id}`,
          reqId: req.requirement_id,
          stdId: rec.standard_id,
          confidence: conf,
          partial: conf < PARTIAL_BELOW,
          gap: false,
        });
      });
    });
    return out;
  }, [requirements, recommendations, matrix]);

  const hasGap = links.some(l => l.gap);
  const defaultLinkId = useMemo(() => {
    const primary = recommendations.find(r => r.relationship_type === 'PRIMARY') ?? recommendations[0];
    const best = links
      .filter(l => !l.gap && l.stdId === primary?.standard_id)
      .sort((a, b) => b.confidence - a.confidence)[0];
    return (best ?? links.find(l => !l.gap) ?? links[0])?.id ?? null;
  }, [links, recommendations]);

  const [selectedId, setSelectedId] = useState<string | null>(defaultLinkId);
  const [hover, setHover] = useState<Hover>(null);

  // reset the selection when the dossier changes
  const linkKey = links.map(l => l.id).join('|');
  useLayoutEffect(() => {
    setSelectedId(defaultLinkId);
    setHover(null);
  }, [linkKey, defaultLinkId]);

  const selected = links.find(l => l.id === selectedId) ?? null;

  /* ---------------------------------------------------------------- geometry */
  const wrapRef = useRef<HTMLDivElement>(null);
  const reqRefs = useRef<Record<string, HTMLElement | null>>({});
  const stdRefs = useRef<Record<string, HTMLElement | null>>({});
  const [geom, setGeom] = useState<Geometry | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const c = wrap.getBoundingClientRect();
      if (c.width === 0) return; // hidden (mobile list is showing)
      const req: Geometry['req'] = {};
      const std: Geometry['std'] = {};
      Object.entries(reqRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        req[id] = { x: r.right - c.left + 5, y: r.top + r.height / 2 - c.top };
      });
      Object.entries(stdRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        std[id] = { x: r.left - c.left - 5, y: r.top + r.height / 2 - c.top };
      });
      setGeom({ w: c.width, h: c.height, req, std });
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(wrap);
    document.fonts?.ready?.then(measure).catch(() => undefined);
    return () => ro?.disconnect();
  }, [linkKey]);

  /* ---------------------------------------------------------------- highlight */
  const isActive = (l: MapLink) => {
    if (hover?.kind === 'req') return l.reqId === hover.id;
    if (hover?.kind === 'std') return l.stdId === hover.id;
    if (hover?.kind === 'link') return l.id === hover.id;
    return l.id === selectedId;
  };
  const activeLinks = links.filter(isActive);
  const nodeActive = (kind: 'req' | 'std', id: string) =>
    activeLinks.some(l => (kind === 'req' ? l.reqId === id : l.stdId === id));
  const dimmed = (kind: 'req' | 'std', id: string) => hover !== null && !nodeActive(kind, id);

  const selectReq = (reqId: string) => {
    const own = links.filter(l => l.reqId === reqId).sort((a, b) => b.confidence - a.confidence);
    if (own[0]) setSelectedId(own[0].id);
  };
  const selectStd = (stdId: string) => {
    const own = links.filter(l => l.stdId === stdId).sort((a, b) => b.confidence - a.confidence);
    if (own[0]) setSelectedId(own[0].id);
  };

  const pathFor = (l: MapLink) => {
    if (!geom) return null;
    const a = geom.req[l.reqId];
    const b = geom.std[l.stdId];
    if (!a || !b) return null;
    const dx = Math.max(24, (b.x - a.x) * 0.55);
    return { d: `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`, a, b };
  };

  const recById = (id: string) => recommendations.find(r => r.standard_id === id);
  const reqById = (id: string) => requirements.find(r => r.requirement_id === id);

  if (requirements.length === 0) {
    return null;
  }

  /* ---------------------------------------------------------------- render */
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-slate-900">Clause-to-standard map</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Every tender requirement, linked to the standard that governs it. Select a line to trace it.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 shrink-0" aria-hidden="true">
          <span className="inline-flex items-center gap-1.5">
            <svg width="22" height="6"><line x1="1" y1="3" x2="21" y2="3" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" /></svg>
            Match
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="22" height="6"><line x1="1" y1="3" x2="21" y2="3" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" /></svg>
            Partial (&lt;{PARTIAL_BELOW}%)
          </span>
          {hasGap && (
            <span className="inline-flex items-center gap-1.5">
              <svg width="22" height="6"><line x1="1" y1="3" x2="21" y2="3" stroke="#d97706" strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" /></svg>
              Gap
            </span>
          )}
        </div>
      </div>

      {/* ---------- desktop / tablet: drawn map ---------- */}
      <div className="hidden sm:block px-5 sm:px-6 pb-6">
        <div className="grid text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2.5" style={{ gridTemplateColumns: COLS }}>
          <span>Tender requirements · {requirements.length}</span>
          <span />
          <span>Recommended standards · {recommendations.length}</span>
        </div>

        <div
          ref={wrapRef}
          className="relative grid"
          style={{ gridTemplateColumns: COLS }}
          onMouseLeave={() => setHover(null)}
        >
          {/* requirements */}
          <ul className="flex flex-col gap-2 justify-center relative z-10">
            {requirements.map(req => {
              const own = links.filter(l => l.reqId === req.requirement_id);
              const gap = own.some(l => l.gap);
              const isSel = selected?.reqId === req.requirement_id;
              return (
                <li key={req.requirement_id}>
                  <button
                    ref={el => { reqRefs.current[req.requirement_id] = el; }}
                    onClick={() => selectReq(req.requirement_id)}
                    onMouseEnter={() => setHover({ kind: 'req', id: req.requirement_id })}
                    onFocus={() => setHover({ kind: 'req', id: req.requirement_id })}
                    onBlur={() => setHover(null)}
                    aria-pressed={isSel}
                    className={cx(
                      'w-full text-left rounded-xl border bg-white px-3.5 py-2.5 transition-all duration-200 cursor-pointer',
                      isSel ? 'border-brand-300 ring-4 ring-brand-100 bg-brand-50/40' : nodeActive('req', req.requirement_id) && hover ? 'border-brand-200' : 'border-line hover:border-slate-300',
                      dimmed('req', req.requirement_id) && 'opacity-40'
                    )}
                  >
                    <span className="flex items-center gap-2 text-[11px]">
                      <span className="font-mono font-semibold text-slate-500">{req.requirement_id.toUpperCase()}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-medium text-slate-500">{REQ_TYPE_LABEL[req.requirement_type]}</span>
                      {gap && (
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Gap
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block line-clamp-2 text-[13px] font-medium leading-snug text-slate-800" title={req.requirement_text}>
                      {req.requirement_text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <span aria-hidden="true" />

          {/* standards */}
          <ul className="flex flex-col gap-2 justify-center relative z-10">
            {recommendations.map(rec => {
              const meta = REL_META[rec.relationship_type];
              const isSel = selected?.stdId === rec.standard_id;
              const linked = links.some(l => l.stdId === rec.standard_id);
              return (
                <li key={rec.standard_id}>
                  <button
                    ref={el => { stdRefs.current[rec.standard_id] = el; }}
                    onClick={() => selectStd(rec.standard_id)}
                    onMouseEnter={() => setHover({ kind: 'std', id: rec.standard_id })}
                    onFocus={() => setHover({ kind: 'std', id: rec.standard_id })}
                    onBlur={() => setHover(null)}
                    disabled={!linked}
                    aria-pressed={isSel}
                    className={cx(
                      'w-full text-left rounded-xl border bg-white px-3.5 py-2.5 transition-all duration-200 cursor-pointer disabled:cursor-default',
                      isSel ? 'border-brand-300 ring-4 ring-brand-100 bg-brand-50/40' : nodeActive('std', rec.standard_id) && hover ? 'border-brand-200' : 'border-line hover:border-slate-300',
                      dimmed('std', rec.standard_id) && 'opacity-40'
                    )}
                  >
                    <span className="block truncate font-mono text-[13px] font-semibold text-slate-900" title={rec.standard.title}>
                      {rec.standard.number}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} aria-hidden="true" />
                      <span className="font-semibold text-slate-600">{meta.label}</span>
                      <span className="text-slate-300">·</span>
                      <span className="truncate">{rec.standard.technical_committee}</span>
                    </span>
                  </button>
                </li>
              );
            })}
            {hasGap && (
              <li>
                <button
                  ref={el => { stdRefs.current[GAP_ID] = el; }}
                  onClick={() => selectStd(GAP_ID)}
                  onMouseEnter={() => setHover({ kind: 'std', id: GAP_ID })}
                  onFocus={() => setHover({ kind: 'std', id: GAP_ID })}
                  onBlur={() => setHover(null)}
                  aria-pressed={selected?.stdId === GAP_ID}
                  className={cx(
                    'w-full text-left rounded-xl border border-dashed px-3.5 py-2.5 transition-all duration-200 cursor-pointer',
                    selected?.stdId === GAP_ID ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-100' : 'border-amber-300 bg-amber-50/50 hover:bg-amber-50',
                    dimmed('std', GAP_ID) && 'opacity-40'
                  )}
                >
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5" /> No indexed standard
                  </span>
                  <span className="mt-0.5 block text-[11px] text-amber-800">Officer discretion required</span>
                </button>
              </li>
            )}
          </ul>

          {/* links */}
          {geom && (
            <svg className="absolute inset-0 pointer-events-none overflow-visible" width={geom.w} height={geom.h} aria-hidden="true">
              {/* inactive first, active on top */}
              {[...links].sort((a, b) => Number(isActive(a)) - Number(isActive(b))).map(l => {
                const p = pathFor(l);
                if (!p) return null;
                const active = isActive(l);
                const isSel = l.id === selectedId;
                const faded = hover !== null && !active;
                const baseColor = l.gap ? '#d97706' : active ? '#4262f2' : '#cbd5e1';
                const dash = l.gap ? '2 5' : l.partial ? '6 5' : undefined;
                return (
                  <g key={l.id} style={{ opacity: faded ? 0.28 : 1, transition: 'opacity 200ms' }}>
                    {isSel && !l.gap && <path d={p.d} fill="none" stroke="#dbe2ff" strokeWidth={6} strokeLinecap="round" />}
                    <path
                      d={p.d}
                      fill="none"
                      stroke={baseColor}
                      strokeWidth={active ? 2.25 : 1.5}
                      strokeDasharray={dash}
                      strokeLinecap="round"
                      style={{ transition: 'stroke 200ms, stroke-width 200ms' }}
                    />
                    {isSel && !l.gap && !l.partial && (
                      <path d={p.d} fill="none" stroke="#ffffff" strokeOpacity={0.9} strokeWidth={1.25} strokeLinecap="round" className="flow-dash motion-reduce:[animation:none]" />
                    )}
                    <circle cx={p.a.x} cy={p.a.y} r={3.5} fill="#ffffff" stroke={baseColor} strokeWidth={1.75} />
                    <circle cx={p.b.x} cy={p.b.y} r={3.5} fill="#ffffff" stroke={baseColor} strokeWidth={1.75} />
                    {/* generous hit target */}
                    <path
                      d={p.d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={16}
                      style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                      onMouseEnter={() => setHover({ kind: 'link', id: l.id })}
                      onClick={() => setSelectedId(l.id)}
                    >
                      <title>
                        {`${l.reqId.toUpperCase()} → ${l.gap ? 'no indexed standard' : `${recById(l.stdId)?.standard.number ?? ''} · ${l.confidence}% clause match`}`}
                      </title>
                    </path>
                  </g>
                );
              })}
            </svg>
          )}

          {/* selective direct labels: confidence on the active links only */}
          {geom &&
            activeLinks
              .filter(l => !l.gap)
              .map(l => {
                const p = pathFor(l);
                if (!p) return null;
                return (
                  <span
                    key={`lbl-${l.id}`}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-1.5 py-0.5 text-[11px] font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 pointer-events-none tabular-nums"
                    style={{ left: (p.a.x + p.b.x) / 2, top: (p.a.y + p.b.y) / 2 }}
                  >
                    {l.confidence}%
                  </span>
                );
              })}
        </div>
      </div>

      {/* ---------- phone: list ---------- */}
      <ul className="sm:hidden px-5 pb-5 space-y-2">
        {requirements.map(req => {
          const own = links.filter(l => l.reqId === req.requirement_id);
          const isSel = selected?.reqId === req.requirement_id;
          return (
            <li key={req.requirement_id}>
              <button
                onClick={() => selectReq(req.requirement_id)}
                aria-pressed={isSel}
                className={cx(
                  'w-full text-left rounded-xl border bg-white px-3.5 py-3 transition-all cursor-pointer',
                  isSel ? 'border-brand-300 ring-4 ring-brand-100' : 'border-line'
                )}
              >
                <span className="flex items-center gap-2 text-[11px]">
                  <span className="font-mono font-semibold text-slate-500">{req.requirement_id.toUpperCase()}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-medium text-slate-500">{REQ_TYPE_LABEL[req.requirement_type]}</span>
                </span>
                <span className="mt-0.5 block text-[13px] font-medium text-slate-800 line-clamp-2">{req.requirement_text}</span>
                <span className="mt-2 flex flex-wrap items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  {own.map(l =>
                    l.gap ? (
                      <span key={l.id} className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                        <AlertTriangle className="w-3 h-3" /> No indexed standard
                      </span>
                    ) : (
                      <span key={l.id} className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: REL_META[recById(l.stdId)?.relationship_type ?? 'SUPPORTING'].color }} aria-hidden="true" />
                        {recById(l.stdId)?.standard.number}
                        <span className="font-sans font-medium text-slate-500">{l.confidence}%</span>
                      </span>
                    )
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* ---------- trace of the selected link ---------- */}
      {selected && (
        <TracePanel
          link={selected}
          requirement={reqById(selected.reqId) ?? null}
          recommendation={selected.gap ? null : recById(selected.stdId) ?? null}
          isOfficerEndorsed={isOfficerEndorsed}
          onOpenEvidence={onOpenEvidence}
          onOpenTender={onOpenTender}
          onOpenCoverage={onOpenCoverage}
        />
      )}
    </Card>
  );
};

/* ==================================================================== */
/* Trace panel                                                           */
/* ==================================================================== */

const StepHead: React.FC<{ n: number; icon: React.ElementType; label: string }> = ({ n, icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-2.5">
    <span className="w-6 h-6 rounded-lg bg-white ring-1 ring-line text-slate-500 flex items-center justify-center shadow-sm">
      <Icon className="w-3.5 h-3.5" />
    </span>
    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
      {n} · {label}
    </span>
  </div>
);

const Connector: React.FC = () => (
  <div className="hidden @4xl:flex items-center justify-center text-slate-300" aria-hidden="true">
    <ArrowRight className="w-4 h-4" />
  </div>
);

interface TracePanelProps {
  link: MapLink;
  requirement: Requirement | null;
  recommendation: Recommendation | null;
  isOfficerEndorsed: boolean;
  onOpenEvidence: (rec: Recommendation) => void;
  onOpenTender: () => void;
  onOpenCoverage: () => void;
}

const TracePanel: React.FC<TracePanelProps> = ({
  link,
  requirement,
  recommendation,
  isOfficerEndorsed,
  onOpenEvidence,
  onOpenTender,
  onOpenCoverage,
}) => {
  const passed = recommendation?.evidence?.filter(e => e.matched) ?? [];
  const total = recommendation?.evidence_match_total ?? recommendation?.evidence?.length ?? 5;
  const rel = recommendation ? REL_META[recommendation.relationship_type] : null;

  return (
    <div className="@container border-t border-line-soft bg-slate-50/70 px-5 sm:px-6 py-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MousePointerClick className="w-4 h-4 text-brand-600" aria-hidden="true" />
          <span className="font-semibold text-slate-900">Trace</span>
          <span className="font-mono text-slate-600">{link.reqId.toUpperCase()}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className={cx('font-mono', link.gap ? 'text-amber-700' : 'text-slate-600')}>
            {link.gap ? 'no indexed standard' : recommendation?.standard.number}
          </span>
        </div>
        {recommendation && (
          <button
            onClick={() => onOpenEvidence(recommendation)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 cursor-pointer group"
          >
            Open evidence dossier
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)_20px_minmax(0,1fr)_20px_minmax(0,0.8fr)] gap-x-6 gap-y-5 @4xl:gap-x-2">
        {/* 1 clause */}
        <div className="min-w-0">
          <StepHead n={1} icon={FileText} label="Tender clause" />
          <p className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2">{requirement?.requirement_text}</p>
          {requirement?.source_span && (
            <p className="mt-1.5 flex gap-1.5 text-xs italic text-slate-500 leading-snug">
              <Quote className="w-3 h-3 shrink-0 mt-0.5 not-italic" aria-hidden="true" />
              <span className="line-clamp-2">{requirement.source_span}</span>
            </p>
          )}
          <button onClick={onOpenTender} className="mt-2 text-xs font-semibold text-brand-700 hover:text-brand-800 cursor-pointer">
            Show in tender
          </button>
        </div>

        {link.gap ? (
          <>
            <Connector />
            <div className="@4xl:col-span-5 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-900">No standard in the indexed catalog covers this requirement</p>
                  <p className="mt-1 text-[13px] text-amber-900/80 leading-relaxed">
                    The engine does not guess a citation. The officer decides whether to cite a standard outside the indexed scope or keep a
                    measurable, performance-based clause.
                  </p>
                  <button onClick={onOpenCoverage} className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline cursor-pointer">
                    Open coverage matrix <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Connector />
            {/* 2 standard */}
            <div className="min-w-0">
              <StepHead n={2} icon={ShieldCheck} label="BIS standard" />
              <p className="font-mono text-[13px] font-semibold text-brand-700 truncate">{recommendation?.standard.number}</p>
              <p className="mt-0.5 text-[13px] text-slate-700 leading-snug line-clamp-2">{recommendation?.standard.title}</p>
              {rel && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full" style={{ background: rel.color }} aria-hidden="true" />
                  <span className="font-semibold text-slate-600">{rel.label}</span> · Committee {recommendation?.standard.technical_committee}
                </p>
              )}
            </div>

            <Connector />
            {/* 3 evidence */}
            <div className="min-w-0">
              <StepHead n={3} icon={Check} label="Evidence" />
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-slate-900">{link.confidence}%</span>
                <span className="text-xs text-slate-500">clause match{link.partial ? ' (partial)' : ''}</span>
              </div>
              <div className="mt-2 flex gap-[3px]" role="img" aria-label={`${passed.length} of ${total} evidence checks passed`}>
                {Array.from({ length: total }).map((_, i) => (
                  <span key={i} className={cx('h-1.5 flex-1 rounded-full', i < passed.length ? 'bg-emerald-500' : 'bg-slate-200')} />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-slate-500 leading-snug line-clamp-2">
                <span className="font-semibold text-slate-700">
                  {passed.length}/{total} checks
                </span>{' '}
                · {passed.map(e => e.criterion_label).join(', ')}
              </p>
            </div>

            <Connector />
            {/* 4 officer */}
            <div className="min-w-0">
              <StepHead n={4} icon={UserCheck} label="Officer" />
              {isOfficerEndorsed ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200">
                  <Check className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                  <UserCheck className="w-3.5 h-3.5" /> Awaiting verification
                </span>
              )}
              <p className="mt-2 text-xs text-slate-500 leading-snug">Official applicability stays with the procuring officer.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
