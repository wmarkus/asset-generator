import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModelNameEditor } from './TextFieldEditor';
import { ProviderDropdown } from './ProviderDropdown';
import type { ModelConfig, Provider } from '@/types';

interface ModelSelectorProps {
  label: string;
  model: ModelConfig;
  onNameChange: (name: string) => void;
  onProviderChange: (provider: Provider) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function ModelSelector({
  label,
  model,
  onNameChange,
  onProviderChange,
  onFocus,
  onBlur,
}: ModelSelectorProps) {
  return (
    <Card className="border-muted gap-1 py-0">
      <CardHeader className="px-3 pt-2 pb-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 px-3 pt-1 pb-2">
        <ModelNameEditor
          label="Model Name"
          value={model.name}
          onChange={onNameChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <ProviderDropdown
          label="Provider"
          value={model.provider}
          onChange={onProviderChange}
        />
      </CardContent>
    </Card>
  );
}
