import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Cpu, Paperclip, Globe, Mic, Share, Download, AudioWaveform, X, Volume2, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import TTSPlayer from "./TTSPlayer";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { toast } from "sonner";
import ExportModal from "./modals/ExportModal";
import EmailSettingsModal from "./modals/EmailSettingsModal";
import UpgradePromptModal from "./modals/UpgradePromptModal";
import { useUserPlan } from "@/hooks/useUserPlan";
import { getAvailableModels, getLockedModels } from "@/config/modelConfig";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  placeholder?: string;
  onFocus?: () => void;
  lastResponse?: string;
  onModelSelect?: (model: string) => void;
}

const ChatInput = ({ onSendMessage, isLoading = false, initialValue = "", placeholder = "Ask Mergenta...", onFocus, lastResponse, onModelSelect }: ChatInputProps) => {
  const [input, setInput] = useState(initialValue);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTTS, setShowTTS] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedLockedModel, setSelectedLockedModel] = useState<{ name: string; requiredPlan: string } | null>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceRecording();
  const { uploadDocument, isUploading } = useDocumentUpload();
  const { planType } = useUserPlan();

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

  const handleActionButtonClick = async () => {
    if (input.trim()) {
      // Send message
      onSendMessage(input.trim());
      setInput("");
      // Reset textarea height
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = '24px';
      }
    } else if (isRecording) {
      // Stop recording and transcribe
      try {
        const transcribedText = await stopRecording();
        if (transcribedText) {
          setInput(transcribedText);
          toast.success('Audio transcribed successfully');
        }
      } catch (error) {
        console.error('Recording error:', error);
      }
    } else {
      // Start recording
      await startRecording();
      toast.info('Recording started - click again to stop');
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
    if (input.trim()) return <Send className="h-4 w-4 text-white" />;
    if (isTranscribing) return <AudioWaveform className="h-4 w-4 animate-pulse text-white" />;
    if (isRecording) return <AudioWaveform className="h-4 w-4 animate-pulse text-white" />;
    return <AudioWaveform className="h-4 w-4 text-white" />;
  };

  const getActionButtonTooltip = () => {
    if (input.trim()) return "Send";
    if (isTranscribing) return "Transcribing...";
    if (isRecording) return "Stop recording";
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadDocument(file);
    if (result?.extractedText) {
      setInput((prev) => prev + '\n\n' + result.extractedText);
      toast.success('Document content added to prompt');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <TooltipProvider>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.xls,.xlsx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        content={lastResponse || input}
      />

      {/* Email Settings Modal */}
      <EmailSettingsModal
        isOpen={showEmailSettings}
        onClose={() => setShowEmailSettings(false)}
      />

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
          <div className="flex flex-col w-full rounded-xl shadow-sm bg-white px-4 pt-3 pb-3 min-h-[94px]">
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

            {/* Icons row at bottom */}
            <div className="flex justify-between items-center mt-auto">
              {/* Left side icons */}
              <div className="flex gap-1 lg:gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setShowEmailSettings(true)}
                      className="p-3 lg:p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] lg:min-h-auto lg:min-w-auto flex items-center justify-center"
                    >
                      <Share className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Email automation</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setShowExportModal(true)}
                      disabled={!lastResponse && !input}
                      className="p-3 lg:p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] lg:min-h-auto lg:min-w-auto flex items-center justify-center disabled:opacity-50"
                    >
                      <Download className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Export & Download</TooltipContent>
                </Tooltip>
              </div>

              {/* Right side icons */}
              <div className="flex gap-1 lg:gap-2">
              <div className="relative" ref={modelDropdownRef}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className="p-3 lg:p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] lg:min-h-auto lg:min-w-auto flex items-center justify-center"
                    >
                      <Cpu className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Select your model</TooltipContent>
                </Tooltip>

                {/* Model Selection Dropdown */}
                {showModelDropdown && (
                  <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-w-md max-h-96 overflow-y-auto">
                    {/* Available Models */}
                    {getAvailableModels(planType).length > 0 && (
                      <div className="p-4">
                        <h3 className="font-semibold text-sm text-gray-800 mb-3">Available Models</h3>
                        <div className="space-y-2">
                          {getAvailableModels(planType).map((model) => (
                            <button
                              key={model.id}
                              className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 py-2 px-3 rounded transition-colors"
                              onClick={() => {
                                onModelSelect?.(model.id);
                                setShowModelDropdown(false);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{model.displayName}</span>
                                {model.badge && (
                                  <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                    {model.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{model.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Locked Models */}
                    {getLockedModels(planType).length > 0 && (
                      <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Lock className="h-4 w-4 text-gray-400" />
                          <h3 className="font-semibold text-sm text-gray-600">Locked Models</h3>
                        </div>
                        <div className="space-y-2">
                          {getLockedModels(planType).map((model) => (
                            <button
                              key={model.id}
                              className="w-full text-left text-sm text-gray-600 hover:bg-gray-100 py-2 px-3 rounded transition-colors opacity-75"
                              onClick={() => {
                                setSelectedLockedModel({ 
                                  name: model.displayName, 
                                  requiredPlan: model.requiredPlan 
                                });
                                setShowUpgradeModal(true);
                                setShowModelDropdown(false);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Lock className="h-3 w-3" />
                                  <span className="font-medium">{model.displayName}</span>
                                </div>
                                {model.badge && (
                                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                    {model.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 ml-5">
                                {model.description} • Requires {model.requiredPlan.charAt(0).toUpperCase() + model.requiredPlan.slice(1)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

               <Tooltip>
                 <TooltipTrigger asChild>
                   <button
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     disabled={isUploading}
                     className="p-3 lg:p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] lg:min-h-auto lg:min-w-auto flex items-center justify-center disabled:opacity-50"
                   >
                     {isUploading ? (
                       <Loader2 className="h-5 w-5 lg:h-4 lg:w-4 animate-spin" />
                     ) : (
                       <Paperclip className="h-5 w-5 lg:h-4 lg:w-4" />
                     )}
                   </button>
                 </TooltipTrigger>
                 <TooltipContent>Upload document (PDF, DOCX, TXT, Excel)</TooltipContent>
               </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-3 lg:p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] lg:min-h-auto lg:min-w-auto flex items-center justify-center"
                  >
                    <Globe className="h-5 w-5 lg:h-4 lg:w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Web references</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-3 lg:p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 touch-manipulation min-h-[44px] min-w-[44px] lg:min-h-auto lg:min-w-auto flex items-center justify-center"
                  >
                    <Mic className="h-5 w-5 lg:h-4 lg:w-4" />
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
                      className={`p-3 lg:p-2 rounded-md hover:bg-gray-100 transition-colors touch-manipulation min-h-[44px] min-w-[44px] lg:min-h-auto lg:min-w-auto flex items-center justify-center ${
                        showTTS ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Volume2 className="h-5 w-5 lg:h-4 lg:w-4" />
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
                    className="ml-2 w-12 h-12 lg:w-10 lg:h-10 rounded-full flex items-center justify-center
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

      {/* Upgrade Prompt Modal */}
      <UpgradePromptModal 
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        modelName={selectedLockedModel?.name || ''}
        requiredPlan={selectedLockedModel?.requiredPlan as any || 'pro'}
        currentPlan={planType}
      />
    </TooltipProvider>
  );
};

export default ChatInput;