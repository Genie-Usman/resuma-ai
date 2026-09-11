import { forwardRef, useState, useEffect } from "react";
import { LuGlobe, LuLink } from "react-icons/lu";

// In-memory cache for fetched SimpleIcons SVG paths and brand fill colors
const simpleIconsCache = new Map();

// Local fallback aliases for generic web concepts
const GENERIC_ICONS = {
  globe: LuGlobe,
  web: LuGlobe,
  website: LuGlobe,
  portfolio: LuGlobe,
  link: LuLink,
};

// Authentic LinkedIn path for the white 'in' letters
const LINKEDIN_IN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z";

const BrandIcon = forwardRef(({ slug = "", className = "size-5", style = {}, ...props }, ref) => {
  const [iconData, setIconData] = useState(null);
  const [hasError, setHasError] = useState(false);

  if (!slug) return null;

  const rawSlug = slug.toLowerCase().trim();
  const normalized = rawSlug.replace(/[-_\s]+/g, "");

  // 1. Generic icons (globe, portfolio, website, link) - use crisp neutral dark color
  const GenericIcon = GENERIC_ICONS[normalized] || GENERIC_ICONS[rawSlug];
  if (GenericIcon) {
    return (
      <GenericIcon
        ref={ref}
        className={`${className} shrink-0 inline-block align-middle`}
        style={{ ...style, color: "#334155" }}
        {...props}
      />
    );
  }

  // 2. Special case: LinkedIn - authentic blue rounded square with crisp white 'in' letters
  if (normalized === "linkedin" || normalized === "linkedincom") {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        viewBox="0 0 24 24"
        className={`${className} shrink-0 inline-block align-middle`}
        style={style}
        {...props}
      >
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path fill="#FFFFFF" d={LINKEDIN_IN_PATH} />
      </svg>
    );
  }

  // 3. Normalize Twitter to 'x'
  const fetchSlug = normalized === "twitter" || normalized === "twittercom" ? "x" : rawSlug;

  // Check cache first
  const cached = simpleIconsCache.get(fetchSlug);

  useEffect(() => {
    let isMounted = true;

    if (simpleIconsCache.has(fetchSlug)) {
      setIconData(simpleIconsCache.get(fetchSlug));
      return;
    }

    // Fetch from SimpleIcons CDN (supports all 3000+ SimpleIcons)
    fetch(`https://cdn.simpleicons.org/${fetchSlug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Icon not found on SimpleIcons");
        }
        return res.text();
      })
      .then((svgText) => {
        if (!isMounted) return;
        const pathMatch = svgText.match(/<path[^>]*d=["']([^"']+)["']/);
        const fillMatch = svgText.match(/fill=["']([^"']+)["']/);
        if (pathMatch && pathMatch[1]) {
          const data = {
            d: pathMatch[1],
            fill: fillMatch ? fillMatch[1] : "#181717",
          };
          simpleIconsCache.set(fetchSlug, data);
          setIconData(data);
        } else {
          setHasError(true);
        }
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchSlug]);

  // When path is ready, render inline vector SVG using its authentic brand fill color
  const active = cached || iconData;
  if (active) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        viewBox="0 0 24 24"
        className={`${className} shrink-0 inline-block align-middle`}
        style={style}
        {...props}
      >
        <path fill={active.fill} d={active.d} />
      </svg>
    );
  }

  // If fetch errored or 404, fall back to clean globe icon
  if (hasError) {
    return (
      <LuGlobe
        ref={ref}
        className={`${className} shrink-0 inline-block align-middle`}
        style={{ ...style, color: "#334155" }}
        {...props}
      />
    );
  }

  // While fetching, render an eager image with original brand colors
  return (
    <img
      ref={ref}
      alt={fetchSlug}
      className={`${className} shrink-0 inline-block align-middle`}
      style={style}
      src={`https://cdn.simpleicons.org/${fetchSlug}`}
      crossOrigin="anonymous"
      loading="eager"
      onError={() => setHasError(true)}
      {...props}
    />
  );
});

BrandIcon.displayName = "BrandIcon";

export default BrandIcon;

