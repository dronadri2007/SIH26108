import React from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * Shared workspace primitives (light theme).
 * Every workspace screen should compose these instead of hand-rolling borders,
 * badges and buttons, so the whole app keeps one visual language.
 */

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ */
/* Tones                                                               */
/* ------------------------------------------------------------------ */
export type Tone = 'neutral' | 'brand' | 'success' | 'warn' | 'danger' | 'info' | 'saffron' | 'violet';

export const toneBadge: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warn: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  saffron: 'bg-saffron-50 text-saffron-700 ring-saffron-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export const toneDot: Record<Tone, string> = {
  neutral: 'bg-slate-400',
  brand: 'bg-brand-500',
  success: 'bg-emerald-500',
  warn: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-sky-500',
  saffron: 'bg-saffron-500',
  violet: 'bg-violet-500',
};

export const toneIconTile: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-emerald-50 text-emerald-600',
  warn: 'bg-amber-50 text-amber-600',
  danger: 'bg-rose-50 text-rose-600',
  info: 'bg-sky-50 text-sky-600',
  saffron: 'bg-saffron-50 text-saffron-600',
  violet: 'bg-violet-50 text-violet-600',
};

export const toneBar: Record<Tone, string> = {
  neutral: 'bg-slate-400',
  brand: 'bg-gradient-to-r from-brand-500 to-violet-500',
  success: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
  warn: 'bg-gradient-to-r from-amber-400 to-amber-500',
  danger: 'bg-gradient-to-r from-rose-400 to-rose-500',
  info: 'bg-gradient-to-r from-sky-400 to-sky-500',
  saffron: 'bg-gradient-to-r from-saffron-400 to-saffron-500',
  violet: 'bg-gradient-to-r from-violet-400 to-violet-500',
};

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ padded = true, hover = false, className, children, ...rest }) => (
  <div
    className={cx('card', padded === 'lg' ? 'p-7' : padded ? 'p-5 sm:p-6' : '', hover && 'card-hover', className)}
    {...rest}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */
interface BadgeProps {
  tone?: Tone;
  dot?: boolean;
  mono?: boolean;
  size?: 'sm' | 'md';
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', dot, mono, size = 'md', icon: Icon, className, children }) => (
  <span
    className={cx(
      'inline-flex max-w-full items-center gap-1.5 rounded-full ring-1 ring-inset font-semibold whitespace-nowrap',
      size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
      mono && 'font-mono',
      toneBadge[tone],
      className
    )}
  >
    {dot && <span className={cx('w-1.5 h-1.5 shrink-0 rounded-full', toneDot[tone])} />}
    {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
    <span className="min-w-0 truncate">{children}</span>
  </span>
);

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconRight?: LucideIcon;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'text-white bg-gradient-to-b from-brand-500 to-brand-600 hover:from-brand-500 hover:to-brand-700 shadow-[0_8px_20px_-8px_rgba(47,69,224,0.7),inset_0_1px_0_rgba(255,255,255,0.25)]',
  secondary: 'text-slate-700 bg-white border border-line hover:bg-slate-50 hover:border-slate-300 shadow-xs',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'text-white bg-gradient-to-b from-rose-500 to-rose-600 hover:to-rose-700 shadow-[0_8px_20px_-8px_rgba(225,29,72,0.6)]',
  dark: 'text-white bg-slate-900 hover:bg-slate-800 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.6)]',
  success:
    'text-white bg-gradient-to-b from-emerald-500 to-emerald-600 hover:to-emerald-700 shadow-[0_8px_20px_-8px_rgba(5,150,105,0.6)]',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-sm gap-2 rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  ...rest
}) => (
  <button
    className={cx(
      'inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
      buttonVariants[variant],
      buttonSizes[size],
      className
    )}
    {...rest}
  >
    {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
    {children}
    {IconRight && <IconRight className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
  </button>
);

/* ------------------------------------------------------------------ */
/* Page header, section title                                          */
/* ------------------------------------------------------------------ */
interface PageHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, eyebrowIcon: EyebrowIcon, title, description, actions, meta }) => (
  <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
    <div className="min-w-0 space-y-2.5">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
          {EyebrowIcon && <EyebrowIcon className="w-3.5 h-3.5" />}
          {eyebrow}
        </div>
      )}
      <h1 className="font-heading text-2xl sm:text-[1.75rem] leading-tight font-bold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="text-sm sm:text-[15px] leading-relaxed text-slate-500 max-w-3xl">{description}</p>}
      {meta && <div className="flex flex-wrap items-center gap-2 pt-1">{meta}</div>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
  </header>
);

