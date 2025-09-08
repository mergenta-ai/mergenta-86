import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Target, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Custom DialogContent without automatic close button
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

const formSchema = z.object({
  decisionArea: z.string().min(1, "Please select a decision area"),
  timeframe: z.string().min(1, "Please select a timeframe"),
  priorityLevel: z.string().min(1, "Please select a priority level"),
  riskSensitivity: z.string().min(1, "Please select risk sensitivity"),
  challenge: z.string().min(10, "Please describe your decision challenge (minimum 10 characters)"),
});

interface DecisionMakingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRunPlaybook: (formData: z.infer<typeof formSchema>) => void;
}

export const DecisionMakingModal = ({ open, onOpenChange, onRunPlaybook }: DecisionMakingModalProps) => {
  const [openDropdowns, setOpenDropdowns] = React.useState({
    decisionArea: false,
    timeframe: false,
    priorityLevel: false,
    riskSensitivity: false
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      decisionArea: "",
      timeframe: "",
      priorityLevel: "",
      riskSensitivity: "",
      challenge: "",
    },
  });

  const dropdownOptions = {
    decisionArea: [
      { value: "business", label: "Business" },
      { value: "career", label: "Career" },
      { value: "finance", label: "Finance" },
      { value: "personal", label: "Personal" },
      { value: "health", label: "Health" },
      { value: "family", label: "Family" },
      { value: "lifestyle", label: "Lifestyle" }
    ],
    timeframe: [
      { value: "immediate", label: "Immediate" },
      { value: "short-term", label: "Short Term" },
      { value: "medium-term", label: "Medium Term" },
      { value: "long-term", label: "Long Term" }
    ],
    priorityLevel: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" }
    ],
    riskSensitivity: [
      { value: "risk-taking", label: "Risk-Taking" },
      { value: "balanced", label: "Balanced" },
      { value: "risk-averse", label: "Risk-Averse" }
    ]
  };

  const toggleDropdown = (field: keyof typeof openDropdowns) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const selectOption = (field: string, value: string) => {
    form.setValue(field as keyof z.infer<typeof formSchema>, value);
    setOpenDropdowns(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const getSelectedLabel = (field: keyof typeof dropdownOptions, value: string) => {
    const option = dropdownOptions[field].find(opt => opt.value === value);
    return option ? option.label : `Select ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onRunPlaybook(values);
  };

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
        {/* Navigation and Close buttons */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 left-6 z-50 p-2 rounded-full bg-white hover:bg-white/80 transition-colors shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-black" />
        </button>
        
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-soft"
        >
          <X className="h-5 w-5 text-mergenta-dark-grey" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center pt-12 pb-8">
          <div className="mb-6">
            <Target className="h-20 w-20 text-mergenta-dark-grey" />
          </div>
          <h1 className="text-4xl font-bold text-mergenta-dark-grey mb-4">Decision Making Playbook</h1>
          <p className="text-lg text-mergenta-dark-grey/80 max-w-2xl text-center">
            Get structured guidance for making complex decisions with confidence
          </p>
        </div>

        {/* Content area */}
        <div className="flex-1 px-12 pb-12 max-h-[calc(100vh-200px)]">
          <div className="max-w-4xl mx-auto h-full overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Decision Area */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-md rounded-2xl p-6 border border-purple-300/60 shadow-lg relative overflow-visible">
                    <FormField
                      control={form.control}
                      name="decisionArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-white drop-shadow-md">Decision Area</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <button
                                type="button"
                                onClick={() => toggleDropdown('decisionArea')}
                                className="w-full bg-white/95 backdrop-blur-sm border-white/50 hover:bg-white transition-colors text-gray-900 font-medium rounded-md px-3 py-2 text-left flex items-center justify-between"
                              >
                                <span>{getSelectedLabel('decisionArea', field.value)}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdowns.decisionArea ? 'rotate-180' : ''}`} />
                              </button>
                            </FormControl>
                            {openDropdowns.decisionArea && (
                              <div 
                                className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in"
                                style={{ zIndex: 10000 }}
                              >
                                <div className="py-1">
                                  {dropdownOptions.decisionArea.map((option) => (
                                    <button
                                      key={option.value}
                                      type="button"
                                      onClick={() => selectOption('decisionArea', option.value)}
                                      className="w-full px-4 py-3 text-left hover:bg-purple-50 focus:bg-purple-50 cursor-pointer text-gray-900 font-medium transition-colors"
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Timeframe */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-md rounded-2xl p-6 border border-purple-300/60 shadow-lg relative overflow-visible">
                    <FormField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-white drop-shadow-md">Timeframe</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <button
                                type="button"
                                onClick={() => toggleDropdown('timeframe')}
                                className="w-full bg-white/95 backdrop-blur-sm border-white/50 hover:bg-white transition-colors text-gray-900 font-medium rounded-md px-3 py-2 text-left flex items-center justify-between"
                              >
                                <span>{getSelectedLabel('timeframe', field.value)}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdowns.timeframe ? 'rotate-180' : ''}`} />
                              </button>
                            </FormControl>
                            {openDropdowns.timeframe && (
                              <div 
                                className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in"
                                style={{ zIndex: 10000 }}
                              >
                                <div className="py-1">
                                  {dropdownOptions.timeframe.map((option) => (
                                    <button
                                      key={option.value}
                                      type="button"
                                      onClick={() => selectOption('timeframe', option.value)}
                                      className="w-full px-4 py-3 text-left hover:bg-purple-50 focus:bg-purple-50 cursor-pointer text-gray-900 font-medium transition-colors"
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Priority Level */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-md rounded-2xl p-6 border border-purple-300/60 shadow-lg relative overflow-visible">
                    <FormField
                      control={form.control}
                      name="priorityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-white drop-shadow-md">Priority Level</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <button
                                type="button"
                                onClick={() => toggleDropdown('priorityLevel')}
                                className="w-full bg-white/95 backdrop-blur-sm border-white/50 hover:bg-white transition-colors text-gray-900 font-medium rounded-md px-3 py-2 text-left flex items-center justify-between"
                              >
                                <span>{getSelectedLabel('priorityLevel', field.value)}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdowns.priorityLevel ? 'rotate-180' : ''}`} />
                              </button>
                            </FormControl>
                            {openDropdowns.priorityLevel && (
                              <div 
                                className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in"
                                style={{ zIndex: 10000 }}
                              >
                                <div className="py-1">
                                  {dropdownOptions.priorityLevel.map((option) => (
                                    <button
                                      key={option.value}
                                      type="button"
                                      onClick={() => selectOption('priorityLevel', option.value)}
                                      className="w-full px-4 py-3 text-left hover:bg-purple-50 focus:bg-purple-50 cursor-pointer text-gray-900 font-medium transition-colors"
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Risk Sensitivity */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-md rounded-2xl p-6 border border-purple-300/60 shadow-lg relative overflow-visible">
                    <FormField
                      control={form.control}
                      name="riskSensitivity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-white drop-shadow-md">Risk Sensitivity</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <button
                                type="button"
                                onClick={() => toggleDropdown('riskSensitivity')}
                                className="w-full bg-white/95 backdrop-blur-sm border-white/50 hover:bg-white transition-colors text-gray-900 font-medium rounded-md px-3 py-2 text-left flex items-center justify-between"
                              >
                                <span>{getSelectedLabel('riskSensitivity', field.value)}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdowns.riskSensitivity ? 'rotate-180' : ''}`} />
                              </button>
                            </FormControl>
                            {openDropdowns.riskSensitivity && (
                              <div 
                                className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in"
                                style={{ zIndex: 10000 }}
                              >
                                <div className="py-1">
                                  {dropdownOptions.riskSensitivity.map((option) => (
                                    <button
                                      key={option.value}
                                      type="button"
                                      onClick={() => selectOption('riskSensitivity', option.value)}
                                      className="w-full px-4 py-3 text-left hover:bg-purple-50 focus:bg-purple-50 cursor-pointer text-gray-900 font-medium transition-colors"
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Challenge Description */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-md rounded-2xl p-6 border border-purple-300/60 shadow-lg">
                  <FormField
                    control={form.control}
                    name="challenge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-white drop-shadow-md">Describe your decision challenge</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the decision you need to make, the options you're considering, and any constraints or concerns you have..."
                            className="min-h-[120px] bg-white/95 backdrop-blur-sm border-white/50 resize-none hover:bg-white transition-colors text-gray-900 font-medium placeholder:text-gray-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Run Playbook Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-12 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Run Playbook
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};