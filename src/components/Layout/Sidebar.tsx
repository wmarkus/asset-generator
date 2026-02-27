import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Film, Loader2, X, FileVideo } from 'lucide-react';
import { SocialCopyEditor, ModelSelector, HeroCountSelector } from '@/components/Editor';
import { BackgroundSelector } from '@/components/BackgroundGenerator';
import type { AssetConfig, AssetType, Provider, HeroCount, FocusedField, BadgeType, ProductType } from '@/types';
import { BADGE_TYPES, PRODUCT_TYPES } from '@/types';
import { useExportAnimation } from '@/hooks/useExportAnimation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SidebarProps {
  config: AssetConfig;
  activeAsset: AssetType;
  onConfigChange: (config: AssetConfig) => void;
  onExport: () => void;
  focusedField: FocusedField;
  onFocusField: (field: FocusedField) => void;
}

export function Sidebar({
  config,
  activeAsset,
  onConfigChange,
  onExport,
  focusedField: _focusedField,
  onFocusField,
}: SidebarProps) {
  const updateHeroModel1 = (field: 'name' | 'provider', value: string) => {
    onConfigChange({
      ...config,
      heroModel1: {
        ...config.heroModel1,
        [field]: value,
      },
    });
  };

  const updateHeroModel2 = (field: 'name' | 'provider', value: string) => {
    onConfigChange({
      ...config,
      heroModel2: {
        ...config.heroModel2,
        [field]: value,
      },
    });
  };

  const updateHeroModel3 = (field: 'name' | 'provider', value: string) => {
    onConfigChange({
      ...config,
      heroModel3: {
        ...config.heroModel3,
        [field]: value,
      },
    });
  };

  const updateOtherModel1 = (field: 'name' | 'provider', value: string) => {
    onConfigChange({
      ...config,
      otherModel1: {
        ...config.otherModel1,
        [field]: value,
      },
    });
  };

  const updateOtherModel2 = (field: 'name' | 'provider', value: string) => {
    onConfigChange({
      ...config,
      otherModel2: {
        ...config.otherModel2,
        [field]: value,
      },
    });
  };

  const updateHeroCount = (heroCount: HeroCount) => {
    onConfigChange({
      ...config,
      heroCount,
    });
  };

  const handleBackgroundChange = (source: 'default' | 'custom', url?: string) => {
    onConfigChange({
      ...config,
      backgroundSource: source,
      customBackgroundUrl: url,
    });
  };

  return (
    <aside className="w-80 border-r bg-muted/30 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-dark" style={{ direction: 'rtl' }}>
        <div className="space-y-3" style={{ direction: 'ltr' }}>
        {/* Background Selector */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground px-1">
            Background
          </h3>
          <BackgroundSelector
            backgroundSource={config.backgroundSource}
            customBackgroundUrl={config.customBackgroundUrl}
            onBackgroundChange={handleBackgroundChange}
          />
        </div>

        {/* Product */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground px-1">
            Product
          </h3>
          <Card className="gap-1 py-0">
            <CardContent className="px-3 py-2">
              <Label className="text-xs text-muted-foreground mb-1 block">Product Name</Label>
              <Select
                value={config.productType}
                onValueChange={(value: ProductType) =>
                  onConfigChange({ ...config, productType: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((product) => (
                    <SelectItem key={product.value} value={product.value}>
                      {product.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Badge Type */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground px-1">
            Badge
          </h3>
          <Card className="gap-1 py-0">
            <CardContent className="px-3 py-2">
              <Label className="text-xs text-muted-foreground mb-1 block">Badge Label</Label>
              <Select
                value={config.badgeType}
                onValueChange={(value: BadgeType) =>
                  onConfigChange({ ...config, badgeType: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BADGE_TYPES.map((badge) => (
                    <SelectItem key={badge.value} value={badge.value}>
                      {badge.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Social Copy */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground px-1">
            Announcement Text
          </h3>
          <Card className="gap-1 py-0">
            <CardContent className="px-3 py-2">
              <SocialCopyEditor
                value={config.socialCopy}
                onChange={(value) =>
                  onConfigChange({ ...config, socialCopy: value })
                }
                onFocus={() => onFocusField('socialCopy')}
                onBlur={() => onFocusField(null)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Model Configuration */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground px-1">
            Model List
          </h3>

          {/* Hero Count Selector */}
          <Card className="gap-1 py-0 border-muted">
            <CardContent className="px-3 py-2">
              <HeroCountSelector
                value={config.heroCount}
                onChange={updateHeroCount}
              />
            </CardContent>
          </Card>

          <ModelSelector
            label={config.heroCount > 1 ? "New Model 1 (Selected)" : "New Model (Selected)"}
            model={config.heroModel1}
            onNameChange={(name) => updateHeroModel1('name', name)}
            onProviderChange={(provider: Provider) =>
              updateHeroModel1('provider', provider)
            }
            onFocus={() => onFocusField('heroModel1')}
            onBlur={() => onFocusField(null)}
          />

          {config.heroCount >= 2 && (
            <ModelSelector
              label="New Model 2"
              model={config.heroModel2}
              onNameChange={(name) => updateHeroModel2('name', name)}
              onProviderChange={(provider: Provider) =>
                updateHeroModel2('provider', provider)
              }
              onFocus={() => onFocusField('heroModel2')}
              onBlur={() => onFocusField(null)}
            />
          )}

          {config.heroCount >= 3 && (
            <ModelSelector
              label="New Model 3"
              model={config.heroModel3}
              onNameChange={(name) => updateHeroModel3('name', name)}
              onProviderChange={(provider: Provider) =>
                updateHeroModel3('provider', provider)
              }
              onFocus={() => onFocusField('heroModel3')}
              onBlur={() => onFocusField(null)}
            />
          )}

          <ModelSelector
            label="Old Model 1"
            model={config.otherModel1}
            onNameChange={(name) => updateOtherModel1('name', name)}
            onProviderChange={(provider: Provider) =>
              updateOtherModel1('provider', provider)
            }
            onFocus={() => onFocusField('otherModel1')}
            onBlur={() => onFocusField(null)}
          />

          <ModelSelector
            label="Old Model 2"
            model={config.otherModel2}
            onNameChange={(name) => updateOtherModel2('name', name)}
            onProviderChange={(provider: Provider) =>
              updateOtherModel2('provider', provider)
            }
            onFocus={() => onFocusField('otherModel2')}
            onBlur={() => onFocusField(null)}
          />
        </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="p-4 border-t bg-background space-y-2">
        <Button onClick={onExport} className="w-full" size="lg">
          <Download className="mr-2 h-4 w-4" />
          Download {activeAsset === 'social' ? 'Social Card' : 'Header'} PNG
        </Button>

        {activeAsset === 'social' && (
          <AnimatedExportSection config={config} />
        )}
      </div>
    </aside>
  );
}

function AnimatedExportSection({ config }: { config: AssetConfig }) {
  const { state, exportAnimation, cancel, reset, download } = useExportAnimation();

  if (state.status === 'idle') {
    return (
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => exportAnimation(config, 'both')}
      >
        <Film className="mr-2 h-4 w-4" />
        Export Animation (MP4 + WebM)
      </Button>
    );
  }

  if (state.status === 'rendering' || state.status === 'encoding') {
    return (
      <Card className="py-0 gap-0">
        <CardContent className="px-3 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              {state.message}
            </span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={cancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.status === 'done') {
    return (
      <Card className="py-0 gap-0">
        <CardContent className="px-3 py-3 space-y-2">
          <p className="text-xs font-medium text-green-500">✓ Export complete!</p>
          <div className="flex gap-2">
            {state.mp4Url && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => download(state.mp4Url!, 'social-card-animation.mp4')}
              >
                <FileVideo className="mr-1 h-3 w-3" />
                MP4
              </Button>
            )}
            {state.webmUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => download(state.webmUrl!, 'social-card-animation.webm')}
              >
                <FileVideo className="mr-1 h-3 w-3" />
                WebM
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={reset}>
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state.status === 'error') {
    return (
      <Card className="py-0 gap-0">
        <CardContent className="px-3 py-3 space-y-2">
          <p className="text-xs text-red-500">{state.error}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={reset}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
