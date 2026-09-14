import React, { useEffect, useState, useMemo } from "react";
import QRCode from "qrcode";

/**
 * Resolves the target destination URL based on the selected QR type and user profiles.
 */
export const resolveQrUrl = (qrCode = {}, basics = {}, profiles = []) => {
  const type = qrCode.type || "portfolio";
  if (type === "custom") {
    return qrCode.customUrl || qrCode.url || "";
  }
  if (type === "linkedin") {
    const li = Array.isArray(profiles)
      ? profiles.find((p) => p?.network?.toLowerCase() === "linkedin")
      : null;
    if (li?.url?.href) return li.url.href;
    if (li?.username) return `https://linkedin.com/in/${li.username}`;
    return qrCode.customUrl || "";
  }
  if (type === "github") {
    const gh = Array.isArray(profiles)
      ? profiles.find((p) => p?.network?.toLowerCase() === "github")
      : null;
    if (gh?.url?.href) return gh.url.href;
    if (gh?.username) return `https://github.com/${gh.username}`;
    return qrCode.customUrl || "";
  }
  // Default: personal portfolio / website
  return basics?.url?.href || qrCode.customUrl || "";
};

export const getDefaultSubtitle = (type) => {
  switch (type) {
    case "linkedin":
      return "Scan for LinkedIn";
    case "github":
      return "Scan for GitHub";
    case "custom":
      return "Scan to Connect";
    case "portfolio":
    default:
      return "Scan for Portfolio";
  }
};

const SIZE_MAP = {
  small: 68,   // ~18mm discreet (recommended)
  medium: 84,  // ~22mm standard
  large: 100,  // ~26mm prominent
};

/**
 * ResumeQrCode Component
 * Generates a crisp, 100% vector SVG QR code embedded seamlessly into resume headers.
 */
const ResumeQrCode = ({
  qrCode = {},
  basics = {},
  profiles = [],
  themeColors = [],
  className = "",
  align = "center", // "center" | "left" | "right"
  inverted = false, // if placed on dark banner
}) => {
  const [svgMarkup, setSvgMarkup] = useState("");

  const isEnabled = qrCode?.enabled === true;
  const targetUrl = useMemo(
    () => resolveQrUrl(qrCode, basics, profiles),
    [qrCode, basics, profiles]
  );

  const sizeKey = qrCode?.size || "small";
  const sizePx = typeof sizeKey === "number" ? sizeKey : (SIZE_MAP[sizeKey] || 68);

  const subtitle = qrCode?.subtitle || getDefaultSubtitle(qrCode?.type);
  const showSubtitle = qrCode?.showSubtitle !== false && Boolean(subtitle);

  useEffect(() => {
    if (!isEnabled || !targetUrl) {
      setSvgMarkup("");
      return;
    }

    let isMounted = true;

    QRCode.toString(
      targetUrl,
      {
        type: "svg",
        margin: 0,
        errorCorrectionLevel: "M",
        color: {
          dark: "#0f172a", // rich slate-900 for high optical contrast
          light: "#00000000", // transparent background
        },
      },
      (err, svg) => {
        if (!err && isMounted && svg) {
          setSvgMarkup(svg);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [isEnabled, targetUrl]);

  if (!isEnabled || !targetUrl || !svgMarkup) {
    return null;
  }

  const alignmentClass =
    align === "right"
      ? "items-end text-right"
      : align === "left"
      ? "items-start text-left"
      : "items-center text-center";

  return (
    <div
      className={`inline-flex flex-col ${alignmentClass} group shrink-0 select-none print:break-inside-avoid ${className}`}
      title={`Scan or click to open: ${targetUrl}`}
    >
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white p-1 rounded-lg border border-slate-200/80 shadow-2xs transition-transform duration-200 hover:scale-105 active:scale-98 cursor-pointer"
        style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
        aria-label={`QR code for ${subtitle || targetUrl}`}
      >
        <div
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </a>

      {showSubtitle && (
        <span
          className={`mt-1 text-[8.5px] font-semibold tracking-wider uppercase leading-tight ${
            inverted ? "text-white/80" : "text-slate-500"
          }`}
          style={{ maxWidth: `${sizePx + 16}px` }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
};

export default ResumeQrCode;
