import React from 'react';
import { ChevronDown, Contrast, Languages, LogOut, Menu } from 'lucide-react';
import { OfficerUser } from '../types';
import type { MainNavView } from './AppSidebar';
import { cx } from './ui';

interface AppTopBarProps {
  currentView?: MainNavView;
  selectedPreset: string;
  onSelectPreset: (presetKey: string) => void;
  currentUser: OfficerUser;
  onLogout: () => void;
  fontSize: 'normal' | 'large' | 'small';
  onChangeFontSize: (size: 'normal' | 'large' | 'small') => void;
  isHighContrast: boolean;
  onToggleContrast: () => void;
  language: 'EN' | 'HI';
  onToggleLanguage: () => void;
  onOpenNav?: () => void;
}

const VIEW_LABELS: Record<MainNavView, string> = {
  overview: 'Tender overview',
  results: 'Recommendations',
  requirements: 'Requirements',
  coverage: 'Coverage matrix',
  risks: 'Specification review',
  catalog: 'Standards catalog',
  graph: 'Knowledge graph',
  audit: 'Audit trail',
  history: 'Analysis history',
  new_analysis: 'New tender intake',
  whynot: 'Why not these standards',
  compare: 'Compare standards',
};

export const AppTopBar: React.FC<AppTopBarProps> = ({
  currentView = 'overview',
  selectedPreset,
  onSelectPreset,
  currentUser,
  onLogout,
  fontSize,
  onChangeFontSize,
  isHighContrast,
  onToggleContrast,
  language,
  onToggleLanguage,
  onOpenNav,
}) => {
  const sizeBtn = (size: 'small' | 'normal' | 'large', label: string, aria: string) => (
    <button
      onClick={() => onChangeFontSize(size)}
      className={cx(
        'w-8 h-7 rounded-md text-xs font-semibold transition-all cursor-pointer',
        fontSize === size ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/70' : 'text-slate-500 hover:text-slate-800'
      )}
      title={aria}
      aria-label={aria}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 bg-white/80 backdrop-blur-xl border-b border-line">
      <div className="h-full px-4 sm:px-8 flex items-center gap-3 sm:gap-4">
        {/* mobile nav trigger */}
        <button
          onClick={onOpenNav}
          className="lg:hidden -ml-1 p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* title */}
        <div className="min-w-0 shrink-0 leading-tight">
          <div className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</div>
          <div className="font-heading text-[15px] sm:text-base font-bold text-slate-900 truncate">{VIEW_LABELS[currentView]}</div>
        </div>

        <div className="flex-1" />

        {/* case switcher */}
        <label className="hidden md:flex items-center gap-2.5 h-10 pl-3.5 pr-2.5 rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200/80 hover:ring-slate-300 transition-all">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-slate-500 hidden 2xl:inline">Tender case</span>
          <span className="relative">
            <select
              value={selectedPreset}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="appearance-none bg-transparent pr-6 text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer w-[150px] lg:w-[190px] xl:w-[270px] 2xl:w-[310px] truncate"
              aria-label="Select benchmark tender case"
            >
              <option value="case1">Case 1: CPWD 415V LV Switchgear &amp; Earthing</option>
              <option value="case2">Case 2: DRDO Retort Pouches (Army Rations)</option>
              <option value="case3">Case 3: JNPA Marine Concrete Berth</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </span>
        </label>

        {/* accessibility */}
        <div className="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 ring-1 ring-inset ring-slate-200/70">
          {sizeBtn('small', 'A-', 'Decrease font size')}
          {sizeBtn('normal', 'A', 'Standard font size')}
          {sizeBtn('large', 'A+', 'Increase font size')}
        </div>

        <button
          onClick={onToggleContrast}
          className={cx(
            'hidden xl:inline-flex w-10 h-10 items-center justify-center rounded-xl ring-1 ring-inset transition-all cursor-pointer',
            isHighContrast ? 'bg-amber-400 text-black ring-amber-500' : 'text-slate-500 ring-slate-200/80 hover:bg-slate-50 hover:text-slate-800'
          )}
          title="Toggle high contrast mode"
          aria-label="Toggle high contrast mode"
        >
          <Contrast className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleLanguage}
          className="hidden xl:inline-flex h-10 px-3 items-center gap-2 rounded-xl text-sm font-semibold text-slate-600 ring-1 ring-inset ring-slate-200/80 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
          aria-label="Toggle language"
        >
          <Languages className="w-4 h-4 text-slate-400" />
          <span className="hidden 2xl:inline">{language === 'EN' ? 'हिन्दी' : 'English'}</span>
          <span className="2xl:hidden">{language === 'EN' ? 'हि' : 'En'}</span>
        </button>

        {/* user */}
        <div className="flex items-center gap-3 pl-3 sm:pl-4 sm:border-l border-line">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white font-heading font-bold text-xs flex items-center justify-center shadow-md">
            {currentUser.avatar_initials || currentUser.name.charAt(0)}
          </span>
          <div className="hidden 2xl:block leading-tight">
            <div className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">{currentUser.name}</div>
            <div className="text-xs text-slate-500">{currentUser.role === 'TECHNICAL_COMMITTEE_CHAIR' ? 'TC chair' : 'Demo officer'}</div>
          </div>
          <button
            onClick={onLogout}
            className="hidden sm:inline-flex p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
