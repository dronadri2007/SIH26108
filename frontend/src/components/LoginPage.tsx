import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileSearch, Link2, ShieldCheck, UserCheck } from 'lucide-react';
import { OfficerUser } from '../types';
import { BrandLockup } from './BrandMark';

export const PRESET_OFFICERS: OfficerUser[] = [
  {
    id: 'off-001',
    name: 'Dr. Rajesh Verma',
    designation: "Scientist 'F' & Member Secretary",
    department: 'Bureau of Indian Standards (Electrotechnical Dept.)',
    email: 'rajesh.verma@demo.example',
    role: 'TECHNICAL_COMMITTEE_CHAIR',
    security_clearance: 'Class-I Gazetted Signatory',
    avatar_initials: 'RV',
    last_login: 'Today, 10:14 IST'
  },
  {
    id: 'off-002',
    name: 'Smt. Priya Sundaram',
    designation: 'Executive Engineer (Electrical)',
    department: 'Central Public Works Department (CPWD Nirman Bhawan)',
    email: 'priya.sundaram@demo.example',
    role: 'EVALUATION_OFFICER',
    security_clearance: 'Tender Evaluation Committee Chair',
    avatar_initials: 'PS',
    last_login: 'Today, 09:30 IST'
  },
  {
    id: 'off-003',
    name: 'Col. Anand K. Sharma',
    designation: 'Joint Director (Quality Assurance)',
    department: 'Defence Research & Development Organisation (DRDO)',
    email: 'ak.sharma@demo.example',
    role: 'EVALUATION_OFFICER',
    security_clearance: 'Defense Procurement Wing',
    avatar_initials: 'AS',
    last_login: 'Yesterday, 17:45 IST'
  }
];

interface LoginPageProps {
  onLogin: (officer: OfficerUser) => void;
  onBack?: () => void;
}

const AVATAR_GRADIENTS = [
  'from-brand-500 to-violet-500',
  'from-saffron-500 to-rose-500',
  'from-emerald-500 to-sky-500',
];

const POINTS = [
  { icon: Link2, text: 'Every recommendation links back to the tender clause that triggered it.' },
  { icon: FileSearch, text: 'Near misses and coverage gaps are shown, not hidden.' },
  { icon: ShieldCheck, text: 'Final applicability always stays with the procuring officer.' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('off-001');
  const selectedOfficer = PRESET_OFFICERS.find(o => o.id === selectedOfficerId) || PRESET_OFFICERS[0];

  return (
    <div className="landing noise min-h-screen font-sans overflow-x-clip flex flex-col">
      <div className="aurora"><span /></div>
      <div className="grid-fade" />

      {/* top bar */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
          <BrandLockup tone="light" />
          {onBack && (
            <button
              onClick={onBack}
              className="btn-outline-light rounded-xl h-10 px-4 text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> About
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[1fr_0.92fr] gap-12 lg:gap-20 items-center">

          {/* left: message */}
          <section className="space-y-8 text-center lg:text-left min-w-0">
            <div className="inline-flex items-center gap-2.5 rounded-full glass pl-2 pr-4 py-1.5 text-[12px] font-medium text-slate-700 animate-fade-up">
              <span className="rounded-full bg-gradient-to-r from-brand-500 to-violet-500 text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wider">DEMO</span>
              Simulated officer sign-in
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.06] tracking-[-0.03em] text-slate-900 animate-fade-up" style={{ animationDelay: '80ms' }}>
              Step into the{' '}
              <span className="font-serif italic font-normal text-gradient-brand">decision workspace</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '160ms' }}>
              Pick an officer profile to explore sample tender dossiers. No real credentials are used anywhere in this prototype.
            </p>

            <ul className="hidden lg:block space-y-4 max-w-lg animate-fade-up" style={{ animationDelay: '240ms' }}>
              {POINTS.map(p => (
                <li key={p.text} className="flex items-start gap-3.5">
                  <span className="mt-0.5 w-9 h-9 rounded-xl bg-white ring-1 ring-inset ring-slate-200 text-brand-600 shadow-sm flex items-center justify-center shrink-0">
                    <p.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                  </span>
                  <span className="text-[15px] text-slate-600 leading-relaxed pt-1.5">{p.text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* right: card */}
          <section className="w-full min-w-0 max-w-[520px] mx-auto lg:mx-0 lg:ml-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="relative ring-gradient glass-strong rounded-[1.75rem] p-6 sm:p-8">
              <div className="space-y-1.5 mb-6">
                <h2 className="font-heading text-2xl font-bold text-slate-900 tracking-tight">Choose an officer profile</h2>
                <p className="text-sm text-slate-600">Each profile opens the same demo dossiers with a different signatory.</p>
              </div>

              <div role="radiogroup" aria-label="Demo officer profile" className="space-y-3">
                {PRESET_OFFICERS.map((officer, idx) => {
                  const isSelected = selectedOfficerId === officer.id;
                  return (
                    <button
                      key={officer.id}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedOfficerId(officer.id)}
                      className={`w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? 'bg-brand-50 border-brand-400 shadow-[0_0_0_4px_rgba(66,98,242,0.10)]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-white font-heading font-bold text-sm flex items-center justify-center shrink-0 shadow-lg`}
                      >
                        {officer.avatar_initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold text-slate-900 truncate">{officer.name}</span>
                        <span className="block text-[13px] text-slate-600 truncate">{officer.designation}</span>
                        <span className="block text-xs text-slate-500 truncate mt-0.5">{officer.department}</span>
                      </span>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'bg-brand-500 text-white scale-100' : 'border border-slate-300 text-transparent scale-90'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onLogin(selectedOfficer)}
                className="btn-glow w-full mt-7 h-14 rounded-2xl text-base font-semibold inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <UserCheck className="w-5 h-5" />
                Enter as {selectedOfficer.name.split(' ').slice(0, 2).join(' ')}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="mt-5 text-center text-xs text-slate-500 leading-relaxed">
                Demonstration environment for Smart India Hackathon 2026, SIH26108.
                <br />
                Not an official Government of India or BIS portal.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        Ministry of Consumer Affairs, Food &amp; Public Distribution · Problem statement SIH26108
      </footer>
    </div>
  );
};
