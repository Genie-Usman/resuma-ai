/**
 * Google Fonts Utility & API Service for Resuma AI
 * Handles dynamic font stylesheet loading, curated font presets,
 * and live search integration via Google Web Fonts API.
 */

export const DEFAULT_FONT = "Inter";

// Curated top ATS-safe resume fonts (pre-cached for instant 0ms rendering)
export const CURATED_FONTS = [
  // Modern Sans-Serif
  { family: "Inter", category: "sans-serif", label: "Inter (Modern Tech)" },
  { family: "Roboto", category: "sans-serif", label: "Roboto (Clean Standard)" },
  { family: "Montserrat", category: "sans-serif", label: "Montserrat (Geometric)" },
  { family: "Poppins", category: "sans-serif", label: "Poppins (Friendly Modern)" },
  { family: "Open Sans", category: "sans-serif", label: "Open Sans (Neutral)" },
  { family: "Lato", category: "sans-serif", label: "Lato (Corporate)" },
  { family: "Outfit", category: "sans-serif", label: "Outfit (Contemporary)" },
  { family: "Plus Jakarta Sans", category: "sans-serif", label: "Plus Jakarta Sans (Premium)" },
  { family: "Nunito", category: "sans-serif", label: "Nunito (Soft & Rounded)" },
  { family: "Raleway", category: "sans-serif", label: "Raleway (Elegant Sans)" },

  // Executive Serif
  { family: "Merriweather", category: "serif", label: "Merriweather (Classic Executive)" },
  { family: "Lora", category: "serif", label: "Lora (Literary & Refined)" },
  { family: "Playfair Display", category: "serif", label: "Playfair Display (Editorial)" },
  { family: "EB Garamond", category: "serif", label: "EB Garamond (Traditional Heritage)" },
  { family: "PT Serif", category: "serif", label: "PT Serif (Formal & Direct)" },
  { family: "Cormorant Garamond", category: "serif", label: "Cormorant (High Fashion)" },

  // Tech / Monospace
  { family: "JetBrains Mono", category: "monospace", label: "JetBrains Mono (Developer)" },
  { family: "Fira Code", category: "monospace", label: "Fira Code (Code Aesthetic)" },
  { family: "Space Mono", category: "monospace", label: "Space Mono (Editorial Mono)" },
];

const loadedFontsSet = new Set(["Inter"]);

/**
 * Dynamically injects Google Font <link> into document.head on-demand.
 * Deduplicates multiple loads and supports standard resume weights.
 */
export const loadGoogleFont = (fontFamily) => {
  if (!fontFamily || typeof fontFamily !== "string") return;

  const cleanFamily = fontFamily.trim();
  if (loadedFontsSet.has(cleanFamily)) return;

  const fontId = `gf-${cleanFamily.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  if (document.getElementById(fontId)) {
    loadedFontsSet.add(cleanFamily);
    return;
  }

  const encodedFamily = cleanFamily.replace(/\s+/g, "+");
  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodedFamily}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
  
  link.onload = () => loadedFontsSet.add(cleanFamily);
  document.head.appendChild(link);
};

/**
 * Returns generic CSS fallback stack based on font category.
 */
export const getFontFallback = (category) => {
  switch (category) {
    case "serif":
      return 'Georgia, Cambria, "Times New Roman", serif';
    case "monospace":
      return '"Courier New", Courier, monospace';
    case "sans-serif":
    default:
      return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }
};

/**
 * Fetches all popular fonts from Google Fonts API using the developer key.
 * Caches in sessionStorage to minimize API requests and ensure snappy performance.
 */
export const fetchGoogleFontsList = async (apiKey) => {
  const effectiveKey = apiKey || import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
  if (!effectiveKey) {
    return CURATED_FONTS;
  }

  const CACHE_KEY = "resuma_google_fonts_catalog_v1";
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read font cache:", err);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${effectiveKey}&sort=popularity`
    );

    if (!response.ok) {
      console.warn("Google Fonts API error:", response.status, response.statusText);
      return CURATED_FONTS;
    }

    const data = await response.json();
    if (Array.isArray(data.items)) {
      // Extract popular fonts (top 350 for fast scrolling & low memory footprint)
      const mapped = data.items.slice(0, 350).map((f) => ({
        family: f.family,
        category: f.category || "sans-serif",
        label: f.family,
      }));

      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
      } catch (e) {
        // Quota exceeded in storage, ignore
      }

      return mapped;
    }
  } catch (err) {
    console.warn("Failed to fetch Google Fonts catalog:", err);
  }

  return CURATED_FONTS;
};
