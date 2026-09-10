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
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const isVisible = section?.visible !== false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all select-none cursor-pointer ${
        isActive
          ? "bg-purple-50 border-purple-400 text-purple-900 shadow-sm"
          : "bg-white border-gray-200 hover:border-purple-200 hover:bg-gray-50/80 text-gray-700"
      } ${!isVisible ? "opacity-50 bg-gray-50" : ""}`}
      onClick={onSelect}
    >
      {/* Left: Drag Handle + Icon + Label */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-purple-600 cursor-grab active:cursor-grabbing p-0.5 rounded touch-none"
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          <LuGripVertical className="text-base" />
        </button>

        {/* Section Icon */}
        {Icon && <Icon className={`text-base flex-shrink-0 ${isActive ? "text-purple-600" : "text-gray-500"}`} />}

        {/* Section Name */}
        <span className="text-sm font-medium truncate capitalize">
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
