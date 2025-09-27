import React, { useCallback, useEffect, useRef, useState } from "react";
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
  onHeightChange?: (height: number) => void;
}

const MIN_TEXTAREA_HEIGHT = 24;
const MAX_TEXTAREA_HEIGHT = 120;

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  initialValue = "",
  placeholder = "Ask Mergenta...",
  onFocus,
  lastResponse,
  onHeightChange
}) => {
  const [input, setInput] = useState(initialValue);
  const [isRecording, setIsRecording] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTTS, setShowTTS] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
      if (onHeightChange) onHeightChange(MIN_TEXTAREA_HEIGHT);
    }
  }, [input, isLoading, onSendMessage, onHeightChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleActionButtonClick = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    if (input.trim()) {
      sendMessage();
      return;
    }
    setIsRecording(true);
  };

  const handleClearInput = () => {
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
      textareaRef.current.focus();
      if (onHeightChange) onHeightChange(MIN_TEXTAREA_HEIGHT);
    }
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

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resizeHandler = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      rafRef.current = requestAnimationFrame(() => {
        textarea.style.height = "auto";
        const measured = Math.min(Math.max(textarea.scrollHeight, MIN_TEXTAREA_HEIGHT), MAX_TEXTAREA_HEIGHT);
        textarea.style.height = `${measured}px`;
        if (onHeightChange) onHeightChange(measured);
      });
    };

    resizeHandler();

    const ro = new ResizeObserver(resizeHandler);
    ro.observe(textarea);
    resizeObserverRef.current = ro;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [onHeightChange, input]);

  useEffect(() => {
    const handlePointerDown = (ev: PointerEvent | TouchEvent | MouseEvent) => {
      const target = ev.target as Node | null;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown as EventListener);
    document.addEventListener("touchstart", handlePointerDown as EventListener, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown as EventListener);
      document.removeEventListener("touchstart", handlePointerDown as EventListener);
    };
  }, []);

  return (
    <TooltipProvider>
      {showTTS && lastResponse && (
        <div className="fixed left-1/2 bottom-[6.5rem] transform -translate-x-1/2 z-[60] w-full max-w-md px-4">
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
            <div className="flex-grow relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                placeholder={placeholder}
                aria-label="Chat input"
                className="w-full resize-none focus:outline-none placeholder-gray-400 min-h-[24px] bg-transparent border-none outline-none text-base lg:text-lg touch-manipulation pr-10"
                disabled={isLoading}
                style={{
                  height: `${MIN_TEXTAREA_HEIGHT}px`,
                  minHeight: `${MIN_TEXTAREA_HEIGHT}px`,
                  maxHeight: `${MAX_TEXTAREA_HEIGHT}px`,
                  overflowY: "auto",
                  lineHeight: "1.5",
                }}
              />

              {input.trim() && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleClearInput}
                      aria-label="Clear input"
                      className="absolute right-2 top-1 p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Clear prompt bar</TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="flex gap-1 sm:gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Export"
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                      aria-label="Download"
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex gap-1 sm:gap-2 flex-wrap items-center">
                <div className="relative" ref={dropdownRef}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={showModelDropdown}
                        onClick={() => setShowModelDropdown((s) => !s)}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Cpu className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Select your model</TooltipContent>
                  </Tooltip>

                  {showModelDropdown && (
                    <div
                      role="menu"
                      aria-label="Select model"
                      className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border border-gray-100 z-50 min-w-max max-w-[90vw] sm:max-w-none"
                    >
                      <div className="p-4 min-w-[160px]">
                        <div className="font-semibold text-sm text-gray-800 mb-1">Model</div>
                        <div className="text-xs text-gray-500 mb-3">Choose compute</div>
                        <button
                          className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 py-1 px-2 rounded transition-colors"
                          onClick={() => setShowModelDropdown(false)}
                        >
                          GPT-5 (sample)
                        </button>
                        <button
                          className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 py-1 px-2 rounded transition-colors mt-1"
                          onClick={() => setShowModelDropdown(false)}
                        >
                          GPT-4.1
                        </button>
                        <div className="mt-2 text-xs text-gray-400">More options load lazily.</div>
                      </div>
                    </div>
                  )}
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Attach file"
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
                      aria-label="Web references"
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
                      aria-label="Voice input"
                      className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Voice input</TooltipContent>
                </Tooltip>

                {lastResponse && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setShowTTS((s) => !s)}
                        aria-pressed={showTTS}
                        aria-label="Toggle text to speech"
                        className={`p-2 rounded-md hover:bg-gray-100 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
                          showTTS ? "text-purple-600 bg-purple-50" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Text to Speech</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleActionButtonClick}
                      disabled={isLoading}
                      aria-label={getActionButtonTooltip()}
                      className="ml-2 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-[#6F42C1] to-[#7D55C7] hover:scale-105 transition-transform touch-manipulation"
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
