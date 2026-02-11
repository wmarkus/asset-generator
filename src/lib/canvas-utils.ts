/**
 * Draw the GitHub Invertocat logo on a canvas
 * @param ctx - Canvas 2D rendering context
 * @param x - X position (left)
 * @param y - Y position (top)
 * @param size - Size of the logo (width and height)
 * @param color - Fill color (default white)
 */
export function drawGitHubLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string = '#ffffff'
) {
  ctx.save();
  ctx.translate(x, y);
  
  // Scale to desired size (original path is 98x96)
  const scale = size / 98;
  ctx.scale(scale, scale);
  
  ctx.fillStyle = color;
  ctx.beginPath();
  
  // GitHub Invertocat SVG path
  ctx.moveTo(48.854, 0);
  ctx.bezierCurveTo(21.839, 0, 0, 22, 0, 49.217);
  ctx.bezierCurveTo(0, 70.973, 13.993, 89.389, 33.405, 95.907);
  ctx.bezierCurveTo(35.832, 96.397, 36.721, 94.848, 36.721, 93.545);
  ctx.bezierCurveTo(36.721, 92.404, 36.641, 88.493, 36.641, 84.418);
  ctx.bezierCurveTo(23.051, 87.352, 20.221, 78.551, 20.221, 78.551);
  ctx.bezierCurveTo(18.037, 72.847, 14.801, 71.381, 14.801, 71.381);
  ctx.bezierCurveTo(10.353, 68.366, 15.125, 68.366, 15.125, 68.366);
  ctx.bezierCurveTo(20.059, 68.692, 22.648, 73.418, 22.648, 73.418);
  ctx.bezierCurveTo(27.015, 80.914, 34.052, 78.796, 36.883, 77.492);
  ctx.bezierCurveTo(37.287, 74.314, 38.58, 72.114, 39.955, 70.892);
  ctx.bezierCurveTo(29.114, 69.751, 17.713, 65.514, 17.713, 46.609);
  ctx.bezierCurveTo(17.713, 41.231, 19.654, 36.831, 22.729, 33.409);
  ctx.bezierCurveTo(22.243, 32.187, 20.545, 27.134, 23.214, 20.371);
  ctx.bezierCurveTo(23.214, 20.371, 27.339, 19.067, 36.64, 25.423);
  ctx.bezierCurveTo(40.6, 24.362, 44.746, 23.821, 48.854, 23.821);
  ctx.bezierCurveTo(52.962, 23.821, 57.108, 24.362, 61.068, 25.423);
  ctx.bezierCurveTo(70.369, 19.067, 74.494, 20.371, 74.494, 20.371);
  ctx.bezierCurveTo(77.163, 27.134, 75.465, 32.187, 74.979, 33.409);
  ctx.bezierCurveTo(78.135, 36.831, 79.995, 41.231, 79.995, 46.609);
  ctx.bezierCurveTo(79.995, 65.514, 68.594, 69.669, 57.671, 70.892);
  ctx.bezierCurveTo(59.45, 72.44, 60.986, 75.373, 60.986, 79.999);
  ctx.bezierCurveTo(60.986, 86.546, 60.905, 91.789, 60.905, 93.545);
  ctx.bezierCurveTo(60.905, 94.848, 61.794, 96.478, 64.302, 95.907);
  ctx.bezierCurveTo(83.714, 89.389, 97.707, 70.973, 97.707, 49.217);
  ctx.bezierCurveTo(97.789, 22, 75.869, 0, 48.854, 0);
  ctx.closePath();
  
  ctx.fill();
  ctx.restore();
}

/**
 * Draw a rounded rectangle (fallback for older browsers)
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
