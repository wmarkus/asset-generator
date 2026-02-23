import { useRef, useEffect, useMemo } from 'react';
import type { AssetConfig, Provider, HeroCount, FocusedField } from '@/types';
import { ASSET_DIMENSIONS } from '@/types';
import { useMultipleImages } from '@/hooks/useImageLoader';
import { getProviderLogo, getOverlayPath, getBackgroundPath, getIconPath } from '@/lib/providers';

// Layout configuration for different hero counts
const SOCIAL_LAYOUT_1_HERO = {
  overlay: 'SocialBox.png',
  overlayY: 'center' as const,
  maskHeight: 369,
  maskY: 320,
  listOffsetY: 0, // Offset list content relative to mask (positive = down)
  cursorX: 2150,
  cursorY: 780,
  cursorScale: 0.8,
};

const SOCIAL_LAYOUT_2_HERO = {
  overlay: 'SocialBox_2.png',
  overlayY: 'center' as const,
  maskHeight: 515, // +174 for extra row
  maskY: 308, // Move mask up (was 320)
  listOffsetY: 0, // Keep list in same visual position (mask moved up 30, so offset list down 30)
  cursorX: 2150,
  cursorY: 710, // Adjusted for new layout - points at Hero 1
  cursorScale: 0.8,
};

const SOCIAL_LAYOUT_3_HERO = {
  overlay: 'SocialBox_3.png', // Future
  overlayY: 'center' as const,
  maskHeight: 717,
  maskY: 320,
  listOffsetY: 0,
  cursorX: 2150,
  cursorY: 980,
  cursorScale: 0.8,
};

const getSocialLayout = (heroCount: HeroCount) => {
  switch (heroCount) {
    case 1: return SOCIAL_LAYOUT_1_HERO;
    case 2: return SOCIAL_LAYOUT_2_HERO;
    case 3: return SOCIAL_LAYOUT_3_HERO;
  }
};

interface SocialCardCanvasProps {
  config: AssetConfig;
  zoom: number;
  panX: number;
  panY: number;
  focusedField: FocusedField;
}

