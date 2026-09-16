import Picture from "../Picture";

const ResumeHeader = ({ basics = {}, themeColors = [] }) => {
  const hasPicture = basics.picture?.url && !basics.picture?.effects?.hidden;

  return (
    <div className="w-full flex flex-col items-start px-5 pt-6 pb-4 select-none">
      {hasPicture && (
        <div className="mb-4 w-full flex justify-center">
          <div className="rounded-xl overflow-hidden shadow-md ring-2 ring-white/20 bg-white/10">
            <Picture picture={basics.picture} size={110} />
          </div>
        </div>
      )}

      <div className="w-full space-y-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight break-words">
          {basics.name || "Your Name"}
        </h1>
        {basics.headline && (
          <p className="text-xs sm:text-[13px] font-semibold text-slate-300 leading-snug break-words">
            {basics.headline}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumeHeader;
