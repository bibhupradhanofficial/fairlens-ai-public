import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { HeroSection } from '@/components/landing/HeroSection';
import { Logo } from '@/components/Logo';
import { FileUpload } from '@/components/audit/FileUpload';
import { ConfigureAudit } from '@/components/audit/ConfigureAudit';

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -15, scale: 0.98, filter: 'blur(8px)' },
};
const pageTransition: Transition = { 
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 1 
};
import { AuditDashboard } from '@/components/audit/AuditDashboard';
import { AnalyzingScreen } from '@/components/audit/AnalyzingScreen';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { computeStatistics } from '@/lib/csv-parser';
import { supabase } from '@/integrations/supabase/client';
import { SAMPLE_DATASET, SAMPLE_AUDIT_CONFIG } from '@/data/sample-dataset';
import { saveAudit, computeFairnessScore, scoreToGrade } from '@/lib/audit-history';
import { decodeAuditFromURL } from '@/lib/share-utils';
import type { DatasetSummary, AuditConfig, AuditResult, AuditStep, SavedAudit } from '@/types/audit';

const Index = () => {
  const [step, setStep] = useState<AuditStep>('landing');
  const [dataset, setDataset] = useState<DatasetSummary | null>(null);
  const [datasetName, setDatasetName] = useState('Dataset');
  const [comparisonDataset, setComparisonDataset] = useState<DatasetSummary | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<AuditResult | null>(null);

  // Check for shared audit in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auditParam = params.get('audit');
    if (auditParam) {
      const decoded = decodeAuditFromURL(auditParam);
      if (decoded) {
        setAuditResult(decoded);
        setStep('results');
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  const handleTrySample = () => {
    setDataset(SAMPLE_DATASET);
    setDatasetName('Sample Lending Dataset');
    setStep('configure');
  };

  const handleLoadAudit = (audit: SavedAudit) => {
    setAuditResult(audit.result);
    setComparisonResult(audit.comparisonResult || null);
    setStep('results');
  };

  const handleRunAudit = async (config: AuditConfig) => {
    if (!dataset) return;
    setStep('analyzing');

    try {
      const positiveValue = config.positiveOutcomeValue ||
        dataset.columns.find(c => c.name === config.targetColumn)?.sampleValues[0] || '1';

      const stats = computeStatistics(dataset.data, config.targetColumn, config.protectedAttributes, positiveValue);

      const { data, error } = await supabase.functions.invoke('audit-bias', {
        body: { statistics: stats },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const score = data.fairnessScore ?? computeFairnessScore(data);
      const grade = data.fairnessGrade ?? scoreToGrade(score);

      const result: AuditResult = {
        ...data,
        groupDistributions: stats.groupDistributions,
        datasetStats: stats,
        fairnessScore: score,
        fairnessGrade: grade,
      };
      setAuditResult(result);

      // Run comparison if available
      let compResult: AuditResult | null = null;
      if (comparisonDataset) {
        const compStats = computeStatistics(comparisonDataset.data, config.targetColumn, config.protectedAttributes, positiveValue);
        const { data: compData, error: compError } = await supabase.functions.invoke('audit-bias', {
          body: { statistics: compStats },
        });
        if (!compError && compData && !compData.error) {
          compResult = {
            ...compData,
            groupDistributions: compStats.groupDistributions,
            datasetStats: compStats,
            fairnessScore: compData.fairnessScore ?? computeFairnessScore(compData),
            fairnessGrade: compData.fairnessGrade ?? scoreToGrade(compData.fairnessScore ?? computeFairnessScore(compData)),
          };
          setComparisonResult(compResult);
        }
      }

      // Save to history
      saveAudit(result, compResult, datasetName);

      setStep('results');
    } catch (e) {
      console.error('Audit failed:', e);
      toast.error(e instanceof Error ? e.message : 'Audit failed. Please try again.');
      setStep('configure');
    }
  };

  const resetAudit = () => {
    setStep('landing');
    setDataset(null);
    setDatasetName('Dataset');
    setComparisonDataset(null);
    setAuditResult(null);
    setComparisonResult(null);
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'landing' && (
        <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
          <HeroSection
            onStartAudit={() => setStep('upload')}
            onTrySample={handleTrySample}
            onLoadAudit={handleLoadAudit}
          />
        </motion.div>
      )}

      {step === 'upload' && (
        <motion.div key="upload" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
          <div className="min-h-screen bg-background relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_60%)] opacity-[0.03] pointer-events-none" />
            <nav className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-background/50 backdrop-blur-3xl sticky top-0 z-50">
              <Button variant="ghost" className="rounded-full" onClick={resetAudit}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Home
              </Button>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-card/50 border border-border/50 rounded-full shadow-sm">
                <Logo className="h-5" showText={false} />
                <span className="font-heading font-semibold text-sm">Upload Dataset</span>
              </div>
              <div className="w-20" />
            </nav>
            <div className="container max-w-2xl mx-auto px-6 py-12 space-y-6">
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-bold">Upload Your Dataset</h1>
                <p className="text-muted-foreground">Upload a CSV file to begin the bias audit.</p>
              </div>
              <FileUpload
                label="Primary Dataset"
                dataset={dataset}
                onParsed={(d) => { setDataset(d); setDatasetName('Uploaded Dataset'); }}
                onClear={() => setDataset(null)}
              />
              {dataset && (
                <div className="flex justify-end">
                  <Button onClick={() => setStep('configure')}>
                    Configure Audit →
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {step === 'configure' && dataset && (
        <motion.div key="configure" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
          <ConfigureAudit
            dataset={dataset}
            comparisonDataset={comparisonDataset}
            onComparisonParsed={setComparisonDataset}
            onClearComparison={() => setComparisonDataset(null)}
            onBack={() => setStep('upload')}
            onRunAudit={handleRunAudit}
          />
        </motion.div>
      )}

      {step === 'analyzing' && (
        <motion.div key="analyzing" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
          <AnalyzingScreen />
        </motion.div>
      )}

      {step === 'results' && auditResult && (
        <motion.div key="results" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
          <AuditDashboard
            result={auditResult}
            comparisonResult={comparisonResult}
            onBack={resetAudit}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
