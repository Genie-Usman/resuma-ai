import Picture from "../Picture";

const ResumeHeader = ({ basics = {}, themeColors = [] }) => {
  const hasPicture = basics.picture?.url && !basics.picture?.effects?.hidden;
  const primaryColor = themeColors[2] || "#1e293b";

  return (
    <div className="w-full pt-8 pb-3 px-8 select-none">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1 flex-1 min-w-0">
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none break-words"
            style={{ color: primaryColor }}
          >
            {basics.name || "Your Name"}
          </h1>

          {basics.headline && (
            <p className="text-sm sm:text-base font-semibold text-slate-600 mt-1 leading-snug break-words">
              {basics.headline}
            </p>
          )}
        </div>

        {hasPicture && (
          <div className="shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-xs ring-1 ring-slate-200">
              <Picture picture={basics.picture} size={96} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHeader;
