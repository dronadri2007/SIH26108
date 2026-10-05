import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Info,
  Layers,
  MousePointerClick,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { StandardsGraph, GraphNode, GraphEdge, RelationshipType } from '../types';
import { SAMPLE_KNOWLEDGE_GRAPHS, CATALOG_STANDARDS } from '../mockData';
import { Badge, Button, Card, IconTile, PageHeader, SectionTitle, Segmented, cx, toneDot } from './ui';
import type { Tone } from './ui';

interface KnowledgeGraphViewProps {
  initialStandardId?: string;
  onSelectStandard?: (standardId: string) => void;
}

/* Relationship palette: PRIMARY brand, SAFETY rose, SUPPORTING emerald, TERMINOLOGY sky, INFERRED amber. */
const REL_TONE: Record<RelationshipType, Tone> = {
  PRIMARY: 'brand',
  SAFETY: 'danger',
  SUPPORTING: 'success',
  TERMINOLOGY: 'info',
  INFERRED: 'warn',
};

const REL_LABEL: Record<RelationshipType, string> = {
  PRIMARY: 'Primary',
  SAFETY: 'Safety',
  SUPPORTING: 'Supporting',
  TERMINOLOGY: 'Terminology',
  INFERRED: 'Inferred',
};

const EDGE_STROKE: Record<RelationshipType, string> = {
  PRIMARY: 'stroke-brand-500',
  SAFETY: 'stroke-rose-500',
  SUPPORTING: 'stroke-emerald-500',
  TERMINOLOGY: 'stroke-sky-500',
  INFERRED: 'stroke-amber-500',
};

const EDGE_PIN_IDLE: Record<RelationshipType, string> = {
  PRIMARY: 'fill-white stroke-brand-500',
  SAFETY: 'fill-white stroke-rose-500',
  SUPPORTING: 'fill-white stroke-emerald-500',
  TERMINOLOGY: 'fill-white stroke-sky-500',
  INFERRED: 'fill-white stroke-amber-500',
};

const EDGE_PIN_ACTIVE: Record<RelationshipType, string> = {
  PRIMARY: 'fill-brand-500 stroke-white',
  SAFETY: 'fill-rose-500 stroke-white',
  SUPPORTING: 'fill-emerald-500 stroke-white',
  TERMINOLOGY: 'fill-sky-500 stroke-white',
  INFERRED: 'fill-amber-500 stroke-white',
};

const NODE_CARD: Record<RelationshipType | 'NONE', string> = {
  PRIMARY: 'fill-brand-50 stroke-brand-300',
  SAFETY: 'fill-rose-50 stroke-rose-300',
  SUPPORTING: 'fill-emerald-50 stroke-emerald-300',
  TERMINOLOGY: 'fill-sky-50 stroke-sky-300',
  INFERRED: 'fill-amber-50 stroke-amber-300',
  NONE: 'fill-slate-50 stroke-slate-300',
};

const FOCAL_OPTIONS = [
  { id: 'std-is-61439-2', number: 'IS/IEC 61439-2:2020', label: 'LV Switchgear Assemblies' },
  { id: 'std-is-302-1', number: 'IS 302-1:2008', label: 'Household Appliances' },
  { id: 'std-is-1489-1', number: 'IS 1489-1:2015', label: 'Pozzolana Cement' },
];

const FILTERS: Array<RelationshipType | 'ALL'> = ['ALL', 'PRIMARY', 'SUPPORTING', 'SAFETY', 'TERMINOLOGY'];

/** Card footprint of a node on the canvas. */
const nodeBox = (isCenter: boolean) => (isCenter ? { w: 170, h: 80 } : { w: 144, h: 54 });

/**
 * Midpoint of the part of a link that is actually visible between the two node cards,
 * so the clickable pin never hides underneath a card.
 */
