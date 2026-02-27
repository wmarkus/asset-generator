# Copilot Model Launch Kit


<img width="2270" height="1680" alt="Screenshot 2026-01-15 at 10 48 04 AM" src="https://github.com/user-attachments/assets/85286fee-37a1-49b4-9e74-f35e291bc9ef" />

**Live Site**: https://potential-goggles-n2pkmnm.pages.github.io/

An internal asset creator for GitHub Copilot model launch graphics. Designed for program managers to quickly generate on-brand social cards and changelog headers without needing design tools. 

## Features

- **Social Card Generator** (2400×1260px) - Create announcement graphics for social media
- **Header Image Generator** (2064×600px) - Create changelog/blog post headers
- **AI Background Generator** - Generate custom backgrounds with Krea AI (NEW!)
- **Live Preview** - See changes in real-time with zoom and pan controls
- **PNG Export** - Download production-ready assets with one click
- **Multi-Model Support** - Configure hero model + two additional models with provider logos

## Supported Providers

- OpenAI
- Anthropic
- Google
- xAI

## Usage

1. Visit the deployed site (requires GitHub authentication)
2. Select your asset type (Social Card or Header)
3. **(NEW)** Generate a custom background or use the default
4. Enter your announcement text
5. Configure the hero model and other models
6. Preview your asset in the canvas
7. Click "Export PNG" to download

### AI Background Generation

Create custom backgrounds using Krea AI:

1. Click "Generate with Krea AI" in the Background section
2. Describe your desired background (e.g., "futuristic gradient, dark theme")
3. Select a style preset
4. Generate and choose from multiple variations
5. Your custom background applies to both asset types

See [KREA_INTEGRATION.md](./KREA_INTEGRATION.md) for detailed documentation.

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# (Optional) Configure Krea AI API key
cp .env.example .env.local
# Edit .env.local and add your Krea API key

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui primitives
│   ├── Canvas/       # Canvas rendering (SocialCardCanvas, HeaderCanvas)
│   ├── Editor/       # Form inputs (ModelSelector, TextFieldEditor)
│   └── Layout/       # App shell (Header, Sidebar)
├── hooks/            # Custom hooks (useCanvasZoom, useExportImage)
├── lib/              # Utilities and provider config
└── types/            # TypeScript types
```

## Deployment

Automatically deployed to GitHub Pages on push to `main`. The site is private and requires GitHub authentication to access.

### Docker Deployment

The repo now includes a production Docker setup:

- `Dockerfile` (multi-stage build: Node -> Nginx)
- `nginx.conf` (SPA fallback + static caching)
- `.dockerignore`

Build and run locally:

```bash
# Build image
docker build -t model-launchkit:latest .

# Run container
docker run --rm -p 8080:80 model-launchkit:latest
```

Open http://localhost:8080

If you want AI background generation enabled in that build, pass your key at build time:

```bash
docker build \
  --build-arg VITE_KREA_API_KEY=your_krea_key \
  -t model-launchkit:latest .
```

Example push/deploy flow:

```bash
# Tag for your registry
docker tag model-launchkit:latest ghcr.io/<org-or-user>/model-launchkit:latest

# Push
docker push ghcr.io/<org-or-user>/model-launchkit:latest
```


## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4 + shadcn/ui
- HTML5 Canvas API

## Support

This is maintained by @cameronfoxly. For issues or feature requests, please open an issue on the GitHub repository.
