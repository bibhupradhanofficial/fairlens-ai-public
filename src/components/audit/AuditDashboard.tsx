import { ArrowLeft, Download, FileText, BarChart3, Brain, Lightbulb, GitCompare, Share2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';
import { FairnessScoreGauge } from './FairnessScoreGauge';
import { GroupDrillDown } from './GroupDrillDown';
import { IntersectionalAnalysis } from './IntersectionalAnalysis';
import type { AuditResult } from '@/types/audit';
import { exportAuditPDF, exportMetricsCSV } from '@/lib/export-utils';
import { encodeAuditToURL } from '@/lib/share-utils';

interface AuditDashboardProps {
  result: AuditResult;
  comparisonResult: AuditResult | null;
  onBack: () => void;
}

function MetricGauge({ metric }: { metric: AuditResult['fairnessMetrics'][0] }) {
  const pct = Math.min(Math.max(metric.value, 0), 1) * 100;
  const isPass = metric.status === 'pass';
  const isWarning = metric.status === 'warning';
  
  const bgColors = isPass ? 'bg-success/5 border-success/20' : isWarning ? 'bg-warning/5 border-warning/20' : 'bg-destructive/5 border-destructive/20';
  const barColor = isPass ? 'bg-success' : isWarning ? 'bg-warning' : 'bg-destructive';
  const textColor = isPass ? 'text-success' : isWarning ? 'text-warning' : 'text-destructive';

  return (
    <div className={`p-6 border rounded-3xl space-y-4 backdrop-blur-md shadow-glass-dark transition-all duration-500 hover:shadow-glow hover:-translate-y-1 relative overflow-hidden group ${bgColors}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full blur-[30px] -mr-10 -mt-10 pointer-events-none group-hover:scale-150 transition-transform duration-700" style={{ color: `var(--${textColor.split('-')[1]})` }} />
      <div className="flex items-center justify-between relative z-10">
        <span className="text-sm font-semibold tracking-tight">{metric.name}</span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase shadow-sm ${
          isPass ? 'bg-success/20 text-success' :
          isWarning ? 'bg-warning/20 text-warning' :
          'bg-destructive/20 text-destructive'
        }`}>
          {metric.status}
        </span>
      </div>
      <div className="flex items-end gap-2 relative z-10">
        <span className={`text-4xl font-heading font-black tracking-tighter ${textColor} drop-shadow-sm`}>{metric.value.toFixed(3)}</span>
        <span className="text-xs text-muted-foreground mb-1.5 font-medium">/ {metric.threshold.toFixed(2)} limit</span>
      </div>
      <div className="h-2.5 bg-background/60 rounded-full overflow-hidden border border-border/10 relative z-10">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} style={{ width: `${pct}%`, boxShadow: '0 0 10px currentColor' }} />
      </div>
      <p className="text-xs text-muted-foreground/80 leading-relaxed relative z-10">{metric.description}</p>
    </div>
  );
}

