import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PROVIDERS, type Provider } from '@/types';
import { getProviderLogo } from '@/lib/providers';

interface ProviderDropdownProps {
  label: string;
  value: Provider;
  onChange: (value: Provider) => void;
}

export function ProviderDropdown({
  label,
  value,
  onChange,
}: ProviderDropdownProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as Provider)}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <img
                src={getProviderLogo(value)}
                alt={value}
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span>
                {PROVIDERS.find((p) => p.value === value)?.label || value}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PROVIDERS.map((provider) => (
            <SelectItem key={provider.value} value={provider.value}>
              <div className="flex items-center gap-2">
                <img
                  src={getProviderLogo(provider.value)}
                  alt={provider.label}
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span>{provider.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
