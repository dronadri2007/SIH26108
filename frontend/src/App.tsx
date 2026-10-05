import React, { useState } from 'react';
import { OfficerUser, Recommendation, Standard, InputType, QueryRecord, Requirement, FeedbackSubmission } from './types';
import { PRESET_QUERIES } from './mockData';
import { api } from './api';

// Extracted Modular Components
import { AppTopBar } from './components/AppTopBar';
import { AppSidebar, MainNavView } from './components/AppSidebar';
import { DossierOverview } from './components/DossierOverview';
import { ResultsView } from './components/ResultsView';
import { RequirementDecompositionView } from './components/RequirementDecompositionView';
import { CoverageMatrix } from './components/CoverageMatrix';
import { RiskPanel } from './components/RiskPanel';
import { WhyNotPanel } from './components/WhyNotPanel';
import { ComparisonTable } from './components/ComparisonTable';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { AuditPanel } from './components/AuditPanel';
import { CatalogBrowser } from './components/CatalogBrowser';
import { NewAnalysisView } from './components/NewAnalysisView';
import { AnalysisHistoryView } from './components/AnalysisHistoryView';
import { ProcessingPipelineView } from './components/ProcessingPipelineView';
import { LoginPage, PRESET_OFFICERS } from './components/LoginPage';
import { AboutPage } from './components/AboutPage';

// Modals and Drawers
import { EvidencePanel } from './components/EvidencePanel';
import { FeedbackModal } from './components/FeedbackModal';
import { TenderDocumentDrawer } from './components/TenderDocumentDrawer';
import { SystemStatusModal } from './components/SystemStatusModal';
import { DocumentationModal } from './components/DocumentationModal';

