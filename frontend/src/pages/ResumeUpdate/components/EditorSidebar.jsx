import React, { useMemo, useState } from "react";
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
  LuFileJson,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from "react-icons/lu";
import SortableSectionItem from "./SortableSectionItem";
import { extractLayoutColumns } from "../../../utils/layoutUtils";

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
  onExportJson,
  isSaving,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Derive sortable keys properly from 3D/2D layout or defaults
  const sortableKeys = useMemo(() => {
    const [col0, col1] = extractLayoutColumns(layout, sections);
    const existing = [...col0, ...col1];
    const combined = [
      ...new Set([...existing, ...DEFAULT_SORTABLE_KEYS, ...Object.keys(sections)]),
    ];
    return combined.filter((key) => key !== "personal-info" && sections[key]);
  }, [layout, sections]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortableKeys.indexOf(active.id);
    const newIndex = sortableKeys.indexOf(over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(sortableKeys, oldIndex, newIndex);
      onReorderSections(newOrder);
    }
  };

  // -------------------------------------------------------------
  // Compact Icon Rail Mode (64px)
  // -------------------------------------------------------------
  if (isCollapsed) {
    return (
      <aside className="w-16 h-full bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs flex flex-col items-center justify-between transition-all duration-200">
        {/* Top: Expand Toggle */}
        <div className="w-full flex flex-col items-center gap-2 pb-2 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
            title="Expand sidebar (shows full section names)"
          >
            <LuPanelLeftOpen className="text-lg" />
          </button>
        </div>

        {/* Scrollable Icon List */}
        <div className="flex-1 w-full overflow-y-auto custom-scrollbar py-2 flex flex-col items-center gap-1.5">
          {/* Personal Info */}
          <button
            type="button"
            onClick={() => setActivePage("personal-info")}
            className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
              activePage === "personal-info"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Personal Information (Core)"
          >
            <LuUser className="text-base" />
          </button>

          {/* Section Icons */}
          {sortableKeys.map((key) => {
            const sec = sections[key];
            const Icon = SECTION_ICONS[key] || LuSparkles;
            const isActive = activePage === key;
            const isVisible = sec?.visible !== false;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActivePage(key)}
                className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                } ${!isVisible ? "opacity-40" : ""}`}
                title={`${sec?.name || key} (${sec?.items?.length || 0} items)`}
              >
                <Icon className="text-base" />
                {Array.isArray(sec?.items) && sec.items.length > 0 && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                      isActive
                        ? "bg-white text-purple-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {sec.items.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom: JSON Export */}
        <div className="pt-2 border-t border-slate-100 w-full flex justify-center">
          {onExportJson && (
            <button
              type="button"
              onClick={onExportJson}
              className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
              title="Export JSON Resume"
            >
              <LuFileJson className="text-base" />
            </button>
          )}
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // Expanded Drawer Mode (240px - 260px)
  // -------------------------------------------------------------
  return (
    <aside className="w-full h-full bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col gap-3 transition-all duration-200">
      {/* Top Section: Action Controls */}
      <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase truncate">
            Resume Sections
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
            Drag to reorder
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Collapse sidebar to icon rail (frees space for preview)"
          >
            <LuPanelLeftClose className="text-sm" />
          </button>
        </div>
      </div>

      {/* Fixed: Personal Information */}
      <div
        onClick={() => setActivePage("personal-info")}
        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-colors cursor-pointer ${
          activePage === "personal-info"
            ? "bg-purple-50/90 border-purple-500 text-purple-950 font-semibold shadow-xs ring-1 ring-purple-500/20"
            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
          <LuUser
            className={`text-base shrink-0 ${
              activePage === "personal-info" ? "text-purple-600" : "text-slate-500"
            }`}
          />
          <span className="text-xs font-medium truncate">Personal Information</span>
        </div>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          Core
        </span>
      </div>

      {/* Drag and Drop Sortable Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        autoScroll={false}
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
      <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2 shrink-0">
        {onExportJson && (
          <button
            type="button"
            onClick={onExportJson}
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-purple-200"
            title="Export as JSON"
          >
            <LuFileJson className="text-sm text-purple-600" />
            <span>Export JSON</span>
          </button>
        )}
        <div className="flex items-center justify-center text-[11px] text-slate-400 px-1">
          <span>{sortableKeys.length + 1} sections active</span>
        </div>
      </div>
    </aside>
  );
};

export default EditorSidebar;
