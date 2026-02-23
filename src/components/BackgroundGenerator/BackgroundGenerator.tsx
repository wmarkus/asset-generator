import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { mockGenerateImage, KREA_STYLE_PRESETS, type KreaGenerateRequest } from '@/lib/api/krea';

interface BackgroundGeneratorProps {
  onBackgroundGenerated: (imageUrl: string) => void;
  onClose: () => void;
}

export function BackgroundGenerator({ onBackgroundGenerated, onClose }: BackgroundGeneratorProps) {
  const [prompt, setPrompt] = useState('abstract tech gradient background, dark theme, modern');
  const [selectedStyle, setSelectedStyle] = useState(KREA_STYLE_PRESETS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHistory, setGeneratedHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const request: KreaGenerateRequest = {
        prompt: prompt.trim(),
        width: 2400,
        height: 1260,
        stylePreset: selectedStyle,
      };

      // Using mock for now - replace with real API when keys are configured
      const response = await mockGenerateImage(request);

      if (response.status === 'completed' && response.imageUrl) {
        setGeneratedHistory(prev => [response.imageUrl!, ...prev]);
      } else if (response.status === 'failed') {
        setError(response.error || 'Generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseBackground = (imageUrl: string) => {
    onBackgroundGenerated(imageUrl);
    onClose();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Background with Krea AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe your background</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., abstract tech gradient, dark theme, futuristic"
              disabled={isGenerating}
            />
          </div>

          {/* Style Preset */}
          <div className="space-y-2">
            <Label htmlFor="style">Style Preset</Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isGenerating}>
              <SelectTrigger id="style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KREA_STYLE_PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">{preset.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Background
              </>
            )}
          </Button>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Images History */}
      {generatedHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="h-4 w-4" />
              Generated Backgrounds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {generatedHistory.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Generated ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border border-border"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      onClick={() => handleUseBackground(imageUrl)}
                    >
                      Use This
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Currently using mock generation for development. 
            Configure your Krea API key in environment variables to enable real generation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
