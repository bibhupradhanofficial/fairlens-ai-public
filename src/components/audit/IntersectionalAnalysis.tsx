import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IntersectionalGroup } from '@/types/audit';

interface IntersectionalAnalysisProps {
  groups: IntersectionalGroup[];
  findings?: string;
}

export function IntersectionalAnalysis({ groups, findings }: IntersectionalAnalysisProps) {
  if (!groups.length) return null;

  const maxRate = Math.max(...groups.map((g) => g.rate));
  const sorted = [...groups].sort((a, b) => a.rate - b.rate);

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Intersectional Bias Analysis</h2>

      {findings && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm leading-relaxed whitespace-pre-line">{findings}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Positive Outcome Rate by Group Combination</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {sorted.map((g) => {
              const pct = maxRate > 0 ? (g.rate / maxRate) * 100 : 0;
              const rateColor =
                g.rate < 0.3 ? 'bg-destructive' :
                g.rate < 0.5 ? 'bg-warning' :
                'bg-success';

              return (
                <div key={g.combination} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-48 shrink-0 truncate" title={g.combination}>
                    {g.combination}
                  </span>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${rateColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-mono w-20 text-right">
                    {(g.rate * 100).toFixed(1)}% ({g.positive}/{g.total})
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
