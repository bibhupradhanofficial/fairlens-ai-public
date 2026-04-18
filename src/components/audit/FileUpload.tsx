import { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCSV } from '@/lib/csv-parser';
import type { DatasetSummary } from '@/types/audit';

interface FileUploadProps {
  label: string;
  onParsed: (summary: DatasetSummary) => void;
  dataset: DatasetSummary | null;
  onClear: () => void;
}

export function FileUpload({ label, onParsed, dataset, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return;
    }
    setError(null);
    setParsing(true);
    try {
      const summary = await parseCSV(file);
      onParsed(summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse CSV');
    } finally {
      setParsing(false);
    }
  }, [onParsed]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (dataset) {
    return (
      <div className="border border-border/50 rounded-2xl p-5 bg-card/60 backdrop-blur-sm shadow-glass-dark group transition-all duration-300 hover:border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-heading font-semibold text-base">{label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                <span className="font-mono">{dataset.rowCount.toLocaleString()}</span> rows &middot; <span className="font-mono">{dataset.columnCount}</span> columns
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClear} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground ml-1">{label}</label>
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
          isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border/60 bg-card/30 hover:bg-card/60 hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.csv';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFile(file);
          };
          input.click();
        }}
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
           <Upload className={`h-8 w-8 transition-colors ${parsing ? 'text-primary animate-pulse' : 'text-primary/70'}`} />
        </div>
        <p className="text-base font-semibold">
          {parsing ? 'Parsing Document...' : 'Drop CSV here or click to upload'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">Supports high-volume .csv files</p>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