const visibleMid = (
  a: { x: number; y: number },
  boxA: { w: number; h: number },
  b: { x: number; y: number },
  boxB: { w: number; h: number }
) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const exit = (box: { w: number; h: number }) =>
    Math.min(dx !== 0 ? (box.w / 2 + 9) / Math.abs(dx) : Infinity, dy !== 0 ? (box.h / 2 + 9) / Math.abs(dy) : Infinity);
  const tA = exit(boxA);
  const tB = 1 - exit(boxB);
  const t = tB > tA ? (tA + tB) / 2 : 0.5;
  return { x: a.x + dx * t, y: a.y + dy * t };
};

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  initialStandardId = 'std-is-61439-2',
}) => {
  const [activeCenterId, setActiveCenterId] = useState<string>(initialStandardId);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterType, setFilterType] = useState<RelationshipType | 'ALL'>('ALL');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  /* On narrow screens the canvas scrolls sideways: start centred on the focal node. */
  useEffect(() => {
    const el = canvasRef.current;
    if (el) el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
  }, [activeCenterId]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const graph: StandardsGraph = SAMPLE_KNOWLEDGE_GRAPHS[activeCenterId] || SAMPLE_KNOWLEDGE_GRAPHS['std-is-61439-2'];

  const centerNode = graph.nodes.find(n => n.id === graph.center_standard_id) || graph.nodes[0];
  const otherNodes = graph.nodes.filter(n => n.id !== centerNode?.id);

  const filteredEdges = graph.edges.filter(edge => {
    if (filterType === 'ALL') return true;
    return edge.relationship_type === filterType;
  });

  const width = 800;
  const height = 520;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 190;
  /** Horizontal crop of the canvas so the graph fills the card (positions are unchanged). */
  const padX = 70;

  const nodePositions: Record<string, { x: number; y: number }> = {};
  if (centerNode) {
    nodePositions[centerNode.id] = { x: centerX, y: centerY };
  }

  otherNodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / otherNodes.length - Math.PI / 2;
    nodePositions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const edgeCount = (t: RelationshipType | 'ALL') =>
    t === 'ALL' ? graph.edges.length : graph.edges.filter(e => e.relationship_type === t).length;

  const nodeById = (id: string) => graph.nodes.find(n => n.id === id);
  const focalCurrent =
    FOCAL_OPTIONS.find(o => o.id === activeCenterId) ||
    { id: centerNode?.id ?? activeCenterId, number: centerNode?.number ?? activeCenterId, label: centerNode?.title ?? '' };
  const visibleNodeIds = new Set<string>();
  filteredEdges.forEach(e => {
    visibleNodeIds.add(e.source);
    visibleNodeIds.add(e.target);
  });

  const selectNode = (node: GraphNode) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };
  const selectEdge = (edge: GraphEdge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };
  const onKeyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  const inspectorState = selectedNode ? 'Node selected' : selectedEdge ? 'Edge selected' : 'Nothing selected';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Standards knowledge graph"
        eyebrowIcon={Share2}
        title="Multi-dimensional standards relationship network"
        description={
          <>
            Visualizing standard dependencies so a procurement officer can answer:{' '}
            <em className="text-slate-600">
              &ldquo;If this standard applies, what other test codes, safety mandates, and vocabulary references must be included in the tender?&rdquo;
            </em>
          </>
        }
        meta={
          <>
            <Badge tone="brand" dot>Curated normative edges</Badge>
            <Badge tone="warn" dot>Inferred edges</Badge>
          </>
        }
        actions={
          <div ref={menuRef} className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label={`Focal node: ${focalCurrent.number}. Change focal standard`}
              className="w-full sm:w-[26rem] h-14 pl-3 pr-3 rounded-xl border border-line bg-white shadow-xs hover:border-slate-300 flex items-center gap-3 text-left transition-colors cursor-pointer focus:outline-none focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-100"
            >
              <IconTile icon={Layers} tone="brand" size="sm" />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="eyebrow block">Focal node</span>
                <span className="mt-0.5 flex items-baseline gap-1.5 min-w-0">
                  <span className="font-mono text-[13px] font-semibold text-slate-900 whitespace-nowrap">{focalCurrent.number}</span>
                  <span className="text-[13px] text-slate-500 truncate">{focalCurrent.label}</span>
                </span>
              </span>
              <ChevronDown className={cx('w-4 h-4 text-slate-500 shrink-0 transition-transform', menuOpen && 'rotate-180')} aria-hidden="true" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 z-30 w-full sm:w-[26rem] card p-1.5 animate-pop origin-top-right">
                <ul>
                  {FOCAL_OPTIONS.map(opt => {
                    const active = opt.id === activeCenterId;
                    return (
                      <li key={opt.id}>
                        <button
                          type="button"
                          aria-current={active ? 'true' : undefined}
                          onClick={() => {
                            setActiveCenterId(opt.id);
                            setSelectedNode(null);
                            setSelectedEdge(null);
                            setMenuOpen(false);
                          }}
                          className={cx(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer',
                            active ? 'bg-brand-50' : 'hover:bg-slate-50'
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            <span className={cx('block font-mono text-[13px] font-semibold', active ? 'text-brand-700' : 'text-slate-900')}>{opt.number}</span>
                            <span className="block text-sm text-slate-500 truncate">{opt.label}</span>
                          </span>
                          {active && <Check className="w-4 h-4 text-brand-600 shrink-0" aria-hidden="true" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ------------------------------------------------------------------ */}
        {/* Graph canvas                                                       */}
        {/* ------------------------------------------------------------------ */}
        <Card padded={false} className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-line-soft">
            <div role="group" aria-label="Filter links by relationship type" className="overflow-x-auto max-w-full -my-1 py-1">
              <Segmented
                value={filterType}
                onChange={setFilterType}
                options={FILTERS.map(t => ({
                  value: t,
                  count: edgeCount(t),
                  label:
                    t === 'ALL' ? (
                      'All'
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cx('w-2 h-2 rounded-full', toneDot[REL_TONE[t]])} />
                        {REL_LABEL[t]}
                      </span>
                    ),
                }))}
              />
            </div>
          </div>

          {/* SVG canvas: dot grid, scrolls sideways on narrow screens instead of shrinking text */}
          <div className="p-3 sm:p-4">
            <div className="relative">
              <div className="mb-2 flex justify-end sm:mb-0 sm:block sm:absolute sm:right-3 sm:bottom-3 z-10">
              <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-white/90 backdrop-blur ring-1 ring-inset ring-slate-200 shadow-sm">
                <button
                  onClick={() => setZoomLevel(z => Math.min(z + 0.15, 1.5))}
                  className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(z => Math.max(z - 0.15, 0.75))}
                  className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="w-11 text-center text-xs font-mono font-semibold text-slate-500 tabular-nums" aria-live="polite">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Reset zoom"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              </div>
            <div ref={canvasRef} className="overflow-x-auto rounded-2xl bg-slate-50/70 ring-1 ring-inset ring-line-soft">
              <div className="overflow-hidden min-w-[560px]">
                <svg
                  viewBox={`${padX} 0 ${width - padX * 2} ${height}`}
                  className="block w-full h-auto transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                  role="group"
                  aria-label="Standards relationship graph"
                >
                  <defs>
                    <pattern id="kg-dots" width="22" height="22" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.2" className="fill-slate-300/80" />
                    </pattern>
                    <radialGradient id="kg-glow">
                      <stop offset="0%" className="text-brand-200" stopColor="currentColor" stopOpacity="0.6" />
                      <stop offset="100%" className="text-brand-200" stopColor="currentColor" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect width={width} height={height} fill="url(#kg-dots)" />
                  <circle cx={centerX} cy={centerY} r={radius + 60} fill="url(#kg-glow)" />
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    className="fill-none stroke-slate-300/80"
                    strokeWidth="1.25"
                    strokeDasharray="2 7"
                    strokeLinecap="round"
                  />

                  {/* Connecting edges */}
                  {filteredEdges.map(edge => {
                    const sourcePos = nodePositions[edge.source];
                    const targetPos = nodePositions[edge.target];
                    if (!sourcePos || !targetPos) return null;

                    const isSelected = selectedEdge?.id === edge.id;
                    const mid = visibleMid(
                      sourcePos,
                      nodeBox(edge.source === graph.center_standard_id),
                      targetPos,
                      nodeBox(edge.target === graph.center_standard_id)
                    );
                    const mx = mid.x;
                    const my = mid.y;
                    const srcNode = nodeById(edge.source);
                    const tgtNode = nodeById(edge.target);

                    return (
                      <g
                        key={edge.id}
                        onClick={() => selectEdge(edge)}
                        onKeyDown={onKeyActivate(() => selectEdge(edge))}
                        role="button"
                        tabIndex={0}
                        aria-label={`${REL_LABEL[edge.relationship_type]} link from ${srcNode?.number ?? edge.source} to ${tgtNode?.number ?? edge.target}${edge.is_inferred ? ', inferred' : ''}`}
                        aria-pressed={isSelected}
                        className="cursor-pointer group outline-none focus-visible:[&_.kg-pin]:stroke-[4px]"
                      >
                        {/* wide invisible hit area */}
                        <line
                          x1={sourcePos.x}
                          y1={sourcePos.y}
                          x2={targetPos.x}
                          y2={targetPos.y}
                          className="stroke-transparent"
                          strokeWidth={18}
                        />
                        <line
                          x1={sourcePos.x}
                          y1={sourcePos.y}
                          x2={targetPos.x}
                          y2={targetPos.y}
                          className={cx(
                            EDGE_STROKE[edge.relationship_type],
                            'transition-opacity group-hover:opacity-100',
                            isSelected ? 'opacity-100' : 'opacity-70'
                          )}
                          strokeWidth={isSelected ? 3.5 : 2.25}
                          strokeDasharray={edge.is_inferred ? '7 5' : undefined}
                          strokeLinecap="round"
                        />
                        <circle
                          cx={mx}
                          cy={my}
                          r={isSelected ? 8 : 6}
                          strokeWidth={2.5}
                          className={cx(
                            'kg-pin transition-all',
                            isSelected ? EDGE_PIN_ACTIVE[edge.relationship_type] : EDGE_PIN_IDLE[edge.relationship_type]
                          )}
                        />
                      </g>
                    );
                  })}

                  {/* Standard nodes */}
                  {graph.nodes.map(node => {
                    const pos = nodePositions[node.id];
                    if (!pos) return null;

                    const isCenter = node.id === graph.center_standard_id;
                    const isSelected = selectedNode?.id === node.id;
                    const dimmed = !isCenter && !visibleNodeIds.has(node.id);
                    const { w, h } = nodeBox(isCenter);

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onClick={() => selectNode(node)}
                        onKeyDown={onKeyActivate(() => selectNode(node))}
                        role="button"
                        tabIndex={0}
                        aria-label={`${node.number}, ${node.title}${isCenter ? ', focal standard' : node.relationship_to_center ? `, ${REL_LABEL[node.relationship_to_center]} link` : ''}`}
                        aria-pressed={isSelected}
                        className={cx('cursor-pointer group outline-none transition-opacity', dimmed && 'opacity-35 hover:opacity-80')}
                      >
                        <title>{`${node.number} - ${node.title}`}</title>

                        {isSelected && (
                          <rect
                            x={-w / 2 - 8}
                            y={-h / 2 - 8}
                            width={w + 16}
                            height={h + 16}
                            rx={isCenter ? 26 : 20}
                            className="fill-none stroke-brand-500"
                            strokeWidth="2"
                            strokeDasharray="5 4"
                          />
                        )}

                        {isCenter ? (
                          <>
                            <rect
                              x={-w / 2 - 7}
                              y={-h / 2 - 7}
                              width={w + 14}
                              height={h + 14}
                              rx={25}
                              className="fill-brand-100/70"
                            />
                            <rect
                              x={-w / 2}
                              y={-h / 2}
                              width={w}
                              height={h}
                              rx={18}
                              className="fill-brand-600 stroke-brand-700 drop-shadow-lg transition-all group-hover:fill-brand-700"
                              strokeWidth="1.5"
                            />
                            <text
                              textAnchor="middle"
                              y={-h / 2 + 21}
                              fontSize="11"
                              letterSpacing="1.5"
                              className="fill-brand-200 font-semibold uppercase pointer-events-none select-none"
                            >
                              Focal standard
                            </text>
                            <text
                              textAnchor="middle"
                              y={6}
                              fontSize="15"
                              className="fill-white font-mono font-bold pointer-events-none select-none"
                            >
                              {node.number.split(':')[0]}
                            </text>
                            <text
                              textAnchor="middle"
                              y={h / 2 - 14}
                              fontSize="12"
                              className="fill-brand-100 font-mono font-medium pointer-events-none select-none"
                            >
                              {node.technical_committee}
                            </text>
                          </>
                        ) : (
                          <>
                            <rect
                              x={-w / 2}
                              y={-h / 2}
                              width={w}
                              height={h}
                              rx={15}
                              className={cx(
                                NODE_CARD[node.relationship_to_center ?? 'NONE'],
                                'drop-shadow-sm transition-all group-hover:drop-shadow-md'
                              )}
                              strokeWidth="1.75"
                            />
                            <text
                              textAnchor="middle"
                              y={-3}
                              fontSize="12.5"
                              className="fill-slate-900 font-mono font-bold pointer-events-none select-none"
                            >
                              {node.number.split(':')[0]}
                            </text>
                            <text
                              textAnchor="middle"
                              y={15}
                              fontSize="11.5"
                              className="fill-slate-600 font-mono font-medium pointer-events-none select-none"
                            >
                              {node.technical_committee}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 sm:px-5 pb-5 pt-1">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Legend">
              {(Object.keys(REL_TONE) as RelationshipType[]).map(t => (
                <li key={t} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className={cx('w-5 h-1 rounded-full', toneDot[REL_TONE[t]])} />
                  {REL_LABEL[t]}
                </li>
              ))}
              <li className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="w-5 border-t-2 border-dashed border-slate-400" />
                Dashed = inferred link
              </li>
            </ul>
            <p className="sm:hidden mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
              <MousePointerClick className="w-3.5 h-3.5" />
              Swipe the graph sideways to pan; tap a standard to inspect it.
            </p>
          </div>
        </Card>

        {/* ------------------------------------------------------------------ */}
        {/* Inspector                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Card className="flex flex-col gap-5" aria-live="polite">
          <SectionTitle icon={Info} title="Network element inspector" subtitle={inspectorState} />

          {selectedNode ? (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="brand" mono>{selectedNode.number}</Badge>
                  {selectedNode.id === graph.center_standard_id && <Badge tone="violet" size="sm">Focal standard</Badge>}
                </div>
                <h3 className="font-heading text-lg font-semibold leading-snug text-slate-900 tracking-tight">
                  {selectedNode.title}
                </h3>
              </div>

              <dl className="card-soft px-4 py-1.5 text-sm">
                <div className="flex items-center justify-between gap-4 py-3 border-b border-line-soft">
                  <dt className="text-slate-500">Technical committee</dt>
                  <dd className="font-mono text-[13px] font-semibold text-slate-900">{selectedNode.technical_committee}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 border-b border-line-soft last:border-0">
                  <dt className="text-slate-500 shrink-0">Sector division</dt>
                  <dd className="font-medium text-slate-900 text-right">{selectedNode.sector_name}</dd>
                </div>
                {selectedNode.relationship_to_center && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-slate-500">Link to focal node</dt>
                    <dd>
                      <Badge tone={REL_TONE[selectedNode.relationship_to_center]} dot>
                        {REL_LABEL[selectedNode.relationship_to_center]}
                      </Badge>
                    </dd>
                  </div>
                )}
              </dl>

              {(() => {
                const fullStd = CATALOG_STANDARDS.find(s => s.standard_id === selectedNode.id);
                if (fullStd) {
                  return (
                    <div>
                      <div className="eyebrow">Official scope statement</div>
                      <blockquote className="mt-2 border-l-2 border-brand-300 pl-4 text-sm text-slate-600 leading-relaxed">
                        &ldquo;{fullStd.scope_text}&rdquo;
                      </blockquote>
                    </div>
                  );
                }
                return null;
              })()}

              {(() => {
                const linkEdge = graph.edges.find(e => e.target === selectedNode.id);
                if (!linkEdge) return null;
                return (
                  <div>
                    <div className="eyebrow">Why it is linked</div>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{linkEdge.rationale}</p>
                  </div>
                );
              })()}

              <Button
                variant="primary"
                className="w-full"
                iconRight={ArrowRight}
                onClick={() => {
                  setActiveCenterId(selectedNode.id);
                  setSelectedNode(null);
                }}
              >
                Re-center network on {selectedNode.number}
              </Button>
            </div>
          ) : selectedEdge ? (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={REL_TONE[selectedEdge.relationship_type]} dot>
                    {REL_LABEL[selectedEdge.relationship_type]} link
                  </Badge>
                  {selectedEdge.is_inferred && <Badge tone="warn" size="sm">Inferred (curation stage)</Badge>}
                </div>
                <h3 className="font-heading text-lg font-semibold leading-snug text-slate-900 tracking-tight">
                  Allied standard connection rationale
                </h3>
              </div>

              <div className="card-soft p-4 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm">
                  <span className="eyebrow w-12 shrink-0">From</span>
                  <span className="font-mono text-[13px] font-semibold text-slate-900">
                    {nodeById(selectedEdge.source)?.number ?? selectedEdge.source}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <span className="eyebrow w-12 shrink-0">To</span>
                  <span className="font-mono text-[13px] font-semibold text-slate-900">
                    {nodeById(selectedEdge.target)?.number ?? selectedEdge.target}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{selectedEdge.rationale}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <IconTile icon={MousePointerClick} tone="neutral" size="sm" />
                <p className="text-sm text-slate-500 leading-relaxed">
                  Click any standard node or connecting link to inspect technical committee scope and normative rationale.
                </p>
              </div>

              <div>
                <div className="eyebrow mb-2">Standards in this network</div>
                <ul className="-mx-2 space-y-0.5">
                  {[centerNode, ...otherNodes].filter(Boolean).map(node => (
                    <li key={node.id}>
                      <button
                        onClick={() => selectNode(node)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span
                          className={cx(
                            'w-2 h-8 rounded-full shrink-0',
                            node.id === graph.center_standard_id
                              ? 'bg-brand-600'
                              : toneDot[node.relationship_to_center ? REL_TONE[node.relationship_to_center] : 'neutral']
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-[13px] font-semibold text-slate-900 truncate">{node.number}</span>
                          <span className="block text-xs text-slate-500 truncate">{node.title}</span>
                        </span>
                        <span className="text-xs font-semibold text-slate-500 shrink-0">
                          {node.id === graph.center_standard_id
                            ? 'Focal'
                            : node.relationship_to_center
                              ? REL_LABEL[node.relationship_to_center]
                              : ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
