import type { AuditResult, SavedAudit } from '@/types/audit';

const STORAGE_KEY = 'ub-audit-history';
const MAX_AUDITS = 20;

export function saveAudit(
  result: AuditResult,
  comparisonResult: AuditResult | null,
  datasetName: string
): SavedAudit {
  const score = computeFairnessScore(result);
  const saved: SavedAudit = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    datasetName,
    rowCount: result.datasetStats.rowCount,
    fairnessScore: score,
    fairnessGrade: scoreToGrade(score),
    metricsCount: result.fairnessMetrics.length,
    passCount: result.fairnessMetrics.filter((m) => m.status === 'pass').length,
    result,
    comparisonResult,
  };

  const history = getAuditHistory();
  history.unshift(saved);
  if (history.length > MAX_AUDITS) history.pop();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // storage full — remove oldest
    history.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  return saved;
}

export function getAuditHistory(): SavedAudit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteAudit(id: string) {
  const history = getAuditHistory().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function computeFairnessScore(result: AuditResult): number {
  if (!result.fairnessMetrics.length) return 50;
  const scores = result.fairnessMetrics.map((m) => {
    if (m.status === 'pass') return 100;
    if (m.status === 'warning') return 60;
    return 20;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 65) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}
