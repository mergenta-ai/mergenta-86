import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sun, Moon, Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  value: string;
  variant: string;
  onThemeChange: (theme: string) => void;
  onVariantChange: (variant: string) => void;
}

const themes = [
  {
    id: 'light',
    name: 'Light',
    icon: Sun,
    preview: 'bg-white border-gray-200'
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: Moon,
    preview: 'bg-gray-900 border-gray-700 text-white'
  }
];

const variants = [
  {
    id: 'default',
    name: 'Default',
    preview: 'bg-gradient-to-r from-mergenta-violet to-mergenta-magenta'
  },
  {
    id: 'purple',
    name: 'Purple Dreams',
    preview: 'bg-gradient-to-r from-purple-500 to-purple-700'
  },
  {
    id: 'pink',
    name: 'Rose Gold',
    preview: 'bg-gradient-to-r from-pink-400 to-rose-400'
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    preview: 'bg-gradient-to-r from-blue-500 to-cyan-400'
  },
  {
    id: 'green',
    name: 'Forest Green',
    preview: 'bg-gradient-to-r from-green-500 to-emerald-400'
  }
];

export const ThemeSelector = ({ 
  value, 
  variant, 
  onThemeChange, 
  onVariantChange 
}: ThemeSelectorProps) => {
  return (
    <div className="space-y-4">
      {/* Theme Mode Selection */}
      <div className="space-y-2">
        <Label>Theme Mode</Label>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <Button
                key={theme.id}
                variant={value === theme.id ? "default" : "outline"}
                className={`justify-start h-12 ${
                  value === theme.id 
                    ? 'bg-gradient-primary border-mergenta-violet' 
                    : 'border-pastel-violet hover:bg-pastel-violet'
                }`}
                onClick={() => onThemeChange(theme.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {theme.name}
                {value === theme.id && <Check className="h-4 w-4 ml-auto" />}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Color Variant Selection */}
      <div className="space-y-2">
        <Label>Color Variant</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {variants.map((variantOption) => (
            <Card
              key={variantOption.id}
              className={`relative p-3 cursor-pointer transition-all hover:shadow-soft ${
                variant === variantOption.id 
                  ? 'ring-2 ring-mergenta-violet shadow-glow' 
                  : 'border-pastel-violet hover:border-mergenta-violet'
              }`}
              onClick={() => onVariantChange(variantOption.id)}
            >
              <div className="space-y-2">
                <div className={`w-full h-8 rounded ${variantOption.preview}`} />
                <div className="text-sm font-medium text-center">
                  {variantOption.name}
                </div>
                {variant === variantOption.id && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-white rounded-full p-1 shadow-soft">
                      <Check className="h-3 w-3 text-mergenta-violet" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Theme Preview */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card className={`p-4 ${value === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
          <div className="space-y-3">
            <div className={`h-3 rounded ${variants.find(v => v.id === variant)?.preview}`} />
            <div className="space-y-2">
              <div className="h-2 bg-gray-300 rounded w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-primary rounded px-3 text-xs flex items-center text-primary-foreground">
                Button
              </div>
              <div className="h-6 border border-gray-300 rounded px-3 text-xs flex items-center">
                Outline
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};