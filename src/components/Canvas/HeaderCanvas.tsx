import { useRef, useEffect, useMemo } from 'react';
import type { AssetConfig, Provider, HeroCount, FocusedField } from '@/types';
import { ASSET_DIMENSIONS } from '@/types';
import { useMultipleImages } from '@/hooks/useImageLoader';
import { getProviderLogo, getOverlayPath, getBackgroundPath, getIconPath } from '@/lib/providers';

// Layout configuration for different hero counts
const HEADER_LAYOUT_1_HERO = {
  canvasHeight: 600,
  overlay: 'HeaderBox.png',
  maskHeight: 217,
  maskY: 209,
  cursorX: -450, // Relative to overlay right edge
  cursorY: 320,
  cursorScale: 0.5,
};

const HEADER_LAYOUT_2_HERO = {
  canvasHeight: 713,
  overlay: 'HeaderBox_2.png',
  maskHeight: 330, // +113 for extra row
  maskY: 209,
  cursorX: -450,
  cursorY: 380, // Adjusted for new layout - points at Hero 1
  cursorScale: 0.5,
};

const HEADER_LAYOUT_3_HERO = {
  canvasHeight: 826,
  overlay: 'HeaderBox_3.png', // Future
  maskHeight: 443,
  maskY: 209,
  cursorX: -450,
  cursorY: 440,
  cursorScale: 0.5,
};

const getHeaderLayout = (heroCount: HeroCount) => {
  switch (heroCount) {
    case 1: return HEADER_LAYOUT_1_HERO;
    case 2: return HEADER_LAYOUT_2_HERO;
    case 3: return HEADER_LAYOUT_3_HERO;
  }
};

interface HeaderCanvasProps {
  config: AssetConfig;
  zoom: number;
  panX: number;
  panY: number;
  focusedField: FocusedField;
}

