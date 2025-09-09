import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { X, Users, ChevronDown, ArrowLeft, ArrowRight, RefreshCw, Mic, Lightbulb, TrendingUp, AlertTriangle, MessageCircle, Zap } from "lucide-react";
import { Dialog, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ChatInput from "@/components/ChatInput";

// Custom DialogContent without automatic close button
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

interface RoleplayHubModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat?: (message: string, response: string) => void;
}

interface DialogueMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface FeedbackTile {
  title: string;
  icon: React.ComponentType<any>;
  points: string[];
}

const RoleplayHubModal = ({ open, onOpenChange, onAddToChat }: RoleplayHubModalProps) => {
  // Page navigation state
  const [currentPage, setCurrentPage] = useState<'search' | 'dialogue' | 'feedback'>('search');
  
  // Page 1: Search state
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDropdownPair, setCurrentDropdownPair] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Page 2: Dialogue state
  const [dialogueMessages, setDialogueMessages] = useState<DialogueMessage[]>([]);
  const [isUserRole, setIsUserRole] = useState(true); // true = user asks, AI responds
  const [queryCount, setQueryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Page 3: Feedback state
  const [feedbackData, setFeedbackData] = useState<{
    strengths: string[];
    improvements: string[];
  }>({
    strengths: [],
    improvements: []
  });

  // Rotate dropdown options every 3 seconds
  useEffect(() => {
    if (showDropdown) {
      const interval = setInterval(() => {
        setCurrentDropdownPair(prev => (prev + 1) % 5); // 10 options / 2 = 5 pairs
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showDropdown]);

  // Auto-scroll dialogue messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dialogueMessages]);

  const roleplayScenarios = [
    "I am working with ABC company as a Production Executive and hold an MTech in Mechanical with 4 years of experience. My expertise lies in sheet metal handling, process optimisation and industrial safety. I have an interview scheduled with the Director of XYZ company for a senior role that demands strong technical and leadership abilities. I want to practise answering tough technical and behavioural questions. Please act as the interviewer and guide me through the session with feedback.",
    "I am an actor and a graduate from a professional dance and theatre academy. I have to audition for the role of a struggling young artist in an upcoming film before a demanding panel. The panel is known for being critical and expects strong performance skills as well as confidence under pressure. I want to practise answering their questions and delivering sample lines. Please roleplay as the panel and guide me through this audition.",
    "I am working as a software engineer with five years of professional experience in product development. I have cleared the technical rounds of a new company and now face the final HR negotiation. The company has proposed an offer, but I believe my achievements justify a higher package. I want to practise negotiating salary and benefits without sounding aggressive. Please roleplay as the HR executive and test my negotiation skills.",
    "I am a sales executive tasked with pitching a workflow automation product to a prospective client. The client is skeptical because of the high cost and wants solid justification before making a decision. I want to practise how to present the benefits, demonstrate ROI and handle objections. Please roleplay as the client, asking challenging questions and raising concerns. Guide me through this pitch so I can refine my approach.",
    "I am a project manager handling a cross-functional team with tight deadlines. One of my senior colleagues strongly disagrees with the schedule and feels it is unrealistic. I want to roleplay this situation to learn how to resolve the conflict without harming the relationship. Please roleplay as the colleague and challenge me during the discussion. At the end, give me feedback on my conflict resolution style.",
    "I am the founder of a renewable energy startup focusing on solar and wind solutions. I need to pitch my business to a venture capitalist who is known for being highly critical of financial models. I want to practise presenting my idea clearly, covering market size, revenue strategy and long-term scalability. Please roleplay as the investor and ask me tough questions. Give me feedback on my pitch and delivery after the session.",
    "I have to deliver a motivational speech to a group of university students on the theme of resilience and career growth. I want to practise my delivery so that it sounds inspiring, confident and easy to follow. Please roleplay as the student audience and react to my speech with interest, questions or challenges. At the end, provide me with feedback on tone, clarity and confidence. Help me refine my delivery for real impact.",
    "I am working in customer support for an electronics company. A customer has contacted me angrily about a late delivery and disappointing product quality. I want to practise responding politely, keeping the customer calm and finding a fair resolution. Please roleplay as the customer and express your frustration openly. At the end of the session, give me constructive feedback on what went well and what could be improved.",
    "I am a mathematics teacher and I need to explain calculus to a student who finds the subject very difficult. My goal is to simplify the topic and also keep the student motivated. Please roleplay as the struggling student, asking questions and showing hesitation. After the roleplay, give me feedback on how clear my explanations were. Help me learn how to improve my teaching style and engagement.",
    "I am the spokesperson of a company facing a press conference after a product recall due to safety issues. Journalists are likely to ask aggressive and challenging questions about responsibility and future actions. I want to practise handling the media under pressure while remaining professional and calm. Please roleplay as the panel of journalists and test me with probing questions. After the session, provide me with feedback on how I managed the situation."
  ];

  // Get current pair of dropdown options
  const getCurrentDropdownOptions = () => {
    const startIndex = currentDropdownPair * 2;
    return roleplayScenarios.slice(startIndex, startIndex + 2);
  };

  const handleSearchSubmit = async (message: string) => {
    setSearchValue(message);
    setShowDropdown(false);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Initialize dialogue with first AI message
    const firstMessage: DialogueMessage = {
      id: Date.now().toString(),
      content: `Great! I'll help you roleplay this scenario. Let's begin with your practice session. I'll start by setting the scene and asking you the first question.`,
      isUser: false,
      timestamp: new Date()
    };
    
    setDialogueMessages([firstMessage]);
    setIsLoading(false);
    setCurrentPage('dialogue');
  };

  const handleDropdownSelect = (option: string) => {
    setSearchValue(option);
    setShowDropdown(false);
  };

  const handleSearchFocus = () => {
    if (currentPage === 'search') {
      setShowDropdown(true);
    }
  };

  const handleDialogueSubmit = async (message: string) => {
    // Add user message
    const userMessage: DialogueMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setDialogueMessages(prev => [...prev, userMessage]);
    setQueryCount(prev => prev + 1);
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiMessage: DialogueMessage = {
      id: (Date.now() + 1).toString(),
      content: `Great response! ${isUserRole ? "Now let me follow up with another question..." : "That's an interesting perspective. Let me address that..."}`,
      isUser: false,
      timestamp: new Date()
    };
    
    setDialogueMessages(prev => [...prev, aiMessage]);
    
    // Check if we need to show feedback after 5 queries
    if ((queryCount + 1) % 5 === 0) {
      setTimeout(() => {
        generateFeedback();
        setCurrentPage('feedback');
      }, 1000);
    }
  };

  const handleRoleFlip = () => {
    setIsUserRole(prev => !prev);
    
    const flipMessage: DialogueMessage = {
      id: Date.now().toString(),
      content: `Roles have been flipped! ${!isUserRole ? "You'll now ask questions and I'll respond." : "I'll now ask questions and you'll respond."}`,
      isUser: false,
      timestamp: new Date()
    };
    
    setDialogueMessages(prev => [...prev, flipMessage]);
  };

  const generateFeedback = () => {
    const sampleStrengths = [
      "Excellent communication clarity in your responses",
      "Strong confidence level throughout the interaction",
      "Good use of specific examples to support your points",
      "Effective listening and response adaptation",
      "Professional tone maintained consistently"
    ];
    
    const sampleImprovements = [
      "Consider providing more concrete examples",
      "Work on reducing filler words and pauses",
      "Practice more assertive body language cues",
      "Develop stronger closing statements",
      "Focus on asking clarifying questions"
    ];
    
    setFeedbackData({
      strengths: sampleStrengths.slice(0, 3),
      improvements: sampleImprovements.slice(0, 3)
    });
  };

  const resetModal = () => {
    setCurrentPage('search');
    setSearchValue("");
    setShowDropdown(false);
    setIsLoading(false);
    setDialogueMessages([]);
    setQueryCount(0);
    setIsUserRole(true);
    setCurrentDropdownPair(0);
  };

  const handleSearchAgain = () => {
    setCurrentPage('search');
    setDialogueMessages([]);
    setQueryCount(0);
    setIsUserRole(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset modal when it closes
  useEffect(() => {
    if (!open) {
      resetModal();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/60 backdrop-blur-lg" />
      <CustomDialogContent className="max-w-[1210px] max-h-[86vh] w-[105vw] h-[100vh] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-6 top-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Page 1: Search Page */}
          {currentPage === 'search' && (
            <>
              {/* Header Section */}
              <div className="flex-shrink-0 text-center pt-16 pb-6 px-8">
                <div className="flex items-center justify-center mb-8">
                  <Users className="h-12 w-12 text-purple-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  Roleplay Hub
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Practise real scenarios through live dialogue — simulate interviews, pitches, and tough talks.
                </p>
              </div>

              {/* Search Section */}
              <div className="flex-shrink-0 px-8 mb-8 mt-16">
                <div className="max-w-3xl mx-auto relative" ref={searchRef}>
                  <ChatInput 
                    onSendMessage={handleSearchSubmit} 
                    isLoading={isLoading}
                    initialValue={searchValue}
                    onFocus={handleSearchFocus}
                  />

                  {/* Dropdown Menu with rotating options */}
                  {showDropdown && (
                    <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 z-40 overflow-hidden">
                      <div className="p-2">
                        <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                          <span className="font-medium">Suggested roleplay scenarios</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                        {getCurrentDropdownOptions().map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDropdownSelect(option)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-600/70 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded-lg mx-1 my-1 animate-in fade-in-50"
                            style={{ 
                              animationDelay: `${idx * 100}ms`,
                              fontSize: '0.85rem',
                              lineHeight: '1.4'
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Page 2: Dialogue Page */}
          {currentPage === 'dialogue' && (
            <>
              {/* Header with navigation */}
              <div className="flex-shrink-0 px-8 pt-8 pb-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage('search')}
                    className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div className="flex items-center space-x-2">
                      {isUserRole ? (
                        <Mic className={`h-5 w-5 text-green-500 ${queryCount % 2 === 0 ? 'animate-pulse' : ''}`} />
                      ) : (
                        <Lightbulb className={`h-5 w-5 text-yellow-500 ${queryCount % 2 === 1 ? 'animate-pulse' : ''}`} />
                      )}
                      <span className="text-sm text-gray-600">
                        {isUserRole ? 'Your Turn' : 'AI Turn'}
                      </span>
                    </div>
                  </div>
                  <div className="w-9 h-9"></div>
                </div>
              </div>

              {/* Dialogue Area */}
              <div className="flex-1 px-8 overflow-hidden">
                <div className="h-full bg-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg overflow-y-auto">
                  <div className="space-y-4 pb-4">
                    {dialogueMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            message.isUser
                              ? 'bg-purple-600 text-white'
                              : 'bg-white text-gray-800 shadow-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 px-8 py-6">
                <div className="max-w-3xl mx-auto mb-4">
                  <ChatInput 
                    onSendMessage={handleDialogueSubmit}
                    placeholder="Type your response..."
                  />
                </div>
                
                {/* Control Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleRoleFlip}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Flip The Role
                  </Button>
                  <Button
                    onClick={handleSearchAgain}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Search Again
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Page 3: Feedback Page */}
          {currentPage === 'feedback' && (
            <>
              {/* Header */}
              <div className="flex-shrink-0 text-center pt-16 pb-8 px-8">
                <div className="flex items-center justify-center mb-8">
                  <TrendingUp className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  Performance Insights
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Your progress analysis from the last 5 interactions
                </p>
              </div>

              {/* Feedback Tiles */}
              <div className="flex-1 px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Strengths Tile */}
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-green-500 rounded-full mr-4">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-green-800">Your Strengths So Far</h2>
                    </div>
                    <ul className="space-y-3">
                      {feedbackData.strengths.map((strength, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-green-700"
                        >
                          <Zap className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements Tile */}
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-orange-500 rounded-full mr-4">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-orange-800">Work On This</h2>
                    </div>
                    <ul className="space-y-3">
                      {feedbackData.improvements.map((improvement, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-orange-700"
                        >
                          <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 text-orange-500 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={() => setCurrentPage('dialogue')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg transition-all duration-300 hover:scale-105"
                  >
                    Continue Practice
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export default RoleplayHubModal;