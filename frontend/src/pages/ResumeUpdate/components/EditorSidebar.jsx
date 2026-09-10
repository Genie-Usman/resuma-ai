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
    <aside className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-4">
      {/* Top Section: Action Controls */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 tracking-wide uppercase">
          Resume Sections
        </h3>
        <span className="text-xs text-gray-400 font-medium">Drag to reorder</span>
      </div>

      {/* Fixed: Personal Information */}
      <div
        onClick={() => setActivePage("personal-info")}
        className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
          activePage === "personal-info"
            ? "bg-purple-50 border-purple-400 text-purple-900 shadow-sm"
            : "bg-white border-gray-200 hover:border-purple-200 hover:bg-gray-50/80 text-gray-700"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-4 flex justify-center text-purple-600 font-bold">•</div>
          <LuUser className={`text-base ${activePage === "personal-info" ? "text-purple-600" : "text-gray-500"}`} />
          <span className="text-sm font-medium">Personal Information</span>
        </div>
        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
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
          <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
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

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
        <button
          type="button"
          onClick={onOpenJobMatch}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all shadow-xs cursor-pointer"
          title="Analyze ATS match against a job description"
        >
          <LuTarget className="text-sm" />
          <span>ATS Job Match Analyzer</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenTheme}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
          >
            <LuPalette className="text-sm" />
            Theme
          </button>

          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
          >
            <LuEye className="text-sm" />
            Preview
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <LuSave className="text-sm" />
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={onDownload}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
          >
            <LuDownload className="text-sm" />
            PDF Export
          </button>
        </div>
      </div>
    </aside>
  );
};

export default EditorSidebar;
