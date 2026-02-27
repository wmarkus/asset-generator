import type { AssetConfig, Provider, FocusedField, HeroCount } from '@/types';
import { ASSET_DIMENSIONS, BADGE_TYPES, PRODUCT_TYPES } from '@/types';
import { getProviderLogo, getOverlayPath, getBackgroundPath, getIconPath, getProductLogo } from '@/lib/providers';

// Layout configuration for different hero counts
const SOCIAL_LAYOUT_1_HERO = {
  overlay: 'SocialBox.png',
  overlayY: 'center' as const,
  maskHeight: 369,
  maskY: 320,
  listOffsetY: 0,
  cursorX: 2150,
  cursorY: 780,
  cursorScale: 0.8,
};

const SOCIAL_LAYOUT_2_HERO = {
  overlay: 'SocialBox_2.png',
  overlayY: 'center' as const,
  maskHeight: 515,
  maskY: 308,
  listOffsetY: 0,
  cursorX: 2150,
  cursorY: 710,
  cursorScale: 0.8,
};

const SOCIAL_LAYOUT_3_HERO = {
  overlay: 'SocialBox_3.png',
  overlayY: 'center' as const,
  maskHeight: 717,
  maskY: 320,
  listOffsetY: 0,
  cursorX: 2150,
  cursorY: 980,
  cursorScale: 0.8,
};

export interface SocialLayoutConfig {
  overlay: string;
  overlayY: 'center';
  maskHeight: number;
  maskY: number;
  listOffsetY: number;
  cursorX: number;
  cursorY: number;
  cursorScale: number;
}

export const getSocialLayout = (heroCount: HeroCount): SocialLayoutConfig => {
  switch (heroCount) {
    case 1: return SOCIAL_LAYOUT_1_HERO;
    case 2: return SOCIAL_LAYOUT_2_HERO;
    case 3: return SOCIAL_LAYOUT_3_HERO;
  }
};

export interface AnimationParams {
  opacity: number;
  offsetX: number;
  offsetY: number;
}

const DEFAULT_ANIM: AnimationParams = { opacity: 1, offsetX: 0, offsetY: 0 };

type ImageMap = Record<string, HTMLImageElement | null>;

// Collect all image sources needed for the social card
export function getSocialCardImageSources(config: AssetConfig): string[] {
  const layout = getSocialLayout(config.heroCount);
  return [
    config.backgroundSource === 'custom' && config.customBackgroundUrl
      ? config.customBackgroundUrl
      : getBackgroundPath('Social_Background.jpg'),
    getOverlayPath(layout.overlay),
    getOverlayPath('Cursor.png'),
    getIconPath('dropdown-chevron.svg'),
    getProviderLogo(config.heroModel1.provider),
    getProviderLogo(config.heroModel2.provider),
    getProviderLogo(config.heroModel3.provider),
    getProviderLogo(config.otherModel1.provider),
    getProviderLogo(config.otherModel2.provider),
    getProductLogo(config.productType),
  ];
}

// Layer 1: Background
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  images: ImageMap,
  anim: AnimationParams = DEFAULT_ANIM,
) {
  const dimensions = ASSET_DIMENSIONS.social;
  ctx.save();
  ctx.globalAlpha = anim.opacity;

  const backgroundUrl = config.backgroundSource === 'custom' && config.customBackgroundUrl
    ? config.customBackgroundUrl
    : getBackgroundPath('Social_Background.jpg');
  const bgImg = images[backgroundUrl];
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, dimensions.width, dimensions.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
    gradient.addColorStop(0, '#0d1117');
    gradient.addColorStop(0.5, '#0a1f1a');
    gradient.addColorStop(1, '#0d1117');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
  }

  ctx.restore();
}

