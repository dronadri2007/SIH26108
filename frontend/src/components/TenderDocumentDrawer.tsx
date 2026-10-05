import React, { useRef, useState } from 'react';
import { FileText, ScanText, X } from 'lucide-react';
import { Requirement, RequirementType, ProductProfile } from '../types';
import { Badge, Button, Backdrop, cx } from './ui';
import type { Tone } from './ui';

interface TenderDocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rawText: string;
  filename?: string;
  requirements: Requirement[];
  profile?: ProductProfile;
}

const REQUIREMENT_TYPE_TONE: Record<RequirementType, Tone> = {
  SAFETY: 'danger',
  TESTING: 'info',
  PRODUCT: 'brand',
  PERFORMANCE: 'violet',
  MATERIAL: 'success',
  TERMINOLOGY: 'neutral',
};

interface Segment {
  text: string;
  reqId?: string;
  index?: number;
}

/**
 * Find where a requirement's source span sits in the raw tender text.
 * Tries the whole span first, then any fragment around an ellipsis, case-insensitively.
 */
const locateSpan = (raw: string, span: string): { start: number; end: number } | null => {
  if (!span) return null;
  const hay = raw.toLowerCase();
  const candidates = [span, ...span.split(/\s*(?:\.{3}|…)\s*/)].map(s => s.trim()).filter(s => s.length >= 12);
  for (const c of candidates) {
    const i = hay.indexOf(c.toLowerCase());
    if (i >= 0) return { start: i, end: i + c.length };
  }
  return null;
};

/** Split the raw text into plain and highlighted segments, one highlight per located requirement. */
const buildSegments = (raw: string, requirements: Requirement[]) => {
  const ranges = requirements
    .map((req, index) => {
      const hit = locateSpan(raw, req.source_span);
      return hit ? { ...hit, reqId: req.requirement_id, index } : null;
    })
    .filter((r): r is { start: number; end: number; reqId: string; index: number } => r !== null)
    .sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  const located = new Set<string>();
  let cursor = 0;
  for (const r of ranges) {
    if (r.start < cursor) continue; // overlapping span, leave it unhighlighted
    if (r.start > cursor) segments.push({ text: raw.slice(cursor, r.start) });
    segments.push({ text: raw.slice(r.start, r.end), reqId: r.reqId, index: r.index });
    located.add(r.reqId);
    cursor = r.end;
  }
  if (cursor < raw.length) segments.push({ text: raw.slice(cursor) });
  return { segments, located };
};

