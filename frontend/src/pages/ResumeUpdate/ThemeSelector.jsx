import { useEffect, useRef, useState, useMemo } from "react";
import {
  LuPalette,
  LuLayoutTemplate,
  LuCheck,
  LuX,
  LuZoomIn,
  LuZoomOut,
  LuMaximize2,
  LuSparkles,
} from "react-icons/lu";
import { RESUME_TEMPLATES, THEME_COLOR_PALETTE } from "../../constants";
import RenderResume from "../../components/ResumeTemplates/RenderResume";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const PALETTE_LABELS = {
  classic: "Classic Gold",
  midnight: "Midnight Sky",
  graphite: "Graphite Slate",
  sunrise: "Sunrise Coral",
  lavender: "Royal Lavender",
  forest: "Forest Emerald",
  blush: "Berry Blush",
  cobalt: "Cobalt Blue",
  sand: "Desert Sand",
  slate: "Modern Slate",
  chocolate: "Warm Mocha",
  rose: "Rose Garden",
  ocean: "Ocean Teal",
  minty: "Mint Fresh",
  thunder: "Thunder Gold",
  crimson: "Bold Crimson",
  steel: "Steel Blue",
  bronze: "Warm Bronze",
  jade: "Deep Jade",
  indigoSky: "Indigo Sky",
  espresso: "Espresso Brown",
  charcoal: "Charcoal Blue",
};

