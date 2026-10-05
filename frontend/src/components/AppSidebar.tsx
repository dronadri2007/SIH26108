import React from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckSquare,
  FileCheck2,
  FileText,
  HelpCircle,
  History,
  Info,
  LayoutDashboard,
  LogOut,
  Plus,
  Share2,
  Terminal,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { OfficerUser, ProductProfile } from '../types';
import { BrandLockup } from './BrandMark';
import { cx } from './ui';

export type MainNavView =
  | 'overview'
  | 'results'
  | 'requirements'
  | 'coverage'
  | 'risks'
  | 'catalog'
  | 'graph'
  | 'audit'
  | 'history'
  | 'new_analysis'
  | 'whynot'
  | 'compare';

interface AppSidebarProps {
  currentView: MainNavView;
  onNavigate: (view: MainNavView) => void;
  hasActiveAnalysis: boolean;
  activeProfile?: ProductProfile;
  gapCount: number;
  riskCount: number;
  standardsCount: number;
  currentUser: OfficerUser | null;
  onLogout: () => void;
  onOpenSystemStatus: () => void;
  onOpenDocumentation: () => void;
  onOpenAbout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

type BadgeTone = 'neutral' | 'amber' | 'rose' | 'emerald';

const badgeClasses: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  amber: 'bg-amber-100 text-amber-800',
  rose: 'bg-rose-100 text-rose-700',
  emerald: 'bg-emerald-100 text-emerald-700',
};

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
  badgeTone?: BadgeTone;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, badge, badgeTone = 'neutral' }) => (
  <button
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={cx(
      'group relative w-full h-10 flex items-center gap-3 px-3 rounded-xl text-sm transition-all cursor-pointer',
      active
        ? 'bg-brand-50 text-brand-700 font-semibold'
        : 'text-slate-600 font-medium hover:bg-slate-100/80 hover:text-slate-900'
    )}
  >
    {active && <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-brand-600" aria-hidden="true" />}
    <Icon className={cx('w-[18px] h-[18px] shrink-0 transition-colors', active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600')} />
    <span className="truncate flex-1 text-left">{label}</span>
    {badge !== undefined && badge !== null && (
      <span className={cx('text-[11px] font-semibold font-mono px-2 py-0.5 rounded-md', active ? 'bg-white text-brand-700 ring-1 ring-brand-100' : badgeClasses[badgeTone])}>
        {badge}
      </span>
    )}
  </button>
);

const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{children}</div>
);

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onNavigate,
  gapCount,
  riskCount,
  standardsCount,
  currentUser,
  onLogout,
  onOpenSystemStatus,
  onOpenDocumentation,
  onOpenAbout,
  isOpen = false,
  onClose,
}) => {
  const go = (v: MainNavView) => () => onNavigate(v);

  return (
    <>
      {/* mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cx(
          'bg-white border-r border-line flex flex-col w-[284px] shrink-0 select-none z-50',
          'fixed inset-y-0 left-0 transition-transform duration-300 ease-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-line-soft shrink-0">
          <BrandLockup tone="light" size={34} />
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6" aria-label="Primary">
          <button
            onClick={go('new_analysis')}
            className={cx(
              'w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white transition-all cursor-pointer',
              'bg-gradient-to-b from-brand-500 to-brand-600 hover:to-brand-700 shadow-[0_10px_22px_-10px_rgba(47,69,224,0.8),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-[0.98]',
              currentView === 'new_analysis' && 'ring-4 ring-brand-100'
            )}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New tender intake
          </button>

          <div className="space-y-1">
            <GroupLabel>Workspace</GroupLabel>
            <NavItem icon={LayoutDashboard} label="Tender overview" active={currentView === 'overview'} onClick={go('overview')} />
            <NavItem icon={FileCheck2} label="Recommendations" active={currentView === 'results'} onClick={go('results')} badge={standardsCount} />
            <NavItem icon={FileText} label="Requirements" active={currentView === 'requirements'} onClick={go('requirements')} />
            <NavItem
              icon={CheckSquare}
              label="Coverage matrix"
              active={currentView === 'coverage'}
              onClick={go('coverage')}
              badge={gapCount > 0 ? `${gapCount} ${gapCount === 1 ? 'gap' : 'gaps'}` : 'Full'}
              badgeTone={gapCount > 0 ? 'amber' : 'emerald'}
            />
            <NavItem
              icon={AlertTriangle}
              label="Specification review"
              active={currentView === 'risks'}
              onClick={go('risks')}
              badge={riskCount > 0 ? riskCount : undefined}
              badgeTone="rose"
            />
          </div>

          <div className="space-y-1">
            <GroupLabel>Explore</GroupLabel>
            <NavItem icon={BookOpen} label="Standards catalog" active={currentView === 'catalog'} onClick={go('catalog')} badge={450} />
            <NavItem icon={Share2} label="Knowledge graph" active={currentView === 'graph'} onClick={go('graph')} />
          </div>

          <div className="space-y-1">
            <GroupLabel>Governance</GroupLabel>
            <NavItem icon={Terminal} label="Audit trail" active={currentView === 'audit'} onClick={go('audit')} />
            <NavItem icon={History} label="Analysis history" active={currentView === 'history'} onClick={go('history')} />
          </div>

          <div className="space-y-1">
            <GroupLabel>Support</GroupLabel>
            <NavItem icon={Activity} label="System health" active={false} onClick={onOpenSystemStatus} />
            <NavItem icon={HelpCircle} label="Methodology and help" active={false} onClick={onOpenDocumentation} />
            {onOpenAbout && <NavItem icon={Info} label="About this project" active={false} onClick={onOpenAbout} />}
          </div>
        </nav>

        {/* Footer: scope note + session */}
        <div className="px-4 pb-4 pt-3 space-y-3 border-t border-line-soft shrink-0">
          <div className="rounded-xl bg-gradient-to-br from-brand-50 to-violet-50/60 ring-1 ring-inset ring-brand-100 px-3.5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">Indexed scope</span>
              <span className="text-[11px] font-mono font-semibold text-brand-700">450 standards</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-snug">ETD, CHD and CED. Every recommendation needs officer verification.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white font-heading font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
              {currentUser?.avatar_initials || currentUser?.name?.charAt(0) || 'DO'}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-sm font-semibold text-slate-900 truncate">{currentUser?.name || 'Demo Officer'}</div>
              <div className="text-xs text-slate-500 truncate">
                {currentUser?.role === 'TECHNICAL_COMMITTEE_CHAIR' ? 'Technical committee chair' : 'Tender evaluation officer'}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
