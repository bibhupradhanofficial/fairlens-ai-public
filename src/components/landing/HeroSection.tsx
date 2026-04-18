import { ArrowRight, Shield, BarChart3, GitCompare, FileDown, Beaker, Moon, Sun, Clock, Trash2 } from 'lucide-react';
import { Logo } from '@/components/Logo';

// Custom components for missing brand icons in lucide-react v1.8.0
const Github = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ExternalLink = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { getAuditHistory, deleteAudit } from '@/lib/audit-history';
import { useState } from 'react';
import type { SavedAudit } from '@/types/audit';

import { Footer } from './Footer';

interface HeroSectionProps {
  onStartAudit: () => void;
  onTrySample: () => void;
  onLoadAudit: (audit: SavedAudit) => void;
}

export function HeroSection({ onStartAudit, onTrySample, onLoadAudit }: HeroSectionProps) {
  const { theme, toggle } = useTheme();
  const [history, setHistory] = useState(() => getAuditHistory());

  const handleDelete = (id: string) => {
    deleteAudit(id);
    setHistory(getAuditHistory());
  };

  const gradeColor = (grade: string) => {
    if (grade === 'A' || grade === 'B') return 'text-success';
    if (grade === 'C') return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 dark:bg-primary/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Floating Glass Navigation */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <nav className="flex items-center justify-between px-6 py-3 w-full max-w-4xl rounded-full bg-background/60 dark:bg-card/40 backdrop-blur-xl border border-border/50 shadow-glass-dark">
          <div className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
            <Logo className="h-7 text-primary" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9 rounded-full bg-background/50">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={onStartAudit} size="sm" className="rounded-full shadow-glow group">
              Start Audit <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </nav>
      </div>

      <section className="flex-1 flex items-center pt-32 pb-20 relative z-10">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(var(--primary),0.15)] animate-float">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI-Powered Fairness Auditing
              </div>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tighter">
                Detect Bias.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Build Trust.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
                Upload your dataset, and our AI instantly identifies discrimination across gender, race, age, and more — no code required.
              </p>
              <div className="flex flex-wrap gap-5">
                <Button size="lg" onClick={onStartAudit} className="text-base px-8 rounded-full shadow-glow group">
                  Start Free Audit <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 rounded-full bg-background/50 backdrop-blur-md group" onClick={onTrySample}>
                  <Beaker className="mr-2 h-5 w-5 text-primary group-hover:text-white transition-colors" /> Try Sample Data
                </Button>
              </div>
            </div>

            <div className="relative animate-float" style={{ animationDelay: '1s' }}>
              {/* Outer decorative gradient border */}
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-transparent to-blue-500/30 rounded-[2rem] blur-md" />
              <div className="bg-card/80 backdrop-blur-xl rounded-[2rem] border border-border/50 shadow-2xl p-8 space-y-6 relative z-10">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">Sample Audit Preview</h3>
                    <p className="text-xs text-muted-foreground">Real-time fairness analysis</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { metric: 'Demographic Parity', value: 0.72, status: 'fail' as const },
                    { metric: 'Disparate Impact', value: 0.85, status: 'warning' as const },
                    { metric: 'Equal Opportunity', value: 0.95, status: 'pass' as const },
                  ].map((item) => (
                    <div key={item.metric} className="flex items-center justify-between bg-background/50 rounded-xl px-5 py-4 border border-border/30 hover:border-border transition-colors">
                      <span className="text-sm font-semibold">{item.metric}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono tracking-tight">{item.value.toFixed(2)}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.status === 'pass' ? 'bg-success/15 text-success border border-success/30' :
                          item.status === 'warning' ? 'bg-warning/15 text-warning border border-warning/30' :
                            'bg-destructive/15 text-destructive border border-destructive/30'
                          }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/40 rounded-xl p-4 mt-2">
                  <p className="text-sm text-foreground/80 italic font-medium">
                    "Your model is <span className="text-destructive font-bold">28% less likely</span> to approve applicants from minority groups aged 20–30."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit History */}
      {history.length > 0 && (
        <section className="py-20 relative z-10">
          <div className="container max-w-6xl mx-auto px-6">
            <h2 className="font-heading text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="p-2 bg-primary/10 rounded-xl"><Clock className="h-6 w-6 text-primary" /></span> 
              Recent Audits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.slice(0, 6).map((audit) => (
                <div
                  key={audit.id}
                  className="relative group rounded-3xl p-6 bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-glass-dark"
                  onClick={() => onLoadAudit(audit)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm truncate max-w-[180px]">{audit.datasetName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(audit.timestamp).toLocaleDateString()} · {audit.rowCount} rows</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-heading text-xl font-bold ${gradeColor(audit.fairnessGrade)}`}>
                        {audit.fairnessGrade}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); handleDelete(audit.id); }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {audit.passCount}/{audit.metricsCount} metrics passed · Score: {audit.fairnessScore}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section id="features" className="py-24 relative z-10 border-t border-border/10 bg-gradient-to-b from-transparent to-background/5">
        <div className="container max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-4xl font-bold text-center mb-16 tracking-tight">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: FileDown, title: 'Upload CSV', desc: 'Drag & drop your dataset — we handle the rest.' },
              { icon: Shield, title: 'Select Attributes', desc: 'Choose protected groups and outcome columns.' },
              { icon: BarChart3, title: 'AI Analysis', desc: 'Get fairness metrics with plain-language explanations.' },
              { icon: GitCompare, title: 'Compare & Export', desc: 'Before/after comparison and PDF reports.' },
            ].map((f, i) => (
              <div key={f.title} className="text-center space-y-4 group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="border-t border-border/10 py-32 bg-background overflow-hidden relative z-10">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_50%)]" />
        </div>

        <div className="container max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-5 mb-16">
            <h2 className="font-heading text-4xl font-bold tracking-tight">Meet the Developer</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Building tools to ensure AI fairness and transparency for a more equitable digital future.
            </p>
          </div>

          <div className="bg-card/40 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] p-10 md:p-14 shadow-glass-dark flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="flex-1 text-center md:text-left space-y-8 relative z-10">
              <div>
                <h3 className="font-heading text-3xl font-bold">Bibhu Pradhan</h3>
                <p className="text-sm text-primary font-bold tracking-widest uppercase mt-2">Full Stack Developer & AI Enthusiast</p>
              </div>

              <p className="text-muted-foreground leading-relaxed text-lg">
                Passionate about bridging the gap between complex AI systems and ethical implementation.
                I create open-source tools that help developers and organizations audit their datasets
                for bias and ensure their algorithms treat everyone fairly.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <Button variant="outline" size="lg" className="rounded-full gap-2 hover:bg-[#181717] hover:text-white hover:border-[#181717] transition-all duration-300 hover:-translate-y-1" asChild>
                  <a href="https://github.com/bibhupradhanofficial" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5 transition-colors" />
                    GitHub
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all duration-300 hover:-translate-y-1" asChild>
                  <a href="https://www.linkedin.com/in/bibhupradhanofficial/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5 transition-colors" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

