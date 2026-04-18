interface FairnessScoreGaugeProps {
  score: number;
  grade: string;
}

export function FairnessScoreGauge({ score, grade }: FairnessScoreGaugeProps) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score / 100) * circumference;

  const gradeColor =
    grade === 'A' ? 'text-success' :
    grade === 'B' ? 'text-success' :
    grade === 'C' ? 'text-warning' :
    grade === 'D' ? 'text-warning' :
    'text-destructive';

  const strokeColor =
    grade === 'A' || grade === 'B' ? 'hsl(152,60%,40%)' :
    grade === 'C' || grade === 'D' ? 'hsl(38,92%,50%)' :
    'hsl(0,72%,51%)';

  return (
    <div className="flex items-center gap-6 p-6 border rounded-2xl bg-card">
      <div className="relative w-36 h-36 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70" cy="70" r="60"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
          />
          <circle
            cx="70" cy="70" r="60"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-heading text-3xl font-bold ${gradeColor}`}>{grade}</span>
          <span className="text-sm text-muted-foreground">{score}/100</span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold">Fairness Score</h3>
        <p className="text-sm text-muted-foreground">
          {score >= 90 ? 'Excellent — minimal bias detected across all metrics.' :
           score >= 80 ? 'Good — minor disparities detected in some areas.' :
           score >= 65 ? 'Fair — noticeable bias in several metrics requires attention.' :
           score >= 50 ? 'Poor — significant bias detected that needs remediation.' :
           'Critical — severe bias detected across multiple metrics.'}
        </p>
      </div>
    </div>
  );
}
