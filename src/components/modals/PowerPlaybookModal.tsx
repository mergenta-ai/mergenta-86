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
  Recycle
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
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Decision Making Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Compare, weigh, and choose between multiple options.</p>
                  <div className="flex justify-center">
                    <Target className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Strategy Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Shape long-term direction with clarity and focus.</p>
                  <div className="flex justify-center">
                    <Compass className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <RefreshCw className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Change Management Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Navigate transitions and overcome resistance smoothly.</p>
                  <div className="flex justify-center">
                    <RefreshCw className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Product Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Turn ideas into market-ready products step by step.</p>
                  <div className="flex justify-center">
                    <Package className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Handshake className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Negotiation Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Bargain, persuade, and close with confidence.</p>
                  <div className="flex justify-center">
                    <Handshake className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Leadership Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Inspire teams, align stakeholders, and lead with impact.</p>
                  <div className="flex justify-center">
                    <Users className="h-12 w-12 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Learning & Knowledge */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Learning & Knowledge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Learning & Education Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Build effective study and lifelong learning habits.</p>
                  <div className="flex justify-center">
                    <BookOpen className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Skills Development Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Identify gaps and accelerate skill mastery.</p>
                  <div className="flex justify-center">
                    <TrendingUp className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Research & Knowledge Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Gather, analyse, and synthesise information better.</p>
                  <div className="flex justify-center">
                    <Search className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Academic Success Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Boost performance with proven academic strategies.</p>
                  <div className="flex justify-center">
                    <GraduationCap className="h-12 w-12 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Finance & Money */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Finance & Money</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Finance & Money Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Master personal and business financial basics.</p>
                  <div className="flex justify-center">
                    <DollarSign className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Investment Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Plan and grow wealth through smart investing.</p>
                  <div className="flex justify-center">
                    <TrendingUp className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PiggyBank className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Wealth Building Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Design strategies to increase long-term assets.</p>
                  <div className="flex justify-center">
                    <PiggyBank className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Risk & Insurance Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Protect finances with risk analysis and coverage.</p>
                  <div className="flex justify-center">
                    <Shield className="h-12 w-12 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Life & Guidance */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Life & Guidance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Personal Growth Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Discover strengths and unlock personal potential.</p>
                  <div className="flex justify-center">
                    <Heart className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Family & Relationships Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Strengthen bonds and resolve conflicts at home.</p>
                  <div className="flex justify-center">
                    <Home className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Compass className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Life Guidance Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Find clarity in everyday challenges and crossroads.</p>
                  <div className="flex justify-center">
                    <Compass className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Scale className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Ethics & Values Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Align decisions with principles that matter most.</p>
                  <div className="flex justify-center">
                    <Scale className="h-12 w-12 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Communication */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Media & Communication</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Megaphone className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Media & PR Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Manage reputation and craft persuasive stories.</p>
                  <div className="flex justify-center">
                    <Megaphone className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Branding Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Build memorable and trustworthy brand identities.</p>
                  <div className="flex justify-center">
                    <Palette className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Communication Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Express ideas clearly across audiences and formats.</p>
                  <div className="flex justify-center">
                    <MessageSquare className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Marketing Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Design campaigns that connect and convert.</p>
                  <div className="flex justify-center">
                    <Zap className="h-12 w-12 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Productivity & Systems */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Productivity & Systems</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckSquare className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Productivity & Workflow Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Organise tasks and optimise daily execution.</p>
                  <div className="flex justify-center">
                    <CheckSquare className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Time Management Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Prioritise and make the most of each hour.</p>
                  <div className="flex justify-center">
                    <Clock className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Systems & Automation Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Automate tasks and design efficient systems.</p>
                  <div className="flex justify-center">
                    <Settings className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCheck className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Collaboration Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Enhance teamwork and manage group dynamics.</p>
                  <div className="flex justify-center">
                    <UserCheck className="h-12 w-12 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Health & Wellbeing */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Health & Wellbeing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Health & Wellness Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Adopt routines that keep body and mind balanced.</p>
                  <div className="flex justify-center">
                    <Activity className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Mental Resilience Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Handle stress and bounce back from setbacks.</p>
                  <div className="flex justify-center">
                    <Brain className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Apple className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Healthy Nutrition Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Fuel energy and focus with better eating habits.</p>
                  <div className="flex justify-center">
                    <Apple className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Mindfulness Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Stay present and centred in daily life.</p>
                  <div className="flex justify-center">
                    <Leaf className="h-12 w-12 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Travel & Lifestyle */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-dark-grey">Travel & Lifestyle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Travel & Lifestyle Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Plan journeys and enrich everyday living.</p>
                  <div className="flex justify-center">
                    <MapPin className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Cultural Exploration Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Learn from diverse traditions and perspectives.</p>
                  <div className="flex justify-center">
                    <Globe className="h-12 w-12 text-white/60" />
                  </div>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow aspect-square flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Recycle className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Sustainable Living Playbook</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-1">Adopt eco-conscious habits in work and life.</p>
                  <div className="flex justify-center">
                    <Recycle className="h-12 w-12 text-white/60" />
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