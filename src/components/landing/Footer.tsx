import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';

// Custom components for missing brand icons in lucide-react v1.8.0
const Github = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background relative overflow-hidden border-t border-border/10">
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mb-64 pointer-events-none animate-pulse-glow" />

      <div className="container max-w-6xl mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 shadow-glass-dark border border-border/50 grid grid-cols-1 md:grid-cols-12 gap-16 mb-20 relative overflow-hidden group">
          {/* Subtle inner hover glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Logo and Info */}
          <div className="md:col-span-4 space-y-6 relative z-10">
            <div className="flex items-center gap-2 group/logo transition-transform hover:scale-[1.02] duration-300 w-fit cursor-pointer">
              <div className="p-2 bg-primary/10 rounded-xl group-hover/logo:bg-primary/20 transition-colors">
                 <Logo className="h-7 text-primary" showText={false} />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-foreground">FairLens AI</span>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xs">
              Leading the way in ethical AI by uncovering hidden biases and ensuring algorithmic transparency for everyone.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-5">
              <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-white">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Features</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Case Studies</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> API Docs</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Pricing</a></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-white">Legal & Trust</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Terms of Service</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Security Center</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> GDPR Compliance</a></li>
              </ul>
            </div>

            <div className="space-y-5 col-span-2 sm:col-span-1">
              <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-white">Support</h4>
              <ul className="space-y-3">
                <li><a href="mailto:support@fairlens.ai" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Help Desk</a></li>
                <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> Community</a></li>
                <li className="pt-4">
                  <Button variant="outline" size="sm" className="w-full justify-center rounded-xl font-medium transition-all shadow-sm focus-visible:ring-primary">
                    Send Feedback
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
            <p className="text-sm font-medium text-muted-foreground">
              © {currentYear} FairLens AI. All rights reserved.
            </p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="text-xs text-muted-foreground/60 flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-full border border-border/50">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(var(--success),0.5)]" />
              Global Infrastructure Operational
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            Built with precision by <a href="https://www.linkedin.com/in/bibhupradhanofficial/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-all underline decoration-primary/20 underline-offset-4 hover:decoration-primary">Bibhu Pradhan</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

