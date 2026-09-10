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
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const isVisible = section?.visible !== false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between px-3 py-2 rounded-xl border text-sm transition-colors select-none cursor-pointer ${
        isActive
          ? "bg-purple-50/80 border-purple-500 text-purple-950 font-semibold shadow-xs ring-1 ring-purple-500/20"
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-700"
      } ${!isVisible ? "opacity-45 bg-slate-50/60" : ""}`}
      onClick={onSelect}
    >
      {/* Left: Drag Handle + Icon + Label */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-slate-400 hover:text-purple-600 cursor-grab active:cursor-grabbing p-0.5 rounded touch-none shrink-0"
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          <LuGripVertical className="text-sm" />
        </button>

        {/* Section Icon */}
        {Icon && (
          <Icon
            className={`text-sm shrink-0 ${
              isActive ? "text-purple-600" : "text-slate-500"
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

      {/* Right: Badge & Visibility Toggle */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {typeof itemCount === "number" && itemCount > 0 && (
          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-semibold">
            {itemCount}
          </span>
        )}

        {/* Eye toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className={`p-1 rounded-md transition-colors ${
            isVisible
              ? "text-gray-400 hover:text-purple-600 hover:bg-purple-100/50"
              : "text-red-400 hover:text-red-600 hover:bg-red-50"
          }`}
          title={isVisible ? "Hide on resume" : "Show on resume"}
        >
          {isVisible ? <LuEye className="text-base" /> : <LuEyeOff className="text-base" />}
        </button>
      </div>
    </div>
  );
};

export default SortableSectionItem;
