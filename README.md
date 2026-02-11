# Copilot Model Launch Kit


<img width="2270" height="1680" alt="Screenshot 2026-01-15 at 10 48 04 AM" src="https://github.com/user-attachments/assets/85286fee-37a1-49b4-9e74-f35e291bc9ef" />

**Live Site**: https://potential-goggles-n2pkmnm.pages.github.io/

An internal asset creator for GitHub Copilot model launch graphics. Designed for program managers to quickly generate on-brand social cards and changelog headers without needing design tools. 

## Features

- **Social Card Generator** (2400×1260px) - Create announcement graphics for social media
- **Header Image Generator** (2064×600px) - Create changelog/blog post headers
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
3. Enter your announcement text
4. Configure the hero model and other models
5. Preview your asset in the canvas
6. Click "Export PNG" to download

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

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


## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4 + shadcn/ui
- HTML5 Canvas API

## Support

This is maintained by @cameronfoxly. For issues or feature requests, please open an issue on the GitHub repository.
