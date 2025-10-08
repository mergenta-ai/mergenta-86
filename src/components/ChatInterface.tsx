import { useRef, useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { Button } from "./ui/button";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Array<{
    id: string;
    type: "google" | "rss";
    title: string;
    url: string;
    snippet: string;
  }>;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  turnCount: number;
}

const ChatInterface = ({ messages, isLoading, turnCount }: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [selectedThinkingMessages, setSelectedThinkingMessages] = useState<string[]>([]);
  const [warmthLine, setWarmthLine] = useState<string>("");
  const [currentWarmthIndex, setCurrentWarmthIndex] = useState(0);
  const [selectedWarmthMessages, setSelectedWarmthMessages] = useState<string[]>([]);
  const [warmthFade, setWarmthFade] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const allThinkingMessages = [
    "Mergenta is thinking…",
    "Analysing your query thoughtfully…",
    "Absorbing every detail of your prompt…",
    "Letting the ideas align before responding…",
    "Generating insights — just a moment…",
    "Connecting ideas to craft the best response…",
    "Exploring the most relevant information…",
    "Evaluating context for an accurate answer…",
    "Piecing together key insights…",
    "Thinking through your question carefully…",
    "Sorting signals from noise to form clarity…",
    "Synthesising knowledge across sources…",
    "Assembling the most meaningful perspective…",
    "Exploring all angles for a balanced answer…",
    "Reflecting before responding…",
    "Gathering precise details for clarity…",
    "Reaching into the data vault for precision…",
    "Fine-tuning thoughts for the perfect phrasing…",
    "Scanning patterns to uncover insight…",
    "Framing a response that truly resonates…",
    "Composing your answer elegantly…",
    "Understanding intent before replying…",
    "Refining the response to ensure precision…",
  ];

  const warmthCategories = {
    generalAffirmations: [
      "Excellent question — you've spotted something interesting.",
      "That's a thoughtful observation.",
      "Perfect point — let's look into it together.",
      "You're absolutely right to ask that.",
      "A very perceptive thought — here's the reasoning behind it.",
      "I like the way you've approached that.",
      "Good thinking — and there's an intriguing angle here.",
      "Smart question — it shows attention to detail.",
      "That's exactly the kind of question that deepens understanding.",
      "Nicely framed query — let's unpack it.",
    ],
    whenExplaining: [
      "Let's look at this step by step.",
      "Here's how it really works beneath the surface.",
      "Let's break this down clearly.",
      "Allow me to explain how this connects.",
      "Let's examine this from another perspective.",
      "This is an interesting one — here's the logic behind it.",
      "Let's reason through this carefully.",
      "Let's take a closer look.",
      "Here's where it gets fascinating.",
      "This might surprise you a bit.",
    ],
    onRightTrack: [
      "Exactly right — you're thinking along the right lines.",
      "You've got it — that's the key idea.",
      "Spot on — that's precisely the point.",
      "Yes, that's a sharp insight.",
      "Indeed — that's what makes the difference.",
      "Correct — and here's the reasoning that supports it.",
      "That's accurate — you've read it well.",
      "Perfectly understood — let's go a bit deeper.",
      "Absolutely — and there's one more angle to consider.",
      "Right on target — you've captured the essence.",
    ],
    encouragingCuriosity: [
      "Lovely — curiosity like this leads to real understanding.",
      "You're asking exactly the kind of question that opens insight.",
      "That's a valuable way to think about it.",
      "Fascinating thought — let's explore it a bit.",
      "Good — that shows genuine curiosity.",
      "Interesting angle — few people think of it this way.",
      "That's a curious one — let's see what lies behind it.",
      "I like that — let's reflect on it for a moment.",
      "You're connecting the dots beautifully.",
      "That question shows deep thinking.",
    ],
    empathy: [
      "I can see why you'd wonder that.",
      "A fair question — and one that deserves clarity.",
      "That's a common point of confusion — let's clear it up.",
      "It's natural to think that — here's what's actually happening.",
      "I completely understand that curiosity.",
      "Good that you brought that up — it often gets overlooked.",
      "You've picked up on a subtle but important detail.",
      "I appreciate that observation — it adds perspective.",
      "That's a keen insight, truly.",
      "It's always refreshing to see questions framed this thoughtfully.",
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom && messages.length > 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  // Select 3-4 random thinking messages when loading starts
  useEffect(() => {
    if (isLoading) {
      // Always include "Mergenta is thinking…" as first, then select 3-4 from remaining
      const numMessages = Math.floor(Math.random() * 2) + 3; // 3 or 4
      const otherMessages = allThinkingMessages.slice(1); // Exclude first message
      const shuffled = [...otherMessages].sort(() => Math.random() - 0.5);
      const selected = ["Mergenta is thinking…", ...shuffled.slice(0, numMessages)];
      setSelectedThinkingMessages(selected);
      setCurrentMessageIndex(0);
      setFade(true);

      // Select 3-4 random warmth messages for turns >= 2
      if (turnCount >= 2) {
        const allCategories = Object.values(warmthCategories).flat();
        const numWarmthMessages = Math.floor(Math.random() * 2) + 3; // 3 or 4
        const shuffledWarmth = [...allCategories].sort(() => Math.random() - 0.5);
        const selectedWarmth = shuffledWarmth.slice(0, numWarmthMessages);
        setSelectedWarmthMessages(selectedWarmth);
        setCurrentWarmthIndex(0);
        setWarmthFade(true);
        setWarmthLine(selectedWarmth[0]);
      } else {
        setWarmthLine("");
        setSelectedWarmthMessages([]);
      }
    }
  }, [isLoading, turnCount]);

  // Cycle through selected thinking messages with 5-5.5s intervals
  useEffect(() => {
    if (!isLoading || selectedThinkingMessages.length === 0) {
      return;
    }

    const interval = setInterval(
      () => {
        setFade(false);
        setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % selectedThinkingMessages.length);
          setFade(true);
        }, 300);
      },
      Math.floor(Math.random() * 500) + 5000,
    ); // 4000-4500ms

    return () => clearInterval(interval);
  }, [isLoading, selectedThinkingMessages]);

  // Cycle through selected warmth messages with 5-5.5s intervals
  useEffect(() => {
    if (!isLoading || turnCount < 2 || selectedWarmthMessages.length === 0) {
      return;
    }

    const interval = setInterval(
      () => {
        setWarmthFade(false);
        setTimeout(() => {
          setCurrentWarmthIndex((prev) => {
            const newIndex = (prev + 1) % selectedWarmthMessages.length;
            setWarmthLine(selectedWarmthMessages[newIndex]);
            return newIndex;
          });
          setWarmthFade(true);
        }, 300);
      },
      Math.floor(Math.random() * 500) + 5000,
    ); // 4000-4500ms

    return () => clearInterval(interval);
  }, [isLoading, turnCount, selectedWarmthMessages]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 relative min-h-0" style={{ maxHeight: 'calc(100vh - var(--chat-input-height, 120px))', paddingBottom: '20px', scrollPaddingBottom: '20px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <div className={`max-w-3xl mx-auto py-4 sm:py-6 ${messages.length > 0 ? "pb-40 sm:pb-52" : ""}`}>
        {messages.length === 0 ? (
          <div className="text-center py-8">{/* Empty state - clean and minimal */}</div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                sources={message.sources}
              />
            ))}

            {/* Loading Indicator - appears instantly when processing */}
            {isLoading && selectedThinkingMessages.length > 0 && (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                <div className="relative w-16 h-16 mb-4">
                  <img
                    src="/lovable-uploads/0ef37e7c-4020-4d43-b3cb-e900815b9635.png"
                    alt="Mergenta thinking"
                    className="w-full h-full object-contain animate-spin"
                    style={{ animationDuration: "2s" }}
                  />
                </div>

                {/* Turn 1: Show thinking messages */}
                {turnCount === 1 && (
                  <p
                    className="text-sm text-muted-foreground transition-opacity duration-300"
                    style={{ opacity: fade ? 1 : 0 }}
                  >
                    {selectedThinkingMessages[currentMessageIndex]}
                  </p>
                )}

                {/* Turn 2+: Show rotating warmth line (no thinking messages) */}
                {turnCount >= 2 && warmthLine && (
                  <p
                    className="text-sm text-muted-foreground transition-opacity duration-300"
                    style={{ opacity: warmthFade ? 1 : 0 }}
                  >
                    {warmthLine}
                  </p>
                )}
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>


      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 md:right-8 z-30 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-10 h-10 bg-background border border-border hover:bg-accent"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default ChatInterface;
