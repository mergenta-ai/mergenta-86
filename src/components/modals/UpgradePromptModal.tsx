import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlanType } from "@/hooks/useUserPlan";
import { getPlanBadgeColor } from "@/config/modelConfig";

interface UpgradePromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelName: string;
  requiredPlan: PlanType;
  currentPlan: PlanType;
}

const UpgradePromptModal = ({
  open,
  onOpenChange,
  modelName,
  requiredPlan,
  currentPlan,
}: UpgradePromptModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/plans');
    onOpenChange(false);
  };

  const requiredPlanDisplay = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);
  const currentPlanDisplay = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-purple-100">
              <Lock className="h-5 w-5 text-purple-600" />
            </div>
            <DialogTitle>Upgrade Required</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3 pt-2">
            <p className="text-base">
              <span className="font-semibold text-foreground">{modelName}</span> requires a{' '}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${getPlanBadgeColor(requiredPlan)}`}>
                {requiredPlanDisplay}
              </span>{' '}
              plan or higher.
            </p>
            <p className="text-sm text-muted-foreground">
              You're currently on the{' '}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${getPlanBadgeColor(currentPlan)}`}>
                {currentPlanDisplay}
              </span>{' '}
              plan.
            </p>
            <div className="bg-muted/50 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Upgrade to unlock advanced models with superior reasoning, longer context, and enhanced capabilities.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={handleUpgrade} className="w-full gap-2">
            Upgrade to {requiredPlanDisplay}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePromptModal;
