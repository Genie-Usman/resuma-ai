import React, { useState, useRef, useEffect } from "react";
import { LuEye, LuEyeOff, LuPencil, LuCheck, LuX, LuTrash2 } from "react-icons/lu";

/**
 * Curated suggestions for Roadmap Item 2.4 (Section Title Renaming)
 * Supports conventional and unconventional career profiles.
 */
const SECTION_TITLE_SUGGESTIONS = {
  experience: [
    "Work Experience",
    "Professional Experience",
    "Relevant Experience",
    "Clinical Practice",
    "Career History",
  ],
  projects: [
    "Key Projects",
    "Open Source & Key Projects",
    "Case Studies",
    "Portfolio",
    "Technical Projects",
  ],
  profiles: [
    "Online Profiles",
    "Links & Repositories",
    "Social & Web Profiles",
    "Portfolio Links",
  ],
  summary: [
    "Professional Summary",
    "Executive Summary",
    "Career Overview",
    "About Me",
  ],
  education: [
    "Education",
    "Academic Background",
    "Education & Credentials",
    "Academic Qualifications",
  ],
  skills: [
    "Technical Skills",
    "Core Competencies",
    "Skills & Technologies",
    "Key Skills",
    "Areas of Expertise",
  ],
  certifications: [
    "Certifications & Licenses",
    "Certifications",
    "Professional Credentials",
    "Licenses",
  ],
  awards: [
    "Honors & Awards",
    "Distinctions & Awards",
    "Key Achievements",
    "Honors",
  ],
  languages: [
    "Languages",
    "Language Proficiencies",
    "Languages Spoken",
    "Multilingual Skills",
  ],
  interests: [
    "Interests & Passions",
    "Interests & Hobbies",
    "Personal Interests",
    "Activities & Passions",
  ],
  publications: [
    "Publications & Research",
    "Research & Publications",
    "Patents & Papers",
    "Publications",
  ],
  volunteer: [
    "Volunteering & Leadership",
    "Community Involvement",
    "Volunteer Experience",
    "Service & Leadership",
  ],
  references: [
    "Professional References",
    "References",
    "References upon Request",
  ],
};

/**
 * SectionFormHeader Component
 * Standardized header for resume section edit forms with:
 * 1. Section Title Renaming (Roadmap Item 2.4) with inline edit & quick suggestions.
 * 2. Section Visibility Toggle (Roadmap Item 2.3) with LuEye / LuEyeOff.
 */
