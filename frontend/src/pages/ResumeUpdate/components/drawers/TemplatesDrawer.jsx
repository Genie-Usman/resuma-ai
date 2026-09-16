import { useState } from "react";
import {
  LuLayoutTemplate,
  LuX,
  LuCheck,
  LuSparkles,
  LuPalette,
} from "react-icons/lu";
import { RESUME_TEMPLATES } from "../../../../constants";

const NEW_TEMPLATE_IDS = new Set(["meridian", "clarity", "vanguard"]);

const TemplateThumbnail = ({ thumbnail, name, isTwoCol, isNew }) => {
  const [imgError, setImgError] = useState(false);

  if (!thumbnail || imgError) {
    return (
      <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200/70 text-slate-500 select-none">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-14 bg-slate-300 rounded-full" />
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/90 text-slate-700">
            {isTwoCol ? "2-Col" : "1-Col"}
          </span>
        </div>

        <div className="space-y-1.5 my-auto py-2">
          <div className="h-2 w-3/4 bg-slate-300/80 rounded" />
          <div className="h-1.5 w-full bg-slate-200 rounded" />
          <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
          <div className="h-1.5 w-2/3 bg-slate-200 rounded" />
        </div>

        <div className="pt-2 border-t border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-700 block truncate">
            {name}
          </span>
          <span className="text-[9px] text-slate-400">Preview Layout</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={thumbnail}
      alt={name}
      onError={() => setImgError(true)}
      className="w-full h-full object-cover object-top transition-transform group-hover:scale-103 duration-200"
      loading="lazy"
    />
  );
};

/**
 * TemplatesDrawer Component
 * Dedicated drawer for browsing and switching between ATS-optimized resume templates.
 */
const TemplatesDrawer = ({
  currentTemplate,
  onSelectTemplate,
  onOpenColors,
  onClose,
}) => {
  const [filterCategory, setFilterCategory] = useState("all"); // "all" | "new" | "two-col" | "single-col"

  // Filter templates
  const filteredTemplates = RESUME_TEMPLATES.filter((tpl) => {
    if (filterCategory === "new") return NEW_TEMPLATE_IDS.has(tpl.id);
    if (filterCategory === "two-col") return tpl.columns === 2;
    if (filterCategory === "single-col") return tpl.columns === 1;
    return true;
  });

  const activeTemplateObj = RESUME_TEMPLATES.find((t) => t.id === currentTemplate) || RESUME_TEMPLATES[0];

  return (
    <div className="w-full h-full flex flex-col bg-white select-none overflow-hidden">
      {/* Drawer Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/80 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <LuLayoutTemplate className="text-base" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">Resume Templates</h2>
            <p className="text-[11px] text-slate-500 leading-tight">16 ATS-friendly layout designs</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Templates drawer"
        >
          <LuX className="text-base" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {/* Active Template Summary Banner */}
        <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
              Active Template
            </span>
            <span className="text-sm font-bold text-slate-900 leading-snug">
              {activeTemplateObj.name}
            </span>
            <span className="text-xs text-slate-500 block">
              {activeTemplateObj.columns === 2 ? "Two-Column Layout" : "Single-Column Layout"} • ATS-Engine
            </span>
          </div>

          <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <LuCheck className="text-sm stroke-[3]" />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar">
            {[
              { id: "all", label: `All (${RESUME_TEMPLATES.length})` },
              { id: "new", label: `New (${NEW_TEMPLATE_IDS.size})` },
              { id: "two-col", label: "2-Column" },
              { id: "single-col", label: "1-Column" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCategory(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  filterCategory === tab.id
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredTemplates.map((template) => {
            const isSelected = currentTemplate === template.id;
            const isNew = NEW_TEMPLATE_IDS.has(template.id);
            const displayName = template.name || template.id.charAt(0).toUpperCase() + template.id.slice(1);

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelectTemplate(template.id)}
                className={`group relative rounded-xl border bg-white overflow-hidden cursor-pointer transition-all duration-150 flex flex-col text-left ${
                  isSelected
                    ? "border-purple-600 ring-2 ring-purple-600/30 shadow-md"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-xs">
                    <LuCheck className="text-[11px]" />
                    <span>Active</span>
                  </div>
                )}

                {/* New Badge */}
                {isNew && !isSelected && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] font-bold text-white shadow-xs">
                    <LuSparkles className="text-[10px]" />
                    <span>NEW</span>
                  </div>
                )}

                {/* Image Thumbnail */}
                <div className="relative w-full aspect-[1/1.32] bg-slate-100 overflow-hidden">
                  <TemplateThumbnail
                    thumbnail={template.thumbnail}
                    name={displayName}
                    isTwoCol={template.columns === 2}
                    isNew={isNew}
                  />
                </div>

                {/* Card Footer */}
                <div
                  className={`px-2.5 py-2 border-t text-center text-xs transition-colors w-full ${
                    isSelected
                      ? "bg-purple-50 text-purple-900 border-purple-100 font-bold"
                      : "bg-white text-slate-700 border-slate-100 group-hover:text-purple-700 font-semibold"
                  }`}
                >
                  <span className="truncate block">{displayName}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Shortcut to Colors Drawer */}
        {onOpenColors && (
          <div className="pt-3 border-t border-slate-200/80 text-center">
            <button
              type="button"
              onClick={onOpenColors}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1.5 mx-auto cursor-pointer py-1 px-3 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <LuPalette className="text-sm" />
              <span>Customize colors & themes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesDrawer;
