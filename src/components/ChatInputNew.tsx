import { Send, Loader2, Cpu, Paperclip, Globe, Mic, Share, Download, AudioWaveform, X, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import TTSPlayer from "./TTSPlayer";
import { useChatInputController } from "./layout/ChatInputController";

/**
 * REFACTORED CHAT INPUT COMPONENT
 * Mobile-first design with proper accessibility and touch targets
 * Uses scoped refs and eliminates global DOM queries
 */

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  placeholder?: string;
  onFocus?: () => void;
  lastResponse?: string;
  className?: string;
}

const ChatInputNew = ({ 
  onSendMessage, 
  isLoading = false, 
  initialValue = "", 
  placeholder = "Ask Mergenta...", 
  onFocus, 
  lastResponse,
  className = ""
}: ChatInputProps) => {
  const controller = useChatInputController({
    onSendMessage,
    isLoading,
    initialValue,
    placeholder,
    lastResponse,
    onFocus,
    className,
  });

  const {
    state,
    setState,
    textareaRef,
    containerRef,
    modelDropdownRef,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    handleActionButtonClick,
    handleClearInput,
  } = controller;

  // Action button helpers
  const getActionButtonIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-text-inverse" />;
    if (state.isRecording) return <AudioWaveform className="h-4 w-4 text-text-inverse" />;
    if (state.input.trim()) return <Send className="h-4 w-4 text-text-inverse" />;
    return <AudioWaveform className="h-4 w-4 text-text-inverse" />;
  };

  const getActionButtonTooltip = () => {
    if (state.isRecording) return "Stop recording";
    if (state.input.trim()) return "Send";
    return "Voice input";
  };

  return (
    <TooltipProvider>
      {/* TTS Player - Positioned dynamically based on input height */}
      {state.showTTS && lastResponse && (
        <div 
          className="fixed left-1/2 transform -translate-x-1/2 z-tooltip w-full max-w-md px-4"
          style={{ 
            bottom: `${state.height + 120}px` // Dynamic positioning
          }}
        >
          <TTSPlayer 
            text={lastResponse}
            isVisible={state.showTTS}
            onClose={() => setState(prev => ({ ...prev, showTTS: false }))}
          />
        </div>
      )}
      
      {/* Main Input Container */}
      <div className={`flex justify-center w-full px-fluid-sm mt-fluid-xs lg:mt-0 ${className}`} ref={containerRef}>
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
          <div 
            className="flex flex-col w-full bg-bg-primary shadow-md border border-border-light"
            style={{
              borderRadius: 'var(--chat-input-border-radius)',
              padding: 'var(--chat-input-padding-y) var(--chat-input-padding-x)',
              minHeight: '94px', // Preserve original min-height
            }}
          >
            {/* Textarea Input */}
            <div className="flex-grow relative">
              <textarea
                ref={textareaRef}
                value={state.input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                placeholder={placeholder}
                disabled={isLoading}
                className="
                  w-full resize-none focus:outline-none bg-transparent border-none outline-none 
                  text-text-primary placeholder-text-tertiary
                  text-base lg:text-lg leading-normal
                  touch-manipulation pr-10
                "
                style={{
                  height: 'auto',
                  minHeight: 'var(--chat-input-min-height)',
                  maxHeight: 'var(--chat-input-max-height)',
                  overflowY: 'auto',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
                aria-label="Chat message input"
                aria-describedby="chat-input-help"
              />
              
              {/* Clear Button */}
              {state.input.trim() && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="
                        absolute right-2 top-1 p-1 rounded-md 
                        hover:bg-bg-tertiary transition-all duration-fast
                        text-text-tertiary hover:text-text-secondary
                        min-w-touch min-h-touch flex items-center justify-center
                      "
                      aria-label="Clear input"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Clear prompt bar</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Action Icons Row */}
            <div className="flex justify-between items-center mt-auto">
              {/* Left Side Icons */}
              <div className="flex gap-1 lg:gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Export chat"
                    >
                      <Share className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Export</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Download chat"
                    >
                      <Download className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
              </div>

              {/* Right Side Icons */}
              <div className="flex gap-1 lg:gap-2">
                {/* Model Selection Dropdown */}
                <div className="relative" ref={modelDropdownRef}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, showModelDropdown: !prev.showModelDropdown }))}
                        className="
                          p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                          text-text-secondary hover:text-text-primary touch-manipulation 
                          min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                          flex items-center justify-center
                        "
                        aria-label="Select AI model"
                        aria-expanded={state.showModelDropdown}
                        aria-haspopup="menu"
                      >
                        <Cpu className="h-5 w-5 lg:h-4 lg:w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Select your model</TooltipContent>
                  </Tooltip>

                  {/* Model Selection Dropdown Menu */}
                  {state.showModelDropdown && (
                    <div className="
                      absolute bottom-full mb-2 right-0 bg-bg-primary rounded-lg shadow-lg 
                      border border-border-light z-overlay min-w-max
                      animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2
                    ">
                      <div className="flex" role="menu" aria-label="Model selection">
                        {/* Creativity Column */}
                        <div className="p-4 min-w-[140px]">
                          <h3 className="font-semibold text-sm text-text-primary mb-1">Creativity</h3>
                          <p className="text-xs text-text-secondary mb-3">Inventive & Expressive</p>
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
                                role="menuitem"
                                className="
                                  w-full text-left text-sm text-text-primary hover:bg-bg-tertiary 
                                  py-1 px-2 rounded transition-all duration-fast
                                  flex items-center justify-between
                                "
                                onClick={() => {
                                  console.log(`Selected: ${model.name}`);
                                  setState(prev => ({ ...prev, showModelDropdown: false }));
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
                        <div className="w-px bg-border-light my-4"></div>

                        {/* Research Column */}
                        <div className="p-4 min-w-[140px]">
                          <h3 className="font-semibold text-sm text-text-primary mb-1">Research</h3>
                          <p className="text-xs text-text-secondary mb-3">Reasoning & Thinking</p>
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
                                role="menuitem"
                                className="
                                  w-full text-left text-sm text-text-primary hover:bg-bg-tertiary 
                                  py-1 px-2 rounded transition-all duration-fast
                                  flex items-center justify-between
                                "
                                onClick={() => {
                                  console.log(`Selected: ${model.name}`);
                                  setState(prev => ({ ...prev, showModelDropdown: false }));
                                }}
                              >
                                <span>{model.name}</span>
                                {model.badge && (
                                  <div className="flex items-center gap-1 ml-2">
                                    <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                      {model.badge}
                                    </span>
                                    <span className="text-xs text-text-tertiary">onwards</span>
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

                {/* File Upload */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Upload file"
                    >
                      <Paperclip className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>File upload</TooltipContent>
                </Tooltip>

                {/* Web References */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Web references"
                    >
                      <Globe className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Web references</TooltipContent>
                </Tooltip>

                {/* Voice Input */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Voice input"
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
                        onClick={() => setState(prev => ({ ...prev, showTTS: !prev.showTTS }))}
                        className={`
                          p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                          touch-manipulation min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                          flex items-center justify-center
                          ${state.showTTS 
                            ? 'text-brand-primary bg-brand-primary-bg' 
                            : 'text-text-secondary hover:text-text-primary'
                          }
                        `}
                        aria-label="Text to speech"
                        aria-pressed={state.showTTS}
                      >
                        <Volume2 className="h-5 w-5 lg:h-4 lg:w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Text to Speech</TooltipContent>
                  </Tooltip>
                )}

                {/* Send/Record Action Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      onClick={handleActionButtonClick}
                      disabled={isLoading}
                      className="
                        ml-2 w-12 h-12 lg:w-10 lg:h-10 rounded-full flex items-center justify-center
                        bg-gradient-to-r from-brand-primary to-brand-primary-light
                        hover:scale-105 hover:shadow-glow transition-all duration-fast
                        touch-manipulation disabled:opacity-50 disabled:hover:scale-100
                      "
                      aria-label={getActionButtonTooltip()}
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

      {/* Screen Reader Help */}
      <div id="chat-input-help" className="sr-only">
        Press Enter to send your message, or Shift+Enter for a new line.
      </div>
    </TooltipProvider>
  );
};

export default ChatInputNew;

  // Action button helpers
  const getActionButtonIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-text-inverse" />;
    if (state.isRecording) return <AudioWaveform className="h-4 w-4 text-text-inverse" />;
    if (state.input.trim()) return <Send className="h-4 w-4 text-text-inverse" />;
    return <AudioWaveform className="h-4 w-4 text-text-inverse" />;
  };

  const getActionButtonTooltip = () => {
    if (state.isRecording) return "Stop recording";
    if (state.input.trim()) return "Send";
    return "Voice input";
  };

  return (
    <TooltipProvider>
      {/* TTS Player - Positioned dynamically based on input height */}
      {state.showTTS && lastResponse && (
        <div 
          className="fixed left-1/2 transform -translate-x-1/2 z-tooltip w-full max-w-md px-4"
          style={{ 
            bottom: `${state.height + 120}px` // Dynamic positioning
          }}
        >
          <TTSPlayer 
            text={lastResponse}
            isVisible={state.showTTS}
            onClose={() => setState(prev => ({ ...prev, showTTS: false }))}
          />
        </div>
      )}
      
      {/* Main Input Container */}
      <div className={`flex justify-center w-full px-fluid-sm mt-fluid-xs lg:mt-0 ${className}`} ref={containerRef}>
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
          <div 
            className="flex flex-col w-full bg-bg-primary shadow-md border border-border-light"
            style={{
              borderRadius: 'var(--chat-input-border-radius)',
              padding: 'var(--chat-input-padding-y) var(--chat-input-padding-x)',
              minHeight: '94px', // Preserve original min-height
            }}
          >
            {/* Textarea Input */}
            <div className="flex-grow relative">
              <textarea
                ref={textareaRef}
                value={state.input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                placeholder={placeholder}
                disabled={isLoading}
                className="
                  w-full resize-none focus:outline-none bg-transparent border-none outline-none 
                  text-text-primary placeholder-text-tertiary
                  text-base lg:text-lg leading-normal
                  touch-manipulation pr-10
                "
                style={{
                  height: 'auto',
                  minHeight: 'var(--chat-input-min-height)',
                  maxHeight: 'var(--chat-input-max-height)',
                  overflowY: 'auto',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
                aria-label="Chat message input"
                aria-describedby="chat-input-help"
              />
              
              {/* Clear Button */}
              {state.input.trim() && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="
                        absolute right-2 top-1 p-1 rounded-md 
                        hover:bg-bg-tertiary transition-all duration-fast
                        text-text-tertiary hover:text-text-secondary
                        min-w-touch min-h-touch flex items-center justify-center
                      "
                      aria-label="Clear input"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Clear prompt bar</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Action Icons Row */}
            <div className="flex justify-between items-center mt-auto">
              {/* Left Side Icons */}
              <div className="flex gap-1 lg:gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Export chat"
                    >
                      <Share className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Export</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Download chat"
                    >
                      <Download className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
              </div>

              {/* Right Side Icons */}
              <div className="flex gap-1 lg:gap-2">
                {/* Model Selection Dropdown */}
                <div className="relative" ref={modelDropdownRef}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setState(prev => ({ ...prev, showModelDropdown: !prev.showModelDropdown }))}
                        className="
                          p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                          text-text-secondary hover:text-text-primary touch-manipulation 
                          min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                          flex items-center justify-center
                        "
                        aria-label="Select AI model"
                        aria-expanded={state.showModelDropdown}
                        aria-haspopup="menu"
                      >
                        <Cpu className="h-5 w-5 lg:h-4 lg:w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Select your model</TooltipContent>
                  </Tooltip>

                  {/* Model Selection Dropdown Menu */}
                  {state.showModelDropdown && (
                    <div className="
                      absolute bottom-full mb-2 right-0 bg-bg-primary rounded-lg shadow-lg 
                      border border-border-light z-overlay min-w-max
                      animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2
                    ">
                      <div className="flex" role="menu" aria-label="Model selection">
                        {/* Creativity Column */}
                        <div className="p-4 min-w-[140px]">
                          <h3 className="font-semibold text-sm text-text-primary mb-1">Creativity</h3>
                          <p className="text-xs text-text-secondary mb-3">Inventive & Expressive</p>
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
                                role="menuitem"
                                className="
                                  w-full text-left text-sm text-text-primary hover:bg-bg-tertiary 
                                  py-1 px-2 rounded transition-all duration-fast
                                  flex items-center justify-between
                                "
                                onClick={() => {
                                  console.log(`Selected: ${model.name}`);
                                  setState(prev => ({ ...prev, showModelDropdown: false }));
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
                        <div className="w-px bg-border-light my-4"></div>

                        {/* Research Column */}
                        <div className="p-4 min-w-[140px]">
                          <h3 className="font-semibold text-sm text-text-primary mb-1">Research</h3>
                          <p className="text-xs text-text-secondary mb-3">Reasoning & Thinking</p>
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
                                role="menuitem"
                                className="
                                  w-full text-left text-sm text-text-primary hover:bg-bg-tertiary 
                                  py-1 px-2 rounded transition-all duration-fast
                                  flex items-center justify-between
                                "
                                onClick={() => {
                                  console.log(`Selected: ${model.name}`);
                                  setState(prev => ({ ...prev, showModelDropdown: false }));
                                }}
                              >
                                <span>{model.name}</span>
                                {model.badge && (
                                  <div className="flex items-center gap-1 ml-2">
                                    <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                      {model.badge}
                                    </span>
                                    <span className="text-xs text-text-tertiary">onwards</span>
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

                {/* File Upload */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Upload file"
                    >
                      <Paperclip className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>File upload</TooltipContent>
                </Tooltip>

                {/* Web References */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Web references"
                    >
                      <Globe className="h-5 w-5 lg:h-4 lg:w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Web references</TooltipContent>
                </Tooltip>

                {/* Voice Input */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="
                        p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                        text-text-secondary hover:text-text-primary touch-manipulation 
                        min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                        flex items-center justify-center
                      "
                      aria-label="Voice input"
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
                        onClick={() => setState(prev => ({ ...prev, showTTS: !prev.showTTS }))}
                        className={`
                          p-3 lg:p-2 rounded-md hover:bg-bg-tertiary transition-all duration-fast
                          touch-manipulation min-h-touch min-w-touch lg:min-h-auto lg:min-w-auto 
                          flex items-center justify-center
                          ${state.showTTS 
                            ? 'text-brand-primary bg-brand-primary-bg' 
                            : 'text-text-secondary hover:text-text-primary'
                          }
                        `}
                        aria-label="Text to speech"
                        aria-pressed={state.showTTS}
                      >
                        <Volume2 className="h-5 w-5 lg:h-4 lg:w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Text to Speech</TooltipContent>
                  </Tooltip>
                )}

                {/* Send/Record Action Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      onClick={handleActionButtonClick}
                      disabled={isLoading}
                      className="
                        ml-2 w-12 h-12 lg:w-10 lg:h-10 rounded-full flex items-center justify-center
                        bg-gradient-to-r from-brand-primary to-brand-primary-light
                        hover:scale-105 hover:shadow-glow transition-all duration-fast
                        touch-manipulation disabled:opacity-50 disabled:hover:scale-100
                      "
                      aria-label={getActionButtonTooltip()}
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

      {/* Screen Reader Help */}
      <div id="chat-input-help" className="sr-only">
        Press Enter to send your message, or Shift+Enter for a new line.
      </div>
    </TooltipProvider>
  );
};

export default ChatInputNew;