interface SectionTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, action, icon: Icon, className }) => (
  <div className={cx('flex items-start justify-between gap-4', className)}>
    <div className="flex items-start gap-3 min-w-0">
      {Icon && (
        <span className="mt-0.5 w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="font-heading text-base font-semibold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Stat, icon tile, progress, segmented control                        */
/* ------------------------------------------------------------------ */
interface IconTileProps {
  icon: LucideIcon;
  tone?: Tone;
  size?: 'sm' | 'md' | 'lg';
}

export const IconTile: React.FC<IconTileProps> = ({ icon: Icon, tone = 'brand', size = 'md' }) => (
  <span
    className={cx(
      'inline-flex items-center justify-center shrink-0',
      size === 'sm' ? 'w-8 h-8 rounded-lg' : size === 'lg' ? 'w-12 h-12 rounded-2xl' : 'w-10 h-10 rounded-xl',
      toneIconTile[tone]
    )}
  >
    <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
  </span>
);

interface StatProps {
  label: string;
  value: React.ReactNode;
  suffix?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({ label, value, suffix, hint, className }) => (
  <div className={className}>
    <div className="eyebrow">{label}</div>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="font-heading text-4xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</span>
      {suffix && <span className="text-sm text-slate-500 font-medium">{suffix}</span>}
    </div>
    {hint && <div className="mt-1.5 text-sm text-slate-500 leading-relaxed">{hint}</div>}
  </div>
);

interface ProgressBarProps {
  value: number;
  tone?: Tone;
  className?: string;
  height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, tone = 'brand', className, height = 'h-2' }) => (
  <div className={cx('w-full rounded-full bg-slate-100 overflow-hidden', height, className)}>
    <div
      className={cx('h-full rounded-full transition-all duration-700', toneBar[tone])}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

interface SegmentedProps<T extends string> {
  options: Array<{ value: T; label: React.ReactNode; count?: number }>;
  value: T;
  onChange: (v: T) => void;
  className?: string;
}

export function Segmented<T extends string>({ options, value, onChange, className }: SegmentedProps<T>) {
  return (
    <div className={cx('inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 ring-1 ring-inset ring-slate-200/70', className)}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cx(
              'px-3.5 h-8 rounded-lg text-[13px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5',
              active ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/70' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {opt.label}
            {typeof opt.count === 'number' && (
              <span className={cx('text-[11px] font-mono px-1.5 rounded-md', active ? 'bg-brand-50 text-brand-700' : 'bg-slate-200/70 text-slate-500')}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state, key/value, divider                                     */
/* ------------------------------------------------------------------ */
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <div className="card flex flex-col items-center text-center px-6 py-14 gap-3">
    <IconTile icon={Icon} tone="neutral" size="lg" />
    <h3 className="font-heading text-lg font-semibold text-slate-900">{title}</h3>
    {description && <p className="text-sm text-slate-500 max-w-md leading-relaxed">{description}</p>}
    {action}
  </div>
);

export const Kv: React.FC<{ label: string; children: React.ReactNode; mono?: boolean; className?: string }> = ({
  label,
  children,
  mono,
  className,
}) => (
  <div className={className}>
    <dt className="eyebrow">{label}</dt>
    <dd className={cx('mt-1 text-sm text-slate-800', mono && 'font-mono text-[13px]')}>{children}</dd>
  </div>
);

/* Modal / drawer shell with a soft backdrop. */
export const Backdrop: React.FC<{ onClick?: () => void; className?: string }> = ({ onClick, className }) => (
  <div
    onClick={onClick}
    className={cx('fixed inset-0 bg-slate-950/45 backdrop-blur-[3px] animate-fade-in z-40', className)}
    aria-hidden="true"
  />
);
