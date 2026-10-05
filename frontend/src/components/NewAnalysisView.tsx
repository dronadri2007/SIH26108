import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  Database,
  FileCode,
  FileText,
  FileUp,
  Layers,
  Loader2,
  Package,
  Scale,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { InputType } from '../types';
import { Badge, Button, Card, IconTile, PageHeader, SectionTitle, Segmented, cx } from './ui';
import type { Tone } from './ui';

interface NewAnalysisViewProps {
  onStartAnalysis: (inputType: InputType, content: string | File, presetKey?: string) => void;
  onBrowseCatalog: () => void;
  isLoading: boolean;
}

const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  onStartAnalysis,
  onBrowseCatalog,
  isLoading
}) => {
  const [activeMode, setActiveMode] = useState<InputType>('TEXT');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Pre-fill realistic domain examples
  const sampleScenarios: Array<{
    key: string;
    sector: string;
    icon: typeof Zap;
    tone: Tone;
    title: string;
    ref: string;
    text: string;
  }> = [
    {
      key: 'case1',
      sector: 'Electrical Safety',
      icon: Zap,
      tone: 'warn',
      title: 'CPWD LV Switchgear & Earthing',
      ref: 'MOP/CPWD/NZ-2026/EL-8942',
      text: 'Supply, installation, testing and commissioning of 415V low-voltage main switchgear panels with 30mA residual current protection and a deep-bore chemical earthing system. Panels shall be factory-built, type-tested assemblies with 50kA short-circuit withstand strength. Earth loop resistance must be below 1.0 Ohm. All wiring in fire-retardant low smoke copper cables.'
    },
    {
      key: 'case2',
      sector: 'High-Barrier Packaging',
      icon: Package,
      tone: 'info',
      title: 'DRDO High-Barrier Meal Ration Pouches',
      ref: 'DRDO/DFRL/RATION/2026/04',
      text: 'Procurement of retortable multi-layer composite pouch packaging for ready-to-eat operational field rations deployed in extreme high-altitude alpine terrain (-40°C to +55°C). Pouches must feature outer biaxially oriented polyamide (nylon) layer, intermediate aluminum barrier foil, and inner food-grade non-migrating polypropylene sealant.'
    },
    {
      key: 'case3',
      sector: 'Marine Infrastructure',
      icon: Building2,
      tone: 'success',
      title: 'JNPA Coastal Wharf Marine Concrete',
      ref: 'JNPA/CIVIL/WHARF/2026/112',
      text: 'Procurement specification for reinforced marine grade M45 design-mix concrete, sulphate-resisting Portland cement, and high-strength corrosion-resistant TMT steel reinforcement bars (Fe 550D) for tidal marine container berth expansion at coastal port.'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMode === 'TEXT') {
      if (!textInput.trim()) return;
      onStartAnalysis('TEXT', textInput);
    } else {
      if (!selectedFile) return;
      onStartAnalysis('DOCUMENT', selectedFile);
    }
  };

  const handleRunPreset = (scenario: typeof sampleScenarios[0]) => {
    setTextInput(scenario.text);
    onStartAnalysis('TEXT', scenario.text, scenario.key);
  };

  const wordCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  const submitDisabled =
    isLoading || (activeMode === 'TEXT' && !textInput.trim()) || (activeMode === 'DOCUMENT' && !selectedFile);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        eyebrow="Procurement intelligence workstation"
        eyebrowIcon={Sparkles}
        title="Analyze a tender specification"
        description="Automated decomposition, statutory candidate retrieval, and clause-level evidence verification for public procurement tenders. Surfaces normative Indian Standards and highlights compliance gaps prior to tender notification."
        meta={<Badge tone="neutral">GFR 2017 Rule 144(iii) Standards-Based Specification</Badge>}
        actions={
          <div className="card flex items-center gap-3.5 pl-4 pr-5 py-3">
            <IconTile icon={Database} tone="brand" />
            <div className="leading-tight">
              <div className="eyebrow">Indexed catalog</div>
              <div className="mt-1 font-heading text-lg font-bold tracking-tight text-slate-900 tabular-nums">450 Standards</div>
              <div className="text-xs font-mono text-slate-500">ETD · CHD · CED</div>
            </div>
          </div>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Input workspace                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Card padded={false}>
        <div className="p-5 sm:p-6 space-y-6">
          {/* Mode selector */}
          <Segmented<InputType>
            value={activeMode}
            onChange={setActiveMode}
            options={[
              {
                value: 'TEXT',
                label: (
                  <>
                    <FileText className="w-4 h-4" />
                    <span className="sm:hidden">Clause text</span>
                    <span className="hidden sm:inline">Specification clause text</span>
                  </>
                ),
              },
              {
                value: 'DOCUMENT',
                label: (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="sm:hidden">Upload document</span>
                    <span className="hidden sm:inline">Upload NIT tender document (PDF / DOCX)</span>
                  </>
                ),
              },
            ]}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* MODE A: TEXTAREA */}
            {activeMode === 'TEXT' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="spec-text-input" className="block font-heading text-base font-semibold tracking-tight text-slate-900">
                    Procurement technical specification
                  </label>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Paste tender description, clause paragraphs, or equipment specs
                  </p>
                </div>

                <textarea
                  id="spec-text-input"
                  rows={7}
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Procure electrical switchgear for industrial distribution panels. The equipment must meet specified safety and testing requirements including power-frequency withstand voltage, thermal limits, and fault containment under relevant Indian Standards..."
                  className="block w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 resize-y transition-all"
                  required
                />

                <div className="flex items-center justify-between gap-3 min-h-8 text-xs text-slate-500">
                  <span className="tabular-nums">
                    {wordCount} {wordCount === 1 ? 'word' : 'words'} · {textInput.length} characters
                  </span>
                  {textInput && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setTextInput('')}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* MODE B: DOCUMENT UPLOAD */}
            {activeMode === 'DOCUMENT' && (
              <div className="space-y-4">
                <div>
                  <div className="font-heading text-base font-semibold tracking-tight text-slate-900">
                    Notice Inviting Tender (NIT) document
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">OCR &amp; Clause Decomposer extracts specifications</p>
                </div>

                {/* Drag and drop zone */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload tender document. Drag and drop a file here, or press Enter to browse files."
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={cx(
                    'rounded-2xl border-2 border-dashed px-6 py-10 sm:py-12 text-center transition-all cursor-pointer',
                    dragActive
                      ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-100'
                      : 'border-slate-300 bg-slate-50/60 hover:border-brand-400 hover:bg-brand-50/50'
                  )}
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      document.getElementById('file-upload-input')?.click();
                    }
                  }}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    tabIndex={-1}
                  />

                  <div className="flex justify-center">
                    <IconTile icon={FileUp} tone="brand" size="lg" />
                  </div>
                  <div className="mt-4 font-heading text-base font-semibold text-slate-900">
                    Drag and drop tender document, or{' '}
                    <span className="text-brand-700 underline underline-offset-4 decoration-brand-300">browse files</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    Accepted formats: PDF, DOCX, TXT. Documents parsed on-premise without third-party cloud leak.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <Badge tone="neutral">Max 25 MB</Badge>
                    <Badge tone="neutral">Clause Traceability (§10)</Badge>
                    <Badge tone="success" icon={ShieldCheck}>Offline Parser</Badge>
                  </div>
                </div>

                {/* File extraction preview */}
                {selectedFile && (
                  <div className="card-soft p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <IconTile icon={FileCode} tone="brand" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">{selectedFile.name}</div>
                        <div className="text-sm text-slate-500">
                          <span className="font-mono text-[13px]">{formatFileSize(selectedFile.size)}</span> · Ready for clause extraction &amp; decomposition
                        </div>
                      </div>
                    </div>
                    <Badge tone="success" icon={Check} className="self-start sm:self-center">Validated document</Badge>
                  </div>
                )}
              </div>
            )}

            {/* Primary action row */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-line-soft">
              <Button type="button" variant="secondary" size="lg" icon={BookOpen} onClick={onBrowseCatalog} className="w-full sm:w-auto">
                Browse BIS Standards (450)
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitDisabled}
                icon={isLoading ? Loader2 : undefined}
                iconRight={isLoading ? undefined : ArrowRight}
                className={cx('w-full sm:w-auto', isLoading && '[&>svg]:animate-spin')}
              >
                {isLoading ? (
                  'Analyzing specifications...'
                ) : (
                  <>
                    <span className="sm:hidden">Analyze &amp; decompose</span>
                    <span className="hidden sm:inline">Analyze requirements &amp; decompose</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Benchmark tenders                                                  */}
      {/* ------------------------------------------------------------------ */}
      {activeMode === 'TEXT' && (
        <section className="space-y-4" aria-labelledby="benchmark-tenders-title">
          <SectionTitle
            icon={Sparkles}
            title={<span id="benchmark-tenders-title">Verified benchmark tenders</span>}
            subtitle="1-click run: load a benchmark spec into the editor, or analyze it straight away."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sampleScenarios.map(sc => (
              <Card key={sc.key} padded={false} className="p-5 flex flex-col gap-4 transition-colors hover:border-brand-200">
                <div className="flex items-start justify-between gap-3">
                  <IconTile icon={sc.icon} tone={sc.tone} />
                  <span className="font-mono text-xs text-slate-500 text-right leading-5 break-all">{sc.ref}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="eyebrow">{sc.sector}</div>
                  <h3 className="font-heading text-base font-semibold leading-snug tracking-tight text-slate-900">{sc.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{sc.text}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-line-soft flex items-center justify-between gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setTextInput(sc.text)}>
                    Load spec
                  </Button>
                  <Button type="button" variant="primary" size="sm" iconRight={ArrowRight} onClick={() => handleRunPreset(sc)}>
                    1-click run
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Credibility strip                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card padded={false} className="p-5 sm:p-6 space-y-3">
          <IconTile icon={Layers} tone="brand" size="sm" />
          <h3 className="font-heading text-base font-semibold tracking-tight text-slate-900">Hybrid retrieval architecture</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            BM25 sparse lexical search combined with local MiniLM dense semantic vectors. Captures exact technical designations and functional intent without LLM hallucination.
          </p>
        </Card>

        <Card padded={false} className="p-5 sm:p-6 space-y-3">
          <IconTile icon={CheckCircle2} tone="success" size="sm" />
          <h3 className="font-heading text-base font-semibold tracking-tight text-slate-900">Normative evidence layer</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Multi-criterion validation across Product Category, Material, Scope, and Key Test Protocols. Every recommendation is backed by verbatim standards citations.
          </p>
        </Card>

        <Card padded={false} className="p-5 sm:p-6 space-y-3">
          <IconTile icon={Scale} tone="saffron" size="sm" />
          <h3 className="font-heading text-base font-semibold tracking-tight text-slate-900">Statutory officer ratification</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The engine generates decision-support evidence. GFR 2017 Rule 144(iii) directs that specifications be based on recognised national standards. The engine only surfaces candidates, so official applicability requires human procurement officer verification.
          </p>
        </Card>
      </div>

      {/* Mandatory statutory notice (§38) */}
      <div className="flex items-center justify-center gap-2.5 rounded-2xl bg-brand-50/70 ring-1 ring-inset ring-brand-100 px-4 py-3 text-sm text-slate-700 text-center">
        <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
        <span>Official applicability: Requires procurement officer verification prior to tender gazette</span>
      </div>
    </div>
  );
};
