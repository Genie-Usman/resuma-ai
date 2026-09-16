/**
 * Analytics Parsing & Normalization Helper for Resuma AI Public Portfolios
 */

// Common timezone to country mapping fallback
const TIMEZONE_TO_COUNTRY = {
  "Asia/Karachi": { country: "Pakistan", code: "PK" },
  "Asia/Kolkata": { country: "India", code: "IN" },
  "Asia/Dhaka": { country: "Bangladesh", code: "BD" },
  "Asia/Dubai": { country: "United Arab Emirates", code: "AE" },
  "Asia/Riyadh": { country: "Saudi Arabia", code: "SA" },
  "Asia/Singapore": { country: "Singapore", code: "SG" },
  "Asia/Tokyo": { country: "Japan", code: "JP" },
  "Asia/Seoul": { country: "South Korea", code: "KR" },
  "Asia/Hong_Kong": { country: "Hong Kong", code: "HK" },
  "Asia/Shanghai": { country: "China", code: "CN" },
  "Europe/London": { country: "United Kingdom", code: "GB" },
  "Europe/Dublin": { country: "Ireland", code: "IE" },
  "Europe/Paris": { country: "France", code: "FR" },
  "Europe/Berlin": { country: "Germany", code: "DE" },
  "Europe/Amsterdam": { country: "Netherlands", code: "NL" },
  "Europe/Madrid": { country: "Spain", code: "ES" },
  "Europe/Rome": { country: "Italy", code: "IT" },
  "Europe/Zurich": { country: "Switzerland", code: "CH" },
  "Europe/Stockholm": { country: "Sweden", code: "SE" },
  "Australia/Sydney": { country: "Australia", code: "AU" },
  "Australia/Melbourne": { country: "Australia", code: "AU" },
  "America/Toronto": { country: "Canada", code: "CA" },
  "America/Vancouver": { country: "Canada", code: "CA" },
  "America/Sao_Paulo": { country: "Brazil", code: "BR" },
};

const COUNTRY_CODE_TO_NAME = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  NL: "Netherlands",
  PK: "Pakistan",
  IN: "India",
  SG: "Singapore",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  BR: "Brazil",
  IE: "Ireland",
  CH: "Switzerland",
  SE: "Sweden",
  ES: "Spain",
  IT: "Italy",
};

/**
 * Normalizes raw HTTP referrer or client document.referrer into canonical source
 */
function parseReferrer(rawReferrer) {
  if (!rawReferrer || typeof rawReferrer !== "string") {
    return "Direct Link";
  }

  const clean = rawReferrer.trim().toLowerCase();
  if (clean === "direct" || clean === "" || clean === "null" || clean === "undefined") {
    return "Direct Link";
  }

  try {
    const url = clean.startsWith("http") ? new URL(clean) : null;
    const host = url ? url.hostname.replace(/^www\./, "") : clean;

    if (host.includes("linkedin.com") || host.includes("lnkd.in")) return "LinkedIn";
    if (host.includes("github.com")) return "GitHub";
    if (host.includes("twitter.com") || host.includes("t.co") || host.includes("x.com")) return "X / Twitter";
    if (host.includes("google.")) return "Google Search";
    if (host.includes("indeed.")) return "Indeed";
    if (host.includes("glassdoor.")) return "Glassdoor";
    if (host.includes("facebook.") || host.includes("fb.com")) return "Facebook";
    if (host.includes("instagram.")) return "Instagram";
    if (host.includes("reddit.")) return "Reddit";
    if (host.includes("youtube.")) return "YouTube";
    if (host.includes("localhost") || host.includes("127.0.0.1") || host.includes("resuma")) {
      return "Direct / Resuma";
    }

    // Capitalize domain without TLD or return hostname
    return host;
  } catch {
    return "Direct Link";
  }
}

/**
 * Detects visitor country from CDN headers or client timezone
 */
function parseCountry(req) {
  // 1. Check CDN headers (Cloudflare, Vercel, AWS CloudFront)
  const headerCode =
    req.headers["cf-ipcountry"] ||
    req.headers["x-vercel-ip-country"] ||
    req.headers["x-country-code"] ||
    req.headers["cloudfront-viewer-country"];

  if (headerCode && headerCode.length === 2) {
    const upper = headerCode.toUpperCase();
    return {
      country: COUNTRY_CODE_TO_NAME[upper] || upper,
      code: upper,
    };
  }

  // 2. Check query parameter or client timezone header
  const tz = req.query?.tz || req.headers["x-client-timezone"];
  if (tz && typeof tz === "string") {
    if (TIMEZONE_TO_COUNTRY[tz]) {
      return TIMEZONE_TO_COUNTRY[tz];
    }
    if (tz.startsWith("America/")) {
      return { country: "United States", code: "US" };
    }
    if (tz.startsWith("Europe/")) {
      return { country: "Europe", code: "EU" };
    }
    if (tz.startsWith("Asia/")) {
      return { country: "Asia", code: "AS" };
    }
  }

  // Default fallback
  return {
    country: "United States",
    code: "US",
  };
}

/**
 * Detects device category (Mobile, Tablet, Desktop)
 */
function parseDevice(userAgent = "") {
  const ua = String(userAgent).toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    return "Tablet";
  }
  if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

/**
 * Detects basic browser name
 */
function parseBrowser(userAgent = "") {
  const ua = String(userAgent).toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("chrome") && !ua.includes("edg/")) return "Chrome";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("opera") || ua.includes("opr/")) return "Opera";
  return "Browser";
}

module.exports = {
  parseReferrer,
  parseCountry,
  parseDevice,
  parseBrowser,
};
