import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CHARACTER_LIMITS } from '@/types';

interface TextFieldEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function TextFieldEditor({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  onFocus,
  onBlur,
}: TextFieldEditorProps) {
  const remaining = maxLength - value.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor={label} className="text-xs font-medium">
          {label}
        </Label>
        <span
          className={`text-xs ${
            isOverLimit
              ? 'text-red-500 font-semibold'
              : remaining <= 5
              ? 'text-yellow-500'
              : 'text-muted-foreground'
          }`}
        >
          {value.length}/{maxLength}
        </span>
      </div>
      <Input
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={isOverLimit ? 'border-red-500 focus-visible:ring-red-500' : ''}
        maxLength={maxLength + 10} // Allow slight overflow to show error
      />
      {isOverLimit && (
        <p className="text-xs text-red-500">
          {Math.abs(remaining)} characters over limit
        </p>
      )}
    </div>
  );
}

interface SocialCopyEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SocialCopyEditor({ value, onChange, onFocus, onBlur }: SocialCopyEditorProps) {
  const maxLength = CHARACTER_LIMITS.socialCopy;
  const remaining = maxLength - value.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="social-copy" className="text-sm font-medium">
          Social Copy
        </Label>
        <span
          className={`text-xs ${
            isOverLimit
              ? 'text-red-500 font-semibold'
              : remaining <= 5
              ? 'text-yellow-500'
              : 'text-muted-foreground'
          }`}
        >
          {value.length}/{maxLength}
        </span>
      </div>
      <Textarea
        id="social-copy"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Enter announcement text...&#10;(Use Enter for line breaks)"
        className={`resize-none ${isOverLimit ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        rows={4}
        maxLength={maxLength + 10}
      />
      {isOverLimit && (
        <p className="text-xs text-red-500">
          {Math.abs(remaining)} characters over limit
        </p>
      )}
    </div>
  );
}

interface ModelNameEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function ModelNameEditor({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
}: ModelNameEditorProps) {
  return (
    <TextFieldEditor
      label={label}
      value={value}
      onChange={onChange}
      maxLength={CHARACTER_LIMITS.modelName}
      placeholder="Enter model name..."
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
