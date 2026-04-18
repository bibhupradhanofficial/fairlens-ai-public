import LZString from 'lz-string';
import type { AuditResult } from '@/types/audit';

export function encodeAuditToURL(result: AuditResult): string {
  // Slim down to essential data for sharing
  const slim = {
    s: result.summary,
    fm: result.fairnessMetrics.map((m) => ({
      n: m.name,
      v: m.value,
      t: m.threshold,
      st: m.status,
      d: m.description,
    })),
    fi: result.featureImportance.slice(0, 5),
    r: result.recommendations.map((r) => ({ t: r.title, d: r.description, i: r.impact })),
    ds: {
      rc: result.datasetStats.rowCount,
      cc: result.datasetStats.columnCount,
      tc: result.datasetStats.targetColumn,
      pa: result.datasetStats.protectedAttributes,
    },
    fs: result.fairnessScore,
    fg: result.fairnessGrade,
  };

  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(slim));
  return `${window.location.origin}/?audit=${compressed}`;
}

export function decodeAuditFromURL(param: string): AuditResult | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(param);
    if (!json) return null;
    const slim = JSON.parse(json);

    return {
      summary: slim.s,
      fairnessMetrics: slim.fm.map((m: any) => ({
        name: m.n,
        value: m.v,
        threshold: m.t,
        status: m.st,
        description: m.d,
      })),
      featureImportance: slim.fi,
      recommendations: slim.r.map((r: any) => ({ title: r.t, description: r.d, impact: r.i })),
      groupDistributions: {},
      datasetStats: {
        rowCount: slim.ds.rc,
        columnCount: slim.ds.cc,
        targetColumn: slim.ds.tc,
        protectedAttributes: slim.ds.pa,
        positiveOutcomeValue: '',
        targetDistribution: {},
        groupDistributions: {},
        crossTabulations: {},
      },
      fairnessScore: slim.fs,
      fairnessGrade: slim.fg,
    };
  } catch {
    return null;
  }
}
