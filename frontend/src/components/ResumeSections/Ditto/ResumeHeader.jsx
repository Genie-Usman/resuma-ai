import { LuLink, LuMapPin, LuPhone } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import Picture from "../Picture";

const ResumeHeader = ({ basics = {}, themeColors }) => {
  const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");
  const hasPicture =
    basics.picture?.url &&
    typeof basics.picture.url === "string" &&
    basics.picture.url.startsWith("http") &&
    !basics.picture.effects?.hidden;

  const accentColor = themeColors[2] || "#059669";
  const textColor = themeColors[1] || "#000000";

  return (
    <header className="w-full flex flex-col">
      {/* 1. Top Accent Banner */}
      <div
        className="w-full px-8 py-6 flex items-center transition-colors"
        style={{ backgroundColor: accentColor }}
      >
        <div className="w-full flex items-center gap-6">
          {hasPicture && (
            <div className="shrink-0 -mb-10 relative z-20">
              <Picture
                picture={basics.picture}
                size={105}
                className="rounded-2xl ring-4 ring-white shadow-md object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight break-words">
              {basics.name || "Untitled Resume"}
            </h1>
            {basics.headline && (
              <p className="text-sm sm:text-base font-medium text-white/90 mt-1 tracking-wide">
                {basics.headline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Contact Information Strip */}
      <div
        className={`w-full px-8 py-3 bg-slate-50/80 border-b border-slate-200/70 text-xs font-medium ${
          hasPicture ? "pl-38" : ""
        }`}
        style={{ color: textColor }}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {basics.location && (
            <div className="flex items-center gap-1.5">
              <LuMapPin style={{ color: accentColor }} className="shrink-0" />
              <span>{basics.location}</span>
            </div>
          )}

          {basics.phone && (
            <div className="flex items-center gap-1.5">
              <LuPhone style={{ color: accentColor }} className="shrink-0" />
              <a
                href={`tel:${basics.phone}`}
                className="hover:underline"
                style={{ color: textColor }}
              >
                {basics.phone}
              </a>
            </div>
          )}

          {basics.email && (
            <div className="flex items-center gap-1.5">
              <MdAlternateEmail style={{ color: accentColor }} className="shrink-0 text-sm" />
              <a
                href={`mailto:${basics.email}`}
                className="hover:underline"
                style={{ color: textColor }}
              >
                {basics.email}
              </a>
            </div>
          )}

          {basics.url?.href && isValidUrl(basics.url.href) && (
            <div className="flex items-center gap-1.5">
              <LuLink style={{ color: accentColor }} className="shrink-0" />
              <a
                href={basics.url.href}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline"
                style={{ color: textColor }}
              >
                {basics.url.label || basics.url.href}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ResumeHeader;

