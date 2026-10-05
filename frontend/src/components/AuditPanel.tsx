import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Award,
  ChevronDown,
  CircleHelp,
  Clock,
  Cpu,
  FileSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Split,
  Tags,
  Terminal,
  TriangleAlert,
  ArrowUpDown,
  Zap,
  ListChecks,
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { Badge, Button, Card, EmptyState, IconTile, PageHeader, SectionTitle, Stat, cx } from './ui';
import type { Tone } from './ui';

interface AuditPanelProps {
  auditLogs: AuditLogEntry[];
}

const STAGE_ICON: Record<string, LucideIcon> = {
  EXTRACTION: FileSearch,
  DECOMPOSITION: Split,
  RETRIEVAL: Search,
  RERANKING: ArrowUpDown,
  EVIDENCE_VALIDATION: ShieldCheck,
  CLASSIFICATION: Tags,
  RECOMMENDATION: Award,
  WHY_NOT: CircleHelp,
  RISK_DETECTION: TriangleAlert,
};

/** Model family drives the colour: Sonnet = violet, Haiku = sky, local = emerald. */
const modelMeta = (model?: string): { tone: Tone; label: string } | null => {
  if (!model) return null;
  if (model.includes('sonnet')) return { tone: 'violet', label: 'Reasoning & evidence' };
  if (model.includes('haiku')) return { tone: 'info', label: 'Fast extraction' };
  return { tone: 'success', label: 'Local embeddings' };
};

/* Tiny JSON syntax highlighter: keys sky, strings emerald, numbers amber, literals violet. */
const highlightJson = (src: string): React.ReactNode[] => {
  const token = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = token.exec(src)) !== null) {
    if (m.index > last) out.push(src.slice(last, m.index));
    if (m[1]) {
      if (m[2]) {
        out.push(
          <span key={key++} className="text-sky-300">{m[1]}</span>,
          <span key={key++} className="text-slate-400">{m[2]}</span>
        );
      } else {
        out.push(<span key={key++} className="text-emerald-300">{m[1]}</span>);
      }
    } else if (m[3]) {
      out.push(<span key={key++} className="text-violet-300">{m[3]}</span>);
    } else {
      out.push(<span key={key++} className="text-amber-300">{m[0]}</span>);
    }
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
};

const MARKER_TEXT: Record<string, string> = {
  info: 'text-sky-600',
  violet: 'text-violet-600',
  success: 'text-emerald-600',
  neutral: 'text-slate-500',
};

const ROUTING = [
  {
    icon: Zap,
    tone: 'info' as Tone,
    name: 'High-volume parser',
    tag: 'Fast extraction',
    text: 'Routed for document extraction, query decomposition, candidate validation, and offline graph edges.',
  },
  {
    icon: Sparkles,
    tone: 'violet' as Tone,
    name: 'Normative reasoning engine',
    tag: 'High reasoning',
    text: 'Routed for cross-attention re-ranking, engineering justification, why-not rejections, and risk detection.',
  },
  {
    icon: Cpu,
    tone: 'success' as Tone,
    name: 'Local MiniLM-L6-v2',
    tag: 'Zero-cost vector',
    text: '384-dimensional dense embeddings run locally without external cloud API latency or token cost.',
  },
];

