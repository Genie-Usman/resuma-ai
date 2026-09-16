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
  isLanguage = false,
}) => {
  if (!section?.visible || !section?.items?.length) return null;

  const validItems = section.items.filter((item) => item.visible !== false);
  if (!validItems.length) return null;

  return (
    <section id={section.id} className="w-full mb-6">
      {/* Section Header with Bold Underline Rule */}
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3.5 select-none">
        {section.title || section.name}
      </h3>

      {/* Items List */}
      <div className="space-y-4">
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

          return (
            <div key={item.id || `${section.id}-${index}`} className="min-w-0">
              <div className="flex items-start gap-4">
                {/* Left Date Column in Timeline Mode */}
                {isTimeline && dateStr && (
                  <div className="w-24 sm:w-28 shrink-0 text-xs font-bold text-slate-800 pt-0.5 leading-snug">
                    {dateStr}
                  </div>
                )}

                {/* Right / Main Content Column */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">{children?.(item)}</div>

                    {/* Dot Rating Meters for Skills / Software / Languages */}
                    {shouldShowRating(section, item, levelKey) && (
                      <Rating
                        level={level}
                        themeColors={themeColors}
                        isLanguage={isLanguage}
                      />
                    )}
                  </div>

                  {/* Summary / Bullet Points */}
                  {summary && summary.trim() !== "" && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: summary.replace(/([^\n>])\s*•/g, "$1<br>• "),
                      }}
                      className="wysiwyg text-xs leading-relaxed text-slate-700 [&>ul]:pl-4 [&>ul]:list-disc [&>ul>li]:my-0.5"
                    />
                  )}

                  {/* Keywords */}
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Link */}
                  {url && section.separateLinks && (
                    <a
                      href={url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline block text-blue-600 hover:text-blue-800"
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
