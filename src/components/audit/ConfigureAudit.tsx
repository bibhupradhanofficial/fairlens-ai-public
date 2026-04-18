import { useState } from 'react';
import { ArrowLeft, ArrowRight, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from './FileUpload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DatasetSummary, AuditConfig } from '@/types/audit';

interface ConfigureAuditProps {
  dataset: DatasetSummary;
  comparisonDataset: DatasetSummary | null;
  onComparisonParsed: (d: DatasetSummary) => void;
  onClearComparison: () => void;
  onBack: () => void;
  onRunAudit: (config: AuditConfig) => void;
}

export function ConfigureAudit({
  dataset, comparisonDataset, onComparisonParsed, onClearComparison, onBack, onRunAudit
}: ConfigureAuditProps) {
  const [targetColumn, setTargetColumn] = useState('');
  const [protectedAttrs, setProtectedAttrs] = useState<string[]>([]);
  const [positiveValue, setPositiveValue] = useState('');

  const targetCol = dataset.columns.find((c) => c.name === targetColumn);
  const canRun = targetColumn && protectedAttrs.length > 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_50%)] opacity-[0.05] pointer-events-none" />

      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-background/50 backdrop-blur-3xl sticky top-0 z-50">
        <Button variant="ghost" className="rounded-full" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="font-heading text-lg font-semibold tracking-tight">Configure Audit</h1>
        <div className="w-20" />
      </nav>

      <div className="container max-w-4xl mx-auto px-6 py-10 space-y-12 relative z-10">
        {/* Data Preview */}
        <section className="space-y-4 animate-float" style={{ animationDuration: '8s' }}>
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl"><Settings2 className="h-5 w-5 text-primary" /></div> Data Preview
          </h2>
          <div className="border border-border/50 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm shadow-glass-dark">
            <div className="max-h-72 overflow-auto scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40">
              <Table>
                <TableHeader>
                  <TableRow className="bg-background/50 border-b-border/30 hover:bg-background/50">
                    {dataset.columns.map((c) => (
                      <TableHead key={c.name} className="whitespace-nowrap text-xs font-semibold py-4">
                        {c.name}
                        <span className="ml-1 text-muted-foreground font-mono font-normal">({c.type})</span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataset.data.slice(0, 8).map((row, i) => (
                    <TableRow key={i} className="border-b-border/10 hover:bg-primary/5 transition-colors">
                      {dataset.columns.map((c) => (
                        <TableCell key={c.name} className="text-xs whitespace-nowrap text-muted-foreground py-3">
                          {String(row[c.name] ?? '')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-5 py-3 bg-muted/20 border-t border-border/30 text-xs font-medium text-muted-foreground flex justify-between">
              <span>Preview Mode</span>
              <span>Showing 8 of {dataset.rowCount.toLocaleString()} rows</span>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Target Column */}
          <section className="space-y-5">
            <div>
              <h3 className="font-heading font-bold text-lg">Target Outcome</h3>
              <p className="text-sm text-muted-foreground mt-1">Which column dictates the final decision? (e.g., "approved")</p>
            </div>
            <Select value={targetColumn} onValueChange={(v) => { setTargetColumn(v); setPositiveValue(''); }}>
              <SelectTrigger className="w-full rounded-xl h-12 bg-card/50 backdrop-blur-sm border-border/50 focus:ring-primary shadow-sm hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Select target column..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 shadow-glass-dark backdrop-blur-xl bg-card/80">
                {dataset.columns.map((c) => (
                  <SelectItem key={c.name} value={c.name} className="rounded-lg">
                    {c.name} <span className="text-muted-foreground opacity-50 ml-1">({c.uniqueValues} unique)</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {targetCol && targetCol.uniqueValues <= 20 && (
              <div className="space-y-3 pt-2 animate-in fade-in zoom-in-95 duration-300">
                <p className="text-sm text-muted-foreground font-medium">Which value represents a successful outcome?</p>
                <Select value={positiveValue} onValueChange={setPositiveValue}>
                  <SelectTrigger className="w-full rounded-xl h-12 bg-primary/5 border-primary/20 text-primary font-medium focus:ring-primary shadow-sm hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select positive value..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50 shadow-glass-dark backdrop-blur-xl bg-card/80">
                    {targetCol.sampleValues.map((v) => (
                      <SelectItem key={v} value={v} className="rounded-lg font-medium">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </section>

          {/* Comparison Dataset */}
          <section className="space-y-5">
            <div>
              <h3 className="font-heading font-bold text-lg">Benchmark Comparison</h3>
              <p className="text-sm text-muted-foreground mt-1">Optional. Upload a corrected dataset to compare bias side by side.</p>
            </div>
            <div className="pt-1">
              <FileUpload
                label="Corrected Dataset"
                dataset={comparisonDataset}
                onParsed={onComparisonParsed}
                onClear={onClearComparison}
              />
            </div>
          </section>
        </div>

        {/* Protected Attributes */}
        <section className="space-y-5 border-t border-border/30 pt-10">
          <div>
            <h3 className="font-heading font-bold text-lg">Protected Attributes to Audit</h3>
            <p className="text-sm text-muted-foreground mt-1">Select the groups you want to check for potential bias (e.g., Gender, Race, Age).</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dataset.columns
              .filter((c) => c.name !== targetColumn)
              .map((c) => (
                <label key={c.name} className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${protectedAttrs.includes(c.name) ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.15)] ring-1 ring-primary/20 scale-[1.02]' : 'bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50'}`}>
                  <Checkbox
                    className="rounded-md border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    checked={protectedAttrs.includes(c.name)}
                    onCheckedChange={(checked) => {
                      setProtectedAttrs((prev) =>
                        checked ? [...prev, c.name] : prev.filter((a) => a !== c.name)
                      );
                    }}
                  />
                  <div>
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{c.uniqueValues} values</span>
                  </div>
                </label>
              ))}
          </div>
        </section>

        {/* Run */}
        <div className="flex justify-end pt-10 border-t border-border/30">
          <Button size="lg" disabled={!canRun} className="rounded-full shadow-glow group px-10 h-14 text-base font-bold" onClick={() => onRunAudit({
            targetColumn,
            protectedAttributes: protectedAttrs,
            positiveOutcomeValue: positiveValue || undefined,
          })}>
            Initiate AI Audit <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
