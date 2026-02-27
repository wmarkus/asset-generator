import type { Provider, ProductType } from '@/types';

// Helper to get correct path with base URL
const base = import.meta.env.BASE_URL;

export const productLogos: Record<ProductType, string> = {
  'github': `${base}icons/mark-github-24.svg`,
  'microsoft-foundry': `${base}logos/Foundry White.png`,
};

export function getProductLogo(product: ProductType): string {
  return productLogos[product];
}

export const providerLogos: Record<Provider, string> = {
  'ai21': `${base}logos/AI21.png`,
  'anthropic': `${base}logos/Antropic.png`,
  'azure-openai': `${base}logos/Azure OpenAI.png`,
  'bayer': `${base}logos/Bayer.png`,
  'black-forest-labs': `${base}logos/Black Forest Labs.png`,
  'bria': `${base}logos/Bria.png`,
  'cerence': `${base}logos/Cerence.png`,
  'claude': `${base}logos/Claude.png`,
  'cohere': `${base}logos/Cohere.png`,
  'databricks': `${base}logos/Databricks.png`,
  'deci': `${base}logos/Deci.png`,
  'deepseek': `${base}logos/Deepseek.png`,
  'fidelity': `${base}logos/Fidelity.png`,
  'foundry': `${base}logos/Foundry.png`,
  'google': `${base}logos/Google.png`,
  'grok': `${base}logos/Grok.png`,
  'huggingface': `${base}logos/Huggingface.png`,
  'jais': `${base}logos/JAIs.png`,
  'meta': `${base}logos/Meta.png`,
  'microsoft': `${base}logos/Microsoft.png`,
  'mistral': `${base}logos/Mistral.png`,
  'nixtla': `${base}logos/Nixtla.png`,
  'nvidia': `${base}logos/Nvidia.png`,
  'openai': `${base}logos/OpenAi.png`,
  'paige-ai': `${base}logos/Paige AI.png`,
  'rockwell': `${base}logos/Rockwell.png`,
  'sdaia': `${base}logos/SDAIA.png`,
  'sight-machine': `${base}logos/Sight Machine.png`,
  'snowflake': `${base}logos/Snowflake.png`,
  'xai': `${base}logos/xAi.png`,
};

export const providerColors: Record<Provider, string> = {
  'ai21': '#6C3AFF',
  'anthropic': '#d97706',
  'azure-openai': '#0078D4',
  'bayer': '#10857F',
  'black-forest-labs': '#1A1A1A',
  'bria': '#6366F1',
  'cerence': '#00A3E0',
  'claude': '#D97706',
  'cohere': '#39594D',
  'databricks': '#FF3621',
  'deci': '#4F46E5',
  'deepseek': '#4D6BFE',
  'fidelity': '#4A8C2A',
  'foundry': '#6B7280',
  'google': '#4285f4',
  'grok': '#F05A28',
  'huggingface': '#FFD21E',
  'jais': '#6B21A8',
  'meta': '#0668E1',
  'microsoft': '#00A4EF',
  'mistral': '#F54E42',
  'nixtla': '#3B82F6',
  'nvidia': '#76B900',
  'openai': '#10a37f',
  'paige-ai': '#E91E63',
  'rockwell': '#C8102E',
  'sdaia': '#005030',
  'sight-machine': '#00BCD4',
  'snowflake': '#29B5E8',
  'xai': '#1d9bf0',
};

export function getProviderLogo(provider: Provider): string {
  return providerLogos[provider];
}

export function getProviderColor(provider: Provider): string {
  return providerColors[provider];
}

// Helper for overlay images
export function getOverlayPath(filename: string): string {
  return `${base}overlays/${filename}`;
}

// Helper for background images
export function getBackgroundPath(filename: string): string {
  return `${base}backgrounds/${filename}`;
}

// Helper for icon images
export function getIconPath(filename: string): string {
  return `${base}icons/${filename}`;
}
