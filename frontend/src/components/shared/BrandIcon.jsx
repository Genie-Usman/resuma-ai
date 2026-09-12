import { forwardRef, useState } from "react";
import LINKEDIN from "../../assets/linkedin.svg";
import { LuGlobe, LuLink, LuMail, LuPhone } from "react-icons/lu";

// Generic concept fallbacks (SimpleIcons does not host non-brand icons like 'portfolio' or 'email')
const GENERIC_ICONS = {
  globe: LuGlobe,
  web: LuGlobe,
  website: LuGlobe,
  portfolio: LuGlobe,
  link: LuLink,
  url: LuLink,
  email: LuMail,
  mail: LuMail,
  phone: LuPhone,
  call: LuPhone,
};

// URL to platform detector so full URLs like 'https://github.com/...' don't break SimpleIcons CDN
function extractPlatformSlug(raw) {
  if (!raw) return "";
  const lower = String(raw).toLowerCase().trim();
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("github.com")) return "github";
  if (lower.includes("gitlab.com")) return "gitlab";
  if (lower.includes("bitbucket.org")) return "bitbucket";
  if (lower.includes("x.com") || lower.includes("twitter.com")) return "x";
  if (lower.includes("leetcode.com")) return "leetcode";
  if (lower.includes("hackerrank.com")) return "hackerrank";
  if (lower.includes("kaggle.com")) return "kaggle";
  if (lower.includes("codeforces.com")) return "codeforces";
  if (lower.includes("codechef.com")) return "codechef";
  if (lower.includes("stackoverflow.com")) return "stackoverflow";
  if (lower.includes("medium.com")) return "medium";
  if (lower.includes("dev.to")) return "devto";
  if (lower.includes("hashnode.dev") || lower.includes("hashnode.com")) return "hashnode";
  if (lower.includes("dribbble.com")) return "dribbble";
  if (lower.includes("behance.net")) return "behance";
  if (lower.includes("figma.com")) return "figma";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("facebook.com")) return "facebook";
  if (lower.includes("youtube.com")) return "youtube";
  if (lower.includes("discord.gg") || lower.includes("discord.com")) return "discord";
  if (lower.includes("slack.com")) return "slack";
  if (lower.includes("t.me") || lower.includes("telegram.me")) return "telegram";
  if (lower.includes("wa.me") || lower.includes("whatsapp.com")) return "whatsapp";
  if (lower.includes("twitch.tv")) return "twitch";
  if (lower.includes("reddit.com")) return "reddit";
  if (lower.includes("threads.net")) return "threads";
  if (lower.includes("substack.com")) return "substack";
  if (lower.includes("tiktok.com")) return "tiktok";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("pinterest.com")) return "pinterest";
  if (lower.includes("snapchat.com")) return "snapchat";
  return "";
}

const BrandIcon = forwardRef(({ slug = "", className = "size-5", style = {}, ...props }, ref) => {
  const [failedSlug, setFailedSlug] = useState(null);

  if (!slug && slug !== 0) return null;

  // Defensive input handling: string, URL, object, number
  let raw = "";
  if (typeof slug === "string") {
    raw = slug.trim();
  } else if (slug && typeof slug === "object") {
    raw = String(slug.href || slug.label || slug.name || slug.icon || "").trim();
  } else {
    raw = String(slug).trim();
  }

  if (!raw) return null;

  // Clean slug from URL if pasted, else sanitize
  let cleanSlug = extractPlatformSlug(raw);
  if (!cleanSlug) {
    cleanSlug = raw.toLowerCase().replace(/https?:\/\/(www\.)?/g, "").replace(/[^a-z0-9]/g, "");
  }

  // 1. Generic non-brand concepts (globe, website, portfolio, email, phone)
  const GenericIcon = GENERIC_ICONS[cleanSlug];
  if (GenericIcon) {
    return (
      <GenericIcon
        ref={ref}
        className={`${className} shrink-0 inline-block align-middle`}
        style={{ color: "#475569", ...style }}
        {...props}
      />
    );
  }

  // 2. LinkedIn: SimpleIcons CDN removed LinkedIn due to trademark takedown (HTTP 404).
  // Use our local authentic SimpleIcons LinkedIn SVG so LinkedIn never breaks!
  if (cleanSlug === "linkedin" || cleanSlug === "linkedincom") {
    return (
      <img
        ref={ref}
        alt="LinkedIn"
        className={`${className} shrink-0 inline-block align-middle object-contain`}
        style={style}
        src={LINKEDIN}
        crossOrigin="anonymous"
        loading="lazy"
        {...props}
      />
    );
  }

  // 3. Twitter: SimpleIcons renamed slug from 'twitter' to 'x'
  const simpleIconsSlug = cleanSlug === "twitter" || cleanSlug === "twittercom" ? "x" : cleanSlug;

  // If the SimpleIcons CDN returned an error / 404 for this exact slug, gracefully show clean globe
  if (failedSlug === simpleIconsSlug) {
    return (
      <LuGlobe
        ref={ref}
        className={`${className} shrink-0 inline-block align-middle`}
        style={{ color: "#475569", ...style }}
        {...props}
      />
    );
  }

  // 4. Primary: Render authentic icon directly from SimpleIcons CDN
  return (
    <img
      key={simpleIconsSlug}
      ref={ref}
      alt={simpleIconsSlug}
      className={`${className} shrink-0 inline-block align-middle object-contain`}
      style={style}
      src={`https://cdn.simpleicons.org/${simpleIconsSlug}`}
      crossOrigin="anonymous"
      loading="lazy"
      onError={() => setFailedSlug(simpleIconsSlug)}
      {...props}
    />
  );
});

BrandIcon.displayName = "BrandIcon";

export default BrandIcon;
