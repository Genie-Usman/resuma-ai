import { normalizeRatingLevel, LEVEL_LABELS } from "../../../utils/ratingUtils";

const Rating = ({ level, themeColors = [] }) => {
  const numericLevel = normalizeRatingLevel(level);
  if (!numericLevel) return null;

  const percentage = (numericLevel / 5) * 100;
  const label = LEVEL_LABELS[numericLevel] || "Good";

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-[11px] font-medium leading-none">
        <span className="opacity-0">.</span>
        <span className="text-[10px] tracking-tight group-[.sidebar]:text-slate-300 group-[.main]:text-slate-500 italic">
          {label}
        </span>
      </div>
      <div className="relative h-1.5 w-full rounded-full overflow-hidden group-[.sidebar]:bg-white/25 group-[.main]:bg-slate-200">
        <div
          className="h-full rounded-full transition-all group-[.sidebar]:bg-white group-[.main]:bg-slate-800"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Rating;
