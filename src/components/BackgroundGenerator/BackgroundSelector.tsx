import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BackgroundGenerator } from './BackgroundGenerator';

interface BackgroundSelectorProps {
  backgroundSource: 'default' | 'custom';
  customBackgroundUrl?: string;
  onBackgroundChange: (source: 'default' | 'custom', url?: string) => void;
}

export function BackgroundSelector({
  backgroundSource,
  customBackgroundUrl,
  onBackgroundChange,
}: BackgroundSelectorProps) {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const handleBackgroundGenerated = (imageUrl: string) => {
    onBackgroundChange('custom', imageUrl);
  };

  const handleResetToDefault = () => {
    onBackgroundChange('default');
  };

  return (
    <>
      <Card className="gap-1 py-0">
        <CardContent className="px-3 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Background</Label>
            {backgroundSource === 'custom' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToDefault}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {/* Preview */}
          {customBackgroundUrl && backgroundSource === 'custom' && (
            <div className="relative">
              <img
                src={customBackgroundUrl}
                alt="Custom background"
                className="w-full h-20 object-cover rounded border border-border"
              />
              <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                Custom
              </div>
            </div>
          )}

          <Button
            variant={backgroundSource === 'custom' ? 'outline' : 'default'}
            size="sm"
            onClick={() => setIsGeneratorOpen(true)}
            className="w-full"
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Generate with Krea AI
          </Button>

          <p className="text-[10px] text-muted-foreground">
            Create custom backgrounds using AI or use the default design
          </p>
        </CardContent>
      </Card>

      {/* Generator Dialog */}
      <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Background Generator</DialogTitle>
          </DialogHeader>
          <BackgroundGenerator
            onBackgroundGenerated={handleBackgroundGenerated}
            onClose={() => setIsGeneratorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
