import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";
import { 
  X, 
  Briefcase, 
  Target, 
  RefreshCw, 
  Package, 
  Handshake, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Search, 
  GraduationCap,
  DollarSign,
  PiggyBank,
  Wallet,
  Shield,
  Heart,
  Home,
  Compass,
  Scale,
  Megaphone,
  Palette,
  MessageSquare,
  Zap,
  CheckSquare,
  Clock,
  Settings,
  UserCheck,
  Activity,
  Brain,
  Apple,
  Leaf,
  MapPin,
  Globe,
  Recycle,
  Trophy,
  Navigation,
  Rocket
} from "lucide-react";

// Custom DialogContent without automatic close button - same as SnapshotModal
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

interface PowerPlaybookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat?: (message: string, response: string) => void;
}

export const PowerPlaybookModal = ({ open, onOpenChange, onAddToChat }: PowerPlaybookModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent 
        className="fixed inset-0 w-screen h-screen max-w-none max-h-none m-0 p-0 rounded-none border-none z-[100]"
        style={{ 
          backgroundColor: '#F3E1F3',
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100vw', 
          height: '100vh',
          transform: 'none'
        }}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
        >
          <X className="h-5 w-5 text-mergenta-dark-grey" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-12 pb-8">
          <h1 className="text-4xl font-bold text-mergenta-dark-grey mb-4">Power Playbook</h1>
          <p className="text-lg text-mergenta-dark-grey/80 max-w-2xl text-center">
            Discover powerful workflows and strategies to enhance your productivity and creativity
          </p>
        </div>

        {/* Content area for tiles with scroll */}
        <div className="flex-1 px-12 pb-12 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Business & Professional */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Business & Professional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-500/90 to-purple-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '0ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Target className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Decision Making Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Compare, weigh, and choose between multiple options.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600/90 to-purple-800/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Compass className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Strategy Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Shape long-term direction with clarity and focus.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-700/90 to-purple-900/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <RefreshCw className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Change Management Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Navigate transitions and overcome resistance smoothly.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-500/90 to-pink-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Package className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Product Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Turn ideas into market-ready products step by step.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600/90 to-pink-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Handshake className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Negotiation Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Bargain, persuade, and close with confidence.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-700/90 to-pink-800/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '500ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Users className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Leadership Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Inspire teams, align stakeholders, and lead with impact.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning & Knowledge */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Learning & Knowledge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-pink-500/90 to-purple-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '600ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <BookOpen className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Learning & Education Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Build effective study and lifelong learning habits.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-600/90 to-purple-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '700ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Trophy className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Skills Development Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Identify gaps and accelerate skill mastery.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-700/90 to-purple-800/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '800ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Search className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Research & Knowledge Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Gather, analyse, and synthesise information better.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-500/90 to-purple-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '900ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <GraduationCap className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Academic Success Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Boost performance with proven academic strategies.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Finance & Money */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Finance & Money</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-800/90 to-pink-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-800/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1000ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <DollarSign className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Finance & Money Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Master personal and business financial basics.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600/90 to-pink-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1100ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <TrendingUp className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Investment Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Plan and grow wealth through smart investing.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-700/90 to-pink-800/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1200ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <PiggyBank className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Wealth Building Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Design strategies to increase long-term assets.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-500/90 to-pink-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1300ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Shield className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Risk & Insurance Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Protect finances with risk analysis and coverage.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Life & Guidance */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Life & Guidance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-pink-600/90 to-purple-500/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1400ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Rocket className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Personal Growth Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Discover strengths and unlock personal potential.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-700/90 to-purple-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1500ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Home className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Family & Relationships Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Strengthen bonds and resolve conflicts at home.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-800/90 to-purple-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-800/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1600ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Navigation className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Life Guidance Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Find clarity in everyday challenges and crossroads.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-500/90 to-purple-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1700ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Scale className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Ethics & Values Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Align decisions with principles that matter most.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Communication */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Media & Communication</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-500/90 to-pink-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1800ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Megaphone className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Media & PR Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Manage reputation and craft persuasive stories.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600/90 to-pink-800/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '1900ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Palette className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Branding Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Build memorable and trustworthy brand identities.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-700/90 to-pink-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2000ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <MessageSquare className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Communication Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Express ideas clearly across audiences and formats.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-800/90 to-pink-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-800/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2100ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Zap className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Marketing Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Design campaigns that connect and convert.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Productivity & Systems */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Productivity & Systems</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-pink-600/90 to-purple-800/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2200ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <CheckSquare className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Productivity & Workflow Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Organise tasks and optimise daily execution.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-700/90 to-purple-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2300ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Clock className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Time Management Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Prioritise and make the most of each hour.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-800/90 to-purple-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-800/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2400ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Settings className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Systems & Automation Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Automate tasks and design efficient systems.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-500/90 to-purple-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2500ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <UserCheck className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Collaboration Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Enhance teamwork and manage group dynamics.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health & Wellbeing */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Health & Wellbeing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600/90 to-pink-500/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2600ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Activity className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Health & Wellness Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Adopt routines that keep body and mind balanced.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-700/90 to-pink-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2700ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Brain className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Mental Resilience Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Handle stress and bounce back from setbacks.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-800/90 to-pink-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-800/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2800ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Apple className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Healthy Nutrition Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Fuel energy and focus with better eating habits.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-500/90 to-pink-800/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '2900ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Leaf className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Mindfulness Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Stay present and centred in daily life.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel & Lifestyle */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Travel & Lifestyle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-pink-600/90 to-purple-500/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-600/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '3000ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <MapPin className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Travel & Lifestyle Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Plan journeys and enrich everyday living.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-700/90 to-purple-600/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-700/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '3100ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Globe className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Cultural Exploration Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Learn from diverse traditions and perspectives.</p>
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-pink-800/90 to-purple-700/90 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-[1.02] hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-pink-800/20 aspect-square flex flex-col p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '3200ms' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-center mb-6">
                      <Recycle className="h-16 w-16 text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 text-center leading-tight">Sustainable Living Playbook</h3>
                    <p className="text-white/70 text-sm text-center flex-1 leading-relaxed">Adopt eco-conscious habits in work and life.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};