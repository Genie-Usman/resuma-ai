import { useState, useMemo, useRef, useEffect } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronDown,
  LuListTree,
  LuPencil,
  LuCheck,
  LuX,
  LuUser,
  LuGlobe,
  LuBriefcase,
  LuGraduationCap,
  LuSparkles,
  LuFolderGit2,
  LuAward,
  LuTrophy,
  LuLanguages,
  LuHeart,
  LuBookOpen,
  LuHeartHandshake,
  LuUsers,
  LuArrowRight,
  LuArrowLeft,
} from "react-icons/lu";
import EditorSidebar from "../EditorSidebar";
import { extractLayoutColumns } from "../../../../utils/layoutUtils";
import { isTwoColumnTemplate } from "../../../../constants";

const SECTION_ICONS = {
  "personal-info": LuUser,
  profiles: LuGlobe,
  summary: LuPencil,
  experience: LuBriefcase,
  education: LuGraduationCap,
  skills: LuSparkles,
  projects: LuFolderGit2,
  certifications: LuAward,
  awards: LuTrophy,
  languages: LuLanguages,
  interests: LuHeart,
  publications: LuBookOpen,
  volunteer: LuHeartHandshake,
  references: LuUsers,
};

const SECTION_LABELS = {
  "personal-info": "Personal Information",
  profiles: "Online Profiles",
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Technical Skills",
  projects: "Key Projects",
  certifications: "Certifications",
  awards: "Honors & Awards",
  languages: "Languages",
  interests: "Interests & Hobbies",
  publications: "Publications",
  volunteer: "Volunteering & Community",
  references: "References",
};

/**
 * ContentDrawer Component (Studio 2.0 / Zety Flow)
 * Replaces the chaotic two-column squeeze with a single, calm 460px drawer.
 * Seamlessly toggles between active Section Form editing and All Sections drag-and-drop reordering.
 */