// Layer 2: Product logo + name (top-left)
export function drawProductBadge(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  images: ImageMap,
  anim: AnimationParams = DEFAULT_ANIM,
) {
  const margin = 120;

  // The default background has a baked-in top-left mark.
  // Patch that region from a clean area of the same image so we can always
  // render the selected product logo/name consistently.
  if (config.backgroundSource === 'default') {
    const defaultBg = images[getBackgroundPath('Social_Background.jpg')];
    if (defaultBg) {
      ctx.save();
      ctx.globalAlpha = anim.opacity;
      ctx.drawImage(
        defaultBg,
        0, 280, 860, 280, // source patch (clean dark area)
        0, 0, 860, 280, // destination patch (top-left where baked mark lives)
      );
      ctx.restore();
    }
  }

  const productLogoSize = 84;
  const productGap = 20;
  const productFontSize = 84;
  const productLabel = PRODUCT_TYPES.find(p => p.value === config.productType)?.label || 'GitHub';
  const productLogoImg = images[getProductLogo(config.productType)];

  ctx.save();
  ctx.globalAlpha = anim.opacity;
  const ox = anim.offsetX;
  const oy = anim.offsetY;

  if (productLogoImg) {
    if (config.productType === 'github') {
      const offscreen = document.createElement('canvas');
      offscreen.width = productLogoSize;
      offscreen.height = productLogoSize;
      const offCtx = offscreen.getContext('2d')!;
      offCtx.drawImage(productLogoImg, 0, 0, productLogoSize, productLogoSize);
      offCtx.globalCompositeOperation = 'source-atop';
      offCtx.fillStyle = '#ffffff';
      offCtx.fillRect(0, 0, productLogoSize, productLogoSize);
      ctx.drawImage(offscreen, margin + ox, margin + oy);
    } else {
      ctx.drawImage(productLogoImg, margin + ox, margin + oy, productLogoSize, productLogoSize);
    }
  }

  ctx.font = `600 ${productFontSize}px "Mona Sans", system-ui, sans-serif`;
  ctx.fillStyle = '#ffffff';
  const productTextX = margin + productLogoSize + productGap + ox;
  const productTextY = margin + productLogoSize / 2 + productFontSize * 0.35 + oy;
  ctx.fillText(productLabel, productTextX, productTextY);

  ctx.restore();
}

// Layer 3: Badge pill + headline text
export function drawBadgeAndHeadline(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  anim: AnimationParams = DEFAULT_ANIM,
  focusedField: FocusedField = null,
) {
  const dimensions = ASSET_DIMENSIONS.social;
  const margin = 120;
  const badgeToTextGap = 40;
  const copyFontSize = 118;
  const copyLineHeight = copyFontSize;
  const copyLetterSpacing = -0.03 * copyFontSize + 2;
  const maxCharsPerLine = 16;
  const maxLines = 4;

  const badgeConfig = BADGE_TYPES.find(b => b.value === config.badgeType);
  const badgeText = badgeConfig?.label || 'NEW RELEASE';
  const badgeColor = badgeConfig?.color || '#39d353';

  const badgeFontSize = 52;
  const badgeBorderWidth = 3;
  const badgePaddingX = 60;

  ctx.save();
  ctx.globalAlpha = anim.opacity;
  const oy = anim.offsetY;

  ctx.font = `400 ${badgeFontSize}px "Monaspace Neon", monospace`;
  const badgeTextWidth = ctx.measureText(badgeText).width;
  const badgeWidth = badgePaddingX * 2 + badgeTextWidth;
  const badgeHeight = 141;

  // Word wrap
  const paragraphs = config.socialCopy.split('\n');
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') { lines.push(''); continue; }
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
    if (currentLine) lines.push(currentLine);
  }
  const displayLines = lines.slice(0, maxLines);

  const textBlockHeight = displayLines.length * copyLineHeight;
  const contentStartY = dimensions.height - margin - textBlockHeight + oy;
  const badgeY = contentStartY - badgeToTextGap - badgeHeight;
  const badgeX = margin;

  // Badge pill
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.strokeStyle = badgeColor + '55';
  ctx.lineWidth = badgeBorderWidth;
  ctx.stroke();

  // Badge text
  ctx.font = `400 ${badgeFontSize}px "Monaspace Neon", monospace`;
  const textStartX = badgeX + (badgeWidth - badgeTextWidth) / 2;
  ctx.fillStyle = badgeColor;
  ctx.fillText(badgeText, textStartX, badgeY + badgeHeight / 2 + badgeFontSize * 0.35);

  // Headline
  ctx.fillStyle = '#ffffff';
  ctx.font = `600 ${copyFontSize}px "Mona Sans", system-ui, sans-serif`;
  ctx.letterSpacing = `${copyLetterSpacing}px`;

  displayLines.forEach((line, index) => {
    const lineY = contentStartY + (index * copyLineHeight) + copyFontSize * 0.85;
    ctx.fillText(line, margin, lineY);
  });

  // Focus highlight
  if (focusedField === 'socialCopy' && displayLines.length > 0) {
    const highlightPadding = 20;
    let maxWidth = 0;
    displayLines.forEach(line => {
      const width = ctx.measureText(line).width;
      if (width > maxWidth) maxWidth = width;
    });
    ctx.strokeStyle = '#39d353';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.roundRect(
      margin - highlightPadding,
      contentStartY - highlightPadding,
      maxWidth + highlightPadding * 2,
      textBlockHeight + highlightPadding * 2,
      12,
    );
    ctx.stroke();
  }

  ctx.letterSpacing = '0px';
  ctx.restore();
}

