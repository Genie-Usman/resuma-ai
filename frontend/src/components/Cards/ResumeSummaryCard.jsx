import { useState } from "react";
import {
  LuCopy,
  LuTrash2,
  LuShare2,
  LuEye,
  LuClock,
  LuSparkles,
  LuArrowUpRight,
} from "react-icons/lu";

const ResumeSummaryCard = ({
  imgUrl,
  title,
  lastUpdated,
  viewsCount = 0,
  template = "azurill",
  candidateName,
  role,
  themeColor = "#7c3aed",
  onSelect,
  onDuplicate,
  onDelete,
  onShare,
}) => {
  const [imgError, setImgError] = useState(false);

  // Treat generic unsplash stock photos as placeholder so we render the authentic document sheet
  const isStockPhoto = typeof imgUrl === "string" && imgUrl.includes("images.unsplash.com");
  const showCustomThumbnail = imgUrl && !isStockPhoto && !imgError;

  return (
    <div
      onClick={onSelect}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-[0_16px_36px_-8px_rgba(124,58,237,0.12),0_8px_16px_-4px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer w-full shadow-2xs"
    >
      {/* 1. Preview Gallery Canvas Area */}
      <div className="relative w-full aspect-[1/1.34] bg-[#f6f7fb] p-3 sm:p-3.5 flex items-center justify-center overflow-hidden border-b border-slate-100">
        {/* Paper Sheet Container */}
        <div className="w-full h-full bg-white rounded-lg shadow-[0_2px_10px_-2px_rgba(0,0,0,0.06),0_1px_3px_0_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] overflow-hidden relative flex flex-col transition-transform duration-300 group-hover:scale-[1.02]">
          {showCustomThumbnail ? (
            <img
              src={imgUrl}
              alt={title || "Resume preview"}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            /* Executive Miniature Document Cover Fallback */
            <div className="w-full h-full flex flex-col justify-between bg-white text-slate-800 select-none">
              {/* Top Accent Strip */}
              <div
                className="h-2 w-full shrink-0"
                style={{ backgroundColor: themeColor || "#7c3aed" }}
              />

              <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                {/* Header Profile Area */}
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-[13px] tracking-tight truncate">
                    {candidateName || title || "Professional Resume"}
                  </h5>
                  <p className="text-[9.5px] font-medium text-slate-500 truncate mt-0.5">
                    {role || "Executive Resume"}
                  </p>
                  <div className="h-px bg-slate-100 my-2" />
                </div>

                {/* Simulated Content Layout */}
                <div className="space-y-2.5 my-auto">
                  {/* Experience Section */}
                  <div>
                    <span className="text-[7.5px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                      Experience
                    </span>
                    <div className="h-1.5 bg-slate-700/70 rounded-full w-3/4 mb-1" />
                    <div className="h-1 bg-slate-300 rounded-full w-1/2 mb-1.5" />
                    <div className="h-1 bg-slate-100 rounded-full w-full mb-0.5" />
                    <div className="h-1 bg-slate-100 rounded-full w-4/5" />
                  </div>

                  {/* Skills / Projects Section */}
                  <div>
                    <span className="text-[7.5px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                      Skills & Highlights
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[7.5px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                        Leadership
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[7.5px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60">
                        Architecture
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[7.5px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60">
                        Engineering
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Sheet Stamp */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400 font-medium">
                  <span className="capitalize">
                    Template: {template || "Standard"}
                  </span>
                  <span className="text-purple-600 font-semibold">Resuma AI</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Count Floating Badge (Top-Left) */}
        {viewsCount > 0 && (
          <div
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10.5px] font-semibold text-slate-700 shadow-xs border border-slate-200/80"
            title={`Viewed ${viewsCount} times`}
          >
            <LuEye className="text-xs text-purple-600" />
            <span>{viewsCount}</span>
          </div>
        )}

        {/* Template Floating Pill (Top-Right) */}
        {template && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-medium text-white shadow-xs capitalize tracking-tight">
            <LuSparkles className="text-[10px] text-purple-300" />
            <span>{template}</span>
          </div>
        )}

        {/* Hover Center Action: "Open Studio" Button */}
        <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3 z-20">
          <span className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 hover:bg-purple-600 hover:text-white">
            <span>Open Studio</span>
            <LuArrowUpRight className="text-sm" />
          </span>
        </div>
      </div>

      {/* 2. Permanent Card Footer Info */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
        {/* Title */}
        <h4
          className="text-sm font-bold text-slate-900 truncate tracking-tight group-hover:text-purple-600 transition-colors"
          title={title || "Untitled Resume"}
        >
          {title || "Untitled Resume"}
        </h4>

        {/* Meta & Actions Row */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1 text-slate-500 text-xs">
          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
            <LuClock className="text-xs shrink-0 text-slate-400" />
            <span className="truncate">{lastUpdated || "Recently"}</span>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.();
              }}
              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
              title="Share public link"
            >
              <LuShare2 className="text-sm" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.();
              }}
              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
              title="Duplicate resume"
            >
              <LuCopy className="text-sm" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete resume"
            >
              <LuTrash2 className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSummaryCard;
