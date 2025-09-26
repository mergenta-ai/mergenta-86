import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Cpu, Paperclip, Globe, Mic, Share, Download, AudioWaveform, X, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import TTSPlayer from "./TTSPlayer";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  placeholder?: string;
  onFocus?: () => void;
  lastResponse?: string;
}

const ChatInput = ({ onSendMessage, isLoading = false, initialValue = "", placeholder = "Ask Mergenta...", onFocus, lastResponse }: ChatInputProps) => {
  const [input, setInput] = useState(initialValue);
  const [isRecording, setIsRecording] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTTS, setShowTTS] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
      // Reset textarea height
      const textarea = e.currentTarget.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = '24px';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleActionButtonClick = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
    } else if (input.trim()) {
      // Send message
      onSendMessage(input.trim());
      setInput("");
      // Reset textarea height
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = '24px';
      }
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const handleClearInput = () => {
    setInput("");
    // Reset textarea height
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = '24px';
    }
    // Focus back on textarea
    textarea?.focus();
  };

  const getActionButtonIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-white" />;
    if (isRecording) return <AudioWaveform className="h-4 w-4 text-white" />;
    if (input.trim()) return <Send className="h-4 w-4 text-white" />;
    return <AudioWaveform className="h-4 w-4 text-white" />;
  };

  const getActionButtonTooltip = () => {
    if (isRecording) return "Stop recording";
    if (input.trim()) return "Send";
    return "Voice input";
  };

  // Update input when initialValue changes
  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  // Auto-resize textarea whenever input changes or initialValue changes
  useEffect(() => {
    const resizeTextarea = () => {
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        if (textarea.value === input || textarea.value === initialValue) {
          textarea.style.height = 'auto';
          const newHeight = Math.min(Math.max(textarea.scrollHeight, 24), 120);
          textarea.style.height = newHeight + 'px';
          // Force reflow to ensure proper rendering
          textarea.offsetHeight;
        }
      });
    };

    // Multiple resize attempts to ensure proper display
    resizeTextarea();
    const timeoutId1 = setTimeout(resizeTextarea, 5);
    const timeoutId2 = setTimeout(resizeTextarea, 50);
    const timeoutId3 = setTimeout(resizeTextarea, 100);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [input, initialValue]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <TooltipProvider>
      {/* TTS Player - Shows above input when enabled */}
      {showTTS && lastResponse && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md px-4">
          <TTSPlayer 
            text={lastResponse}
            isVisible={showTTS}
            onClose={() => setShowTTS(false)}
          />
        </div>
      )}
      
      <div className="flex justify-center w-full px-4 mt-2 lg:mt-0">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col w-full rounded-xl shadow-sm bg-white px-3 sm:px-4 pt-3 pb-3 min-h-[94px]">
            {/* Input field at top */}
            <div className="flex-grow relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                placeholder={placeholder}
                className="w-full resize-none focus:outline-none text-gray-700 placeholder-gray-400 min-h-[24px] bg-transparent border-none outline-none text-base lg:text-lg touch-manipulation pr-10"
                disabled={isLoading}
                style={{
                  height: 'auto',
                  minHeight: '24px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  const newHeight = Math.min(Math.max(target.scrollHeight, 24), 120);
                  target.style.height = newHeight + 'px';
                }}
              />
              
              {/* Clear button */}
              {input.trim() && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="absolute right-2 top-1 p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Clear prompt bar</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Icons row at bottom - responsive spacing */}
            <div className="flex justify-between items-center mt-auto">
              {/* Left side icons - responsive gap */}
              <div className="flex gap-1 sm:gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center sm:p-2.5"
                    >
                      <Share className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Export</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
              </div>

              {/* Right side icons - responsive touch targets */}
              <div className="flex gap-1 sm:gap-2 flex-wrap">
              <div className="relative" ref={modelDropdownRef}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Cpu className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Select your model</TooltipContent>
                </Tooltip>

                {/* Model Selection Dropdown */}
                {showModelDropdown && (
                  <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border border-gray-100 z-50 min-w-max max-w-[90vw] sm:max-w-none">
                    <div className="flex">
                      {/* Creativity Column */}
                      <div className="p-4 min-w-[140px]">
                        <h3 className="font-semibold text-sm text-gray-800 mb-1">Creativity</h3>
                        <p className="text-xs text-gray-500 mb-3">Inventive & Expressive</p>
                        <div className="space-y-2">
                          {[
                            { name: "GPT-5", badge: "New" },
                            { name: "GPT-4.1", badge: null },
                            { name: "Gemini 2.5 Flash", badge: null },
                            { name: "Grok 3", badge: null },
                            { name: "Claude Haiku 3.5", badge: null }
                          ].map((model, idx) => (
                            <button
                              key={idx}
                              className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 py-1 px-2 rounded transition-colors flex items-center justify-between"
                              onClick={() => {
                                console.log(`Selected: ${model.name}`);
                                setShowModelDropdown(false);
                              }}
                            >
                              <span>{model.name}</span>
                              {model.badge && (
                                <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                  {model.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dividing Line */}
                      <div className="w-px bg-gray-200 my-4"></div>

                      {/* Research Column */}
                      <div className="p-4 min-w-[140px]">
                        <h3 className="font-semibold text-sm text-gray-800 mb-1">Research</h3>
                        <p className="text-xs text-gray-500 mb-3">Reasoning & Thinking</p>
                        <div className="space-y-2">
                          {[
                            { name: "Gemini 2.5 Pro", badge: null },
                            { name: "Claude Sonet 4", badge: null },
                            { name: "Grok 4", badge: null },
                            { name: "o3", badge: null },
                            { name: "o4-mini", badge: null },
                            { name: "Claude Opus 4.1", badge: "Ace" },
                            { name: "o3-pro", badge: "Ace" }
                          ].map((model, idx) => (
                            <button
                              key={idx}
                              className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 py-1 px-2 rounded transition-colors flex items-center justify-between"
                              onClick={() => {
                                console.log(`Selected: ${model.name}`);
                                setShowModelDropdown(false);
                              }}
                            >
                              <span>{model.name}</span>
                              {model.badge && (
                                <div className="flex items-center gap-1 ml-2">
                                  <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                    {model.badge}
                                  </span>
                                  <span className="text-xs text-gray-500">onwards</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>File upload</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Globe className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Web references</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Voice input</TooltipContent>
              </Tooltip>

              {/* TTS Button - Only show if we have a response */}
              {lastResponse && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setShowTTS(!showTTS)}
                      className={`p-2 rounded-md hover:bg-gray-100 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        showTTS ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Text to Speech</TooltipContent>
                </Tooltip>
              )}

              {/* Action button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button"
                    onClick={handleActionButtonClick}
                    disabled={isLoading}
                    className="ml-2 w-10 h-10 rounded-full flex items-center justify-center
                               bg-gradient-to-r from-[#6F42C1] to-[#7D55C7]
                               hover:scale-105 hover:shadow-[0_0_10px_#6F42C1]/50 transition-all
                               touch-manipulation"
                  >
                    {getActionButtonIcon()}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{getActionButtonTooltip()}</TooltipContent>
              </Tooltip>
              </div>
            </div>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
};

export default ChatInput;