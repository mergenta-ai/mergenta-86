import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Target, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <div className="flex-1 px-12 pb-12 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Decision Area */}
                  <div className="bg-gradient-to-br from-purple-200/40 to-pink-200/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                    <FormField
                      control={form.control}
                      name="decisionArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-mergenta-dark-grey">Decision Area</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white/95 transition-colors">
                                <SelectValue placeholder="Select decision area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-purple-200/50 shadow-2xl z-[300]" sideOffset={5}>
                              <SelectItem value="business" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Business</SelectItem>
                              <SelectItem value="career" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Career</SelectItem>
                              <SelectItem value="finance" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Finance</SelectItem>
                              <SelectItem value="personal" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Personal</SelectItem>
                              <SelectItem value="health" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Health</SelectItem>
                              <SelectItem value="family" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Family</SelectItem>
                              <SelectItem value="lifestyle" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Lifestyle</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Timeframe */}
                  <div className="bg-gradient-to-br from-purple-200/40 to-pink-200/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                    <FormField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-mergenta-dark-grey">Timeframe</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white/95 transition-colors">
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-purple-200/50 shadow-2xl z-[300]" sideOffset={5}>
                              <SelectItem value="immediate" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Immediate</SelectItem>
                              <SelectItem value="short-term" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Short Term</SelectItem>
                              <SelectItem value="medium-term" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Medium Term</SelectItem>
                              <SelectItem value="long-term" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Long Term</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Priority Level */}
                  <div className="bg-gradient-to-br from-purple-200/40 to-pink-200/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                    <FormField
                      control={form.control}
                      name="priorityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-mergenta-dark-grey">Priority Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white/95 transition-colors">
                                <SelectValue placeholder="Select priority level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-purple-200/50 shadow-2xl z-[300]" sideOffset={5}>
                              <SelectItem value="high" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">High</SelectItem>
                              <SelectItem value="medium" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Medium</SelectItem>
                              <SelectItem value="low" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Low</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Risk Sensitivity */}
                  <div className="bg-gradient-to-br from-purple-200/40 to-pink-200/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                    <FormField
                      control={form.control}
                      name="riskSensitivity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-mergenta-dark-grey">Risk Sensitivity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white/95 transition-colors">
                                <SelectValue placeholder="Select risk sensitivity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-purple-200/50 shadow-2xl z-[300]" sideOffset={5}>
                              <SelectItem value="risk-taking" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Risk-Taking</SelectItem>
                              <SelectItem value="balanced" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Balanced</SelectItem>
                              <SelectItem value="risk-averse" className="hover:bg-purple-100/80 focus:bg-purple-100/80 cursor-pointer text-gray-800">Risk-Averse</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Challenge Description */}
                <div className="bg-gradient-to-br from-purple-200/40 to-pink-200/40 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
                  <FormField
                    control={form.control}
                    name="challenge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-mergenta-dark-grey">Describe your decision challenge</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the decision you need to make, the options you're considering, and any constraints or concerns you have..."
                            className="min-h-[120px] bg-white/90 backdrop-blur-sm border-white/50 resize-none hover:bg-white/95 transition-colors"
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