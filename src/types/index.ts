export type Provider =
  | 'ai21'
  | 'anthropic'
  | 'azure-openai'
  | 'bayer'
  | 'black-forest-labs'
  | 'bria'
  | 'cerence'
  | 'claude'
  | 'cohere'
  | 'databricks'
  | 'deci'
  | 'deepseek'
  | 'fidelity'
  | 'foundry'
  | 'google'
  | 'grok'
  | 'huggingface'
  | 'jais'
  | 'meta'
  | 'microsoft'
  | 'mistral'
  | 'nixtla'
  | 'nvidia'
  | 'openai'
  | 'paige-ai'
  | 'rockwell'
  | 'sdaia'
  | 'sight-machine'
  | 'snowflake'
  | 'xai';

export type HeroCount = 1 | 2 | 3;

export interface ModelConfig {
  name: string;
  provider: Provider;
}

export type ProductType = 'github' | 'microsoft-foundry';

export const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'microsoft-foundry', label: 'Microsoft Foundry' },
];

export type BadgeType = 'preview' | 'generally-available' | 'new-release' | 'deprecate';

export const BADGE_TYPES: { value: BadgeType; label: string; color: string }[] = [
  { value: 'preview', label: 'PREVIEW', color: '#c9a44a' },
  { value: 'generally-available', label: 'GENERALLY AVAILABLE', color: '#6abf7b' },
  { value: 'new-release', label: 'NEW RELEASE', color: '#6abf7b' },
  { value: 'deprecate', label: 'DEPRECATE', color: '#d48078' },
];

export interface AssetConfig {
  socialCopy: string;
  heroCount: HeroCount;
  heroModel1: ModelConfig;
  heroModel2: ModelConfig;
  heroModel3: ModelConfig;
  otherModel1: ModelConfig;
  otherModel2: ModelConfig;
  backgroundSource: 'default' | 'custom';
  customBackgroundUrl?: string;
  badgeType: BadgeType;
  productType: ProductType;
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
  { value: 'ai21', label: 'AI21' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'azure-openai', label: 'Azure OpenAI' },
  { value: 'bayer', label: 'Bayer' },
  { value: 'black-forest-labs', label: 'Black Forest Labs' },
  { value: 'bria', label: 'Bria' },
  { value: 'cerence', label: 'Cerence' },
  { value: 'claude', label: 'Claude' },
  { value: 'cohere', label: 'Cohere' },
  { value: 'databricks', label: 'Databricks' },
  { value: 'deci', label: 'Deci' },
  { value: 'deepseek', label: 'Deepseek' },
  { value: 'fidelity', label: 'Fidelity' },
  { value: 'foundry', label: 'Foundry' },
  { value: 'google', label: 'Google' },
  { value: 'grok', label: 'Grok' },
  { value: 'huggingface', label: 'Hugging Face' },
  { value: 'jais', label: 'JAIs' },
  { value: 'meta', label: 'Meta' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'mistral', label: 'Mistral' },
  { value: 'nixtla', label: 'Nixtla' },
  { value: 'nvidia', label: 'NVIDIA' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'paige-ai', label: 'Paige AI' },
  { value: 'rockwell', label: 'Rockwell' },
  { value: 'sdaia', label: 'SDAIA' },
  { value: 'sight-machine', label: 'Sight Machine' },
  { value: 'snowflake', label: 'Snowflake' },
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
  backgroundSource: 'default',
  badgeType: 'new-release',
  productType: 'github',
};