const SectionFormHeader = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  isVisible = true,
  onToggleVisibility,
  sectionKey,
  onRenameTitle,
  onRemoveSection,
}) => {
  const visible = isVisible !== false;
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title || "");
  const originalTitleRef = useRef(title || "");
  const inputRef = useRef(null);

  // Sync tempTitle if title changes externally (e.g. template reset or undo/redo)
  useEffect(() => {
    if (!isEditing) {
      setTempTitle(title || "");
      originalTitleRef.current = title || "";
    }
  }, [title, isEditing]);

  // Auto-focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (!onRenameTitle) return;
    originalTitleRef.current = title || "";
    setTempTitle(title || "");
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const nextVal = e.target.value;
    setTempTitle(nextVal);
    // Real-time live preview update on every keystroke
    if (onRenameTitle) {
      onRenameTitle(nextVal, false);
    }
  };

  const handleSave = () => {
    const trimmed = tempTitle.trim();
    if (trimmed) {
      if (onRenameTitle) {
        onRenameTitle(trimmed, true);
      }
      setTempTitle(trimmed);
      originalTitleRef.current = trimmed;
    } else {
      // Revert if empty string
      const fallback = originalTitleRef.current || title || "";
      if (onRenameTitle) {
        onRenameTitle(fallback, true);
      }
      setTempTitle(fallback);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    const revertTo = originalTitleRef.current || title || "";
    if (onRenameTitle) {
      onRenameTitle(revertTo, true);
    }
    setTempTitle(revertTo);
    setIsEditing(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setTempTitle(suggestion);
    originalTitleRef.current = suggestion;
    if (onRenameTitle) {
      onRenameTitle(suggestion, true);
    }
    setIsEditing(false);
  };

  const suggestions = sectionKey ? SECTION_TITLE_SUGGESTIONS[sectionKey] || [] : [];

  return (
    <div className="space-y-3 select-none">
      {/* Top Header Row */}
      <div className="pb-3 border-b border-slate-100 flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Inline Title Editor (Roadmap Item 2.4) */}
            {isEditing ? (
              <div className="flex flex-col gap-2 w-full max-w-md py-0.5">
                <div className="flex items-center gap-1.5">
                  <input
                    ref={inputRef}
                    type="text"
                    value={tempTitle}
                    onChange={handleInputChange}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSave();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        handleCancel();
                      }
                    }}
                    placeholder="Enter custom section title..."
                    className="text-base font-bold text-slate-900 bg-white border border-purple-400 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-xs flex-1"
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleSave}
                    className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer shadow-xs shrink-0"
                    title="Save title (Enter)"
                  >
                    <LuCheck className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleCancel}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                    title="Cancel (Esc)"
                  >
                    <LuX className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick suggestions chips */}
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 mt-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 mr-0.5">
                      Suggested titles:
                    </span>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors cursor-pointer ${
                          title === suggestion
                            ? "bg-purple-100 text-purple-800 border-purple-200 font-semibold"
                            : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`group/title flex items-center gap-1.5 rounded-lg py-0.5 px-1.5 -ml-1.5 transition-colors ${
                  onRenameTitle
                    ? "cursor-pointer hover:bg-purple-50/80"
                    : ""
                }`}
                onClick={handleStartEdit}
                title={onRenameTitle ? "Click to rename this section title" : undefined}
              >
                <h2 className="text-lg font-bold text-slate-900 tracking-tight group-hover/title:text-purple-950 transition-colors">
                  {title}
                </h2>
                {onRenameTitle && (
                  <span className="p-1 rounded-md text-slate-300 group-hover/title:text-purple-600 group-hover/title:bg-white transition-all shadow-none group-hover/title:shadow-2xs">
                    <LuPencil className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            )}

            {/* Section Visibility Toggle (Roadmap Item 2.3) */}
            {!isEditing && onToggleVisibility && (
              <button
                type="button"
                onClick={onToggleVisibility}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border shadow-2xs ${
                  visible
                    ? "text-slate-700 bg-white hover:bg-slate-50 border-slate-200/90 hover:border-purple-300 hover:text-purple-700"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-300"
                }`}
                title={visible ? "Click to hide section on resume" : "Click to show section on resume"}
              >
                {visible ? (
                  <>
                    <LuEye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <LuEyeOff className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hidden</span>
                  </>
                )}
              </button>
            )}

            {/* Custom Section Delete Button (Roadmap Item 3.1) */}
            {!isEditing && onRemoveSection && (
              <button
                type="button"
                onClick={onRemoveSection}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200/90 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
                title="Delete this custom section"
              >
                <LuTrash2 className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>

          {!isEditing && subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Section Category Badge */}
        {badge && (
          <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 shadow-2xs">
            {Icon && <Icon className="w-3.5 h-3.5 text-purple-600" />}
            {badge}
          </span>
        )}
      </div>

      {/* Subtle Notice Banner when Section is Soft-Hidden */}
      {!visible && onToggleVisibility && !isEditing && (
        <div className="px-3.5 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 min-w-0">
            <LuEyeOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">This section is hidden on your resume preview and exports.</span>
          </div>
          <button
            type="button"
            onClick={onToggleVisibility}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 font-semibold border border-amber-300 transition-colors shrink-0 cursor-pointer text-[11px]"
          >
            Show Section
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionFormHeader;
