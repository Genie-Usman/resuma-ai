import { useState, useEffect, useRef, useCallback } from "react";
import {
  LuZoomIn,
  LuZoomOut,
  LuMaximize2,
  LuScissors,
  LuLayers,
  LuFileText,
  LuMail,
  LuSparkles,
} from "react-icons/lu";
import toast from "react-hot-toast";
import {
  usePageCalculator,
  getPaperDimensions,
} from "../hooks/usePageCalculator";
import RenderResume from "../../../components/ResumeTemplates/RenderResume";
import MatchedCoverLetter from "../../../components/ResumeSections/MatchedCoverLetter";

/**
 * ResumeCanvas Component (Studio 2.0)
 * Expansive, calm document preview area.
 * Free of cramped button clusters, with dynamic A4 and US Letter support,
 * real-time page break guides, smooth zoom, and responsive auto-fit.
 * Now supports seamless switching between Resume and Matched Cover Letter!
 */
const ResumeCanvas = ({
  resumeData,
  templateId,
  colorPalette,
  canvasRef, // Forwarded ref for thumbnail capture or export
  paperFormat = "a4",
  docType = "resume", // "resume" | "cover-letter"
  onDocTypeChange,
  onShrinkToSinglePage,
  onOpenDesignDrawer,
  onOpenAiAuditDrawer,
  overallScore = 90,
}) => {
  const containerRef = useRef(null);
  const sheetContentRef = useRef(null);

  // Active Paper Dimensions (A4 vs US Letter)
  const activePaper = getPaperDimensions(
    paperFormat || resumeData?.data?.metadata?.page?.format || "a4"
  );

  // View & Zoom State
  const [zoom, setZoom] = useState(0.7);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [viewMode, setViewMode] = useState("continuous"); // "continuous" | "cards"

  // Real-time pagination calculation for active paper format
  const {
    pageCount,
    isNearSinglePageLimit,
    breakPositions,
  } = usePageCalculator(sheetContentRef, activePaper.id);

  // Smart Auto-Fit: Single-click shrink to 1 page
  const handleShrinkToOnePage = useCallback(() => {
    if (!sheetContentRef?.current) return;
    const el = sheetContentRef.current;
    const currentHeight = el.scrollHeight || el.offsetHeight;
    const targetHeight = activePaper.heightPx;

    if (currentHeight <= targetHeight + 8) {
      toast("Your resume already fits cleanly on 1 page!", {
        id: "already-single-page-toast",
        icon: "👍",
      });
      return;
    }

    const currentMargin =
      resumeData?.data?.metadata?.page?.marginPreset || "standard";

    // Candidate configurations in order of least-invasive adjustment
    const candidates = [
      { density: "compact", marginPreset: currentMargin === "wide" ? "standard" : currentMargin, fontScale: null },
      { density: "compact", marginPreset: "standard", fontScale: null },
      { density: "compact", marginPreset: "narrow", fontScale: null },
      { density: "compact", marginPreset: "narrow", fontScale: 0.89 },
      { density: "compact", marginPreset: "narrow", fontScale: 0.86 },
      { density: "compact", marginPreset: "narrow", fontScale: 0.84 },
    ];

    // Rapid synchronous probing on DOM element to find optimal least-invasive winner
    const originalClasses = el.className;
    const originalStyle = el.style.cssText;

    let bestConfig = candidates[candidates.length - 1];

    for (const config of candidates) {
      const marginClass = config.marginPreset === "narrow" ? "resume-margin-narrow" : "resume-margin-standard";
      el.className = `a4-paper-sheet bg-white resume-density-compact ${marginClass}`;
      if (config.fontScale) {
        el.style.setProperty("--resume-font-scale", `${(config.fontScale * 100).toFixed(1)}%`);
      } else {
        el.style.removeProperty("--resume-font-scale");
      }

      const measuredH = el.scrollHeight;
      if (measuredH <= targetHeight + 8) {
        bestConfig = config;
        break;
      }
    }

    // Restore original DOM state
    el.className = originalClasses;
    el.style.cssText = originalStyle;

    if (onShrinkToSinglePage) {
      onShrinkToSinglePage(bestConfig);
    }
  }, [activePaper.heightPx, onShrinkToSinglePage, resumeData]);

  // Auto-fit scale to available column width
  const calculateAutoFit = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 80;
    if (containerWidth > 0) {
      const calculatedScale = Math.min(1.05, Math.max(0.35, containerWidth / activePaper.widthPx));
      setZoom(Number(calculatedScale.toFixed(2)));
    }
  }, [activePaper.widthPx]);

  useEffect(() => {
    if (!isAutoFit) return;
    calculateAutoFit();

    const handleResize = () => {
      if (isAutoFit) calculateAutoFit();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAutoFit, calculateAutoFit]);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.min(1.4, Number((prev + 0.05).toFixed(2))));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.max(0.35, Number((prev - 0.05).toFixed(2))));
  };

  const handleToggleAutoFit = () => {
    setIsAutoFit(true);
    calculateAutoFit();
  };

  const displayPageCount =
    docType === "cover-letter" ? Math.max(1, pageCount) : pageCount;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-full bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden select-none"
    >
      {/* 1. Calm Canvas Top Control Bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-xs text-slate-700 z-10 shrink-0">
        {/* Left: Document Mode Switcher Pill & Page Count Badge */}
        <div className="flex items-center gap-2">
          {/* Document Switcher: Resume vs Matched Cover Letter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => onDocTypeChange && onDocTypeChange("resume")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                docType === "resume"
                  ? "bg-white text-purple-700 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="View & edit Resume document"
            >
              <LuFileText className="text-xs" />
              <span>Resume</span>
            </button>
            <button
              type="button"
              onClick={() => onDocTypeChange && onDocTypeChange("cover-letter")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                docType === "cover-letter"
                  ? "bg-white text-purple-700 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="View & edit Matched Cover Letter"
            >
              <LuMail className="text-xs" />
              <span>Cover Letter</span>
            </button>
          </div>

          {/* Page Count Badge & Paper Format indicator */}
          <button
            type="button"
            onClick={onOpenDesignDrawer}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-xs text-slate-700 font-semibold shrink-0 transition-colors cursor-pointer"
            title="Click to open Design drawer (A4 vs Letter, Margins, Spacing)"
          >
            <span>
              {displayPageCount} {displayPageCount === 1 ? "Page" : "Pages"} · {activePaper.shortLabel}
            </span>
          </button>
        </div>

        {/* Center: View Options (Continuous vs Cards + Cutoff Guides) */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            type="button"
            onClick={() => setViewMode("continuous")}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              viewMode === "continuous"
                ? "bg-white text-purple-700 font-semibold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Continuous
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              viewMode === "cards"
                ? "bg-white text-purple-700 font-semibold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pages
          </button>

          {docType === "resume" && (
            <>
              <div className="w-px h-3 bg-slate-300 mx-0.5" />

              {/* Cutoff Guides Toggle */}
              <button
                type="button"
                onClick={() => setShowGuides((prev) => !prev)}
                className={`px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                  showGuides && viewMode === "continuous"
                    ? "text-purple-700 font-semibold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Toggle visual page break guide lines"
              >
                <LuScissors className="text-xs" />
                <span className="hidden md:inline">Guides</span>
              </button>
            </>
          )}
        </div>

        {/* Right: Smooth Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom out"
          >
            <LuZoomOut className="text-sm" />
          </button>

          <span className="min-w-[42px] text-center font-mono text-xs font-bold text-slate-700">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom in"
          >
            <LuZoomIn className="text-sm" />
          </button>

          <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

          <button
            type="button"
            onClick={handleToggleAutoFit}
            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors cursor-pointer ${
              isAutoFit
                ? "bg-purple-50 text-purple-700 border-purple-200 shadow-2xs"
                : "hover:bg-slate-100 text-slate-600 border-transparent"
            }`}
            title="Auto fit to column width"
          >
            <LuMaximize2 className="text-xs" />
          </button>
        </div>
      </div>

      {/* 2. Expansive Canvas Scroll Area with Studio Grid Backdrop */}
      <div
        className={`flex-1 overflow-y-auto ${
          zoom > 1.05 ? "overflow-x-auto" : "overflow-x-hidden"
        } p-6 sm:p-10 flex justify-center items-start custom-scrollbar studio-canvas-pattern`}
      >
        {/* Continuous View: Single Scaled Document Sheet */}
        {viewMode === "continuous" && (
          <div
            style={{
              width: `${Math.round(activePaper.widthPx * zoom)}px`,
              height: `${Math.round(displayPageCount * activePaper.heightPx * zoom)}px`,
              position: "relative",
              transition: "width 0.15s ease-out, height 0.15s ease-out",
            }}
            className="shrink-0 mb-16 shadow-2xl ring-1 ring-black/10 rounded-xs bg-white overflow-hidden"
          >
            <div
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${activePaper.widthPx}px`,
                minHeight: `${displayPageCount * activePaper.heightPx}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
              className="a4-paper-sheet bg-white"
            >
              {/* Overlaid Visual Page Break Lines (Resume only) */}
              {docType === "resume" && showGuides &&
                breakPositions.map((pos, idx) => (
                  <div
                    key={`page-break-${idx}`}
                    className="page-break-guide-line"
                    style={{ top: `${pos}px` }}
                  >
                    <div className="page-break-guide-pill flex items-center gap-1">
                      <LuScissors className="text-[10px]" />
                      <span>
                        End of Page {idx + 1} ({Math.round(pos * 0.264583)}mm)
                      </span>
                    </div>
                  </div>
                ))}

              {/* Document Content */}
              <div ref={sheetContentRef} className="w-full">
                {docType === "cover-letter" ? (
                  <MatchedCoverLetter
                    basics={resumeData?.basics}
                    metadata={{
                      ...resumeData?.metadata,
                      template: templateId || resumeData?.metadata?.template,
                    }}
                    coverLetter={resumeData?.coverLetter}
                    themeColors={colorPalette}
                    containerWidth={activePaper.widthPx}
                  />
                ) : (
                  resumeData?.basics && (
                    <RenderResume
                      templateId={templateId}
                      resumeData={resumeData}
                      colorPalette={colorPalette}
                      containerWidth={activePaper.widthPx}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paginated Cards View: Visually Demarcated Page Sheets */}
        {viewMode === "cards" && (
          <div
            style={{
              width: `${Math.round(activePaper.widthPx * zoom)}px`,
              height: `${Math.round(
                (displayPageCount * activePaper.heightPx + (displayPageCount - 1) * 24) * zoom
              )}px`,
              position: "relative",
              transition: "width 0.15s ease-out, height 0.15s ease-out",
            }}
            className="shrink-0 mb-16"
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${activePaper.widthPx}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
              className="flex flex-col gap-6"
            >
              {Array.from({ length: displayPageCount }).map((_, pageIdx) => (
                <div
                  key={`paper-page-card-${pageIdx}`}
                  className="relative a4-paper-sheet shadow-2xl rounded-xs bg-white border border-gray-200 overflow-hidden"
                  style={{
                    height: `${activePaper.heightPx}px`,
                    width: `${activePaper.widthPx}px`,
                  }}
                >
                  {/* Page Card Header Badge */}
                  <div className="absolute top-2 right-3 z-20 px-2 py-0.5 rounded bg-gray-100/90 border border-gray-200 text-[11px] font-semibold text-gray-500 select-none shadow-xs">
                    Page {pageIdx + 1} of {displayPageCount} · {activePaper.shortLabel}
                  </div>

                  {/* Window into the continuous content clipped per page */}
                  <div
                    style={{
                      position: "absolute",
                      top: `-${pageIdx * activePaper.heightPx}px`,
                      left: 0,
                      width: `${activePaper.widthPx}px`,
                    }}
                  >
                    {docType === "cover-letter" ? (
                      <MatchedCoverLetter
                        basics={resumeData?.basics}
                        metadata={{
                          ...resumeData?.metadata,
                          template: templateId || resumeData?.metadata?.template,
                        }}
                        coverLetter={resumeData?.coverLetter}
                        themeColors={colorPalette}
                        containerWidth={activePaper.widthPx}
                      />
                    ) : (
                      resumeData?.basics && (
                        <RenderResume
                          templateId={templateId}
                          resumeData={resumeData}
                          colorPalette={colorPalette}
                          containerWidth={activePaper.widthPx}
                        />
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default ResumeCanvas;
