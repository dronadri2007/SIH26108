export type SectorType = 'Electrical Safety' | 'Packaging Materials' | 'Construction & Building Materials';

export interface Sector {
  sector_id: number;
  name: SectorType;
  code: string;
  description: string;
  technical_committees: string[];
  total_standards: number;
}

export type StandardStatus = 'CURRENT' | 'UNKNOWN' | 'AMENDED' | 'REVISED';

export interface Standard {
  standard_id: string;
  number: string;
  title: string;
  technical_committee: string;
  sector_id: number;
  sector_name?: SectorType;
  scope_text: string;
  status: StandardStatus;
  source_url?: string;
  curated_at: string;
  key_test_methods?: string[];
  mandatory_certification?: boolean;
}

export type RelationshipType = 'PRIMARY' | 'SUPPORTING' | 'TERMINOLOGY' | 'SAFETY' | 'INFERRED';

export interface AlliedRelationship {
  relationship_id: string;
  standard_id: string;
  related_id: string;
  relationship_type: RelationshipType;
  is_inferred: boolean;
  rationale: string;
  created_at: string;
}

export type InputType = 'TEXT' | 'DOCUMENT';
export type QueryStatus = 'IDLE' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface ProductProfile {
  profile_id: string;
  query_id: string;
  product: string;
  category: string;
  material: string;
  intended_use: string;
  technical_requirements: string[];
  safety_requirements: string[];
  quantity: string;
  tender_reference?: string;
  department?: string;
}

export type RequirementType = 'PRODUCT' | 'MATERIAL' | 'SAFETY' | 'TESTING' | 'PERFORMANCE' | 'TERMINOLOGY';

export interface Requirement {
  requirement_id: string;
  query_id: string;
  requirement_type: RequirementType;
  requirement_text: string;
  source_span: string; // The tender text this was extracted from (traceability anchor)
}

export type EvidenceCriterion = 
  | 'PRODUCT_CATEGORY' 
  | 'MATERIAL' 
  | 'INTENDED_USE' 
  | 'SCOPE' 
  | 'TEST_REQUIREMENT';

export interface EvidenceItem {
  evidence_id: string;
  candidate_id?: string;
  criterion: EvidenceCriterion;
  criterion_label: string;
  matched: boolean;
  rationale: string;
}

export interface Recommendation {
  recommendation_id: string;
  query_id: string;
  standard_id: string;
  standard: Standard;
  relationship_type: RelationshipType;
  semantic_relevance: number; // 0 - 100
  bm25_relevance: number;
  vector_relevance: number;
  evidence_match_count: number;
  evidence_match_total: number;
  official_applicability: 'REQUIRES_OFFICER_VERIFICATION';
  justification: string;
  rank: number;
  evidence: EvidenceItem[];
  allied_standards?: Standard[];
}

export interface WhyNotCandidate {
  why_not_id: string;
  query_id: string;
  standard_id: string;
  standard: Standard;
  shared_traits: string[];
  differing_traits: string[];
  rejection_text: string;
  near_miss_score: number;
  crucial_mismatch: string;
}

export type RiskType = 
  | 'MISSING_MATERIAL_SPEC' 
  | 'MISSING_TEST_METHOD' 
  | 'AMBIGUOUS_SAFETY_REQUIREMENT' 
  | 'UNMEASURABLE_PERFORMANCE_REQUIREMENT' 
  | 'OTHER';

export type RiskSeverity = 'HIGH' | 'MEDIUM' | 'ADVISORY';

export interface SpecificationRisk {
  risk_id: string;
  query_id: string;
  requirement_id?: string;
  requirement_ref?: string;
  risk_type: RiskType;
  severity: RiskSeverity;
  title: string;
  description: string;
  recommended_remedy: string;
  suggested_clause: string;
}

export interface CoverageMatrixCell {
  covered: boolean;
  standard_id: string;
  evidence_passes: boolean;
  match_confidence: number;
}

export interface CoverageMatrixData {
  query_id: string;
  requirements: Requirement[];
  standards: Standard[];
  // requirement_id -> standard_id -> CoverageMatrixCell
  cells: Record<string, Record<string, CoverageMatrixCell>>;
  gap_count: number;
  gaps: Requirement[];
  coverage_percentage: number;
}

export type PipelineStage = 
  | 'EXTRACTION' 
  | 'DECOMPOSITION' 
  | 'RETRIEVAL' 
  | 'RERANKING' 
  | 'EVIDENCE_VALIDATION' 
  | 'CLASSIFICATION' 
  | 'RECOMMENDATION' 
  | 'WHY_NOT' 
  | 'RISK_DETECTION';

export interface AuditLogEntry {
  log_id: number;
  query_id: string;
  stage: PipelineStage;
  stage_name: string;
  model: 'claude-haiku-4.5' | 'claude-sonnet-4.5' | 'all-MiniLM-L6-v2 (Local)' | 'Postgres tsvector (BM25)';
  payload: Record<string, any>;
  duration_ms: number;
  created_at: string;
  status: 'SUCCESS' | 'WARNING';
}

export interface FeedbackSubmission {
  recommendation_id: string;
  relevant: boolean;
  reason?: 'WRONG_PRODUCT' | 'WRONG_MATERIAL' | 'WRONG_APPLICATION' | 'OUTDATED' | 'OTHER';
  officer_notes?: string;
  submitted_at: string;
}

export interface GraphNode {
  id: string;
  number: string;
  title: string;
  sector_id: number;
  sector_name: SectorType;
  technical_committee: string;
  is_center?: boolean;
  relationship_to_center?: RelationshipType;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship_type: RelationshipType;
  is_inferred: boolean;
  rationale: string;
}

export interface StandardsGraph {
  center_standard_id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface QueryRecord {
  query_id: string;
  input_type: InputType;
  raw_text: string;
  source_filename?: string;
  submitted_at: string;
  status: QueryStatus;
  profile?: ProductProfile;
  requirements?: Requirement[];
  recommendations?: Recommendation[];
  coverage_matrix?: CoverageMatrixData;
  risks?: SpecificationRisk[];
  why_not?: WhyNotCandidate[];
  audit_logs?: AuditLogEntry[];
}

export type OfficerRole = 'EVALUATION_OFFICER' | 'TECHNICAL_COMMITTEE_CHAIR' | 'AUDITOR' | 'ADMIN';

export interface OfficerUser {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  role: OfficerRole;
  security_clearance: string;
  avatar_initials: string;
  last_login?: string;
}

