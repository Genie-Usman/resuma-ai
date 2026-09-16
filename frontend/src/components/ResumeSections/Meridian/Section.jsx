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
  LuFileText,
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
  profiles: LuShare2,
  summary: LuFileText,
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
}) => {
  if (!section?.visible || !section?.items?.length) return null;

  const validItems = section.items.filter((item) => item.visible !== false);
  if (!validItems.length) return null;

  const primaryColor = themeColors[2] || "#0d2f5a";
  const SectionIcon = SECTION_ICONS[section.id] || SECTION_ICONS[section.type] || LuBriefcase;

  return (
    <section id={section.id} className="w-full mb-6">
      {/* 1. Section Header: Left spacer aligning with spine, then Circular Badge Icon & Title */}
      <div className="flex items-center gap-3 mb-3.5 select-none">
        <div className="w-24 sm:w-32 shrink-0" />
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
          style={{ backgroundColor: primaryColor }}
        >
          <SectionIcon className="w-3.5 h-3.5" />
        </div>
        <h3
          className="section-title text-sm sm:text-base font-bold tracking-tight capitalize"
          style={{ color: primaryColor }}
        >
          {section.title || section.name}
        </h3>
      </div>

      {/* 2. Items List */}
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
            <div key={item.id || `${section.id}-${index}`} className="flex items-start">
              {/* Left Date Column sitting over the dark navy spine */}
              <div className="w-24 sm:w-32 shrink-0 pr-3.5 text-right text-[11px] font-bold text-blue-100/90 leading-tight pt-0.5 select-none break-words">
                {dateStr}
              </div>

              {/* Vertical Timeline axis with node */}
              <div className="relative flex flex-col items-center self-stretch mr-3.5">
                {/* Continuous vertical timeline line */}
                <div className="w-0.5 bg-slate-200 h-full absolute top-0" />
                {/* Node dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full z-10 shrink-0 mt-1 ring-2 ring-white shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>

              {/* Right Content Area */}
              <div className="flex-1 min-w-0 pb-2 space-y-1.5 pr-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">{children?.(item)}</div>

                  {/* Rating Dots (for skills / languages / software) */}
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

                {/* Keywords Chips */}
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

                {/* Separate Link */}
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
          );
        })}
      </div>
    </section>
  );
};

export default Section;
