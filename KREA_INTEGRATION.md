# Krea AI Background Generator Integration

## Overview

This project now includes AI-powered background generation using Krea AI. Users can generate custom backgrounds from text prompts instead of using the default static backgrounds.

## Features

 What's New### 

- **AI Background Generation**: Generate custom backgrounds using natural language prompts
- **Style Presets**: Pre-configured styles optimized for tech/product launches:
  - Tech Gradient
  - Abstract Geometric
  - Dark Nebula
  - Cyber Grid
  - Minimal Blur
- **Generation History**: View and reuse previously generated backgrounds
- **Seamless Integration**: Generated backgrounds work with both Social Card and Header assets
- **Mock Mode**: Development-ready with mock generation (no API key needed for testing)

## File Structure

```
src/
 lib/
 api/   
 krea.ts              # Krea API client and mock implementation       
 components/
 BackgroundGenerator/   
 BackgroundGenerator.tsx   # Main generator UI with prompts       
 BackgroundSelector.tsx    # Sidebar integration component       
 index.ts       
 types/index.ts               # Updated AssetConfig with background fields
```

## Usage

### For End Users

1. **Open Background Generator**
   - In the sidebar, find the "Background" section
   - Click "Generate with Krea AI" button

2. **Create Background**
   - Enter a description (e.g., "futuristic gradient with purple tones")
   - Select a style preset
   - Click "Generate Background"
   - Wait ~2-5 seconds for generation

3. **Use Generated Image**
   - View generated images in the history grid
   - Hover over an image and click "Use This"
   - Background applies to both Social Card and Header

4. **Reset to Default**
   - Click "Reset" button to return to original background

### For Developers

#### Mock Mode (Default)

Currently using `mockGenerateImage()` which returns a placeholder image from Unsplash. No API key needed.

#### Production Mode with Real API

1. **Get Krea API Key**
   - Sign up at https://krea.ai
   - Navigate to API settings
   - Generate an API key

2. **Configure Environment Variables**

Create `.env.local`:

```bash
VITE_KREA_API_KEY=your_api_key_here
```

3. **Update Implementation**

In `src/components/BackgroundGenerator/BackgroundGenerator.tsx`:

```typescript
import { createKreaClient, pollGenerationStatus } from '@/lib/api/krea';

// Replace mock call with real API
const client = createKreaClient(import.meta.env.VITE_KREA_API_KEY);
const response = await client.generateImage(request);

// Poll for completion if async
if (response.status === 'pending' || response.status === 'processing') {
  const completed = await pollGenerationStatus(client, response.id);
  if (completed.status === 'completed' && completed.imageUrl) {
    setGeneratedHistory(prev => [completed.imageUrl!, ...prev]);
  }
}
```

## API Reference

### Krea API Client

```typescript
import { createKreaClient } from '@/lib/api/krea';

const client = createKreaClient(apiKey);

// Generate image
const response = await client.generateImage({
  prompt: 'abstract tech gradient',
  negativePrompt: 'text, watermark, blur',
  width: 2400,
  height: 1260,
  stylePreset: 'tech-gradient',
});

// Check status
const status = await client.getGenerationStatus(response.id);
```

### Type Definitions

```typescript
interface KreaGenerateRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  stylePreset?: string;
}

interface KreaGenerateResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageUrl?: string;
  error?: string;
}
```

## Technical Implementation

### Canvas Integration

Both `SocialCardCanvas` and `HeaderCanvas` components check `config.backgroundSource`:

```typescript
const backgroundUrl = config.backgroundSource === 'custom' && config.customBackgroundUrl
  ? config.customBackgroundUrl
  : getBackgroundPath('Social_Background.jpg');

const bgImg = images[backgroundUrl];
ctx.drawImage(bgImg, 0, 0, dimensions.width, dimensions.height);
```

### State Management

Background configuration is stored in `AssetConfig`:

```typescript
interface AssetConfig {
  // ... other fields
  backgroundSource: 'default' | 'custom';
  customBackgroundUrl?: string;
}
```

## Cost Considerations

### Krea AI Pricing

- Credit-based system (~$0.01-0.05 per generation)
- Generations are asynchronous (5-15 seconds)
- Higher resolution = more credits

### Optimization Tips

1. **Cache Generated Images**: Save generated URLs to localStorage
2. **Preset Prompts**: Provide curated prompts to reduce trial/error
3. **Rate Limiting**: Implement cooldown between generations
4. **Batch Generation**: Generate multiple variations at once

## Troubleshooting

### Common Issues

**"Generation timeout" error**
- Increase `maxAttempts` in `pollGenerationStatus()`
- Check Krea API status

**CORS errors**
- Krea API requires backend proxy in production
- Use Netlify/Vercel serverless functions

**Images not loading**
- Verify `customBackgroundUrl` is accessible
- Check browser console for CORS/network errors

### Backend Proxy Setup (Production)

For production deployment, create a serverless function:

**`/api/generate-background.ts`** (Netlify/Vercel)

```typescript
import { createKreaClient } from '@/lib/api/krea';

export default async function handler(req, res) {
  const { prompt, stylePreset } = req.body;
  
  const client = createKreaClient(process.env.KREA_API_KEY);
  const response = await client.generateImage({
    prompt,
    width: 2400,
    height: 1260,
    stylePreset,
  });
  
  res.json(response);
}
```

## Future Enhancements

- [ ] Add image upscaling for higher quality exports
- [ ] Implement prompt templates/library
- [ ] Add image-to-image generation (modify existing backgrounds)
- [ ] Save/load custom background presets
- [ ] Export generated backgrounds as downloadable files
- [ ] Add prompt history with auto-complete
- [ ] Integrate with Adobe Firefly as alternative API

## Resources

- [Krea AI Documentation](https://docs.krea.ai)
- [Krea API Playground](https://krea.ai/api)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