export function AuditDashboard({ result, comparisonResult, onBack }: AuditDashboardProps) {
  const { theme, toggle } = useTheme();

  const handleShare = () => {
    const url = encodeAuditToURL(result);
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_50%)] opacity-[0.04] pointer-events-none" />
      
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/20 sticky top-0 bg-background/50 backdrop-blur-3xl z-50">
        <Button variant="ghost" className="rounded-full" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> New Audit
        </Button>
        <h1 className="font-heading text-lg font-semibold tracking-tight">Audit Results</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9 rounded-full bg-card/50 border border-border/50 shadow-sm">
            {theme === 'dark' ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => exportMetricsCSV(result)}>
            <FileText className="h-4 w-4 mr-1" /> CSV
          </Button>
          <Button size="sm" className="rounded-full shadow-glow" onClick={() => exportAuditPDF(result)}>
            <Download className="h-4 w-4 mr-1" /> PDF
          </Button>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto px-6 py-10 space-y-12 relative z-10">
        {/* Fairness Score */}
        {result.fairnessScore != null && result.fairnessGrade && (
          <FairnessScoreGauge score={result.fairnessScore} grade={result.fairnessGrade} />
        )}

        {/* Dataset Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Rows Processed', value: result.datasetStats.rowCount.toLocaleString() },
            { label: 'Columns Analyzed', value: result.datasetStats.columnCount },
            { label: 'Target Outcome', value: result.datasetStats.targetColumn },
            { label: 'Protected Attrs', value: result.datasetStats.protectedAttributes.length },
          ].map((s) => (
            <Card key={s.label} className="bg-card/40 backdrop-blur-sm border-border/50 shadow-glass-dark rounded-[2rem] hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">{s.label}</p>
                <p className="text-2xl font-heading font-bold text-foreground drop-shadow-sm">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Summary */}
        <Card className="border-primary/20 bg-primary/5 rounded-[2.5rem] shadow-glass-dark relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] -mr-32 -mt-32 pointer-events-none" />
          <CardHeader className="pb-3 border-b border-primary/10 pl-8 pt-8">
            <CardTitle className="text-lg flex items-center gap-2 font-heading font-bold tracking-tight text-primary">
              <Brain className="h-6 w-6" /> Executive AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pl-8 pr-8 pb-8">
            <p className="text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground/90 font-medium">{result.summary}</p>
          </CardContent>
        </Card>

        {/* Fairness Metrics */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Fairness Metrics
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {result.fairnessMetrics.map((m) => (
              <MetricGauge key={m.name} metric={m} />
            ))}
          </div>
        </section>

        {/* Per-Group Drill-Down */}
        <GroupDrillDown
          groupDistributions={result.groupDistributions}
          protectedAttributes={result.datasetStats.protectedAttributes}
        />

        {/* Intersectional Analysis */}
        {result.datasetStats.intersectionalGroups && result.datasetStats.intersectionalGroups.length > 0 && (
          <IntersectionalAnalysis
            groups={result.datasetStats.intersectionalGroups}
            findings={result.intersectionalFindings}
          />
        )}

        {/* Before/After Comparison */}
        {comparisonResult && (
          <section className="space-y-6 pt-4">
            <h2 className="font-heading text-xl font-bold flex items-center gap-2 tracking-tight">
              <div className="p-2 bg-primary/10 rounded-xl"><GitCompare className="h-5 w-5 text-primary" /></div> Benchmark Comparison
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {result.fairnessMetrics.map((original) => {
                const corrected = comparisonResult.fairnessMetrics.find((m) => m.name === original.name);
                if (!corrected) return null;
                const delta = corrected.value - original.value;
                const improved = (original.status !== 'pass' && corrected.status === 'pass') || delta > 0;
                return (
                  <div key={original.name} className={`border rounded-[2rem] p-6 space-y-4 shadow-glass-dark bg-card/40 backdrop-blur-md relative overflow-hidden ${improved ? 'border-success/20' : 'border-destructive/20'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-current opacity-5" style={{ color: improved ? 'var(--success)' : 'var(--destructive)' }} />
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-sm font-semibold">{original.name}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${improved ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                        {delta > 0 ? '+' : ''}{delta.toFixed(3)} {improved ? '↑' : '↓'}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm relative z-10 pt-2">
                      <div className="flex-1 p-3 bg-background/50 rounded-xl border border-border/10">
                        <span className="text-muted-foreground text-[10px] uppercase tracking-widest block mb-1">Before Target</span>
                        <span className="font-mono font-medium text-lg">{original.value.toFixed(3)}</span>
                      </div>
                      <div className="flex-1 p-3 bg-background/50 rounded-xl border border-border/10">
                        <span className="text-muted-foreground text-[10px] uppercase tracking-widest block mb-1">After Correction</span>
                        <span className="font-mono font-medium text-lg">{corrected.value.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Feature Importance */}
        {result.featureImportance.length > 0 && (
          <section className="space-y-6 pt-4">
            <h2 className="font-heading text-xl font-bold tracking-tight">Feature Influence</h2>
            <div className="space-y-3 p-6 border rounded-[2rem] shadow-glass-dark bg-card/40 backdrop-blur-md border-border/50">
              {result.featureImportance.map((f) => (
                <div key={f.feature} className="flex items-center gap-4 p-4 border border-border/30 rounded-xl hover:bg-background/40 transition-colors">
                  <span className="text-sm font-semibold w-40 shrink-0">{f.feature}</span>
                  <div className="flex-1 h-2.5 bg-background/80 rounded-full overflow-hidden border border-border/20 shadow-inner">
                    <div className="h-full bg-primary rounded-full shadow-[0_0_8px_currentColor]" style={{ width: `${Math.min(f.influence * 100, 100)}%` }} />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground w-28 text-right uppercase tracking-wider">{f.direction}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        <section className="space-y-6 pt-4">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2 tracking-tight">
            <div className="p-2 bg-warning/10 rounded-xl"><Lightbulb className="h-5 w-5 text-warning align-middle" /></div> Mitigation Recommendations
          </h2>
          <div className="space-y-4">
            {result.recommendations.map((rec, i) => (
              <Card key={i} className="rounded-[2rem] shadow-glass-dark border-border/50 bg-card/40 backdrop-blur-md overflow-hidden hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full shrink-0 tracking-widest border ${
                      rec.impact === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      rec.impact === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-muted/50 text-muted-foreground border-border/50'
                    }`}>
                      {rec.impact.toUpperCase()}
                    </span>
                    <div>
                      <h4 className="font-semibold text-base">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground/90 mt-2 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