export const App: React.FC = () => {
  // 1. Flow: About -> Login -> Workspace. The officer session is not restored
  // automatically, so the About and Login pages are always the front door.
  // Dev-only shortcut for design review: /?view=results&case=case2 jumps into the workspace.
  // import.meta.env.DEV is false in production builds, so this cannot ship.
  const devParams = import.meta.env.DEV ? new URLSearchParams(window.location.search) : null;
  const devView = devParams?.get('view') as MainNavView | null;
  const devCase = devParams?.get('case');
  const [stage, setStage] = useState<'about' | 'login' | 'app'>(devView ? 'app' : 'about');
  const [currentUser, setCurrentUser] = useState<OfficerUser | null>(devView ? PRESET_OFFICERS[0] : null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // 2. Navigation & Primary View State
  const [currentView, setCurrentView] = useState<MainNavView>(devView || 'overview');
  const [selectedPreset, setSelectedPreset] = useState<string>(devCase && PRESET_QUERIES[devCase] ? devCase : 'case1');
  const [currentQuery, setCurrentQuery] = useState<QueryRecord>(devCase && PRESET_QUERIES[devCase] ? PRESET_QUERIES[devCase] : PRESET_QUERIES.case1);
  const [graphCenterId, setGraphCenterId] = useState<string>(
    (devCase && PRESET_QUERIES[devCase]?.recommendations?.[0]?.standard_id) || 'std-is-61439-2'
  );

  // 3. Processing Pipeline Synchronization State (Single-Clock Flow)
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingResult, setPendingResult] = useState<QueryRecord | null>(null);
  // Officer review marks on the overview queue, keyed by `${query_id}:${itemId}`
  const [reviewedItems, setReviewedItems] = useState<Record<string, boolean>>({});

  // 4. Officer Verification State (specifications per GFR Rule 144(iii))
  const [isOfficerEndorsed, setIsOfficerEndorsed] = useState(false);
  const [endorsementTimestamp, setEndorsementTimestamp] = useState('');

  // 5. Accessibility & Language State
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'small'>('normal');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  // 6. Drawers & Modals State
  const [activeEvidenceRec, setActiveEvidenceRec] = useState<Recommendation | null>(null);
  const [feedbackRec, setFeedbackRec] = useState<Recommendation | null>(null);
  const [isTenderDrawerOpen, setIsTenderDrawerOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedReqFilter, setSelectedReqFilter] = useState<{ id: string; text: string } | null>(null);

  // User Authentication Handlers
  const handleLogin = (officer: OfficerUser) => {
    setCurrentUser(officer);
    setStage('app');
    setCurrentView('overview');
    window.scrollTo({ top: 0 });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsNavOpen(false);
    setStage('login');
    window.scrollTo({ top: 0 });
  };

  // Accessibility Controls
  const handleFontSizeChange = (size: 'normal' | 'large' | 'small') => {
    setFontSize(size);
    document.documentElement.style.fontSize = size === 'large' ? '18px' : size === 'small' ? '14px' : '16px';
  };

  const handleToggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    if (!isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  // Switch Benchmark Preset Dossier
  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    setIsOfficerEndorsed(false);
    setEndorsementTimestamp('');
    setSelectedReqFilter(null);
    if (PRESET_QUERIES[key]) {
      setCurrentQuery(PRESET_QUERIES[key]);
      if (PRESET_QUERIES[key].recommendations?.[0]) {
        setGraphCenterId(PRESET_QUERIES[key].recommendations![0].standard_id);
      }
    }
    setCurrentView('overview');
  };

  // Toggle Statutory Ratification
  const handleToggleEndorsement = () => {
    if (!isOfficerEndorsed) {
      const now = new Date();
      const formatted = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST`;
      setEndorsementTimestamp(formatted);
      setIsOfficerEndorsed(true);
    } else {
      setIsOfficerEndorsed(false);
      setEndorsementTimestamp('');
    }
  };

  // Start Deterministic Analysis Pipeline
  const handleAnalyze = async (inputType: InputType, content: string | File, presetKey?: string) => {
    setIsProcessing(true);
    try {
      const res = await api.submitQuery(inputType, content, presetKey || selectedPreset);
      setPendingResult(res);
    } catch (err) {
      console.error('Analysis failed:', err);
      setIsProcessing(false);
    }
  };

  // Synchronized callback from ProcessingPipelineView when all stages finish
  const handleProcessingComplete = () => {
    if (pendingResult) {
      setCurrentQuery(pendingResult);
      if (pendingResult.recommendations?.[0]) {
        setGraphCenterId(pendingResult.recommendations[0].standard_id);
      }
      setPendingResult(null);
    }
    setIsOfficerEndorsed(false);
    setEndorsementTimestamp('');
    setSelectedReqFilter(null);
    setIsProcessing(false);
    setCurrentView('overview');
  };

  // Contextual Navigation Handlers
  const handleOpenGraphForStandard = (standardId: string) => {
    setGraphCenterId(standardId);
    setCurrentView('graph');
  };

  const handleOpenEvidenceForStandard = (standard: Standard) => {
    const found = currentQuery.recommendations?.find((r: Recommendation) => r.standard_id === standard.standard_id);
    if (found) {
      setActiveEvidenceRec(found);
    } else {
      const fallbackRec: Recommendation = {
        recommendation_id: `cand-${standard.standard_id}`,
        query_id: currentQuery.query_id,
        standard_id: standard.standard_id,
        standard,
        relationship_type: 'SUPPORTING',
        semantic_relevance: 78.5,
        bm25_relevance: 75,
        vector_relevance: 82,
        evidence_match_count: 4,
        evidence_match_total: 5,
        official_applicability: 'REQUIRES_OFFICER_VERIFICATION',
        justification: `Standard ${standard.number} referenced in catalog under committee ${standard.technical_committee}.`,
        rank: 99,
        evidence: [
          {
            evidence_id: 'ev-1',
            criterion: 'PRODUCT_CATEGORY',
            criterion_label: 'Product Category Alignment',
            matched: true,
            rationale: 'Covers category specifications in official scope text.'
          },
          {
            evidence_id: 'ev-2',
            criterion: 'MATERIAL',
            criterion_label: 'Material Composition Match',
            matched: true,
            rationale: 'Standard establishes material grade criteria.'
          },
          {
            evidence_id: 'ev-3',
            criterion: 'INTENDED_USE',
            criterion_label: 'Intended Operating Environment',
            matched: true,
            rationale: 'Applies to commercial and industrial installation environments.'
          },
          {
            evidence_id: 'ev-4',
            criterion: 'SCOPE',
            criterion_label: 'Scope Exclusions Check',
            matched: true,
            rationale: 'Requisition parameters do not fall under standard exclusion boundaries.'
          },
          {
            evidence_id: 'ev-5',
            criterion: 'TEST_REQUIREMENT',
            criterion_label: 'Testing Protocol Verification',
            matched: false,
            rationale: 'Specialized thermal testing specified in separate companion standard.'
          }
        ]
      };
      setActiveEvidenceRec(fallbackRec);
    }
  };

  const handleSelectReqForFilter = (reqId: string, reqText: string) => {
    setSelectedReqFilter({ id: reqId, text: reqText });
    setCurrentView('results');
  };

  // Export Executive Audit CSV
  const handleExportCsv = () => {
    if (!currentQuery?.recommendations) return;
    const headers = ['Standard Code', 'Title', 'Technical Committee', 'Role', 'Relevance Score', 'Mandatory QCO'];
    const rows = currentQuery.recommendations.map((r: Recommendation) => [
      `"${r.standard.number}"`,
      `"${r.standard.title.replace(/"/g, '""')}"`,
      `"${r.standard.technical_committee}"`,
      `"${r.relationship_type}"`,
      `"${r.semantic_relevance.toFixed(1)}%"`,
      `"${r.standard.mandatory_certification ? 'Mandatory' : 'Voluntary'}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((e: string[]) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BIS_Audit_${currentQuery.profile?.tender_reference || 'Dossier'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metric aggregates
  const gapCount = currentQuery.coverage_matrix?.gap_count ?? 0;
  const riskCount = currentQuery.risks?.length ?? 0;
  const standardsCount = currentQuery.recommendations?.length ?? 0;

  // Front door: About, then Login
  if (stage === 'about') {
    return <AboutPage onEnter={() => { setStage('login'); window.scrollTo({ top: 0 }); }} />;
  }
  if (stage === 'login' || !currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => { setStage('about'); window.scrollTo({ top: 0 }); }}
      />
    );
  }

  return (
    <div className="h-screen flex workspace-bg text-slate-900 font-sans overflow-hidden">

      {/* Left navigation (drawer below lg) */}
      <AppSidebar
        currentView={currentView}
        onNavigate={(view) => { setCurrentView(view); setIsNavOpen(false); }}
        hasActiveAnalysis={Boolean(currentQuery)}
        activeProfile={currentQuery?.profile}
        gapCount={gapCount}
        riskCount={riskCount}
        standardsCount={standardsCount}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSystemStatus={() => { setIsStatusModalOpen(true); setIsNavOpen(false); }}
        onOpenDocumentation={() => { setIsDocModalOpen(true); setIsNavOpen(false); }}
        onOpenAbout={() => { setStage('about'); window.scrollTo({ top: 0 }); }}
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <AppTopBar
          currentView={currentView}
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          currentUser={currentUser}
          onLogout={handleLogout}
          fontSize={fontSize}
          onChangeFontSize={handleFontSizeChange}
          isHighContrast={isHighContrast}
          onToggleContrast={handleToggleContrast}
          language={language}
          onToggleLanguage={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
          onOpenNav={() => setIsNavOpen(true)}
        />

        {/* Scrollable content viewport */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-10 space-y-8 animate-view" key={isProcessing ? 'processing' : currentView}>

            {/* View Router */}
            {isProcessing ? (
              <ProcessingPipelineView
                onComplete={handleProcessingComplete}
                sourceText={currentQuery?.profile?.product}
                result={pendingResult}
                filename={PRESET_QUERIES[selectedPreset]?.source_filename || 'Pasted tender text'}
              />
            ) : (
              <>
                {currentView === 'overview' && (
                  <DossierOverview
                    query={currentQuery}
                    officerName={currentUser.name}
                    filename={PRESET_QUERIES[selectedPreset]?.source_filename || currentQuery?.source_filename}
                    isOfficerEndorsed={isOfficerEndorsed}
                    endorsementTimestamp={endorsementTimestamp}
                    onToggleEndorsement={handleToggleEndorsement}
                    onNavigate={(view) => setCurrentView(view)}
                    onOpenTenderDrawer={() => setIsTenderDrawerOpen(true)}
                    onExportCsv={handleExportCsv}
                    onOpenEvidence={(rec) => setActiveEvidenceRec(rec)}
                    reviewed={reviewedItems}
                    onToggleReviewed={(key) => setReviewedItems(prev => ({ ...prev, [key]: !prev[key] }))}
                  />
                )}

                {currentView === 'results' && (
                  <ResultsView
                    recommendations={currentQuery?.recommendations || []}
                    onOpenGraph={handleOpenGraphForStandard}
                    onOpenFeedback={(rec) => setFeedbackRec(rec)}
                    onOpenEvidenceDrawer={(rec) => setActiveEvidenceRec(rec)}
                    onOpenWhyNot={() => setCurrentView('whynot')}
                    onOpenCompare={() => setCurrentView('compare')}
                    selectedReqId={selectedReqFilter?.id}
                    selectedReqText={selectedReqFilter?.text}
                    onClearReqFilter={() => setSelectedReqFilter(null)}
                  />
                )}

                {currentView === 'requirements' && (
                  <RequirementDecompositionView
                    requirements={currentQuery?.requirements || []}
                    recommendations={currentQuery?.recommendations || []}
                    onSelectRequirementFilter={handleSelectReqForFilter}
                  />
                )}

                {currentView === 'coverage' && currentQuery?.coverage_matrix && (
                  <CoverageMatrix
                    data={currentQuery.coverage_matrix}
                    onSelectStandard={handleOpenGraphForStandard}
                  />
                )}

                {currentView === 'risks' && (
                  <RiskPanel
                    risks={currentQuery?.risks || []}
                  />
                )}

                {currentView === 'whynot' && (
                  <WhyNotPanel
                    whyNotCandidates={currentQuery?.why_not || []}
                    primaryRecommendations={currentQuery?.recommendations || []}
                  />
                )}

                {currentView === 'compare' && (
                  <ComparisonTable
                    recommendations={currentQuery?.recommendations || []}
                    onOpenEvidence={(rec) => setActiveEvidenceRec(rec)}
                    onOpenGraph={handleOpenGraphForStandard}
                  />
                )}

                {currentView === 'graph' && (
                  <KnowledgeGraphView
                    initialStandardId={graphCenterId}
                    onSelectStandard={(stdId: string) => setGraphCenterId(stdId)}
                  />
                )}

                {currentView === 'audit' && (
                  <AuditPanel
                    auditLogs={currentQuery?.audit_logs || []}
                  />
                )}

                {currentView === 'catalog' && (
                  <CatalogBrowser
                    onOpenGraph={handleOpenGraphForStandard}
                    onSelectStandard={handleOpenEvidenceForStandard}
                  />
                )}

                {currentView === 'new_analysis' && (
                  <NewAnalysisView
                    onStartAnalysis={handleAnalyze}
                    onBrowseCatalog={() => setCurrentView('catalog')}
                    isLoading={isProcessing}
                  />
                )}

                {currentView === 'history' && (
                  <AnalysisHistoryView
                    onLoadDossier={(key: 'case1' | 'case2' | 'case3') => handleSelectPreset(key)}
                    onNewAnalysis={() => setCurrentView('new_analysis')}
                  />
                )}
              </>
            )}

          </div>

          {/* Footer */}
          <footer className="max-w-[1240px] w-full mx-auto px-4 sm:px-8 pb-8">
            <div className="pt-5 border-t border-slate-200/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>Prototype for Smart India Hackathon 2026 · Problem SIH26108</div>
              <div>Decision support only. Officer verification required.</div>
            </div>
          </footer>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONTEXTUAL DRAWERS & MODALS                                            */}
      {/* ========================================================================= */}
      {activeEvidenceRec && (
        <EvidencePanel
          recommendation={activeEvidenceRec}
          isOpen={Boolean(activeEvidenceRec)}
          onClose={() => setActiveEvidenceRec(null)}
          onOpenFeedback={(rec) => {
            setActiveEvidenceRec(null);
            setFeedbackRec(rec);
          }}
          onOpenGraph={(stdId: string) => {
            setActiveEvidenceRec(null);
            handleOpenGraphForStandard(stdId);
          }}
        />
      )}

      {feedbackRec && (
        <FeedbackModal
          recommendation={feedbackRec}
          onClose={() => setFeedbackRec(null)}
        />
      )}

      <TenderDocumentDrawer
        isOpen={isTenderDrawerOpen}
        onClose={() => setIsTenderDrawerOpen(false)}
        rawText={currentQuery?.raw_text || ''}
        requirements={currentQuery?.requirements || []}
        profile={currentQuery?.profile}
      />

      <SystemStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      <DocumentationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />

    </div>
  );
};

export default App;
