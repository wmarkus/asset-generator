import type { Provider } from '@/types';

// Helper to get correct path with base URL
const base = import.meta.env.BASE_URL;

export const providerLogos: Record<Provider, string> = {
  openai: `${base}logos/OpenAi.png`,
  anthropic: `${base}logos/Antropic.png`,
  google: `${base}logos/Google.png`,
  xai: `${base}logos/xAi.png`,
};

export const providerColors: Record<Provider, string> = {
  openai: '#10a37f',
  anthropic: '#d97706',
  google: '#4285f4',
  xai: '#1d9bf0',
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