export const TenderDocumentDrawer: React.FC<TenderDocumentDrawerProps> = ({
  isOpen,
  onClose,
  rawText,
  filename,
  requirements,
}) => {
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { segments, located } = buildSegments(rawText, requirements);

  /** Bring an element into view inside the drawer body, only when it is off screen. */
  const revealIfHidden = (elementId: string) => {
    const el = document.getElementById(elementId);
    const box = scrollRef.current;
    if (!el || !box) return;
    const r = el.getBoundingClientRect();
    const c = box.getBoundingClientRect();
    if (r.top >= c.top + 8 && r.bottom <= c.bottom - 8) return;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  };

  const toggleAnchor = (reqId: string, reveal: 'span' | 'card') => {
    const next = activeReqId === reqId ? null : reqId;
    setActiveReqId(next);
    if (next) revealIfHidden(reveal === 'span' ? `tender-span-${reqId}` : `tender-anchor-${reqId}`);
  };

  const onKeyActivate = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="tender-drawer-title">
      <Backdrop onClick={onClose} />

      <div className="absolute z-50 inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-line-soft flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                <FileText className="w-3.5 h-3.5" />
                Traceability anchors
              </span>
              {filename && <Badge tone="neutral" mono size="sm" className="max-w-full truncate">{filename}</Badge>}
            </div>
            <h2 id="tender-drawer-title" className="font-heading text-xl font-bold tracking-tight text-slate-900">
              Tender document
            </h2>
          </div>

          <Button variant="ghost" size="sm" icon={X} onClick={onClose} aria-label="Close tender document" title="Close" className="px-2! shrink-0" />
        </div>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-canvas px-5 sm:px-6 py-6 space-y-8">
          {/* Source text */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-base font-semibold text-slate-900">Source text</h3>
              <div className="flex items-center gap-2">
                <Badge tone="saffron" size="sm">{located.size} of {requirements.length} spans highlighted</Badge>
                <Badge tone="brand" icon={ScanText} size="sm">OCR parsed</Badge>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Highlighted passages are the spans each requirement was extracted from. Select one to see its requirement.
            </p>

            <div className="rounded-2xl border border-line bg-white shadow-xs px-5 sm:px-7 py-6">
              {rawText ? (
                <div className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700 selection:bg-brand-100">
                  {segments.map((seg, i) => {
                    if (!seg.reqId) return <React.Fragment key={i}>{seg.text}</React.Fragment>;
                    const reqId = seg.reqId;
                    const active = activeReqId === reqId;
                    const tailMatch = seg.text.match(/^([\s\S]*?)(\S+\s*)$/);
                    const head = tailMatch ? tailMatch[1] : seg.text;
                    const tail = tailMatch ? tailMatch[2] : '';
                    return (
                      <mark
                        key={i}
                        id={`tender-span-${reqId}`}
                        role="button"
                        tabIndex={0}
                        aria-pressed={active}
                        title={`Anchor #${(seg.index ?? 0) + 1}`}
                        onClick={() => toggleAnchor(reqId, 'card')}
                        onKeyDown={e => onKeyActivate(e, () => toggleAnchor(reqId, 'card'))}
                        className={cx(
                          'rounded px-0.5 py-0.5 box-decoration-clone text-slate-900 cursor-pointer transition-colors',
                          active
                            ? 'bg-brand-100 ring-2 ring-brand-300'
                            : 'bg-saffron-100/80 hover:bg-saffron-200/70'
                        )}
                      >
                        {head}
                        <span className="whitespace-nowrap">
                          {tail}
                          <span
                            aria-hidden="true"
                            className={cx(
                              'ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold text-white align-middle -translate-y-px not-italic',
                              active ? 'bg-brand-600' : 'bg-saffron-700'
                            )}
                          >
                            {(seg.index ?? 0) + 1}
                          </span>
                        </span>
                      </mark>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No tender text is available for this analysis.</p>
              )}
            </div>
          </section>

          {/* Extracted requirements */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-base font-semibold text-slate-900">
                Extracted requirements <span className="text-slate-500 font-medium tabular-nums">({requirements.length})</span>
              </h3>
              <span className="text-sm text-slate-500">Structured extraction stage</span>
            </div>

            <div className="space-y-3">
              {requirements.map((req, idx) => {
                const isSelected = activeReqId === req.requirement_id;
                const isLocated = located.has(req.requirement_id);

                return (
                  <div
                    key={req.requirement_id}
                    id={`tender-anchor-${req.requirement_id}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => toggleAnchor(req.requirement_id, 'span')}
                    onKeyDown={e => onKeyActivate(e, () => toggleAnchor(req.requirement_id, 'span'))}
                    className={cx(
                      'rounded-2xl border bg-white p-4 sm:p-5 cursor-pointer transition-all',
                      isSelected
                        ? 'border-brand-300 ring-4 ring-brand-100 shadow-md'
                        : 'border-line shadow-xs hover:border-brand-200 hover:shadow-sm'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cx(
                            'w-6 h-6 rounded-full text-xs font-semibold text-white flex items-center justify-center shrink-0',
                            isSelected ? 'bg-brand-600' : isLocated ? 'bg-saffron-600' : 'bg-slate-400'
                          )}
                          aria-label={`Anchor ${idx + 1}`}
                        >
                          {idx + 1}
                        </span>
                        <Badge tone={REQUIREMENT_TYPE_TONE[req.requirement_type] ?? 'neutral'}>{req.requirement_type}</Badge>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-500">{req.requirement_id}</span>
                    </div>

                    <p className="mt-3 text-sm font-semibold leading-snug text-slate-900">{req.requirement_text}</p>

                    <div className="mt-3.5 pt-3.5 border-t border-line-soft">
                      <div className="eyebrow">Source tender span</div>
                      <blockquote className="mt-2 border-l-2 border-saffron-300 pl-3 text-[13px] italic leading-relaxed text-slate-600">
                        &ldquo;{req.source_span}&rdquo;
                      </blockquote>
                      {!isLocated && (
                        <p className="mt-2 text-xs text-slate-500">No separate highlight: the span is not found verbatim in the source text, or it overlaps another anchor.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-line-soft bg-white flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500 leading-snug">Every downstream recommendation pins back to an anchor span above.</p>
          <Button variant="secondary" onClick={onClose} className="shrink-0">Close</Button>
        </div>
      </div>
    </div>
  );
};
