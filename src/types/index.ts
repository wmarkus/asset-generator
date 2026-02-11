export type Provider = 'openai' | 'anthropic' | 'google' | 'xai';

export type HeroCount = 1 | 2 | 3;

export interface ModelConfig {
  name: string;
  provider: Provider;
}

export interface AssetConfig {
  socialCopy: string;
  heroCount: HeroCount;
  heroModel1: ModelConfig;
  heroModel2: ModelConfig;
  heroModel3: ModelConfig;
  otherModel1: ModelConfig;
  otherModel2: ModelConfig;
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}

export type AssetType = 'social' | 'header';

// Fields that can be focused for highlight on canvas
export type FocusedField = 
  | 'socialCopy'
  | 'heroModel1'
  | 'heroModel2'
  | 'heroModel3'
  | 'otherModel1'
  | 'otherModel2'
  | null;

export interface AssetDimensions {
  width: number;
  height: number;
}

// Static dimensions for social card (doesn't change with hero count)
export const ASSET_DIMENSIONS: Record<AssetType, AssetDimensions> = {
  social: { width: 2400, height: 1260 },
  header: { width: 2064, height: 600 }, // Base dimension for 1 hero
};

// Dynamic header height based on hero count
export const getHeaderHeight = (heroCount: HeroCount): number => {
  switch (heroCount) {
    case 1: return 600;
    case 2: return 713;
    case 3: return 826; // Future: add ~113px per additional hero
  }
};

export const CHARACTER_LIMITS = {
  socialCopy: 60,
  modelName: 30,
} as const;

export const PROVIDERS: { value: Provider; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google', label: 'Google' },
  { value: 'xai', label: 'xAI' },
];

export const DEFAULT_CONFIG: AssetConfig = {
  socialCopy: 'GPT-5.2-Codex now available in GitHub Copilot',
  heroCount: 1,
  heroModel1: { name: 'GPT-5.2-Codex', provider: 'openai' },
  heroModel2: { name: 'GPT-5.2', provider: 'openai' },
  heroModel3: { name: 'GPT-5.2-Mini', provider: 'openai' },
  otherModel1: { name: 'Gemini 3 Pro (Preview)', provider: 'google' },
  otherModel2: { name: 'Claude Opus 4.5', provider: 'anthropic' },
};
