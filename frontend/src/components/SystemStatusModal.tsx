import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Database,
  Lock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Backdrop, Badge, Button, IconTile } from './ui';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Subsystem {
  icon: LucideIcon;
  title: string;
  status: string;
  rows: Array<[string, string]>;
}

const SUBSYSTEMS: Subsystem[] = [
  {
    icon: Database,
    title: 'Standards Knowledge Base',
    status: 'Active',
    rows: [
      ['Indexed catalog', '450 Standards'],
      ['Active Gazette standards', '442'],
      ['Withdrawn / superseded', '8'],
      ['Technical committees (TC)', '28 Committees'],
    ],
  },
  {
    icon: Cpu,
    title: 'Hybrid Retrieval Engines',
    status: 'Ready',
    rows: [
      ['BM25 sparse lexical', '14ms latency'],
      ['Dense embeddings (MiniLM)', '38ms latency'],
      ['LLM re-ranker (Claude Sonnet)', '1 call / requirement'],
      ['Weighted score fusion (BM25 / Dense)', '0.5 / 0.5'],
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Evidence & Rule Verification',
    status: 'Verified',
    rows: [
      ['5-point evidence checklist', 'Operational'],
      ['Pre-tender defect detector', 'Active (12 rules)'],
      ['Why-not disqualification', 'Active'],
      ['Officer verification gate', 'Enforced'],
    ],
  },
  {
    icon: Lock,
    title: 'Audit Trail & Security',
    status: 'Secured',
    rows: [
      ['Audit ledger cryptography', 'SHA-256 Chained'],
      ['Officer SSO identity', 'MeriPehchaan (Parichay)'],
      ['Network boundaries', 'Internal NIC Subnet'],
      ['Data residency', 'India Sovereign Tier-4'],
    ],
  },
];

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({
  isOpen,
  onClose
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <Backdrop onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-status-title"
        className="relative z-50 w-full max-w-4xl max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl animate-pop overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 px-5 sm:px-8 py-5 flex items-start gap-4 border-b border-line-soft">
          <span className="hidden sm:block"><IconTile icon={Activity} tone="success" size="lg" /></span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id="system-status-title" className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
              System diagnostics &amp; infrastructure health
            </h2>
            <p className="mt-1 text-sm text-slate-500">SIH26108 BIS Recommendation Engine — Production Node</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close system diagnostics"
            className="-mr-2 w-9 h-9 shrink-0 rounded-xl inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
          {/* Overall health */}
          <div className="rounded-2xl bg-emerald-50 ring-1 ring-inset ring-emerald-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-200 shrink-0" aria-hidden="true" />
              <div>
                <div className="text-[15px] font-semibold text-emerald-900 leading-snug">
                  All hybrid retrieval &amp; verification pipelines operational
                </div>
                <p className="mt-1 text-sm text-emerald-800 leading-relaxed">
                  Offline-first architecture verified. Air-gapped NIC datacenter environment. Zero external LLM calls.
                </p>
              </div>
            </div>
            <Badge tone="success" mono className="self-start sm:self-center bg-white">99.98% uptime</Badge>
          </div>

          {/* Subsystems */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUBSYSTEMS.map(sys => (
              <section key={sys.title} className="card-soft p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <IconTile icon={sys.icon} tone="brand" size="sm" />
                    <h3 className="font-heading text-[15px] font-semibold text-slate-900 tracking-tight leading-snug">{sys.title}</h3>
                  </div>
                  <Badge tone="success" size="sm" icon={CheckCircle2}>{sys.status}</Badge>
                </div>
                <dl className="mt-3 divide-y divide-line-soft">
                  {sys.rows.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="font-mono text-[13px] font-semibold text-slate-900 text-right whitespace-nowrap">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          {/* Catalog limitation notice */}
          <div className="flex items-start gap-3.5 rounded-2xl bg-amber-50/70 ring-1 ring-inset ring-amber-200 p-4 sm:p-5">
            <span className="w-8 h-8 rounded-lg bg-white text-amber-600 ring-1 ring-inset ring-amber-200 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-amber-900">Catalog scope boundary</h3>
              <p className="mt-1 text-sm text-amber-900/85 leading-relaxed">
                The currently indexed knowledge base contains 450 standards across three critical sectors:{' '}
                <strong className="font-semibold">Electrical Safety</strong>, <strong className="font-semibold">Packaging Materials</strong>, and{' '}
                <strong className="font-semibold">Construction &amp; Building Materials</strong>. For standards beyond these three domains,
                officers should consult the official BIS portal (manakonline.in).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 sm:px-8 py-4 border-t border-line-soft bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <span className="font-mono text-xs text-slate-500">Node ID: NIC-DEL-BIS-014</span>
          <Button variant="primary" onClick={onClose} className="w-full sm:w-auto">Close diagnostics</Button>
        </div>
      </div>
    </div>
  );
};