// Layer 4: Model list overlay + dropdown button
export function drawModelOverlay(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  images: ImageMap,
  anim: AnimationParams = DEFAULT_ANIM,
  focusedField: FocusedField = null,
) {
  const dimensions = ASSET_DIMENSIONS.social;
  const layout = getSocialLayout(config.heroCount);
  const socialBoxImg = images[getOverlayPath(layout.overlay)];
  if (!socialBoxImg) return;

  ctx.save();
  ctx.globalAlpha = anim.opacity;
  const ox = anim.offsetX;

  const overlayX = dimensions.width - socialBoxImg.width + ox;
  const overlayY = (dimensions.height - socialBoxImg.height) / 2;
  ctx.drawImage(socialBoxImg, overlayX, overlayY);

  // Dropdown button
  const dropdownBtnPaddingLeft = 48;
  const dropdownBtnPaddingRight = 32;
  const dropdownBtnPaddingY = 26;
  const dropdownBtnFontSize = 65;
  const dropdownBtnRadius = 24;
  const dropdownBtnGap = 16;
  const chevronSize = 40;

  ctx.font = `500 ${dropdownBtnFontSize}px "SF Pro", system-ui, sans-serif`;
  const heroTextWidth = ctx.measureText(config.heroModel1.name).width;
  const dropdownBtnWidth = dropdownBtnPaddingLeft + heroTextWidth + dropdownBtnGap + chevronSize + dropdownBtnPaddingRight;
  const dropdownBtnHeight = dropdownBtnPaddingY * 2 + dropdownBtnFontSize;

  const dropdownBtnX = overlayX + socialBoxImg.width - dropdownBtnWidth - 30;
  const dropdownBtnY = overlayY + 110;

  ctx.fillStyle = '#282f38';
  ctx.beginPath();
  ctx.roundRect(dropdownBtnX, dropdownBtnY, dropdownBtnWidth, dropdownBtnHeight, dropdownBtnRadius);
  ctx.fill();

  ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 9;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = `500 ${dropdownBtnFontSize}px "SF Pro", system-ui, sans-serif`;
  const textX = dropdownBtnX + dropdownBtnPaddingLeft;
  const textY = dropdownBtnY + dropdownBtnHeight / 2 + dropdownBtnFontSize * 0.35;
  ctx.fillText(config.heroModel1.name, textX, textY);

  const chevronImg = images[getIconPath('dropdown-chevron.svg')];
  if (chevronImg) {
    const chevronX = textX + heroTextWidth + dropdownBtnGap;
    const chevronY = dropdownBtnY + (dropdownBtnHeight - chevronSize) / 2;
    ctx.drawImage(chevronImg, chevronX, chevronY, chevronSize, chevronSize);
  }

  // Model list
  drawModelList(ctx, config, images, overlayX, overlayY, layout, focusedField);

  ctx.restore();
}