export function HeaderCanvas({
  config,
  zoom,
  panX,
  panY,
  focusedField,
}: HeaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layout = getHeaderLayout(config.heroCount);
  const dimensions = { 
    width: ASSET_DIMENSIONS.header.width, 
    height: layout.canvasHeight 
  };

  // Collect all image sources we need
  const imageSources = useMemo(() => [
    getBackgroundPath('Header_Background.png'),
    getOverlayPath(layout.overlay),
    getOverlayPath('Cursor.png'),
    getIconPath('dropdown-chevron.svg'),
    getProviderLogo(config.heroModel1.provider),
    getProviderLogo(config.heroModel2.provider),
    getProviderLogo(config.heroModel3.provider),
    getProviderLogo(config.otherModel1.provider),
    getProviderLogo(config.otherModel2.provider),
  ], [config.heroModel1.provider, config.heroModel2.provider, config.heroModel3.provider, config.otherModel1.provider, config.otherModel2.provider, layout.overlay]);

  const images = useMultipleImages(imageSources);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw background image (or fallback gradient)
    const bgImg = images[getBackgroundPath('Header_Background.png')];
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, dimensions.width, dimensions.height);
    } else {
      // Fallback gradient while loading
      const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
      gradient.addColorStop(0, '#0d1117');
      gradient.addColorStop(0.5, '#0a1f1a');
      gradient.addColorStop(1, '#0d1117');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    // Draw the UI overlay image if loaded
    const headerBoxImg = images[getOverlayPath(layout.overlay)];
    const cursorImg = images[getOverlayPath('Cursor.png')];

    if (headerBoxImg) {
      // Center the header overlay horizontally and vertically
      const overlayX = (dimensions.width - headerBoxImg.width) / 2;
      const overlayY = (dimensions.height - headerBoxImg.height) / 2;
      ctx.drawImage(headerBoxImg, overlayX, overlayY);
      
      // Draw the dropdown button with hero model name (always shows Hero Model 1)
      // Figma specs from node 7582:138708
      const dropdownBtnPaddingLeft = 37;
      const dropdownBtnPaddingRight = 25;
      const dropdownBtnPaddingY = 22;
      const dropdownBtnFontSize = 55;
      const dropdownBtnRadius = 18;
      const dropdownBtnGap = 20;
      const chevronSize = 50;
      
      // Measure text to calculate button width
      ctx.font = `500 ${dropdownBtnFontSize}px "SF Pro", system-ui, sans-serif`;
      const heroTextWidth = ctx.measureText(config.heroModel1.name).width;
      const dropdownBtnWidth = dropdownBtnPaddingLeft + heroTextWidth + dropdownBtnGap + chevronSize + dropdownBtnPaddingRight;
      const dropdownBtnHeight = dropdownBtnPaddingY * 2 + dropdownBtnFontSize;
      
      // Position the button in the top-right area of the overlay
      const dropdownBtnX = overlayX + headerBoxImg.width - dropdownBtnWidth - 258;
      const dropdownBtnY = overlayY + 90;
      
      // Draw button background
      ctx.fillStyle = '#282f38';
      ctx.beginPath();
      ctx.roundRect(dropdownBtnX, dropdownBtnY, dropdownBtnWidth, dropdownBtnHeight, dropdownBtnRadius);
      ctx.fill();
      
      // Draw shadow (Figma: 6.197px 7.002px 6.197px rgba(0,0,0,0.06))
      ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 7;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw hero model name text - white color, SF Pro Semibold (600)
      ctx.fillStyle = '#ffffff';
      ctx.font = `500 ${dropdownBtnFontSize}px "SF Pro", system-ui, sans-serif`;
      const textX = dropdownBtnX + dropdownBtnPaddingLeft;
      const textY = dropdownBtnY + dropdownBtnHeight / 2 + dropdownBtnFontSize * 0.35;
      ctx.fillText(config.heroModel1.name, textX, textY);
      
      // Draw dropdown chevron
      const chevronImg = images[getIconPath('dropdown-chevron.svg')];
      if (chevronImg) {
        const chevronX = textX + heroTextWidth + dropdownBtnGap;
        const chevronY = dropdownBtnY + (dropdownBtnHeight - chevronSize) / 2;
        ctx.drawImage(chevronImg, chevronX, chevronY, chevronSize, chevronSize);
      }
      
      // Draw provider logos and model names on top of the overlay
      drawModelList(ctx, config, images, overlayX, overlayY, headerBoxImg.width, headerBoxImg.height, layout, focusedField);
      
      // Draw cursor if loaded - position finger on the selected model row
      if (cursorImg) {
        const cursorX = overlayX + headerBoxImg.width + layout.cursorX;
        const cursorY = overlayY + layout.cursorY;
        const cursorWidth = cursorImg.width * layout.cursorScale;
        const cursorHeight = cursorImg.height * layout.cursorScale;
        ctx.drawImage(cursorImg, cursorX, cursorY, cursorWidth, cursorHeight);
      }
    }

  }, [config, dimensions, images, layout, focusedField]);

  return (
    <div
      className="relative"
      style={{
        transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        transformOrigin: 'center center',
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="shadow-2xl rounded-lg"
        id="header-canvas"
      />
    </div>
  );
}

interface HeaderLayoutConfig {
  canvasHeight: number;
  overlay: string;
  maskHeight: number;
  maskY: number;
  cursorX: number;
  cursorY: number;
  cursorScale: number;
}

function drawModelList(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  images: Record<string, HTMLImageElement | null>,
  overlayX: number,
  overlayY: number,
  _overlayWidth: number,
  _overlayHeight: number,
  layout: HeaderLayoutConfig,
  focusedField: FocusedField
) {
  // Figma specs for the model list:
  // Font: SF Pro Text Regular, 49px
  // Logo size: 70px square
  // Row height: 112px (text centered)
  
  const maskWidth = 800;
  const logoSize = 70;
  const logoTextGap = 28;
  const rowHeight = 112;
  const fontSize = 49;
  
  // Position the mask box within the overlay
  const maskX = overlayX + 546;
  const maskY = overlayY + layout.maskY;
  
  // Save context state before clipping
  ctx.save();
  
  // Create clipping mask - height varies by hero count
  ctx.beginPath();
  ctx.rect(maskX, maskY, maskWidth, layout.maskHeight);
  ctx.clip();
  
  // Build the model list based on hero count
  // Order: Other1 (faded) → Hero1 (full) → [Hero2 (full)] → [Hero3 (full)] → Other2 (faded)
  type ModelEntry = { 
    model: { name: string; provider: Provider }; 
    rowIndex: number; 
    selected: boolean;
    fieldId: FocusedField;
  };
  const models: ModelEntry[] = [];
  
  let rowIndex = 0;
  models.push({ model: config.otherModel1, rowIndex: rowIndex++, selected: false, fieldId: 'otherModel1' });
  models.push({ model: config.heroModel1, rowIndex: rowIndex++, selected: true, fieldId: 'heroModel1' });
  
  if (config.heroCount >= 2) {
    models.push({ model: config.heroModel2, rowIndex: rowIndex++, selected: true, fieldId: 'heroModel2' });
  }
  if (config.heroCount >= 3) {
    models.push({ model: config.heroModel3, rowIndex: rowIndex++, selected: true, fieldId: 'heroModel3' });
  }
  
  models.push({ model: config.otherModel2, rowIndex: rowIndex++, selected: false, fieldId: 'otherModel2' });
  
  // Calculate vertical offset so hero1 is positioned correctly
  const heroRowCenterY = maskY + layout.maskHeight / 2;
  const heroRowTop = heroRowCenterY - rowHeight / 2;
  
  // Adjust offset based on hero count to keep first hero visible
  const centerRowIndex = config.heroCount === 1 ? 1 : 1.5;
  
  // Starting X position - left padding within the mask
  const contentPaddingX = 27;
  const itemStartX = maskX + contentPaddingX;

  models.forEach(({ model, rowIndex: idx, selected, fieldId }) => {
    // Calculate row Y position relative to center
    const rowTop = heroRowTop + (idx - centerRowIndex) * rowHeight;
    const logoY = rowTop + (rowHeight - logoSize) / 2;
    
    // Draw provider logo with 40% opacity for non-hero items
    const logoImg = images[getProviderLogo(model.provider as Provider)];
    if (logoImg) {
      ctx.globalAlpha = selected ? 1.0 : 0.4;
      ctx.drawImage(logoImg, itemStartX, logoY, logoSize, logoSize);
      ctx.globalAlpha = 1.0;
    }

    // Draw model name - SF Pro Regular 49px, centered vertically in 112px row
    ctx.fillStyle = selected ? '#ffffff' : 'rgba(139, 148, 158, 0.6)';
    ctx.font = `400 ${fontSize}px "SF Pro", system-ui, sans-serif`;
    const textX = itemStartX + logoSize + logoTextGap;
    const textY = rowTop + rowHeight / 2 + fontSize * 0.35;
    ctx.fillText(model.name, textX, textY);
    
    // Draw focus highlight around this model row if focused
    if (focusedField === fieldId) {
      const highlightPadding = 10;
      const textWidth = ctx.measureText(model.name).width;
      const rowWidth = logoSize + logoTextGap + textWidth + highlightPadding * 2;
      
      ctx.strokeStyle = '#39d353'; // GitHub green
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.roundRect(
        itemStartX - highlightPadding, 
        rowTop + (rowHeight - logoSize) / 2 - highlightPadding,
        rowWidth,
        logoSize + highlightPadding * 2,
        8
      );
      ctx.stroke();
    }
  });
  
  // Restore context state (removes clipping)
  ctx.restore();
}