const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme,
  setResumeData,
  resumeData,
  onClose,
}) => {
  const previewContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("templates"); // "templates" | "colors"

  const currentTemplate =
    resumeData?.data?.metadata?.template ||
    resumeData?.template ||
    RESUME_TEMPLATES[0].id;

  const currentTheme = resumeData?.data?.metadata?.theme || {};
  const currentColors = [
    currentTheme.background || "#ffffff",
    currentTheme.text || "#000000",
    currentTheme.primary || "#ca8a04",
  ];

  const [selectedTemplate, setSelectedTemplate] = useState({
    template: currentTemplate,
    index: Math.max(
      0,
      RESUME_TEMPLATES.findIndex((t) => t.id === currentTemplate)
    ),
  });

  const [selectedColorPalette, setSelectedColorPalette] = useState(() => {
    const defaultKey = Object.keys(THEME_COLOR_PALETTE)[0];
    const foundEntry = Object.entries(THEME_COLOR_PALETTE).find(
      ([, colors]) =>
        colors[0]?.toLowerCase() === currentColors[0]?.toLowerCase() &&
        colors[2]?.toLowerCase() === currentColors[2]?.toLowerCase()
    );

    const name = foundEntry?.[0] || defaultKey;
    const colors = foundEntry?.[1] || THEME_COLOR_PALETTE[defaultKey];
    const index = Object.keys(THEME_COLOR_PALETTE).indexOf(name);

    return { name, colors, index: Math.max(0, index) };
  });

  // Dynamic preview zoom scale
  const [scale, setScale] = useState(0.55);
  const [isAutoFit, setIsAutoFit] = useState(true);

  const calculateAutoFit = () => {
    if (!previewContainerRef.current) return;
    const { clientWidth, clientHeight } = previewContainerRef.current;
    if (clientWidth > 0 && clientHeight > 0) {
      const fitW = (clientWidth - 48) / A4_WIDTH_PX;
      const fitH = (clientHeight - 48) / A4_HEIGHT_PX;
      const computedScale = Math.min(fitW, fitH, 0.82);
      setScale(Number(Math.max(0.35, computedScale).toFixed(2)));
    }
  };

  useEffect(() => {
    if (!isAutoFit) return;
    calculateAutoFit();

    const handleResize = () => {
      if (isAutoFit) calculateAutoFit();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAutoFit]);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setScale((prev) => Math.min(1.2, Number((prev + 0.05).toFixed(2))));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setScale((prev) => Math.max(0.35, Number((prev - 0.05).toFixed(2))));
  };

  const handleToggleAutoFit = () => {
    setIsAutoFit(true);
    calculateAutoFit();
  };

  const handleApply = () => {
    const [background, text, primary] = selectedColorPalette.colors;

    setResumeData((prev) => ({
      ...prev,
      template: selectedTemplate.template,
      data: {
        ...prev.data,
        metadata: {
          ...prev.data.metadata,
          template: selectedTemplate.template,
          theme: {
            background,
            text,
            primary,
          },
        },
      },
    }));

    if (setSelectedTheme) {
      setSelectedTheme({
        template: selectedTemplate.template,
        colors: selectedColorPalette.colors,
        name: selectedColorPalette.name,
      });
    }

    onClose();
  };

  const selectedTemplateName = useMemo(() => {
    const name = selectedTemplate.template || "Standard";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [selectedTemplate.template]);

  const selectedColorName = useMemo(() => {
    return (
      PALETTE_LABELS[selectedColorPalette.name] ||
      selectedColorPalette.name ||
      "Custom"
    );
  }, [selectedColorPalette.name]);

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* 1. Modal Top Bar */}
      <div className="h-16 shrink-0 px-5 border-b border-slate-200/80 bg-white flex items-center justify-between z-20">
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/70 text-purple-600 flex items-center justify-center shrink-0">
            <LuPalette className="text-xl" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Choose Template & Colors</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select a design and color scheme for your resume
            </p>
          </div>
        </div>

        {/* Right: Selected pill, Cancel, Apply, and Close */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active selection summary pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-700 font-medium">
            <span className="text-slate-400">Preview:</span>
            <span className="font-semibold text-purple-700">
              {selectedTemplateName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">
              {selectedColorName}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <LuCheck className="text-sm" />
            <span>Apply Changes</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Close window"
          >
            <LuX className="text-lg" />
          </button>
        </div>
      </div>

      {/* 2. Workspace Body: Left Selector (w-[380px]) + Right Live Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Category Tabs & Card Grid */}
        <div className="w-[360px] sm:w-[410px] shrink-0 border-r border-slate-200/80 bg-slate-50/50 flex flex-col h-full">
          {/* Sub-Tabs Switcher */}
          <div className="p-3.5 border-b border-slate-200/70 bg-white">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab("templates")}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "templates"
                    ? "bg-white text-purple-700 shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                <LuLayoutTemplate className="text-sm" />
                <span>Templates ({RESUME_TEMPLATES.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("colors")}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "colors"
                    ? "bg-white text-purple-700 shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                <LuPalette className="text-sm" />
                <span>Colors ({Object.keys(THEME_COLOR_PALETTE).length})</span>
              </button>
            </div>
          </div>

          {/* Scrollable Items Container */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {/* Tab: Templates */}
            {activeTab === "templates" && (
              <div className="grid grid-cols-2 gap-3.5">
                {RESUME_TEMPLATES.map((template, index) => {
                  const isSelected = selectedTemplate.template === template.id;
                  const displayName =
                    template.id.charAt(0).toUpperCase() + template.id.slice(1);

                  return (
                    <div
                      key={template.id}
                      onClick={() =>
                        setSelectedTemplate({
                          template: template.id,
                          index,
                        })
                      }
                      className={`group relative rounded-xl border bg-white overflow-hidden cursor-pointer transition-all duration-150 flex flex-col ${
                        isSelected
                          ? "border-purple-600 ring-2 ring-purple-600/30 shadow-md"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-xs">
                          <LuCheck className="text-[11px]" />
                          <span>Selected</span>
                        </div>
                      )}

                      {/* Image Thumbnail */}
                      <div className="relative w-full aspect-[1/1.32] bg-slate-100 overflow-hidden">
                        {template.thumbnail ? (
                          <img
                            src={template.thumbnail}
                            alt={displayName}
                            className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Preview
                          </div>
                        )}
                      </div>

                      {/* Card Footer with Name */}
                      <div
                        className={`px-2.5 py-2 border-t text-center text-xs font-semibold truncate transition-colors ${
                          isSelected
                            ? "bg-purple-50 text-purple-900 border-purple-100 font-bold"
                            : "bg-white text-slate-700 border-slate-100 group-hover:text-purple-700"
                        }`}
                      >
                        {displayName}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab: Color Palettes */}
            {activeTab === "colors" && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(THEME_COLOR_PALETTE).map(
                  ([name, colors], index) => {
                    const isSelected = selectedColorPalette.index === index;
                    const label = PALETTE_LABELS[name] || name;

                    return (
                      <div
                        key={name}
                        onClick={() =>
                          setSelectedColorPalette({ name, colors, index })
                        }
                        className={`group relative p-3 rounded-xl border bg-white cursor-pointer transition-all duration-150 flex flex-col gap-2.5 ${
                          isSelected
                            ? "border-purple-600 ring-2 ring-purple-600/30 bg-purple-50/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 hover:shadow-2xs"
                        }`}
                      >
                        {/* Top: Name & Check */}
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isSelected
                                ? "text-purple-900 font-bold"
                                : "text-slate-800"
                            }`}
                          >
                            {label}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                              <LuCheck className="text-[10px]" />
                            </div>
                          )}
                        </div>

                        {/* Color Swatch Bars */}
                        <div className="flex items-center h-5 w-full rounded-lg overflow-hidden border border-slate-200/90 shadow-2xs">
                          {/* Background */}
                          <div
                            style={{ backgroundColor: colors[0] }}
                            className="flex-1 h-full"
                            title={`Background: ${colors[0]}`}
                          />
                          {/* Text */}
                          <div
                            style={{ backgroundColor: colors[1] }}
                            className="flex-1 h-full"
                            title={`Text: ${colors[1]}`}
                          />
                          {/* Accent Primary */}
                          <div
                            style={{ backgroundColor: colors[2] }}
                            className="w-1/2 h-full"
                            title={`Primary: ${colors[2]}`}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Document Sheet Preview */}
        <div className="flex-1 h-full bg-slate-100/90 flex flex-col overflow-hidden">
          {/* Preview Toolbar */}
          <div className="h-11 shrink-0 px-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-600 z-10">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Live Preview</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">
                Updates in real-time as you switch options
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Zoom out"
              >
                <LuZoomOut className="text-sm" />
              </button>

              <span className="min-w-[42px] text-center font-mono text-xs font-semibold text-slate-700">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Zoom in"
              >
                <LuZoomIn className="text-sm" />
              </button>

              <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

              <button
                type="button"
                onClick={handleToggleAutoFit}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isAutoFit
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
                title="Fit to view"
              >
                <LuMaximize2 className="text-sm" />
              </button>
            </div>
          </div>

          {/* Centered Scaled Canvas Viewport */}
          <div
            ref={previewContainerRef}
            className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start studio-canvas-pattern custom-scrollbar"
          >
            <div
              style={{
                width: `${Math.round(A4_WIDTH_PX * scale)}px`,
                height: `${Math.round(A4_HEIGHT_PX * scale)}px`,
                position: "relative",
                transition: "width 0.12s ease-out, height 0.12s ease-out",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
              }}
              className="shrink-0 mb-8 ring-1 ring-black/10 rounded-xs bg-white overflow-hidden"
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${A4_WIDTH_PX}px`,
                  minHeight: `${A4_HEIGHT_PX}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
                className="a4-paper-sheet bg-white pointer-events-none"
              >
                <RenderResume
                  templateId={selectedTemplate.template}
                  resumeData={resumeData?.data || resumeData}
                  colorPalette={selectedColorPalette.colors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
