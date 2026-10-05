import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Scale,
  Send,
  X,
  XCircle,
} from 'lucide-react';
import { Recommendation, FeedbackSubmission } from '../types';
import { api } from '../api';
import { Backdrop, Button, IconTile, cx } from './ui';
import { RelationshipBadge } from './ResultsView';

interface FeedbackModalProps {
  recommendation: Recommendation | null;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

const inputBase =
  'w-full rounded-xl border border-line bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  recommendation,
  onClose,
  onSubmitSuccess
}) => {
  const [relevant, setRelevant] = useState<boolean>(true);
  const [reason, setReason] = useState<'WRONG_PRODUCT' | 'WRONG_MATERIAL' | 'WRONG_APPLICATION' | 'OUTDATED' | 'OTHER'>('WRONG_APPLICATION');
  const [officerNotes, setOfficerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isOpen = Boolean(recommendation);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!recommendation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submission: FeedbackSubmission = {
      recommendation_id: recommendation.recommendation_id,
      relevant,
      reason: relevant ? undefined : reason,
      officer_notes: officerNotes,
      submitted_at: new Date().toISOString()
    };

    await api.submitFeedback(submission);
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      onSubmitSuccess?.();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="feedback-modal-title">
      <Backdrop onClick={onClose} />

      <div className="relative z-50 w-full max-w-lg max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl animate-pop overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-line-soft flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
              <Scale className="w-3.5 h-3.5" />
              Officer review &amp; statutory record
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h2 id="feedback-modal-title" className="font-mono text-lg font-bold text-slate-900">
                {recommendation.standard.number}
              </h2>
              <RelationshipBadge type={recommendation.relationship_type} />
            </div>
            <p className="text-sm leading-relaxed text-slate-500">{recommendation.standard.title}</p>
          </div>

          <Button variant="ghost" size="md" icon={X} onClick={onClose} aria-label="Close" title="Close" className="w-10 px-0! shrink-0 -mr-2 -mt-1" />
        </div>

        {submitted ? (
          <div className="px-6 sm:px-7 py-12 flex flex-col items-center text-center gap-3">
            <IconTile icon={CheckCircle2} tone="success" size="lg" />
            <h3 className="font-heading text-lg font-semibold text-slate-900">Officer review recorded</h3>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              Applicability determination successfully added to the query audit ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-6 space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold text-slate-800">Officer applicability determination</legend>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRelevant(true)}
                    aria-pressed={relevant}
                    className={cx(
                      'min-h-[3.5rem] px-4 py-3 rounded-2xl border-2 text-sm font-semibold flex items-center gap-3 text-left transition-all cursor-pointer',
                      relevant
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-4 ring-emerald-500/10'
                        : 'bg-white border-line text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    <CheckCircle2 className={cx('w-5 h-5 shrink-0', relevant ? 'text-emerald-600' : 'text-slate-400')} />
                    <span>Applicable standard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRelevant(false)}
                    aria-pressed={!relevant}
                    className={cx(
                      'min-h-[3.5rem] px-4 py-3 rounded-2xl border-2 text-sm font-semibold flex items-center gap-3 text-left transition-all cursor-pointer',
                      !relevant
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                        : 'bg-white border-line text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    <XCircle className={cx('w-5 h-5 shrink-0', !relevant ? 'text-rose-600' : 'text-slate-400')} />
                    <span>Not applicable / inaccurate</span>
                  </button>
                </div>
              </fieldset>

              {!relevant && (
                <div className="animate-fade-in">
                  <label htmlFor="feedback-reason" className="text-sm font-semibold text-slate-800">
                    Primary reason for disqualification
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="feedback-reason"
                      value={reason}
                      onChange={e => setReason(e.target.value as any)}
                      className={cx(inputBase, 'h-11 appearance-none pr-10 cursor-pointer')}
                    >
                      <option value="WRONG_APPLICATION">WRONG_APPLICATION (Different environment/operational scope)</option>
                      <option value="WRONG_PRODUCT">WRONG_PRODUCT (Applies to a divergent product line)</option>
                      <option value="WRONG_MATERIAL">WRONG_MATERIAL (Material grade mismatch)</option>
                      <option value="OUTDATED">OUTDATED (Superseded by newer statutory revision)</option>
                      <option value="OTHER">OTHER (Specified in Officer Notes)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="feedback-notes" className="text-sm font-semibold text-slate-800">
                  Officer justification / procurement notes
                </label>
                <textarea
                  id="feedback-notes"
                  rows={4}
                  placeholder="Enter remarks, tender committee resolution details, or reference numbers..."
                  value={officerNotes}
                  onChange={e => setOfficerNotes(e.target.value)}
                  className={cx(inputBase, 'mt-2 py-3 leading-relaxed resize-y min-h-[6rem]')}
                />
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 ring-1 ring-inset ring-amber-200 px-4 py-3.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[13px] leading-relaxed text-amber-900">
                  Submission updates the query audit ledger. The model will not auto-retrain live, preserving statutory audit trail stability.
                </p>
              </div>
            </div>

            <div className="px-6 sm:px-7 py-4 border-t border-line-soft bg-slate-50/70 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
              <Button type="button" variant="secondary" size="md" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" icon={Send} disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? 'Recording...' : 'Submit officer review'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
