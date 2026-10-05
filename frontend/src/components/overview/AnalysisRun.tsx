import React from 'react';
import { ArrowRight, CheckCircle2, Timer } from 'lucide-react';
import type { AuditLogEntry } from '../../types';
import { Card } from '../ui';

/**
 * Model identity colours (validator: light surface, all pairs pass every check).
 * Identity is carried by the legend beside the bar; values live in text.
 */
const MODEL_META: Record<string, { label: string; color: string; role: string }> = {
  'claude-haiku-4.5': { label: 'Haiku 4.5', color: '#0f9f8f', role: 'fast extraction and checks' },
  'claude-sonnet-4.5': { label: 'Sonnet 4.5', color: '#4262f2', role: 'reasoning and re-ranking' },
  'all-MiniLM-L6-v2 (Local)': { label: 'MiniLM, local', color: '#d97706', role: 'embeddings, no API call' },
  'Postgres tsvector (BM25)': { label: 'Postgres BM25', color: '#e11d48', role: 'keyword search' },
};
const metaFor = (m: string) => MODEL_META[m] ?? { label: m, color: '#64748b', role: '' };

interface AnalysisRunProps {
  logs: AuditLogEntry[];
  submittedAt?: string;
  onOpenAudit: () => void;
}

const fmtSeconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

export const AnalysisRun: React.FC<AnalysisRunProps> = ({ logs, submittedAt, onOpenAudit }) => {
  const total = logs.reduce((s, l) => s + l.duration_ms, 0);
  const max = Math.max(1, ...logs.map(l => l.duration_ms));
  const ok = logs.filter(l => l.status === 'SUCCESS').length;

  // time by model, in order of first use
  const byModel: { model: string; ms: number; stages: number }[] = [];
  logs.forEach(l => {
    const row = byModel.find(b => b.model === l.model);
    if (row) {
      row.ms += l.duration_ms;
      row.stages += 1;
    } else byModel.push({ model: l.model, ms: l.duration_ms, stages: 1 });
  });

  const when = submittedAt ? new Date(submittedAt) : null;
  const whenLabel =
    when && !Number.isNaN(when.getTime())
      ? when.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
      : null;

  if (logs.length === 0) return null;

  return (
    <Card padded={false} className="flex flex-col h-full">
      <div className="px-5 sm:px-6 pt-5">
        <h2 className="font-heading text-lg font-semibold text-slate-900">Analysis run</h2>
        <p className="text-sm text-slate-500 mt-0.5">Which model did what, and how long it took.</p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Timer className="w-3.5 h-3.5" aria-hidden="true" /> End to end
            </div>
            <div className="font-heading text-[2rem] leading-none font-bold text-slate-900 mt-1">{fmtSeconds(total)}</div>
          </div>
          <div className="text-right pb-0.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> {ok}/{logs.length} stages passed
            </div>
            {whenLabel && <div className="text-xs text-slate-500 mt-1">Run {whenLabel}</div>}
          </div>
        </div>

        {/* time by model */}
        <div className="mt-4 flex h-2.5 gap-[2px]" role="img" aria-label={byModel.map(b => `${metaFor(b.model).label} ${fmtSeconds(b.ms)}`).join(', ')}>
          {byModel.map(b => (
            <span
              key={b.model}
              className="first:rounded-l-full last:rounded-r-full"
              style={{ flexGrow: b.ms, background: metaFor(b.model).color }}
              title={`${metaFor(b.model).label}: ${fmtSeconds(b.ms)} over ${b.stages} stage${b.stages === 1 ? '' : 's'}`}
            />
          ))}
        </div>
        <ul className="mt-3.5 space-y-2.5">
          {byModel.map(b => {
            const m = metaFor(b.model);
            return (
              <li key={b.model} className="flex items-start gap-2.5 text-xs">
                <span className="mt-1 w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: m.color }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-700 whitespace-nowrap">{m.label}</span>
                  <span className="block text-slate-500 truncate">{m.role}</span>
                </span>
                <span className="text-right font-semibold text-slate-700 tabular-nums shrink-0">
                  {fmtSeconds(b.ms)}
                  <span className="block font-normal text-slate-500">
                    {b.stages} {b.stages === 1 ? 'stage' : 'stages'}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* stages */}
      <div className="px-5 sm:px-6 mt-5 mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">Stages</div>
        <ol className="space-y-1">
          {logs.map(l => {
            const m = metaFor(l.model);
            return (
              <li
                key={l.log_id}
                className="grid grid-cols-[minmax(0,1fr)_64px_66px] items-center gap-3 py-0.5"
                title={`${l.stage_name}: ${l.duration_ms} ms on ${m.label}`}
              >
                <span className="text-[13px] text-slate-700 truncate">{l.stage_name}</span>
                <span className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${(l.duration_ms / max) * 100}%`, background: m.color }} />
                </span>
                <span className="text-right text-xs font-semibold text-slate-600 tabular-nums">{l.duration_ms.toLocaleString('en-IN')} ms</span>
              </li>
            );
          })}
        </ol>
      </div>

      <button
        onClick={onOpenAudit}
        className="mt-auto mx-5 sm:mx-6 mb-5 pt-4 border-t border-line-soft flex items-center justify-between text-sm font-semibold text-brand-700 hover:text-brand-800 cursor-pointer group"
      >
        Open the audit trail
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </Card>
  );
};
