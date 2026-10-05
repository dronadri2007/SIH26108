import React from 'react';
import { AlertTriangle, ArrowRight, Check, Info, LayoutGrid, PartyPopper, ShieldAlert } from 'lucide-react';
import type { Requirement, SpecificationRisk } from '../../types';
import { Card, cx } from '../ui';
import { SEVERITY_META } from './meta';

export interface QueueItem {
  id: string; // stable within the dossier, e.g. "gap:req-6" or "risk:risk-1"
  kind: 'gap' | 'risk';
  title: string;
  reqRef?: string;
  severity?: SpecificationRisk['severity'];
}

export const buildQueue = (gaps: Requirement[], risks: SpecificationRisk[]): QueueItem[] => [
  ...gaps.map<QueueItem>(g => ({ id: `gap:${g.requirement_id}`, kind: 'gap', title: g.requirement_text, reqRef: g.requirement_id })),
  ...risks
    .slice()
    .sort((a, b) => ['HIGH', 'MEDIUM', 'ADVISORY'].indexOf(a.severity) - ['HIGH', 'MEDIUM', 'ADVISORY'].indexOf(b.severity))
    .map<QueueItem>(r => ({ id: `risk:${r.risk_id}`, kind: 'risk', title: r.title, reqRef: r.requirement_id, severity: r.severity })),
];

interface DecisionQueueProps {
  items: QueueItem[];
  isReviewed: (id: string) => boolean;
  onToggle: (id: string) => void;
  onOpen: (kind: 'gap' | 'risk') => void;
  isOfficerEndorsed: boolean;
  onVerify: () => void;
}

const iconFor = (item: QueueItem) => {
  if (item.kind === 'gap') return { Icon: LayoutGrid, cls: 'bg-amber-50 text-amber-600 ring-amber-100' };
  if (item.severity === 'HIGH') return { Icon: ShieldAlert, cls: 'bg-rose-50 text-rose-600 ring-rose-100' };
  if (item.severity === 'MEDIUM') return { Icon: AlertTriangle, cls: 'bg-amber-50 text-amber-600 ring-amber-100' };
  return { Icon: Info, cls: 'bg-sky-50 text-sky-600 ring-sky-100' };
};

export const DecisionQueue: React.FC<DecisionQueueProps> = ({ items, isReviewed, onToggle, onOpen, isOfficerEndorsed, onVerify }) => {
  const reviewed = items.filter(i => isReviewed(i.id)).length;
  // open items first, reviewed ones sink to the bottom
  const ordered = [...items].sort((a, b) => Number(isReviewed(a.id)) - Number(isReviewed(b.id)));
  const allDone = items.length > 0 && reviewed === items.length;

  return (
    <Card padded={false} className="flex flex-col h-full">
      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-line-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-slate-900">Needs your decision</h2>
          <span className="text-xs font-semibold text-slate-500 tabular-nums">
            {reviewed}/{items.length} reviewed
          </span>
        </div>
        <div className="mt-3 flex gap-[3px]" aria-hidden="true">
          {items.map(i => (
            <span key={i.id} className={cx('h-1.5 flex-1 rounded-full transition-colors duration-300', isReviewed(i.id) ? 'bg-emerald-500' : 'bg-slate-200')} />
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
          <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Check className="w-5 h-5" />
          </span>
          <p className="text-sm font-semibold text-slate-900">Nothing flagged</p>
          <p className="mt-1 text-xs text-slate-500 max-w-[16rem]">Every requirement has a standard and no clause was flagged as risky.</p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-line-soft">
          {ordered.map(item => {
            const done = isReviewed(item.id);
            const { Icon, cls } = iconFor(item);
            const sev = item.severity ? SEVERITY_META[item.severity] : null;
            return (
              <li key={item.id} className={cx('px-5 sm:px-6 py-3.5 flex items-start gap-3 transition-opacity', done && 'opacity-60')}>
                <span className={cx('mt-0.5 w-8 h-8 rounded-lg ring-1 ring-inset flex items-center justify-center shrink-0', done ? 'bg-slate-50 text-slate-400 ring-slate-100' : cls)}>
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {item.kind === 'gap' ? (
                      <span className="font-semibold uppercase tracking-wider text-amber-700">Coverage gap</span>
                    ) : (
                      <span
                        className={cx(
                          'font-semibold uppercase tracking-wider',
                          sev?.tone === 'danger' ? 'text-rose-700' : sev?.tone === 'warn' ? 'text-amber-700' : 'text-sky-700'
                        )}
                      >
                        {sev?.label} alert
                      </span>
                    )}
                    {item.reqRef && <span className="font-mono text-slate-400">{item.reqRef.toUpperCase()}</span>}
                  </div>
                  <p className="mt-0.5 text-[13px] font-medium text-slate-800 leading-snug line-clamp-2">
                    {item.kind === 'gap' ? `No indexed standard: ${item.title}` : item.title}
                  </p>
                  <button
                    onClick={() => onOpen(item.kind)}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 cursor-pointer"
                  >
                    {item.kind === 'gap' ? 'Inspect in matrix' : 'Read the alert'} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => onToggle(item.id)}
                  aria-pressed={done}
                  aria-label={done ? 'Mark as not reviewed' : 'Mark as reviewed'}
                  title={done ? 'Reviewed. Click to undo.' : 'Mark as reviewed'}
                  className={cx(
                    'mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer',
                    done ? 'bg-emerald-500 text-white shadow-sm' : 'ring-1 ring-inset ring-slate-300 text-transparent hover:ring-emerald-400 hover:text-emerald-500'
                  )}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {allDone && (
        <div className="m-4 mt-0 rounded-xl bg-emerald-50 ring-1 ring-inset ring-emerald-100 px-4 py-3 flex items-center gap-3 animate-fade-in">
          <PartyPopper className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-emerald-900">All flagged items reviewed</p>
            <p className="text-xs text-emerald-800/80">{isOfficerEndorsed ? 'Dossier verified. Export the citation set when ready.' : 'Verify the dossier to finish.'}</p>
          </div>
          {!isOfficerEndorsed && (
            <button onClick={onVerify} className="text-xs font-semibold text-emerald-900 underline-offset-2 hover:underline cursor-pointer shrink-0">
              Verify
            </button>
          )}
        </div>
      )}
    </Card>
  );
};
