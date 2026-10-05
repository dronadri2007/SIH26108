import type { RelationshipType, RequirementType, RiskSeverity } from '../../types';

/**
 * Relationship colours for the dashboard's small part-to-whole bars and node dots.
 * Steps were checked with the dataviz palette validator (light surface, adjacent pairs):
 * lightness band, chroma floor, CVD separation, normal-vision floor and 3:1 contrast all pass.
 * Identity is never colour-only: every dot or segment sits next to its text label.
 */
export const REL_META: Record<RelationshipType, { label: string; color: string }> = {
  PRIMARY: { label: 'Primary', color: '#4262f2' },
  SAFETY: { label: 'Safety', color: '#e11d48' },
  SUPPORTING: { label: 'Supporting', color: '#0f9f8f' },
  TERMINOLOGY: { label: 'Terminology', color: '#0369a1' },
  INFERRED: { label: 'Inferred', color: '#d97706' },
};

export const REL_ORDER: RelationshipType[] = ['PRIMARY', 'SAFETY', 'SUPPORTING', 'TERMINOLOGY', 'INFERRED'];

export const REQ_TYPE_LABEL: Record<RequirementType, string> = {
  PRODUCT: 'Product',
  MATERIAL: 'Material',
  SAFETY: 'Safety',
  TESTING: 'Testing',
  PERFORMANCE: 'Performance',
  TERMINOLOGY: 'Terminology',
};

export const SEVERITY_META: Record<RiskSeverity, { label: string; tone: 'danger' | 'warn' | 'info' }> = {
  HIGH: { label: 'High', tone: 'danger' },
  MEDIUM: { label: 'Medium', tone: 'warn' },
  ADVISORY: { label: 'Advisory', tone: 'info' },
};

/** Status colours (state, not identity). Always shown with an icon and a label. */
export const STATUS = {
  done: '#059669',
  partial: '#d97706',
  todo: '#e2e8f0',
};

/** A covered cell below this confidence is drawn as a partial match. */
export const PARTIAL_BELOW = 70;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
