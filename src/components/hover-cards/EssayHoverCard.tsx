import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface EssayHoverCardProps {
  children: React.ReactNode;
}

const EssayHoverCard: React.FC<EssayHoverCardProps> = ({ children }) => {
  const [showCard, setShowCard] = useState(false);
  const [essayTitle, setEssayTitle] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [customTone, setCustomTone] = useState('');
  const [customAudience, setCustomAudience] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('essayFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setEssayTitle(parsed.essayTitle || '');
        setKeyPoints(parsed.keyPoints || '');
        setWordCount(parsed.wordCount || '');
        setSelectedTones(parsed.selectedTones || []);
        setSelectedAudiences(parsed.selectedAudiences || []);
      } catch (error) {
        console.error('Error loading saved essay data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const dataToSave = {
      essayTitle,
      keyPoints,
      wordCount,
      selectedTones,
      selectedAudiences,
    };
    localStorage.setItem('essayFormData', JSON.stringify(dataToSave));
  }, [essayTitle, keyPoints, wordCount, selectedTones, selectedAudiences]);

  const toneOptions = [
    'Formal', 'Analytical', 'Neutral', 'Creative', 'Imaginative',
    'Academic', 'Narrative', 'Persuasive', 'Critical', 'Optimistic',
    'Humourous', 'Empathetic', 'Assertive', 'Motivational',
  ];

  const audienceOptions = [
    'General', 'Academic', 'Business', 'Technical', 'Professional',
    'Investors', 'Community', 'Media', 'Government', 'Indian', 'Global',
  ];

  const handleToneChange = (value: string) => {
    if (value === 'Others') return;
    if (selectedTones.length < 3 && !selectedTones.includes(value)) {
      setSelectedTones([...selectedTones, value]);
    }
  };

  const handleAudienceChange = (value: string) => {
    if (value === 'Others') return;
    if (selectedAudiences.length < 3 && !selectedAudiences.includes(value)) {
      setSelectedAudiences([...selectedAudiences, value]);
    }
  };

  const removeTone = (tone: string) => {
    setSelectedTones(selectedTones.filter((t) => t !== tone));
  };

  const removeAudience = (audience: string) => {
    setSelectedAudiences(selectedAudiences.filter((a) => a !== audience));
  };

  const addCustomTone = () => {
    if (customTone && selectedTones.length < 3 && !selectedTones.includes(customTone)) {
      setSelectedTones([...selectedTones, customTone]);
      setCustomTone('');
    }
  };

  const addCustomAudience = () => {
    if (customAudience && selectedAudiences.length < 3 && !selectedAudiences.includes(customAudience)) {
      setSelectedAudiences([...selectedAudiences, customAudience]);
      setCustomAudience('');
    }
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowCard(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowCard(false);
    }, 250);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCard) {
        const target = event.target as HTMLElement;
        const card = document.querySelector('[data-essay-card]');
        if (card && !card.contains(target) && !target.closest('[data-essay-trigger]')) {
          setShowCard(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCard]);

  return (
    <div className="relative">
      {/* Trigger Element */}
      <div 
        data-essay-trigger
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowCard(!showCard)}
      >
        {children}
      </div>

      {/* Full Screen Hover Area + Card */}
      {showCard && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          <div
            data-essay-card
            className="absolute left-[620px] top-[140px] w-80 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <div className="p-4 bg-pastel-lavender border border-pastel-lavender-hover rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-2 pb-2 border-b border-pastel-lavender-hover">
                  <span className="text-lg">📄</span>
                  <div>
                    <h3 className="font-semibold text-sidebar-text-violet text-lg">Essay</h3>
                    <p className="text-xs text-sidebar-text-dark italic">
                      Structured, formal writing — balanced arguments and clarity.
                    </p>
                  </div>
                </div>

                {/* Essay Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="essay-title" className="text-sm font-medium text-sidebar-text-dark">
                    Essay Title
                  </Label>
                  <Input
                    id="essay-title"
                    value={essayTitle}
                    onChange={(e) => setEssayTitle(e.target.value)}
                    placeholder="Enter your essay title..."
                    className="text-sm"
                  />
                </div>

                {/* Key Points Input */}
                <div className="space-y-2">
                  <Label htmlFor="key-points" className="text-sm font-medium text-sidebar-text-dark">
                    Key Points / Topics
                  </Label>
                  <Textarea
                    id="key-points"
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    placeholder="List your main points or topics..."
                    className="text-sm min-h-[70px] resize-none"
                  />
                </div>

                {/* Word Count Input */}
                <div className="space-y-2">
                  <Label htmlFor="word-count" className="text-sm font-medium text-sidebar-text-dark">
                    Word Count
                  </Label>
                  <Input
                    id="word-count"
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    placeholder="400–2000"
                    min="400"
                    max="2000"
                    className="text-sm"
                  />
                </div>

                {/* Tone Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-sidebar-text-dark">Tone (Choose up to 3)</Label>
                  <Select onValueChange={handleToneChange} value="">
                    <SelectTrigger className="text-sm">
                      <SelectValue
                        placeholder={
                          selectedTones.length > 0
                            ? `${selectedTones.length}/3 selected`
                            : 'Select tone...'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="z-[300] bg-white border shadow-lg max-h-48 overflow-auto"
                      sideOffset={5}
                      onPointerDownOutside={(e) => e.preventDefault()}
                    >
                      {toneOptions.map((tone) => (
                        <SelectItem
                          key={tone}
                          value={tone}
                          disabled={selectedTones.includes(tone)}
                          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {tone}
                        </SelectItem>
                      ))}
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Custom Tone Input */}
                  <div className="flex gap-2">
                    <Input
                      value={customTone}
                      onChange={(e) => setCustomTone(e.target.value)}
                      placeholder="Custom tone..."
                      className="text-sm flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTone()}
                    />
                    <Button
                      size="sm"
                      onClick={addCustomTone}
                      disabled={!customTone || selectedTones.length >= 3}
                      className="bg-[#6F42C1] hover:bg-[#5A359A] text-white text-xs"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Selected Tones */}
                  <div className="min-h-[40px] p-2 border border-gray-200 rounded-md bg-gray-50">
                    {selectedTones.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedTones.map((tone) => (
                          <span
                            key={tone}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#6F42C1] text-white text-xs rounded-full"
                          >
                            {tone}
                            <button
                              onClick={() => removeTone(tone)}
                              className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Selected tones will appear here...
                      </span>
                    )}
                  </div>
                </div>

                {/* Audience Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-sidebar-text-dark">Audience (Choose up to 3)</Label>
                  <Select onValueChange={handleAudienceChange} value="">
                    <SelectTrigger className="text-sm">
                      <SelectValue
                        placeholder={
                          selectedAudiences.length > 0
                            ? `${selectedAudiences.length}/3 selected`
                            : 'Select audience...'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="z-[300] bg-white border shadow-lg max-h-48 overflow-auto"
                      sideOffset={5}
                      onPointerDownOutside={(e) => e.preventDefault()}
                    >
                      {audienceOptions.map((audience) => (
                        <SelectItem
                          key={audience}
                          value={audience}
                          disabled={selectedAudiences.includes(audience)}
                          className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {audience}
                        </SelectItem>
                      ))}
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Custom Audience Input */}
                  <div className="flex gap-2">
                    <Input
                      value={customAudience}
                      onChange={(e) => setCustomAudience(e.target.value)}
                      placeholder="Custom audience..."
                      className="text-sm flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomAudience()}
                    />
                    <Button
                      size="sm"
                      onClick={addCustomAudience}
                      disabled={!customAudience || selectedAudiences.length >= 3}
                      className="bg-[#6F42C1] hover:bg-[#5A359A] text-white text-xs"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Selected Audiences */}
                  <div className="min-h-[40px] p-2 border border-gray-200 rounded-md bg-gray-50">
                    {selectedAudiences.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedAudiences.map((audience) => (
                          <span
                            key={audience}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#6F42C1] text-white text-xs rounded-full"
                          >
                            {audience}
                            <button
                              onClick={() => removeAudience(audience)}
                              className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Selected audiences will appear here...
                      </span>
                    )}
                  </div>
                </div>

                {/* Start Essay Button */}
                <Button
                  className="w-full bg-[#6F42C1] hover:bg-[#5A359A] text-white transition-colors duration-200"
                  onClick={() => console.log('Start Essay clicked')}
                >
                  Start Essay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayHoverCard;
