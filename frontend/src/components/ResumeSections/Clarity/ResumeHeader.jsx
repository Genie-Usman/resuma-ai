import Picture from "../Picture";

const ResumeHeader = ({ basics = {}, themeColors = [], summarySection = null }) => {
  const hasPicture = basics.picture?.url && !basics.picture?.effects?.hidden;
  const primaryColor = themeColors[2] || "#1e293b";
  const hasSummary = summarySection?.visible && summarySection?.content?.trim();

  return (
    <div className="w-full pt-7 pb-4 px-8 select-none">
      <div
        className={`flex ${
          hasSummary ? "items-start" : "items-center"
        } justify-between gap-6 sm:gap-8`}
      >
        <div className="flex-1 min-w-0">
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none break-words"
            style={{ color: primaryColor }}
          >
            {basics.name || "Your Name"}
          </h1>

          {basics.headline && (
            <p className="text-sm sm:text-base font-semibold text-slate-600 mt-1.5 leading-snug break-words">
              {basics.headline}
            </p>
          )}

          {hasSummary && (
            <div
              dangerouslySetInnerHTML={{ __html: summarySection.content }}
              style={{ color: themeColors[1] || "inherit" }}
              className="wysiwyg text-xs sm:text-[13px] leading-relaxed font-normal mt-3 text-slate-700 [&>p]:mb-1.5 last:[&>p]:mb-0"
            />
          )}
        </div>

        {hasPicture && (
          <div className="shrink-0 mt-0.5">
            <div className="rounded-2xl overflow-hidden shadow-xs ring-1 ring-slate-200/80">
              <Picture picture={basics.picture} size={124} borderRadius={16} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHeader;