export function SocialCardCanvas({
  config,
  zoom,
  panX,
  panY,
  focusedField,
}: SocialCardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimensions = ASSET_DIMENSIONS.social;
  const layout = getSocialLayout(config.heroCount);

  // Collect all image sources we need
  const imageSources = useMemo(() => {
    const sources = [
      config.backgroundSource === 'custom' && config.customBackgroundUrl
        ? config.customBackgroundUrl
        : getBackgroundPath('Social_Background.jpg'),
      getOverlayPath(layout.overlay),
      getOverlayPath('Cursor.png'),
      getIconPath('sparkle.svg'),
      getIconPath('dropdown-chevron.svg'),
      getProviderLogo(config.heroModel1.provider),
      getProviderLogo(config.heroModel2.provider),
      getProviderLogo(config.heroModel3.provider),
      getProviderLogo(config.otherModel1.provider),
      getProviderLogo(config.otherModel2.provider),
    ];
    return sources;
  }, [
    config.backgroundSource,
    config.customBackgroundUrl,
    config.heroModel1.provider,
    config.heroModel2.provider,
    config.heroModel3.provider,
    config.otherModel1.provider,
    config.otherModel2.provider,
    layout.overlay,
  ]);

  const images = useMultipleImages(imageSources);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw background image (or fallback gradient)
    const backgroundUrl = config.backgroundSource === 'custom' && config.customBackgroundUrl
      ? config.customBackgroundUrl
      : getBackgroundPath('Social_Background.jpg');
    const bgImg = images[backgroundUrl];
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

    // Calculate text layout from bottom-left (120px margin)
    const margin = 120;
    const badgeToTextGap = 40;
    
    // Social copy text settings from Figma
    // Mona Sans SemiBold (600), 118.38px, -3% letter spacing, 100% line height
    const copyFontSize = 118;
    const copyLineHeight = copyFontSize; // 100% line height
    const copyLetterSpacing = -0.03 * copyFontSize + 2; // -3% plus 2px for readability
    const maxCharsPerLine = 16; // Approximate target for word wrap
    const maxLines = 4;
    
    // Badge dimensions from Figma specs - fixed sizes
    const badgeWidth = 571;
    const badgeHeight = 141;
    const badgeIconSize = 61;
    const badgeGap = 29;
    const badgeFontSize = 52;
    const badgeBorderWidth = 3;
    
    // Word wrap the social copy, respecting manual line breaks
    // Split by manual line breaks first, then word wrap each paragraph
    const paragraphs = config.socialCopy.split('\n');
    const lines: string[] = [];
    
    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        // Empty line from manual break
        lines.push('');
        continue;
      }
      
      const words = paragraph.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (testLine.length > maxCharsPerLine && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }
    
    // Limit to max lines
    const displayLines = lines.slice(0, maxLines);
    
    // Calculate positions from bottom
    const textBlockHeight = displayLines.length * copyLineHeight;
    const contentStartY = dimensions.height - margin - textBlockHeight;
    const badgeY = contentStartY - badgeToTextGap - badgeHeight;
    const badgeX = margin;

    // Draw "NEW RELEASE" badge - Figma specs
    // No background fill, just border
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = badgeBorderWidth;
    ctx.stroke();

    // Calculate content width for optical centering
    ctx.font = `400 ${badgeFontSize}px "Monaspace Neon", monospace`;
    const badgeTextWidth = ctx.measureText('NEW RELEASE').width;
    const contentWidth = badgeIconSize + badgeGap + badgeTextWidth;
    const contentStartX = badgeX + (badgeWidth - contentWidth) / 2;

    // Draw sparkle icon from image - optically centered
    const sparkleImg = images[getIconPath('sparkle.svg')];
    const sparkleX = contentStartX;
    const sparkleY = badgeY + (badgeHeight - badgeIconSize) / 2;
    
    if (sparkleImg) {
      ctx.drawImage(sparkleImg, sparkleX, sparkleY, badgeIconSize, badgeIconSize);
    }

    // Badge text - using Monaspace Neon, color #8b949e (gray from Figma)
    ctx.font = `400 ${badgeFontSize}px "Monaspace Neon", monospace`;
    ctx.fillStyle = '#8b949e';
    const textX = sparkleX + badgeIconSize + badgeGap;
    const textY = badgeY + badgeHeight / 2 + badgeFontSize * 0.35;
    ctx.fillText('NEW RELEASE', textX, textY);

    // Draw main headline - anchored to bottom left
    // Mona Sans SemiBold (600), 118px, -3% letter spacing
    ctx.fillStyle = '#ffffff';
    ctx.font = `600 ${copyFontSize}px "Mona Sans", system-ui, sans-serif`;
    ctx.letterSpacing = `${copyLetterSpacing}px`;
    
    displayLines.forEach((line, index) => {
      const lineY = contentStartY + (index * copyLineHeight) + copyFontSize * 0.85; // baseline offset
      ctx.fillText(line, margin, lineY);
    });
    
    // Draw focus highlight around social copy if focused
    if (focusedField === 'socialCopy' && displayLines.length > 0) {
      const highlightPadding = 20;
      const highlightX = margin - highlightPadding;
      const highlightY = contentStartY - highlightPadding;
      
      // Calculate max width of all lines
      let maxWidth = 0;
      displayLines.forEach(line => {
        const width = ctx.measureText(line).width;
        if (width > maxWidth) maxWidth = width;
      });
      
      const highlightWidth = maxWidth + highlightPadding * 2;
      const highlightHeight = textBlockHeight + highlightPadding * 2;
      
      ctx.strokeStyle = '#39d353'; // GitHub green
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.roundRect(highlightX, highlightY, highlightWidth, highlightHeight, 12);
      ctx.stroke();
    }
    
    // Reset letter spacing
    ctx.letterSpacing = '0px';

    // Draw the UI overlay image if loaded
    const socialBoxImg = images[getOverlayPath(layout.overlay)];
    const cursorImg = images[getOverlayPath('Cursor.png')];

    if (socialBoxImg) {
      // Position the overlay pinned to the right edge of canvas
      const overlayX = dimensions.width - socialBoxImg.width;
      const overlayY = (dimensions.height - socialBoxImg.height) / 2;
      ctx.drawImage(socialBoxImg, overlayX, overlayY);
      
      // Draw the dropdown button with hero model name (always shows Hero Model 1)
      // Figma specs: bg #282f38, rounded ~24px, SF Pro Medium ~60px
      const dropdownBtnPaddingLeft = 48;
      const dropdownBtnPaddingRight = 32;
      const dropdownBtnPaddingY = 26;
      const dropdownBtnFontSize = 65;
      const dropdownBtnRadius = 24;
      const dropdownBtnGap = 16;
      const chevronSize = 40;
      
      // Measure text to calculate button width
      ctx.font = `500 ${dropdownBtnFontSize}px "SF Pro", system-ui, sans-serif`;
      const heroTextWidth = ctx.measureText(config.heroModel1.name).width;
      const dropdownBtnWidth = dropdownBtnPaddingLeft + heroTextWidth + dropdownBtnGap + chevronSize + dropdownBtnPaddingRight;
      const dropdownBtnHeight = dropdownBtnPaddingY * 2 + dropdownBtnFontSize;
      
      // Position the button in the top-right area of the overlay (over the existing button area)
      const dropdownBtnX = overlayX + socialBoxImg.width - dropdownBtnWidth - 30;
      const dropdownBtnY = overlayY + 110;
      
      // Draw button background
      ctx.fillStyle = '#282f38';
      ctx.beginPath();
      ctx.roundRect(dropdownBtnX, dropdownBtnY, dropdownBtnWidth, dropdownBtnHeight, dropdownBtnRadius);
      ctx.fill();
      
      // Draw shadow (subtle)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 9;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw hero model name text - white color
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
      drawModelList(ctx, config, images, overlayX, overlayY, socialBoxImg.width, socialBoxImg.height, layout, focusedField);
    }

    // Draw cursor if loaded
    if (cursorImg) {
      const cursorWidth = cursorImg.width * layout.cursorScale;
      const cursorHeight = cursorImg.height * layout.cursorScale;
      ctx.drawImage(cursorImg, layout.cursorX, layout.cursorY, cursorWidth, cursorHeight);
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
        id="social-card-canvas"
      />
    </div>
  );
}

