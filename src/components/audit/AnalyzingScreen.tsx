import { Shield, Loader2 } from 'lucide-react';

export function AnalyzingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Shield className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold">Analyzing Your Dataset</h2>
          <p className="text-muted-foreground">
            Our AI is computing fairness metrics, detecting disparities, and generating recommendations...
          </p>
        </div>
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
      </div>
    </div>
  );
}
