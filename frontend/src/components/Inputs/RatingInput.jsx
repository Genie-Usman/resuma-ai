import { useState } from "react";
import { LuStar, LuX, LuEye, LuEyeOff } from "react-icons/lu";
import { normalizeRatingLevel, LEVEL_LABELS } from "../../utils/ratingUtils";

const RatingInput = ({
  value = 0,
  total = 5,
  onChange = () => {},
  showRating = true,
  onToggleShowRating,
  labels = LEVEL_LABELS,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const normalizedValue = normalizeRatingLevel(value);

  const displayCount =
    hoveredIndex >= 0 ? hoveredIndex + 1 : showRating ? normalizedValue : 0;
  const currentLabel =
    showRating && normalizedValue > 0
      ? labels[normalizedValue] || `${normalizedValue}/${total}`
      : "Hidden / No Rating";

  const handleSegmentClick = (index) => {
    const selectedLevel = index + 1;
    // If clicking the current level, toggle it off / reset to 0
    if (normalizedValue === selectedLevel) {
      onChange(0);
      if (onToggleShowRating) {
        onToggleShowRating(false);
      }
    } else {
      onChange(selectedLevel);
      if (onToggleShowRating && !showRating) {
        onToggleShowRating(true);
      }
    }
  };

  const handleClear = () => {
    onChange(0);
    if (onToggleShowRating) {
      onToggleShowRating(false);
    }
  };

  return (
    <div className="space-y-2 select-none">
      {/* Top status bar with optional toggle and active badge */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {onToggleShowRating && (
            <button
              type="button"
              onClick={() => onToggleShowRating(!showRating)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer text-[11px] border ${
                showRating
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
              }`}
              title={showRating ? "Hide rating bar for this item" : "Show rating bar for this item"}
            >
              {showRating ? (
                <>
                  <LuEye className="w-3.5 h-3.5" />
                  <span>Rating Visible</span>
                </>
              ) : (
                <>
                  <LuEyeOff className="w-3.5 h-3.5" />
                  <span>Rating Hidden</span>
                </>
              )}
            </button>
          )}

          <span
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${
              showRating && normalizedValue > 0
                ? "text-purple-700 bg-purple-50 border-purple-200/60"
                : "text-slate-500 bg-slate-100 border-slate-200/80"
            }`}
          >
            {currentLabel} {showRating && normalizedValue > 0 ? `(${normalizedValue}/${total})` : ""}
          </span>
        </div>

        {showRating && normalizedValue > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Remove rating"
          >
            <LuX className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Interactive Rating Segments */}
      <div
        className={`flex items-center gap-1.5 p-2 rounded-xl border transition-all ${
          showRating
            ? "bg-white border-slate-200/80 shadow-2xs"
            : "bg-slate-50/60 border-dashed border-slate-200 opacity-60"
        }`}
        onMouseLeave={() => setHoveredIndex(-1)}
      >
        {Array.from({ length: total }).map((_, index) => {
          const isActive = index < displayCount;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSegmentClick(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              className={`flex-1 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer font-bold text-xs ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs scale-[1.02]"
                  : "bg-slate-100 text-slate-400 hover:bg-purple-100 hover:text-purple-700"
              }`}
              title={`Rate ${index + 1} of ${total}`}
            >
              <LuStar
                className={`w-3.5 h-3.5 ${
                  isActive ? "fill-white text-white" : "text-slate-400"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RatingInput;