export const AuditPanel: React.FC<AuditPanelProps> = ({ auditLogs }) => {
  const [expandedLogs, setExpandedLogs] = useState<Record<number, boolean>>({});

  const toggleLog = (id: number) => {
    setExpandedLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setAll = (open: boolean) => {
    const next: Record<number, boolean> = {};
    auditLogs.forEach(l => {
      next[l.log_id] = open;
    });
    setExpandedLogs(next);
  };

  const totalDuration = auditLogs.reduce((acc, l) => acc + l.duration_ms, 0);
  const slowest = auditLogs.reduce<AuditLogEntry | null>((best, l) => (!best || l.duration_ms > best.duration_ms ? l : best), null);
  const warnings = auditLogs.filter(l => l.status === 'WARNING').length;
  const allOpen = auditLogs.length > 0 && auditLogs.every(l => expandedLogs[l.log_id]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governance · Auditable execution trail"
        eyebrowIcon={Terminal}
        title="Deterministic audit ledger and model routing"
        description="Every procurement decision is logged from raw tender text to statutory recommendation. Evaluators can inspect the exact model invocation, latency, and JSON payload for complete algorithmic accountability."
        meta={
          <>
            <Badge tone="brand" dot>System transparency</Badge>
            <Badge tone="neutral">{auditLogs.length} sequential pipeline stages</Badge>
          </>
        }
        actions={
          auditLogs.length > 0 ? (
            <Button variant="secondary" size="md" icon={ListChecks} onClick={() => setAll(!allOpen)}>
              {allOpen ? 'Collapse all payloads' : 'Expand all payloads'}
            </Button>
          ) : undefined
        }
      />

      {auditLogs.length === 0 ? (
        <EmptyState
          icon={Terminal}
          title="No audit trail yet"
          description="Run a tender analysis and every pipeline stage will be recorded here with its model, latency and payload."
        />
      ) : (
        <>
          {/* ------------------------------------------------------------------ */}
          {/* Summary                                                            */}
          {/* ------------------------------------------------------------------ */}
          <Card padded="lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7 lg:gap-0 lg:divide-x lg:divide-line-soft">
              <Stat
                className="lg:pr-6"
                label="Total processing latency"
                value={(totalDuration / 1000).toFixed(2)}
                suffix="s"
                hint="End-to-end pipeline"
              />
              <Stat className="lg:px-6" label="Pipeline stages" value={auditLogs.length} hint="Logged in sequence" />
              <Stat
                className="lg:px-6"
                label="Slowest stage"
                value={slowest ? slowest.duration_ms.toLocaleString() : '–'}
                suffix="ms"
                hint={slowest?.stage_name}
              />
              <Stat
                className="lg:pl-6"
                label="Stage status"
                value={`${auditLogs.length - warnings}/${auditLogs.length}`}
                suffix="succeeded"
                hint={warnings > 0 ? `${warnings} ${warnings === 1 ? 'stage' : 'stages'} with warnings` : 'No warnings raised'}
              />
            </div>
          </Card>

          {/* ------------------------------------------------------------------ */}
          {/* Model routing                                                      */}
          {/* ------------------------------------------------------------------ */}
          <section aria-label="Model routing" className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ROUTING.map(r => (
              <Card key={r.name} className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <IconTile icon={r.icon} tone={r.tone} />
                  <Badge tone={r.tone} size="sm">{r.tag}</Badge>
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900 tracking-tight">{r.name}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{r.text}</p>
                </div>
              </Card>
            ))}
          </section>

          {/* ------------------------------------------------------------------ */}
          {/* Timeline                                                           */}
          {/* ------------------------------------------------------------------ */}
          <section aria-label="Pipeline stages" className="space-y-4">
            <SectionTitle
              icon={Clock}
              title="Execution timeline"
              subtitle="Select a stage to inspect its parameters and JSON payload."
            />

            <ol className="relative space-y-4">
              <span aria-hidden="true" className="absolute left-[19px] top-6 bottom-6 w-px bg-line" />

              {auditLogs.map((log, index) => {
                const isExpanded = expandedLogs[log.log_id] ?? false;
                const meta = modelMeta(log.model);
                const StageIcon = STAGE_ICON[log.stage] || Cpu;
                const share = totalDuration > 0 ? (log.duration_ms / totalDuration) * 100 : 0;
                const isWarn = log.status === 'WARNING';
                const payloadJson = JSON.stringify(log.payload, null, 2);
                const fieldCount = log.payload ? Object.keys(log.payload).length : 0;
                const panelId = `audit-panel-${log.log_id}`;

                return (
                  <li key={log.log_id} className="relative pl-[3.75rem] sm:pl-16">
                    {/* Stage marker on the rail */}
                    <span
                      className={cx(
                        'absolute left-0 top-4 sm:top-[18px] w-10 h-10 rounded-xl bg-white border border-line shadow-sm ring-4 ring-canvas flex items-center justify-center',
                        MARKER_TEXT[meta?.tone ?? 'neutral']
                      )}
                    >
                      <StageIcon className="w-5 h-5" />
                      {isWarn && (
                        <span className="absolute -right-1 -top-1 w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-white" title="Warning" />
                      )}
                    </span>

                    <Card padded={false} className="overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleLog(log.log_id)}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className="w-full text-left p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6 hover:bg-slate-50/70 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 eyebrow">
                            <span>Stage {String(index + 1).padStart(2, '0')}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono normal-case tracking-normal text-[12px] text-brand-700">{log.stage}</span>
                          </div>
                          <h3 className="mt-1 font-heading text-base sm:text-[17px] font-semibold text-slate-900 tracking-tight leading-snug">
                            {log.stage_name}
                          </h3>
                          <div className="mt-0.5 text-xs font-mono text-slate-500">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
                          {meta && (
                            <Badge tone={meta.tone}>
                              <span className="font-mono">{log.model}</span>
                              <span className="hidden sm:inline font-medium opacity-80">· {meta.label}</span>
                            </Badge>
                          )}
                          <span className="inline-flex flex-col gap-1 min-w-[5.5rem]">
                            <span className="inline-flex items-center gap-1.5 text-sm font-mono font-semibold text-slate-800 tabular-nums">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {log.duration_ms.toLocaleString()} ms
                            </span>
                            <span className="block h-1 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                              <span className="block h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${Math.max(3, share)}%` }} />
                            </span>
                          </span>
                          <Badge tone={isWarn ? 'warn' : 'success'} dot size="sm">
                            {isWarn ? 'Warning' : 'Success'}
                          </Badge>
                          <ChevronDown
                            className={cx('w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ml-auto lg:ml-0', isExpanded && 'rotate-180')}
                            aria-hidden="true"
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div id={panelId} className="border-t border-line-soft bg-slate-50/60 p-4 sm:p-5 space-y-3 animate-fade-in">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                              <Terminal className="w-4 h-4 text-brand-600" />
                              Stage execution parameters and payload
                            </span>
                            <Badge tone={isWarn ? 'warn' : 'success'} size="sm" mono>
                              STATUS: {log.status}
                            </Badge>
                          </div>

                          <div className="rounded-xl bg-slate-950 ring-1 ring-slate-800 overflow-hidden">
                            <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-white/10 text-xs font-mono text-slate-400">
                              <span>payload.json</span>
                              <span>{fieldCount} {fieldCount === 1 ? 'field' : 'fields'}</span>
                            </div>
                            <pre className="p-4 max-h-96 overflow-auto text-[13px] leading-relaxed font-mono text-slate-400">
                              <code>{highlightJson(payloadJson)}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </Card>
                  </li>
                );
              })}
            </ol>
          </section>
        </>
      )}
    </div>
  );
};
