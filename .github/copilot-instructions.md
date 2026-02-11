# GitHub Copilot Instructions for Model LaunchKit

## Project Overview
This is a React + TypeScript asset creator for GitHub Copilot model launch graphics. It generates social cards (2400×1260) and changelog headers (2064×600) with live preview and PNG export.

## Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Canvas**: HTML5 Canvas API
- **Icons**: lucide-react
- **Font**: Mona Sans (loaded from `/public/fonts/`)

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui primitives (auto-generated)
│   ├── Canvas/             # Canvas rendering components
│   │   ├── SocialCardCanvas.tsx
│   │   ├── HeaderCanvas.tsx
│   │   ├── CanvasControls.tsx
│   │   └── index.ts
│   ├── Editor/             # Form/input components for asset config
│   │   ├── TextFieldEditor.tsx
│   │   ├── ProviderDropdown.tsx
│   │   ├── ModelSelector.tsx
│   │   └── index.ts
│   └── Layout/             # App shell components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── index.ts
├── hooks/                  # Custom React hooks
│   ├── useCanvasZoom.ts
│   └── useExportImage.ts
├── lib/                    # Utilities and config
│   ├── utils.ts            # shadcn utilities (cn function)
│   └── providers.ts        # Provider logos and colors
├── types/                  # TypeScript types and constants
│   └── index.ts
├── App.tsx                 # Main application component
├── main.tsx                # Entry point
└── index.css               # Global styles + Tailwind + CSS variables
```

## Coding Conventions

### Component Guidelines
1. **One component per file** - Keep files focused and under 150 lines
2. **Barrel exports** - Each component folder has an `index.ts` for clean imports
3. **Props interfaces** - Define explicit interfaces for all component props
4. **Composition over complexity** - Break large components into smaller, reusable pieces

### File Naming
- Components: `PascalCase.tsx` (e.g., `ModelSelector.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useCanvasZoom.ts`)
- Types: `index.ts` in `types/` folder
- Utilities: `camelCase.ts` (e.g., `providers.ts`)

### Import Order
1. React and external libraries
2. `@/components/ui/*` (shadcn primitives)
3. `@/components/*` (custom components)
4. `@/hooks/*`
5. `@/lib/*`
6. `@/types`
7. Relative imports (avoid when possible)

### TypeScript
- Use `type` for object shapes, `interface` for component props
- Export types from `@/types/index.ts`
- Avoid `any` - use proper typing or `unknown` with type guards
- Use `as const` for constant objects

### shadcn/ui Usage
- Always use shadcn components for UI primitives (Button, Input, Select, etc.)
- Add new components via CLI: `npx shadcn@latest add <component>`
- Do not modify files in `src/components/ui/` directly
- Compose shadcn primitives into custom components in other folders

### Styling
- Use Tailwind utility classes
- Use `cn()` from `@/lib/utils` for conditional classes
- CSS variables defined in `index.css` for theming
- Dark mode is default (class-based: `dark` on root)

### State Management
- Use React hooks (`useState`, `useCallback`, `useMemo`)
- Lift state to nearest common ancestor
- Custom hooks for reusable stateful logic

## Git Workflow

### IMPORTANT: Never Auto-Commit
- **DO NOT** run `git commit`, `git push`, or create commits automatically
- **DO NOT** use GitHub MCP tools to push files or create commits
- All commits must be made manually by the developer after review
- Only stage files or show git status if explicitly requested

### Branch Strategy
- `main` - production, deployed to GitHub Pages
- Feature branches for development

## Asset Configuration

### Dimensions
- Social Card: 2400 × 1260px
- Header Image: 2064 × 600px

### Character Limits
- Social Copy: 52 characters
- Model Names: 30 characters

### Providers
Currently supported: `openai`, `anthropic`, `google`, `xai`
- Logos stored in `/public/logos/{provider}.png`
- Add new providers in `src/lib/providers.ts` and `src/types/index.ts`

## Adding New Features

### New Component
1. Create file in appropriate folder (`Canvas/`, `Editor/`, `Layout/`)
2. Add export to folder's `index.ts`
3. Keep under 150 lines; split if larger

### New Provider
1. Add to `Provider` type in `src/types/index.ts`
2. Add to `PROVIDERS` array in `src/types/index.ts`
3. Add logo mapping in `src/lib/providers.ts`
4. Add logo file to `/public/logos/`

### New Asset Type
1. Add dimensions to `ASSET_DIMENSIONS` in `src/types/index.ts`
2. Create new canvas component in `src/components/Canvas/`
3. Add tab in `App.tsx`
4. Update export logic

## Testing Locally
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```