const ContentDrawer = ({
  activePage,
  setActivePage,
  sections = {},
  layout = [[], []],
  templateId = null,
  onToggleVisibility,
  onReorderSections,
  onExportJson,
  isSaving = false,
  onClose,
  children,
}) => {
  // Mode: "form" (Active Section Form) vs "sections" (Overview & Reorder)
  const [mode, setMode] = useState("form");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isTwoColumn = useMemo(() => isTwoColumnTemplate(templateId), [templateId]);

  // Close section picker dropdown on outside click or escape
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Ordered list of all available sections for stepper navigation
  const orderedSectionKeys = useMemo(() => {
    const keys = ["personal-info"];
    if (sections.summary) keys.push("summary");

    if (isTwoColumn) {
      const [c0, c1] = extractLayoutColumns(layout, sections, templateId);
      const combined = [...(c0 || []), ...(c1 || [])].filter(
        (k) => k !== "personal-info" && k !== "summary" && sections[k]
      );
      // Deduplicate
      combined.forEach((k) => {
        if (!keys.includes(k)) keys.push(k);
      });
    } else {
      const [c0] = extractLayoutColumns(layout, sections, templateId);
      (c0 || []).forEach((k) => {
        if (k !== "personal-info" && k !== "summary" && sections[k] && !keys.includes(k)) {
          keys.push(k);
        }
      });
    }

    // Append any remaining valid sections from data
    Object.keys(sections || {}).forEach((k) => {
      if (sections[k] && !keys.includes(k)) {
        keys.push(k);
      }
    });

    return keys;
  }, [sections, layout, templateId, isTwoColumn]);

  const currentIndex = orderedSectionKeys.indexOf(activePage);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < orderedSectionKeys.length - 1;

  const prevKey = hasPrev ? orderedSectionKeys[currentIndex - 1] : null;
  const nextKey = hasNext ? orderedSectionKeys[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevKey) {
      setActivePage(prevKey);
      setMode("form");
    }
  };

  const handleNext = () => {
    if (nextKey) {
      setActivePage(nextKey);
      setMode("form");
    }
  };

  const ActiveIcon = SECTION_ICONS[activePage] || LuSparkles;
  const activeLabel = SECTION_LABELS[activePage] || activePage;

  return (
    <aside className="w-[460px] lg:w-[480px] shrink-0 h-full bg-white border-r border-slate-200/90 flex flex-col z-20 shadow-xs select-none">
      {/* 1. Header Bar: Mode Switcher & Stepper */}
      <div className="h-14 px-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
        {mode === "form" ? (
          <>
            {/* Left: Breadcrumb / Switch to All Sections */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setMode("sections")}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors border border-slate-200/80 hover:border-purple-200 shrink-0 cursor-pointer shadow-2xs"
                title="View all sections and drag to reorder"
              >
                <LuListTree className="text-xs text-purple-600" />
                <span className="hidden sm:inline">Sections</span>
              </button>

              <div className="h-4 w-px bg-slate-200 shrink-0" />

              {/* Section Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border max-w-[200px] truncate ${
                    dropdownOpen
                      ? "bg-purple-50 text-purple-900 border-purple-300"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80"
                  }`}
                  title="Switch to another section"
                >
                  <ActiveIcon className="text-xs text-purple-600 shrink-0" />
                  <span className="truncate">{activeLabel}</span>
                  <LuChevronDown
                    className={`text-xs text-slate-400 transition-transform shrink-0 ${
                      dropdownOpen ? "rotate-180 text-purple-600" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 max-h-[380px] overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                    <div className="px-3.5 py-1 border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Jump to Section
                    </div>
                    {orderedSectionKeys.map((key) => {
                      const Icon = SECTION_ICONS[key] || LuSparkles;
                      const label = SECTION_LABELS[key] || key;
                      const isSelected = activePage === key;
                      const count =
                        key === "personal-info"
                          ? null
                          : Array.isArray(sections[key]?.items)
                          ? sections[key].items.length
                          : null;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setActivePage(key);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-purple-50 text-purple-900 font-semibold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`text-sm shrink-0 ${
                                isSelected ? "text-purple-600" : "text-slate-400"
                              }`}
                            />
                            <span className="truncate">{label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {count !== null && count > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                                {count}
                              </span>
                            )}
                            {isSelected && <LuCheck className="text-xs text-purple-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Step Steppers & Close */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!hasPrev}
                className="p-1.5 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                title={hasPrev ? `Previous: ${SECTION_LABELS[prevKey] || prevKey}` : "No previous section"}
              >
                <LuChevronLeft className="text-sm stroke-[2.2]" />
              </button>

              <span className="text-[11px] font-bold font-mono text-slate-400 px-0.5">
                {currentIndex + 1}/{orderedSectionKeys.length}
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNext}
                className="p-1.5 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                title={hasNext ? `Next: ${SECTION_LABELS[nextKey] || nextKey}` : "No next section"}
              >
                <LuChevronRight className="text-sm stroke-[2.2]" />
              </button>

              {onClose && (
                <>
                  <div className="h-4 w-px bg-slate-200 shrink-0 mx-1" />
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Collapse drawer (expand canvas)"
                  >
                    <LuX className="text-sm" />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Sections Overview Mode Header */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase truncate">
                Resume Sections
              </h3>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60 shrink-0">
                {isTwoColumn ? "2-Column Layout" : "1-Column Layout"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setMode("form")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
              >
                <span>Done</span>
                <LuCheck className="text-xs" />
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Collapse drawer"
                >
                  <LuX className="text-sm" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* 2. Main Content Body */}
      {mode === "form" ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 bg-white studio-form-container">
          {children}
        </div>
      ) : (
        /* Sections Overview Mode (Drag-and-Drop Reordering + Visibility) */
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-50/60 flex flex-col gap-3">
          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/60 text-xs text-purple-900 flex items-center justify-between">
            <span className="font-medium">
              Click any section to edit, or drag handles to reorder.
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200/80">
              {orderedSectionKeys.length} Sections
            </span>
          </div>

          <EditorSidebar
            activePage={activePage}
            setActivePage={(page) => {
              setActivePage(page);
              setMode("form"); // Automatically transition to form view when selecting a section
            }}
            sections={sections}
            layout={layout}
            templateId={templateId}
            onToggleVisibility={onToggleVisibility}
            onReorderSections={onReorderSections}
            onExportJson={onExportJson}
            isSaving={isSaving}
          />
        </div>
      )}
    </aside>
  );
};

export default ContentDrawer;
