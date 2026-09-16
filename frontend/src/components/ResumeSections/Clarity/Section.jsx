import {
  LuBriefcase,
  LuGraduationCap,
  LuPuzzle,
  LuCpu,
  LuAward,
  LuLanguages,
  LuFolderGit2,
  LuHeart,
  LuBookOpen,
  LuHandHeart,
  LuUsers,
  LuShare2,
  LuUser,
} from "react-icons/lu";
import Rating from "./Rating";
import { shouldShowRating } from "../../../utils/ratingUtils";

const SECTION_ICONS = {
  experience: LuBriefcase,
  education: LuGraduationCap,
  skills: LuPuzzle,
  software: LuCpu,
  certifications: LuAward,
  awards: LuAward,
  languages: LuLanguages,
  projects: LuFolderGit2,
  interests: LuHeart,
  publications: LuBookOpen,
  volunteer: LuHandHeart,
  references: LuUsers,
  profiles: LuUser,
};

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
  hasDivider = false,
}) => {
  if (!section?.visible || !section?.items?.length) return null;

  const validItems = section.items.filter((item) => item.visible !== false);
  if (!validItems.length) return null;

  const primaryColor = themeColors[2] || "#1e293b";
  const SectionIcon = SECTION_ICONS[section.id] || SECTION_ICONS[section.type] || LuBriefcase;

  return (
    <section id={section.id} className="w-full mb-6">
      {/* Section Header with Circular Badge Icon & Horizontal Rule */}
      <div className="flex items-center gap-2.5 mb-3.5 select-none">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs"
          style={{ backgroundColor: primaryColor }}
        >
          <SectionIcon className="w-3 h-3" />
        </div>
        <h3 className="section-title text-sm sm:text-[15px] font-bold tracking-tight text-slate-900 capitalize shrink-0">
          {section.title || section.name}
        </h3>
        {/* Horizontal Divider Line in Main Content */}
        {(isTimeline || hasDivider) && (
          <div className="flex-1 border-b border-slate-200/90 ml-2" />
        )}
      </div>

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
