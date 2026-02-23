export interface KreaGenerateRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  stylePreset?: string;
}

export interface KreaGenerateResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageUrl?: string;
  error?: string;
}

export interface KreaStylePreset {
  id: string;
  name: string;
  description: string;
  preview?: string;
}

export const KREA_STYLE_PRESETS: KreaStylePreset[] = [
  {
    id: 'tech-gradient',
    name: 'Tech Gradient',
    description: 'Modern gradient with tech vibes',
  },
  {
    id: 'abstract-geometric',
    name: 'Abstract Geometric',
    description: 'Sharp geometric shapes and patterns',
  },
  {
    id: 'dark-nebula',
    name: 'Dark Nebula',
    description: 'Deep space with colorful nebula clouds',
  },
  {
    id: 'cyber-grid',
    name: 'Cyber Grid',
    description: 'Futuristic grid and neon accents',
  },
  {
    id: 'minimal-blur',
    name: 'Minimal Blur',
    description: 'Soft blurred background with subtle colors',
  },
];

class KreaAPIClient {
  private apiKey: string;
  private baseUrl = 'https://api.krea.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(request: KreaGenerateRequest): Promise<KreaGenerateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          negative_prompt: request.negativePrompt || 'text, watermark, signature, blur',
          width: request.width || 2400,
          height: request.height || 1260,
          style_preset: request.stylePreset,
        }),
      });

      if (!response.ok) {
        throw new Error(`Krea API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        status: data.status,
        imageUrl: data.image_url,
        error: data.error,
      };
    } catch (error) {
      console.error('Krea API error:', error);
      throw error;
    }
  }

  async getGenerationStatus(id: string): Promise<KreaGenerateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Krea API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        status: data.status,
        imageUrl: data.image_url,
        error: data.error,
      };
    } catch (error) {
      console.error('Krea API error:', error);
      throw error;
    }
  }
}

export function createKreaClient(apiKey: string): KreaAPIClient {
  return new KreaAPIClient(apiKey);
}

// Mock implementation for development/testing
export async function mockGenerateImage(_request: KreaGenerateRequest): Promise<KreaGenerateResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock successful response
  return {
    id: `mock-${Date.now()}`,
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=2400&h=1260&fit=crop',
  };
}

// Helper to poll for completion
export async function pollGenerationStatus(
  client: KreaAPIClient,
  id: string,
  maxAttempts = 30,
  intervalMs = 2000
): Promise<KreaGenerateResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await client.getGenerationStatus(id);
    
    if (status.status === 'completed' || status.status === 'failed') {
      return status;
    }
    
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  throw new Error('Generation timeout - please try again');
}