interface SocialLayoutConfig {
  overlay: string;
  overlayY: 'center';
  maskHeight: number;
  maskY: number;  listOffsetY: number; // Offset list content relative to mask  cursorX: number;
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
  layout: SocialLayoutConfig,
  focusedField: FocusedField
) {
  // Figma specs for the model list:
  // Logo size: 109px square
  // Gap between logo and text: 44px
  // Row height: 174px (content centered vertically)
  
  const maskWidth = 1244;
  const logoSize = 109;
  const logoTextGap = 44;
  const rowHeight = 174;
  const fontSize = 72;
  
  // Position the mask box within the overlay
  const maskX = overlayX + 159;
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
  // For 1 hero: hero1 is row 1 (center)
  // For 2 heroes: hero1 is row 1, hero2 is row 2
  // listOffsetY allows moving mask independently of list content
  const heroRowCenterY = maskY + layout.maskHeight / 2 + layout.listOffsetY;
  const heroRowTop = heroRowCenterY - rowHeight / 2;
  
  // Adjust offset based on hero count to keep first hero visible
  const centerRowIndex = config.heroCount === 1 ? 1 : 1.5; // Center between hero1 and hero2 for 2-hero
  
  // Starting X position - left padding within the mask
  const contentPaddingX = 60;
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

    // Draw model name - using SF Pro, centered vertically in row
    ctx.fillStyle = selected ? '#ffffff' : 'rgba(139, 148, 158, 0.6)';
    ctx.font = selected 
      ? `500 ${fontSize}px "SF Pro", system-ui, sans-serif`
      : `400 ${fontSize}px "SF Pro", system-ui, sans-serif`;
    const textX = itemStartX + logoSize + logoTextGap;
    const textY = rowTop + rowHeight / 2 + fontSize * 0.35;
    ctx.fillText(model.name, textX, textY);
    
    // Draw focus highlight around this model row if focused
    if (focusedField === fieldId) {
      const highlightPadding = 16;
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
        12
      );
      ctx.stroke();
    }
  });
  
  // Restore context state (removes clipping)
  ctx.restore();
}
