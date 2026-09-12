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
  LuPanelLeftClose,
  LuPanelLeftOpen,
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
  isSaving,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

    const [c0, c1] = extractLayoutColumns(layout, sections, templateId);
    const validSections = Object.keys(sections || {}).filter(
      (k) => k !== "personal-info" && sections[k]
    );

    const safeMain = c0.filter((k) => k !== "personal-info" && sections[k]);
    const safeSidebar = c1.filter((k) => k !== "personal-info" && sections[k]);

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

    const [c0] = extractLayoutColumns(layout, sections, templateId);
    const validSections = Object.keys(sections || {}).filter(
      (k) => k !== "personal-info" && sections[k]
    );

    const safeFlat = (c0 || []).filter((k) => k !== "personal-info" && sections[k]);

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
    }
    // Note: Cross-column drops (inMain -> overSidebar or inSidebar -> overMain) are intentionally ignored
    // to preserve template column layout integrity and prevent broken resume layouts.
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

          {/* 1-Column Mode: Continuous vertical icon list */}
          {!isTwoColumn &&
            flatKeys.map((key) => {
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
                  title={sec?.name || key}
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

          {/* 2-Column Mode: Separated Main and Sidebar Icons */}
          {isTwoColumn && (
            <>
              {/* Divider: Main Column */}
              <div className="w-6 h-px bg-slate-200 my-1" title="Main Content Sections" />

              {/* Main Column Icons */}
              {mainKeys.map((key) => {
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
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    } ${!isVisible ? "opacity-40" : ""}`}
                    title={`${sec?.name || key} (Main Column)`}
                  >
                    <Icon className="text-base" />
                    {Array.isArray(sec?.items) && sec.items.length > 0 && (
                      <span
                        className={`absolute -top-0.5 -right-0.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                          isActive
                            ? "bg-white text-blue-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {sec.items.length}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Divider: Sidebar Column */}
              <div className="w-6 h-px bg-purple-200 my-1" title="Sidebar Column Sections" />

              {/* Sidebar Column Icons */}
              {sidebarKeys.map((key) => {
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
                    title={`${sec?.name || key} (Sidebar Column)`}
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
            </>
          )}
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

  // Active section data for DragOverlay preview
  const activeSection = activeId ? sections[activeId] : null;
  const ActiveIcon = activeId ? SECTION_ICONS[activeId] || LuSparkles : null;

  // -------------------------------------------------------------
  // Expanded Drawer Mode (240px - 270px)
  // -------------------------------------------------------------
  return (
    <aside className="w-full h-full bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex flex-col gap-2.5 transition-all duration-200">
      {/* Top Section: Action Controls */}
      <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-100">
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
                    const IconComponent = SECTION_ICONS[key] || LuSparkles;
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
                      const IconComponent = SECTION_ICONS[key] || LuSparkles;
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
                      const IconComponent = SECTION_ICONS[key] || LuSparkles;
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
                {ActiveIcon && <ActiveIcon className="text-sm text-purple-600" />}
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
    </aside>
  );
};

export default EditorSidebar;
