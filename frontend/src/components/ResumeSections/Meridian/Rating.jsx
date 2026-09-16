import { normalizeRatingLevel, LEVEL_LABELS, LANGUAGE_LEVEL_LABELS } from "../../../utils/ratingUtils";

const Rating = ({ level, themeColors = [], isLanguage = false }) => {
  const numericLevel = normalizeRatingLevel(level);
  if (!numericLevel) return null;

  const label = isLanguage
    ? LANGUAGE_LEVEL_LABELS[numericLevel] || "Intermediate"
    : LEVEL_LABELS[numericLevel] || "Good";

  const activeColor = themeColors[2] || "#0d2f5a";

  return (
    <div className="flex flex-col items-end shrink-0 select-none">
      {/* 5 Circular Dots */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < numericLevel;
          return (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full transition-colors"
              style={{
                backgroundColor: isFilled ? activeColor : "#e2e8f0",
              }}
            />
          );
        })}
      </div>
      {/* Subtitle / Level Text */}
      <span className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-tight">
        {label}
      </span>
    </div>
  );
};

export default Rating;
