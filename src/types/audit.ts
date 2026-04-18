export interface DatasetColumn {
  name: string;
  type: 'numeric' | 'categorical' | 'boolean' | 'unknown';
  uniqueValues: number;
  sampleValues: string[];
  nullCount: number;
}

export interface DatasetSummary {
  rowCount: number;
  columnCount: number;
  columns: DatasetColumn[];
  data: Record<string, string | number>[];
}

export interface GroupDistribution {
  group: string;
  count: number;
  positiveRate: number;
  percentage: number;
}

export interface FairnessMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'pass' | 'warning' | 'fail';
  description: string;
}

export interface AuditConfig {
  targetColumn: string;
  protectedAttributes: string[];
  positiveOutcomeValue?: string;
}

export interface DatasetStatistics {
  rowCount: number;
  columnCount: number;
  targetColumn: string;
  protectedAttributes: string[];
  positiveOutcomeValue: string;
  targetDistribution: Record<string, number>;
  groupDistributions: Record<string, GroupDistribution[]>;
  crossTabulations: Record<string, Record<string, { total: number; positive: number; rate: number }>>;
  intersectionalGroups?: IntersectionalGroup[];
}

export interface IntersectionalGroup {
  combination: string;
  attributes: Record<string, string>;
  total: number;
  positive: number;
  rate: number;
}

export interface AuditResult {
  summary: string;
  fairnessMetrics: FairnessMetric[];
  groupDistributions: Record<string, GroupDistribution[]>;
  featureImportance: { feature: string; influence: number; direction: string }[];
  recommendations: { title: string; description: string; impact: 'high' | 'medium' | 'low' }[];
  datasetStats: DatasetStatistics;
  fairnessScore?: number;
  fairnessGrade?: string;
  intersectionalFindings?: string;
}

export interface SavedAudit {
  id: string;
  timestamp: number;
  datasetName: string;
  rowCount: number;
  fairnessScore: number;
  fairnessGrade: string;
  metricsCount: number;
  passCount: number;
  result: AuditResult;
  comparisonResult?: AuditResult | null;
}

export type AuditStep = 'landing' | 'upload' | 'configure' | 'analyzing' | 'results';
