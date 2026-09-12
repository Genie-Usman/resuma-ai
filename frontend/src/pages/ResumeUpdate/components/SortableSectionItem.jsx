import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical, LuEye, LuEyeOff } from "react-icons/lu";

const SortableSectionItem = ({
  id,
  section,
  isActive,
  onSelect,
  onToggleVisibility,
  column = "main",
  isTwoColumn = true,
  icon: Icon,
  itemCount,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const isVisible = section?.visible !== false;
  const isMain = column === "main";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between px-2.5 py-2 rounded-xl border text-sm transition-all select-none cursor-pointer ${
        isActive
          ? "bg-purple-50/90 border-purple-500 text-purple-950 font-semibold shadow-xs ring-1 ring-purple-500/20"
          : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700"
      } ${!isVisible ? "opacity-50 bg-slate-50/50" : ""}`}
      onClick={onSelect}
    >
      {/* Left: Drag Handle + Column Accent (if 2-col) + Icon + Label */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-slate-400 hover:text-purple-600 cursor-grab active:cursor-grabbing p-0.5 rounded touch-none shrink-0"
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder section"
        >
          <LuGripVertical className="text-sm" />
        </button>

        {/* Column Dot Indicator (Only for 2-column templates) */}
        {isTwoColumn && (
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isMain ? "bg-blue-500" : "bg-purple-500"
            }`}
            title={isMain ? "In Main Content Column" : "In Sidebar Column"}
          />
        )}

        {/* Section Icon */}
        {Icon && (
          <Icon
            className={`text-sm shrink-0 ${
              isActive
                ? "text-purple-600"
                : isTwoColumn && !isMain
                ? "text-purple-500/80"
                : "text-slate-500"
            }`}
          />
        )}

        {/* Section Name */}
        <span
          className={`text-xs font-medium truncate capitalize ${
            isActive ? "text-purple-950 font-semibold" : "text-slate-700"
          }`}
          title={section?.name || id}
        >
          {section?.name || id}
        </span>
      </div>

      {/* Right: Item Count Badge + Visibility Toggle */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {typeof itemCount === "number" && itemCount > 0 && (
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
            {itemCount}
          </span>
        )}

        {/* Eye Visibility Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            isVisible
              ? "text-slate-400 hover:text-purple-600 hover:bg-purple-50"
              : "text-red-400 hover:text-red-600 hover:bg-red-50"
          }`}
          title={isVisible ? "Hide section on resume" : "Show section on resume"}
        >
          {isVisible ? <LuEye className="text-sm" /> : <LuEyeOff className="text-sm" />}
        </button>
      </div>
    </div>
  );
};

export default SortableSectionItem;
