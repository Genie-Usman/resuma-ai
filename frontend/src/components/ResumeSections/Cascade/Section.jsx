import Rating from "./Rating";
import { shouldShowRating } from "../../../utils/ratingUtils";

const Section = ({
  section,
  children,
  className = "",
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
  themeColors = [],
  isTimeline = false,
}) => {
  if (!section?.visible || !section?.items?.length) return null;

  const validItems = section.items.filter((item) => item.visible !== false);
  if (!validItems.length) return null;

  return (
    <section id={section.id} className="w-full min-w-0 break-words mb-4">
      {/* 1. Sidebar Section Header (Dark Full-Width Banner as seen in Cascade design) */}
      <div className="hidden group-[.sidebar]:block w-full bg-black/25 px-5 py-1.5 mb-2.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
          {section.title || section.name}
        </h4>
      </div>

      {/* 2. Main Column Section Header (Bold Heading with Underline Rule) */}
      <div className="hidden group-[.main]:block mb-3 border-b border-slate-300 pb-1">
        <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
          {section.title || section.name}
        </h4>
      </div>

      {/* 3. Section Items List */}
      <div className="group-[.sidebar]:px-5 group-[.sidebar]:space-y-3 group-[.main]:space-y-4">
        {validItems.map((item, index) => {
          const urlRaw = urlKey ? item[urlKey] : undefined;
          const url =
            urlRaw && typeof urlRaw === "object"
              ? { label: urlRaw.label, href: urlRaw.href }
              : typeof urlRaw === "string" && urlRaw.startsWith("http")
              ? { label: urlRaw, href: urlRaw }
              : undefined;

          const level = levelKey ? item[levelKey] : undefined;
          const summary = summaryKey ? item[summaryKey] || "" : "";
          const dateStr = item.date || item.period || "";

          let keywords = [];
          if (keywordsKey) {
            const value = item[keywordsKey];
            if (Array.isArray(value)) {
              keywords = value;
            } else if (typeof value === "string" && value.trim() !== "") {
              keywords = value.split(/,\s*/);
            }
          }

          // Main timeline 2-column layout (Date on left, Details on right)
          return (
            <div
              key={item.id || `${section.id}-${index}`}
              className={`min-w-0 break-words ${className}`}
            >
              <div className="group-[.main]:flex group-[.main]:gap-4 group-[.main]:items-start">
                {/* Left Date Column (in Main view) */}
                {isTimeline && dateStr && (
                  <div className="hidden group-[.main]:block w-28 sm:w-32 shrink-0 text-xs font-semibold text-slate-500 pt-0.5 leading-snug">
                    {dateStr}
                  </div>
                )}

                {/* Right / Primary Content Column */}
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Item Details via render prop */}
                  <div>{children?.(item)}</div>

                  {/* Summary / Bullet points */}
                  {summary && summary.trim() !== "" && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: summary.replace(/([^\n>])\s*•/g, "$1<br>• "),
                      }}
                      className="wysiwyg text-xs leading-relaxed group-[.sidebar]:text-slate-200 group-[.main]:text-slate-700 [&>ul]:pl-4 [&>ul]:list-disc [&>ul>li]:my-0.5"
                    />
                  )}

                  {/* Rating Bar (For rated skills/languages) */}
                  {shouldShowRating(section, item, levelKey) && (
                    <Rating level={level} themeColors={themeColors} />
                  )}

                  {/* Keywords */}
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] group-[.sidebar]:text-slate-300 group-[.main]:text-slate-600"
                        >
                          {kw}
                          {i < keywords.length - 1 ? " •" : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  {url && section.separateLinks && (
                    <a
                      href={url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline block group-[.sidebar]:text-blue-300 group-[.main]:text-blue-600"
                    >
                      {url.label || url.href}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Section;
