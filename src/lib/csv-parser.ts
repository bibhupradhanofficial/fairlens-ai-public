import Papa from 'papaparse';
import type { DatasetColumn, DatasetSummary } from '@/types/audit';

export function parseCSV(file: File): Promise<DatasetSummary> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data as Record<string, string | number>[];
        if (!data.length) {
          reject(new Error('CSV file is empty'));
          return;
        }

        const headers = Object.keys(data[0]);
        const columns: DatasetColumn[] = headers.map((name) => {
          const values = data.map((row) => row[name]);
          const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '');
          const uniqueValues = new Set(nonNull.map(String));
          const isNumeric = nonNull.every((v) => typeof v === 'number' || !isNaN(Number(v)));
          const isBoolean = uniqueValues.size <= 2 && [...uniqueValues].every((v) =>
            ['true', 'false', '0', '1', 'yes', 'no'].includes(v.toLowerCase())
          );

          return {
            name,
            type: isBoolean ? 'boolean' : isNumeric ? 'numeric' : 'categorical',
            uniqueValues: uniqueValues.size,
            sampleValues: [...uniqueValues].slice(0, 5),
            nullCount: values.length - nonNull.length,
          };
        });

        resolve({
          rowCount: data.length,
          columnCount: headers.length,
          columns,
          data,
        });
      },
      error: (error) => reject(error),
    });
  });
}

export function computeStatistics(
  data: Record<string, string | number>[],
  targetColumn: string,
  protectedAttributes: string[],
  positiveOutcomeValue: string
) {
  const targetDistribution: Record<string, number> = {};
  data.forEach((row) => {
    const val = String(row[targetColumn] ?? 'null');
    targetDistribution[val] = (targetDistribution[val] || 0) + 1;
  });

  const groupDistributions: Record<string, { group: string; count: number; positiveRate: number; percentage: number }[]> = {};
  const crossTabulations: Record<string, Record<string, { total: number; positive: number; rate: number }>> = {};

  for (const attr of protectedAttributes) {
    const groups: Record<string, { total: number; positive: number }> = {};
    data.forEach((row) => {
      const group = String(row[attr] ?? 'Unknown');
      if (!groups[group]) groups[group] = { total: 0, positive: 0 };
      groups[group].total++;
      if (String(row[targetColumn]) === positiveOutcomeValue) {
        groups[group].positive++;
      }
    });

    groupDistributions[attr] = Object.entries(groups).map(([group, stats]) => ({
      group,
      count: stats.total,
      positiveRate: stats.total > 0 ? stats.positive / stats.total : 0,
      percentage: (stats.total / data.length) * 100,
    }));

    crossTabulations[attr] = {};
    for (const [group, stats] of Object.entries(groups)) {
      crossTabulations[attr][group] = {
        total: stats.total,
        positive: stats.positive,
        rate: stats.total > 0 ? stats.positive / stats.total : 0,
      };
    }
  }

  // Intersectional analysis: combinations of all protected attributes
  const intersectionalGroups: { combination: string; attributes: Record<string, string>; total: number; positive: number; rate: number }[] = [];
  if (protectedAttributes.length >= 2) {
    const combos: Record<string, { attrs: Record<string, string>; total: number; positive: number }> = {};
    data.forEach((row) => {
      const attrs: Record<string, string> = {};
      protectedAttributes.forEach((a) => (attrs[a] = String(row[a] ?? 'Unknown')));
      const key = protectedAttributes.map((a) => `${a}:${attrs[a]}`).join(' × ');
      if (!combos[key]) combos[key] = { attrs, total: 0, positive: 0 };
      combos[key].total++;
      if (String(row[targetColumn]) === positiveOutcomeValue) combos[key].positive++;
    });
    for (const [combination, stats] of Object.entries(combos)) {
      if (stats.total >= 5) { // only groups with meaningful size
        intersectionalGroups.push({
          combination,
          attributes: stats.attrs,
          total: stats.total,
          positive: stats.positive,
          rate: stats.total > 0 ? stats.positive / stats.total : 0,
        });
      }
    }
    intersectionalGroups.sort((a, b) => a.rate - b.rate);
  }

  return {
    rowCount: data.length,
    columnCount: Object.keys(data[0] || {}).length,
    targetColumn,
    protectedAttributes,
    positiveOutcomeValue,
    targetDistribution,
    groupDistributions,
    crossTabulations,
    intersectionalGroups,
  };
}
