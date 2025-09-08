import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
          backgroundColor: 'hsl(var(--power-playbook-bg))',
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
          <h1 className="text-4xl font-bold text-mergenta-deep-violet mb-4">Power Playbook</h1>
          <p className="text-lg text-mergenta-dark-grey max-w-2xl text-center">
            Discover powerful workflows and strategies to enhance your productivity and creativity
          </p>
        </div>

        {/* Content area for tiles */}
        <div className="flex-1 px-12 pb-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Business & Professional */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-deep-violet">Business & Professional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Decision Making Playbook</h3>
                  <p className="text-white/80 text-sm">Compare, weigh, and choose between multiple options.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Strategy Playbook</h3>
                  <p className="text-white/80 text-sm">Shape long-term direction with clarity and focus.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Change Management Playbook</h3>
                  <p className="text-white/80 text-sm">Navigate transitions and overcome resistance smoothly.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Product Playbook</h3>
                  <p className="text-white/80 text-sm">Turn ideas into market-ready products step by step.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Negotiation Playbook</h3>
                  <p className="text-white/80 text-sm">Bargain, persuade, and close with confidence.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Leadership Playbook</h3>
                  <p className="text-white/80 text-sm">Inspire teams, align stakeholders, and lead with impact.</p>
                </div>
              </div>
            </div>

            {/* Learning & Knowledge */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-deep-violet">Learning & Knowledge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Learning & Education Playbook</h3>
                  <p className="text-white/80 text-sm">Build effective study and lifelong learning habits.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Skills Development Playbook</h3>
                  <p className="text-white/80 text-sm">Identify gaps and accelerate skill mastery.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Research & Knowledge Playbook</h3>
                  <p className="text-white/80 text-sm">Gather, analyse, and synthesise information better.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Academic Success Playbook</h3>
                  <p className="text-white/80 text-sm">Boost performance with proven academic strategies.</p>
                </div>
              </div>
            </div>

            {/* Finance & Money */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-deep-violet">Finance & Money</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Finance & Money Playbook</h3>
                  <p className="text-white/80 text-sm">Master personal and business financial basics.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Investment Playbook</h3>
                  <p className="text-white/80 text-sm">Plan and grow wealth through smart investing.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Wealth Building Playbook</h3>
                  <p className="text-white/80 text-sm">Design strategies to increase long-term assets.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Risk & Insurance Playbook</h3>
                  <p className="text-white/80 text-sm">Protect finances with risk analysis and coverage.</p>
                </div>
              </div>
            </div>

            {/* Life & Guidance */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-deep-violet">Life & Guidance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Personal Growth Playbook</h3>
                  <p className="text-white/80 text-sm">Discover strengths and unlock personal potential.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Family & Relationships Playbook</h3>
                  <p className="text-white/80 text-sm">Strengthen bonds and resolve conflicts at home.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Life Guidance Playbook</h3>
                  <p className="text-white/80 text-sm">Find clarity in everyday challenges and crossroads.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Ethics & Values Playbook</h3>
                  <p className="text-white/80 text-sm">Align decisions with principles that matter most.</p>
                </div>
              </div>
            </div>

            {/* Media & Communication */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-deep-violet">Media & Communication</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Media & PR Playbook</h3>
                  <p className="text-white/80 text-sm">Manage reputation and craft persuasive stories.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Branding Playbook</h3>
                  <p className="text-white/80 text-sm">Build memorable and trustworthy brand identities.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Communication Playbook</h3>
                  <p className="text-white/80 text-sm">Express ideas clearly across audiences and formats.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Marketing Playbook</h3>
                  <p className="text-white/80 text-sm">Design campaigns that connect and convert.</p>
                </div>
              </div>
            </div>

            {/* Productivity & Systems */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-deep-violet">Productivity & Systems</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Productivity & Workflow Playbook</h3>
                  <p className="text-white/80 text-sm">Organise tasks and optimise daily execution.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Time Management Playbook</h3>
                  <p className="text-white/80 text-sm">Prioritise and make the most of each hour.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Systems & Automation Playbook</h3>
                  <p className="text-white/80 text-sm">Automate tasks and design efficient systems.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Collaboration Playbook</h3>
                  <p className="text-white/80 text-sm">Enhance teamwork and manage group dynamics.</p>
                </div>
              </div>
            </div>

            {/* Health & Wellbeing */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-deep-violet">Health & Wellbeing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Health & Wellness Playbook</h3>
                  <p className="text-white/80 text-sm">Adopt routines that keep body and mind balanced.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Mental Resilience Playbook</h3>
                  <p className="text-white/80 text-sm">Handle stress and bounce back from setbacks.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Healthy Nutrition Playbook</h3>
                  <p className="text-white/80 text-sm">Fuel energy and focus with better eating habits.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Mindfulness Playbook</h3>
                  <p className="text-white/80 text-sm">Stay present and centred in daily life.</p>
                </div>
              </div>
            </div>

            {/* Travel & Lifestyle */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-mergenta-deep-violet">Travel & Lifestyle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Travel & Lifestyle Playbook</h3>
                  <p className="text-white/80 text-sm">Plan journeys and enrich everyday living.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Cultural Exploration Playbook</h3>
                  <p className="text-white/80 text-sm">Learn from diverse traditions and perspectives.</p>
                </div>
                <div className="group cursor-pointer bg-gradient-to-br from-mergenta-deep-violet to-mergenta-dark-grey rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-elegant hover:shadow-glow">
                  <h3 className="text-lg font-semibold text-white mb-2">Sustainable Living Playbook</h3>
                  <p className="text-white/80 text-sm">Adopt eco-conscious habits in work and life.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};