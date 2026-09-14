/**
 * contrastUtils.js
 * WCAG 2.2 Color Contrast and Luminance Utilities for Resuma AI.
 * Implements the W3C WCAG relative luminance formula and contrast ratio calculation.
 */

/**
 * Normalizes hex string into standard #RRGGBB format
 * @param {string} hex
 * @returns {string} Normalized 6-digit hex or fallback "#000000"
 */
export const normalizeHex = (hex) => {
  if (!hex || typeof hex !== "string") return "#000000";
  let clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return `#${clean.toUpperCase()}`;
  }
  return "#000000";
};

/**
 * Converts a hex color string to RGB values [0..255]
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
 */
export const hexToRgb = (hex) => {
  const normalized = normalizeHex(hex);
  const num = parseInt(normalized.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

/**
 * Computes WCAG 2.2 relative luminance for an sRGB color.
 * Reference: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 * @param {string} hex
 * @returns {number} Luminance between 0 (black) and 1 (white)
 */
export const getRelativeLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);

  const [rs, gs, bs] = [r, g, b].map((val) => {
    const srgb = val / 255;
    return srgb <= 0.04045
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calculates the WCAG contrast ratio between two hex colors.
 * Formula: (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color.
 * @param {string} foregroundHex
 * @param {string} backgroundHex
 * @returns {{
 *   ratio: number,
 *   ratioText: string,
 *   score: 'AAA' | 'AA' | 'AA Large' | 'Fail',
 *   passesAA: boolean,
 *   passesAALarge: boolean,
 *   passesAAA: boolean,
 *   badgeColor: string,
 *   label: string,
 *   description: string
 * }}
 */
export const calculateContrastRatio = (foregroundHex, backgroundHex = "#FFFFFF") => {
  const lum1 = getRelativeLuminance(foregroundHex);
  const lum2 = getRelativeLuminance(backgroundHex);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  const roundedRatio = Math.round(ratio * 10) / 10;
  const ratioText = `${roundedRatio.toFixed(1)}:1`;

  const passesAAA = ratio >= 7.0;
  const passesAA = ratio >= 4.5;
  const passesAALarge = ratio >= 3.0;

  if (passesAAA) {
    return {
      ratio: roundedRatio,
      ratioText,
      score: "AAA",
      passesAA: true,
      passesAALarge: true,
      passesAAA: true,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      label: "WCAG AAA (Enhanced)",
      description: "Exemplary contrast. Highly readable for both headers and small body text.",
    };
  }

  if (passesAA) {
    return {
      ratio: roundedRatio,
      ratioText,
      score: "AA",
      passesAA: true,
      passesAALarge: true,
      passesAAA: false,
      badgeColor: "bg-green-100 text-green-800 border-green-300",
      label: "WCAG AA (Standard)",
      description: "Meets standard accessibility requirements for all body text and headers.",
    };
  }

  if (passesAALarge) {
    return {
      ratio: roundedRatio,
      ratioText,
      score: "AA Large",
      passesAA: false,
      passesAALarge: true,
      passesAAA: false,
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      label: "WCAG Large Text (3:1+)",
      description: "Suitable for large section headers and bold titles. Consider a darker tone for small body text.",
    };
  }

  return {
    ratio: roundedRatio,
    ratioText,
    score: "Fail",
    passesAA: false,
    passesAALarge: false,
    passesAAA: false,
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    label: "Low Contrast Warning",
    description: "Insufficient contrast against white paper. Recruiters and ATS scanners may struggle to read this.",
  };
};

/**
 * Curated Executive Quick-Pick Accent Swatches
 */
export const CURATED_ACCENTS = [
  { name: "Navy Blue", hex: "#1E3A8A", category: "Corporate" },
  { name: "Cobalt", hex: "#2563EB", category: "Tech" },
  { name: "Deep Indigo", hex: "#4338CA", category: "Modern" },
  { name: "Emerald", hex: "#047857", category: "Professional" },
  { name: "Teal", hex: "#0F766E", category: "Creative" },
  { name: "Slate", hex: "#334155", category: "Executive" },
  { name: "Crimson", hex: "#BE123C", category: "Bold" },
  { name: "Burgundy", hex: "#881337", category: "Executive" },
  { name: "Royal Violet", hex: "#6D28D9", category: "Creative" },
  { name: "Warm Bronze", hex: "#B45309", category: "Warm" },
  { name: "Amber Gold", hex: "#CA8A04", category: "Classic" },
  { name: "Charcoal", hex: "#1F2937", category: "Minimal" },
];

/**
 * Curated Background Options
 */
export const CURATED_BACKGROUNDS = [
  { name: "Pure White", hex: "#FFFFFF", description: "Standard white paper" },
  { name: "Crisp Ivory", hex: "#FAFAF9", description: "Subtle warm tone" },
  { name: "Soft Cream", hex: "#FDFBF7", description: "Elegant editorial look" },
  { name: "Cool Slate", hex: "#F8FAFC", description: "Contemporary cool tone" },
];

/**
 * Curated Text / Neutral Dark Options
 */
export const CURATED_TEXT_COLORS = [
  { name: "Pure Black", hex: "#000000", description: "Maximum contrast" },
  { name: "Charcoal", hex: "#111827", description: "Modern soft black" },
  { name: "Slate Dark", hex: "#1E293B", description: "Warm graphite" },
  { name: "Deep Navy", hex: "#0F172A", description: "Subtle executive navy" },
];
