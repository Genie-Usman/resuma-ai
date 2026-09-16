import Picture from "../Picture";

const ResumeHeader = ({ basics = {}, themeColors = [] }) => {
  const hasPicture = basics.picture?.url && !basics.picture?.effects?.hidden;
  const bannerBg = themeColors[2] || "#2d3748";

  return (
    <div
      className="w-full py-8 px-8 select-none transition-colors"
      style={{ backgroundColor: bannerBg }}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-1 flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white break-words">
            {basics.name || "Your Name"}
          </h1>

          {basics.headline && (
            <p className="text-sm sm:text-base font-medium text-slate-300 mt-1.5 leading-snug break-words">
              {basics.headline}
            </p>
          )}
        </div>

        {hasPicture && (
          <div className="shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-md ring-2 ring-white/30">
              <Picture picture={basics.picture} size={96} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHeader;
