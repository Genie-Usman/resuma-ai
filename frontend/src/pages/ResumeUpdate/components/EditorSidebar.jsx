import React, { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
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
  LuPalette,
  LuDownload,
  LuSave,
  LuEye,
  LuTarget,
  LuShare2,
  LuFileJson,
} from "react-icons/lu";
import SortableSectionItem from "./SortableSectionItem";

const SECTION_ICONS = {
  "personal-info": LuUser,
  profiles: LuGlobe,
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

const DEFAULT_SORTABLE_KEYS = [
  "profiles",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "awards",
  "languages",
  "interests",
  "publications",
  "volunteer",
  "references",
];

const EditorSidebar = ({
  activePage,
  setActivePage,
  sections = {},
  layout = [[], []],
  onToggleVisibility,
  onReorderSections,
  onSave,
  onOpenTheme,
  onOpenPreview,
  onOpenJobMatch,
  onOpenShare,
  onExportJson,
  onDownload,
  isSaving,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Derive sortable keys from layout[0] or default order
  const sortableKeys = useMemo(() => {
    const mainKeys = Array.isArray(layout[0]) && layout[0].length > 0 ? layout[0] : [];
    const combined = [...new Set([...mainKeys, ...DEFAULT_SORTABLE_KEYS])];
    return combined.filter((key) => key !== "personal-info" && sections[key]);
  }, [layout, sections]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortableKeys.indexOf(active.id);
    const newIndex = sortableKeys.indexOf(over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(sortableKeys, oldIndex, newIndex);
      onReorderSections(newOrder, 0);
    }
  };

  return (
    <aside className="w-full h-full bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col gap-3">
      {/* Top Section: Action Controls */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">
          Resume Sections
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">Drag to reorder</span>
      </div>

      {/* Fixed: Personal Information */}
      <div
        onClick={() => setActivePage("personal-info")}
        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-all cursor-pointer ${
          activePage === "personal-info"
            ? "bg-purple-50/80 border-purple-500 text-purple-950 font-semibold shadow-xs ring-1 ring-purple-500/20"
            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
          <LuUser className={`text-base ${activePage === "personal-info" ? "text-purple-600" : "text-slate-500"}`} />
          <span className="text-sm font-medium">Personal Information</span>
        </div>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Core
        </span>
      </div>

      {/* Drag and Drop Sortable Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableKeys}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 min-h-[300px] overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-1.5">
            {sortableKeys.map((key) => {
              const sec = sections[key];
              const IconComponent = SECTION_ICONS[key] || LuSparkles;
              const count = Array.isArray(sec?.items) ? sec.items.length : undefined;

              return (
                <SortableSectionItem
                  key={key}
                  id={key}
                  section={sec}
                  isActive={activePage === key}
                  onSelect={() => setActivePage(key)}
                  onToggleVisibility={() => onToggleVisibility(key)}
                  icon={IconComponent}
                  itemCount={count}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Sidebar Footer: Fast Utilities */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 shrink-0">
        {onExportJson && (
          <button
            type="button"
            onClick={onExportJson}
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-purple-200"
            title="Export resume in open-standard JSON Resume format"
          >
            <LuFileJson className="text-sm text-purple-600" />
            <span>Export JSON Resume</span>
          </button>
        )}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>{sortableKeys.length + 1} sections active</span>
          <span className="text-purple-600 font-medium">A4 Standard</span>
        </div>
      </div>
    </aside>
  );
};

export default EditorSidebar;