// Layer 5: Cursor
export function drawCursor(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  images: ImageMap,
  anim: AnimationParams = DEFAULT_ANIM,
) {
  const layout = getSocialLayout(config.heroCount);
  const cursorImg = images[getOverlayPath('Cursor.png')];
  if (!cursorImg) return;

  ctx.save();
  ctx.globalAlpha = anim.opacity;
  const cursorWidth = cursorImg.width * layout.cursorScale;
  const cursorHeight = cursorImg.height * layout.cursorScale;
  ctx.drawImage(cursorImg, layout.cursorX + anim.offsetX, layout.cursorY + anim.offsetY, cursorWidth, cursorHeight);
  ctx.restore();
}

// Render all layers with full opacity (static)
export function renderSocialCardStatic(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  images: ImageMap,
  focusedField: FocusedField = null,
) {
  const dimensions = ASSET_DIMENSIONS.social;
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);
  drawBackground(ctx, config, images);
  drawProductBadge(ctx, config, images);
  drawBadgeAndHeadline(ctx, config, undefined, focusedField);
  drawModelOverlay(ctx, config, images, undefined, focusedField);
  drawCursor(ctx, config, images);
}

// Model list drawing (internal)
function drawModelList(
  ctx: CanvasRenderingContext2D,
  config: AssetConfig,
  images: ImageMap,
  overlayX: number,
  overlayY: number,
  layout: SocialLayoutConfig,
  focusedField: FocusedField,
) {
  const maskWidth = 1244;
  const logoSize = 109;
  const logoTextGap = 44;
  const rowHeight = 174;
  const fontSize = 72;
  const maskX = overlayX + 159;
  const maskY = overlayY + layout.maskY;

  ctx.save();
  ctx.beginPath();
  ctx.rect(maskX, maskY, maskWidth, layout.maskHeight);
  ctx.clip();

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
  if (config.heroCount >= 2) models.push({ model: config.heroModel2, rowIndex: rowIndex++, selected: true, fieldId: 'heroModel2' });
  if (config.heroCount >= 3) models.push({ model: config.heroModel3, rowIndex: rowIndex++, selected: true, fieldId: 'heroModel3' });
  models.push({ model: config.otherModel2, rowIndex: rowIndex++, selected: false, fieldId: 'otherModel2' });

  const heroRowCenterY = maskY + layout.maskHeight / 2 + layout.listOffsetY;
  const heroRowTop = heroRowCenterY - rowHeight / 2;
  const centerRowIndex = config.heroCount === 1 ? 1 : 1.5;
  const contentPaddingX = 60;
  const itemStartX = maskX + contentPaddingX;
  const baseAlpha = ctx.globalAlpha;

  models.forEach(({ model, rowIndex: idx, selected, fieldId }) => {
    const rowTop = heroRowTop + (idx - centerRowIndex) * rowHeight;
    const logoY = rowTop + (rowHeight - logoSize) / 2;

    const logoImg = images[getProviderLogo(model.provider as Provider)];
    if (logoImg) {
      ctx.globalAlpha = baseAlpha * (selected ? 1.0 : 0.4);
      ctx.drawImage(logoImg, itemStartX, logoY, logoSize, logoSize);
      ctx.globalAlpha = baseAlpha;
    }

    ctx.fillStyle = selected ? '#ffffff' : 'rgba(139, 148, 158, 0.6)';
    ctx.font = selected
      ? `500 ${fontSize}px "SF Pro", system-ui, sans-serif`
      : `400 ${fontSize}px "SF Pro", system-ui, sans-serif`;
    const textX = itemStartX + logoSize + logoTextGap;
    const textY = rowTop + rowHeight / 2 + fontSize * 0.35;
    ctx.fillText(model.name, textX, textY);

    if (focusedField === fieldId) {
      const highlightPadding = 16;
      const textWidth = ctx.measureText(model.name).width;
      const rowWidth = logoSize + logoTextGap + textWidth + highlightPadding * 2;
      ctx.strokeStyle = '#39d353';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.roundRect(
        itemStartX - highlightPadding,
        rowTop + (rowHeight - logoSize) / 2 - highlightPadding,
        rowWidth,
        logoSize + highlightPadding * 2,
        12,
      );
      ctx.stroke();
    }
  });

  ctx.restore();
}
