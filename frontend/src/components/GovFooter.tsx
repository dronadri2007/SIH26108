import React from 'react';
import { 
  Building2, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Globe 
} from 'lucide-react';
import { AshokaEmblem } from './AshokaEmblem';
import { BisLogo } from './BisLogo';

export const GovFooter: React.FC = () => {
  return (
    <footer className="bg-[#0b3a75] text-white pt-10 pb-6 border-t-4 border-[#f37023] font-sans mt-auto">
      {/* 4-Column Government Grid */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-[#1b4e8c] text-xs">
        
        {/* Col 1: Headquarters & Contact */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg">
              <BisLogo size={36} />
            </div>
            <div>
              <div className="font-hindi font-bold text-amber-300 text-sm">भारतीय मानक ब्यूरो</div>
              <div className="font-bold text-xs uppercase tracking-wider text-white">Bureau of Indian Standards</div>
            </div>
          </div>

          <div className="space-y-2 text-slate-300 text-[11px] pt-1">
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#f37023] shrink-0 mt-0.5" />
              <span>Manak Bhawan, 9 Bahadur Shah Zafar Marg, New Delhi 110002, India</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#f37023] shrink-0" />
              <span>Toll Free Consumer Helpline: 1800-11-4000</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#f37023] shrink-0" />
              <span>Email: standards-intelligence@bis.gov.in</span>
            </p>
          </div>
        </div>

        {/* Col 2: National Government Portals */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-[#1b4e8c] pb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#f37023]" />
            <span>National Portals</span>
          </h4>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li>
              <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                <span>National Portal of India (india.gov.in)</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </li>
            <li>
              <a href="https://consumeraffairs.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                <span>Ministry of Consumer Affairs</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </li>
            <li>
              <a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                <span>Government e-Marketplace (GeM)</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </li>
            <li>
              <a href="https://fssai.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                <span>Food Safety and Standards Authority (FSSAI)</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </li>
            <li>
              <a href="https://nsws.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                <span>National Single Window System (NSWS)</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & GIGW Compliance Policies */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-[#1b4e8c] pb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f37023]" />
            <span>Statutory & Policy Links</span>
          </h4>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li>
              <span className="hover:text-amber-300 cursor-pointer">Rule 144 of General Financial Rules (GFR), 2017</span>
            </li>
            <li>
              <span className="hover:text-amber-300 cursor-pointer">Quality Control Orders (QCO) Gazette Notifications</span>
            </li>
            <li>
              <span className="hover:text-amber-300 cursor-pointer">Website Terms & Hyperlinking Policy</span>
            </li>
            <li>
              <span className="hover:text-amber-300 cursor-pointer">Privacy & Data Governance Policy</span>
            </li>
            <li>
              <span className="hover:text-amber-300 cursor-pointer">GIGW 3.0 Accessibility Compliance Statement</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Hosting & Technical Credits */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-[#1b4e8c] pb-1.5">
            Technology & Infrastructure
          </h4>
          <div className="bg-[#082952] p-3 rounded-lg border border-[#1b4e8c] space-y-2 text-[11px] text-slate-300">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
              <span>National Informatics Centre (NIC)</span>
            </div>
            <p className="text-[10.5px] leading-relaxed">
              Designed, Developed and Hosted by National Informatics Centre (NIC), Ministry of Electronics & IT, Government of India.
            </p>
            <div className="pt-1 border-t border-[#1b4e8c] text-[10px] text-amber-200 font-mono">
              Node: SIH26108 Hybrid Standards Engine
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-300">
        <div>
          © 2026 Bureau of Indian Standards, Government of India. All Rights Reserved.
        </div>
        <div className="flex items-center gap-3 font-mono text-[10.5px]">
          <span>Security Certified: NIC 256-Bit SSL</span>
          <span>•</span>
          <span>Last Updated: 27 September 2026</span>
        </div>
      </div>
    </footer>
  );
};
