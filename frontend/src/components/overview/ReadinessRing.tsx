import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, CircleDashed } from 'lucide-react';
import { cx } from '../ui';
import { STATUS, prefersReducedMotion } from './meta';

export type StepState = 'done' | 'partial' | 'todo';

export interface ReadinessStep {
  key: string;
  label: string;
  detail: string;
  state: StepState;
  onClick?: () => void;
}

const SIZE = 128;
const STROKE = 11;
const R = (SIZE - STROKE) / 2;
const C = SIZE / 2;
const GAP_DEG = 9;

const polar = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: C + R * Math.cos(rad), y: C + R * Math.sin(rad) };
};

const arc = (startDeg: number, endDeg: number) => {
  const a = polar(startDeg);
  const b = polar(endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
};

const STATE_LABEL: Record<StepState, string> = { done: 'Done', partial: 'In progress', todo: 'To do' };

/**
 * Review progress as a segmented ring: one arc per review step, coloured by state.
 * The step list beside it carries the same state as icon + text, so colour is never the only cue.
 */
export const ReadinessRing: React.FC<{ steps: ReadinessStep[] }> = ({ steps }) => {
  const [drawn, setDrawn] = useState(prefersReducedMotion());
  useEffect(() => {
    if (drawn) return;
    const t = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(t);
  }, [drawn]);

  const done = steps.filter(s => s.state === 'done').length;
  const per = 360 / steps.length;

  return (
    <div className="@container">
    <div className="flex flex-col @[330px]:flex-row items-center gap-5">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`Review progress: ${done} of ${steps.length} steps done`}>
          {steps.map((s, i) => {
            const start = -90 + i * per + GAP_DEG / 2;
            const end = -90 + (i + 1) * per - GAP_DEG / 2;
            const d = arc(start, end);
            return (
              <g key={s.key}>
                <path d={d} fill="none" stroke={STATUS.todo} strokeWidth={STROKE} strokeLinecap="round" />
                {s.state !== 'todo' && (
                  <path
                    d={d}
                    fill="none"
                    stroke={s.state === 'done' ? STATUS.done : STATUS.partial}
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray={`${s.state === 'done' ? 100 : 50} 200`}
                    strokeDashoffset={drawn ? 0 : s.state === 'done' ? 100 : 50}
                    style={{ transition: `stroke-dashoffset 700ms cubic-bezier(.2,.7,.2,1) ${120 + i * 140}ms` }}
                    className="motion-reduce:transition-none"
                  />
                )}
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="font-heading text-[30px] font-bold text-slate-900">
            {done}
            <span className="text-slate-400 font-semibold text-xl">/{steps.length}</span>
          </span>
          <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">steps done</span>
        </div>
      </div>

      <ol className="min-w-0 w-full @[330px]:w-auto flex-1 space-y-1.5">
        {steps.map(s => {
          const Icon = s.state === 'done' ? CheckCircle2 : s.state === 'partial' ? CircleDashed : Circle;
          const inner = (
            <>
              <Icon
                className={cx(
                  'w-4 h-4 shrink-0 mt-0.5',
                  s.state === 'done' ? 'text-emerald-600' : s.state === 'partial' ? 'text-amber-600' : 'text-slate-400'
                )}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className={cx('block text-[13px] font-semibold leading-snug', s.state === 'done' ? 'text-slate-500' : 'text-slate-800')}>
                  {s.label}
                </span>
                <span className="block text-xs text-slate-500 leading-snug">
                  <span className="sr-only">{STATE_LABEL[s.state]}: </span>
                  {s.detail}
                </span>
              </span>
            </>
          );
          return (
            <li key={s.key}>
              {s.onClick ? (
                <button
                  onClick={s.onClick}
                  className="w-full text-left flex items-start gap-2.5 rounded-lg px-2 py-1 -mx-2 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {inner}
                </button>
              ) : (
                <div className="flex items-start gap-2.5 px-2 py-1 -mx-2">{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
    </div>
  );
};
