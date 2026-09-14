import React, { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
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
  LuPlus,
  LuClock,
  LuListChecks,
} from "react-icons/lu";
import SortableSectionItem from "./SortableSectionItem";
import {
  extractLayoutColumns,
  DEFAULT_SIDEBAR_SECTIONS,
} from "../../../utils/layoutUtils";
import { isTwoColumnTemplate } from "../../../constants";

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

const CUSTOM_TYPE_ICONS = {
  timeline: LuClock,
  simple_list: LuListChecks,
  publications: LuBookOpen,
  language_matrix: LuLanguages,
};

const getSectionIcon = (key, sec) => {
  if (sec?.isCustom || (key && key.startsWith("custom_"))) {
    return CUSTOM_TYPE_ICONS[sec?.type] || LuClock;
  }
  return SECTION_ICONS[key] || LuSparkles;
};

/**
 * Droppable Column Container for Drag and Drop separation
 */
const DroppableColumn = ({
  id,
  title,
  subtitle,
  badgeColor = "blue",
  count = 0,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const isBlue = badgeColor === "blue";

  return (
    <div className="flex flex-col gap-1.5">
      {/* Category Header */}
      <div className="flex items-center justify-between px-1 pt-1 pb-0.5 select-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isBlue ? "bg-blue-500" : "bg-purple-500"
            }`}
          />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-800 truncate">
            {title}
          </span>
          {subtitle && (
            <span className="text-[10px] font-medium text-slate-400 truncate hidden xl:inline">
              {subtitle}
            </span>
          )}
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            isBlue
              ? "bg-blue-50 text-blue-700 border border-blue-200/70"
              : "bg-purple-50 text-purple-700 border border-purple-200/70"
          }`}
        >
          {count}
        </span>
      </div>

      {/* Droppable Card Area */}
      <div
        ref={setNodeRef}
        className={`rounded-xl p-1.5 flex flex-col gap-1.5 transition-all min-h-[58px] border ${
          isOver
            ? isBlue
              ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/20 shadow-xs"
              : "bg-purple-50/70 border-purple-400 ring-2 ring-purple-400/20 shadow-xs"
            : isBlue
            ? "bg-slate-50/60 border-slate-200/80"
            : "bg-purple-50/20 border-purple-200/50"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const EditorSidebar = ({
  activePage,
  setActivePage,
  sections = {},
  layout = [[], []],
  templateId = null,
  onToggleVisibility,
  onReorderSections,
  onExportJson,
  onOpenAddSectionModal,
  isSaving,
}) => {
  const [activeId, setActiveId] = useState(null);

  const isTwoColumn = useMemo(() => isTwoColumnTemplate(templateId), [templateId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Derive distinct Main Content and Sidebar section lists for 2-column templates
  const [mainKeys, sidebarKeys] = useMemo(() => {
    if (!isTwoColumn) return [[], []];

    const isRealSection = (k) => {
      if (!k || k === "personal-info") return false;
      if (k === "custom" && !sections[k]?.isCustom && !sections[k]?.type) return false;
      return Boolean(sections[k]);
    };

    const [c0, c1] = extractLayoutColumns(layout, sections, templateId);
    const validSections = Object.keys(sections || {}).filter(isRealSection);

    const safeMain = c0.filter(isRealSection);
    const safeSidebar = c1.filter(isRealSection);

    // Make sure any section in `sections` that isn't in either column gets categorized
    validSections.forEach((k) => {
      if (!safeMain.includes(k) && !safeSidebar.includes(k)) {
        if (DEFAULT_SIDEBAR_SECTIONS.has(k)) {
          safeSidebar.push(k);
        } else {
          safeMain.push(k);
        }
      }
    });

    return [safeMain, safeSidebar];
  }, [layout, sections, templateId, isTwoColumn]);

  // Derive single flat section list for 1-column templates
  const flatKeys = useMemo(() => {
    if (isTwoColumn) return [];

    const isRealSection = (k) => {
      if (!k || k === "personal-info") return false;
      if (k === "custom" && !sections[k]?.isCustom && !sections[k]?.type) return false;
      return Boolean(sections[k]);
    };

    const [c0] = extractLayoutColumns(layout, sections, templateId);
    const validSections = Object.keys(sections || {}).filter(isRealSection);

    const safeFlat = (c0 || []).filter(isRealSection);

    // Ensure any valid section not yet in the list is appended
    validSections.forEach((k) => {
      if (!safeFlat.includes(k)) {
        safeFlat.push(k);
      }
    });

    return safeFlat;
  }, [layout, sections, templateId, isTwoColumn]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Single-Column Reordering
    if (!isTwoColumn) {
      const oldIndex = flatKeys.indexOf(active.id);
      const newIndex = over.id === "single-column" ? flatKeys.length - 1 : flatKeys.indexOf(over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFlat = arrayMove(flatKeys, oldIndex, newIndex);
        onReorderSections(newFlat, templateId);
      }
      return;
    }

    // Two-Column Reordering (Main vs Sidebar strictly isolated)
    const activeId = active.id;
    const overId = over.id;

    const inMain = mainKeys.includes(activeId);
    const inSidebar = sidebarKeys.includes(activeId);

    const overMain = overId === "main-column" || mainKeys.includes(overId);
    const overSidebar = overId === "sidebar-column" || sidebarKeys.includes(overId);

    if (inMain && overMain) {
      // Reorder within Main only
      const oldIndex = mainKeys.indexOf(activeId);
      const newIndex = overId === "main-column" ? mainKeys.length - 1 : mainKeys.indexOf(overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newMain = arrayMove(mainKeys, oldIndex, newIndex);
        onReorderSections([newMain, sidebarKeys], templateId);
      }
    } else if (inSidebar && overSidebar) {
      // Reorder within Sidebar only
      const oldIndex = sidebarKeys.indexOf(activeId);
      const newIndex = overId === "sidebar-column" ? sidebarKeys.length - 1 : sidebarKeys.indexOf(overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newSidebar = arrayMove(sidebarKeys, oldIndex, newIndex);
        onReorderSections([mainKeys, newSidebar], templateId);
      }
    } else if (inMain && overSidebar) {
      // Move from Main column into Sidebar column
      const newMain = mainKeys.filter((k) => k !== activeId);
      const overIndex = sidebarKeys.indexOf(overId);
      const newSidebar = [...sidebarKeys];
      if (overId === "sidebar-column" || overIndex === -1) {
        newSidebar.push(activeId);
      } else {
        newSidebar.splice(overIndex, 0, activeId);
      }
      onReorderSections([newMain, newSidebar], templateId);
    } else if (inSidebar && overMain) {
      // Move from Sidebar column into Main column
      const newSidebar = sidebarKeys.filter((k) => k !== activeId);
      const overIndex = mainKeys.indexOf(overId);
      const newMain = [...mainKeys];
      if (overId === "main-column" || overIndex === -1) {
        newMain.push(activeId);
      } else {
        newMain.splice(overIndex, 0, activeId);
      }
      onReorderSections([newMain, newSidebar], templateId);
    }
  };

  // Active section data for DragOverlay preview
  const activeSection = activeId ? sections[activeId] : null;
  const ActiveIcon = activeId ? SECTION_ICONS[activeId] || LuSparkles : null;

  return (
    <div className="w-full flex-1 flex flex-col gap-3 min-w-0 select-none">
      {/* Overview helper line */}
      <div className="flex items-center justify-between px-0.5 text-xs text-slate-500 pb-0.5">
        <span>Click any section to edit, or drag to reorder</span>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
          {(isTwoColumn ? mainKeys.length + sidebarKeys.length : flatKeys.length)} Sections
        </span>
      </div>

      {/* Fixed: Personal Information */}
      <div
        onClick={() => setActivePage("personal-info")}
        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-colors cursor-pointer select-none ${
          activePage === "personal-info"
            ? "bg-purple-50/90 border-purple-500 text-purple-950 font-semibold shadow-xs ring-1 ring-purple-500/20"
            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
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

      {/* Scrollable Container with Conditional Drag-and-Drop Structure */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3 min-h-[300px]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          autoScroll={false}
        >
          {/* Add Custom Section Action Button */}
          {onOpenAddSectionModal && (
            <button
              type="button"
              onClick={onOpenAddSectionModal}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-all cursor-pointer shadow-2xs mb-3"
            >
              <LuPlus className="text-sm" />
              <span>Add Custom Section</span>
            </button>
          )}

          {/* ========================================================= */}
          {/* 1-COLUMN TEMPLATES: Single Unified Drag-and-Drop Column   */}
          {/* ========================================================= */}
          {!isTwoColumn && (
            <SortableContext
              id="single-column"
              items={flatKeys}
              strategy={verticalListSortingStrategy}
            >
              <DroppableColumn
                id="single-column"
                title="Resume Sections"
                subtitle="Single Column"
                badgeColor="purple"
                count={flatKeys.length}
              >
                {flatKeys.length === 0 ? (
                  <div className="py-3 px-2 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg select-none">
                    No sections available
                  </div>
                ) : (
                  flatKeys.map((key) => {
                    const sec = sections[key];
                    const IconComponent = getSectionIcon(key, sec);
                    const count = Array.isArray(sec?.items) ? sec.items.length : undefined;

                    return (
                      <SortableSectionItem
                        key={key}
                        id={key}
                        column="main"
                        isTwoColumn={false}
                        section={sec}
                        isActive={activePage === key}
                        onSelect={() => setActivePage(key)}
                        onToggleVisibility={() => onToggleVisibility(key)}
                        icon={IconComponent}
                        itemCount={count}
                      />
                    );
                  })
                )}
              </DroppableColumn>
            </SortableContext>
          )}

          {/* ========================================================= */}
          {/* 2-COLUMN TEMPLATES: Separated Main Content & Sidebar Columns */}
          {/* ========================================================= */}
          {isTwoColumn && (
            <>
              {/* Column 1: Main Content */}
              <SortableContext
                id="main-column"
                items={mainKeys}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn
                  id="main-column"
                  title="Main Content"
                  subtitle="Wide Column"
                  badgeColor="blue"
                  count={mainKeys.length}
                >
                  {mainKeys.length === 0 ? (
                    <div className="py-3 px-2 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg select-none">
                      Drag sections here
                    </div>
                  ) : (
                    mainKeys.map((key) => {
                      const sec = sections[key];
                      const IconComponent = getSectionIcon(key, sec);
                      const count = Array.isArray(sec?.items) ? sec.items.length : undefined;

                      return (
                        <SortableSectionItem
                          key={key}
                          id={key}
                          column="main"
                          isTwoColumn={true}
                          section={sec}
                          isActive={activePage === key}
                          onSelect={() => setActivePage(key)}
                          onToggleVisibility={() => onToggleVisibility(key)}
                          icon={IconComponent}
                          itemCount={count}
                        />
                      );
                    })
                  )}
                </DroppableColumn>
              </SortableContext>

              {/* Column 2: Sidebar Column */}
              <SortableContext
                id="sidebar-column"
                items={sidebarKeys}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn
                  id="sidebar-column"
                  title="Sidebar"
                  subtitle="Narrow Column"
                  badgeColor="purple"
                  count={sidebarKeys.length}
                >
                  {sidebarKeys.length === 0 ? (
                    <div className="py-3 px-2 text-center text-xs text-purple-400/80 border border-dashed border-purple-200/60 rounded-lg select-none">
                      Drag sections here
                    </div>
                  ) : (
                    sidebarKeys.map((key) => {
                      const sec = sections[key];
                      const IconComponent = getSectionIcon(key, sec);
                      const count = Array.isArray(sec?.items) ? sec.items.length : undefined;

                      return (
                        <SortableSectionItem
                          key={key}
                          id={key}
                          column="sidebar"
                          isTwoColumn={true}
                          section={sec}
                          isActive={activePage === key}
                          onSelect={() => setActivePage(key)}
                          onToggleVisibility={() => onToggleVisibility(key)}
                          icon={IconComponent}
                          itemCount={count}
                        />
                      );
                    })
                  )}
                </DroppableColumn>
              </SortableContext>
            </>
          )}

          {/* Smooth Drag Overlay preview */}
          <DragOverlay>
            {activeId && activeSection ? (
              <div className="px-3 py-2 rounded-xl bg-white border-2 border-purple-500 shadow-lg text-slate-800 flex items-center gap-2 text-xs font-semibold select-none opacity-95">
                {isTwoColumn && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      mainKeys.includes(activeId) ? "bg-blue-500" : "bg-purple-500"
                    }`}
                  />
                )}
                {(() => {
                  const Icon = getSectionIcon(activeId, activeSection);
                  return <Icon className="text-sm text-purple-600" />;
                })()}
                <span className="capitalize">{activeSection.name || activeId}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Sidebar Footer: Fast Utilities & Column Status */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 shrink-0">
        {onExportJson && (
          <button
            type="button"
            onClick={onExportJson}
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-purple-200"
            title="Export as JSON"
          >
            <LuFileJson className="text-sm text-purple-600" />
            <span>Export JSON</span>
          </button>
        )}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          {isTwoColumn ? (
            <>
              <span>{mainKeys.length} main · {sidebarKeys.length} sidebar</span>
              <span className="font-medium text-blue-600/80 bg-blue-50 px-1.5 py-0.5 rounded">2-Column Layout</span>
            </>
          ) : (
            <>
              <span>{flatKeys.length} sections total</span>
              <span className="font-medium text-purple-600/80 bg-purple-50 px-1.5 py-0.5 rounded">1-Column Layout</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
