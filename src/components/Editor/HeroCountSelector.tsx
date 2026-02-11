import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { HeroCount } from '@/types';

interface HeroCountSelectorProps {
  value: HeroCount;
  onChange: (value: HeroCount) => void;
}

export function HeroCountSelector({ value, onChange }: HeroCountSelectorProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">Number of New Models</Label>
      <Select
        value={value.toString()}
        onValueChange={(v) => onChange(parseInt(v) as HeroCount)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 Model</SelectItem>
          <SelectItem value="2">2 Models</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
