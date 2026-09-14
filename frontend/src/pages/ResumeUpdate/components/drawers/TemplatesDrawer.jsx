import { useState } from "react";
import {
  LuPalette,
  LuX,
  LuCheck,
  LuSparkles,
  LuShieldCheck,
  LuShieldAlert,
  LuPipette,
} from "react-icons/lu";
import { RESUME_TEMPLATES, THEME_COLOR_PALETTE } from "../../../../constants";
import {
  calculateContrastRatio,
  CURATED_ACCENTS,
  normalizeHex,
} from "../../../../utils/contrastUtils";

/**
 * TemplatesDrawer Component
 * Replaces the oversized modal with a contextual, in-place drawer.
 * Allows users to choose color swatches and switch between all 12 templates
 * while watching their resume update live on the canvas.
 */
const TemplatesDrawer = ({
  currentTemplate,
  onSelectTemplate,
  currentColors = ["#ffffff", "#000000", "#ca8a04"],
  onUpdateColors,
  onClose,
}) => {
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
  const activeAccent = currentColors[2] || "#ca8a04";
  const [customHex, setCustomHex] = useState(activeAccent);

  // Live WCAG contrast rating against white paper
  const contrastData = calculateContrastRatio(customHex, currentColors[0] || "#ffffff");

  // Popular quick-pick color presets
  const quickPalettes = [
    { id: "classic", label: "Classic Gold", colors: ["#ffffff", "#000000", "#CA8A04"] },
    { id: "cobalt", label: "Cobalt Blue", colors: ["#ffffff", "#000000", "#2563EB"] },
    { id: "midnight", label: "Midnight Sky", colors: ["#ffffff", "#000000", "#1E3A8A"] },
    { id: "forest", label: "Emerald Green", colors: ["#ffffff", "#000000", "#059669"] },
    { id: "lavender", label: "Royal Lavender", colors: ["#ffffff", "#000000", "#7C3AED"] },
    { id: "crimson", label: "Crimson Red", colors: ["#ffffff", "#000000", "#DC2626"] },
    { id: "graphite", label: "Graphite Slate", colors: ["#ffffff", "#000000", "#475569"] },
    { id: "ocean", label: "Ocean Teal", colors: ["#ffffff", "#000000", "#0D9488"] },
    { id: "sunrise", label: "Sunrise Coral", colors: ["#ffffff", "#000000", "#EA580C"] },
    { id: "rose", label: "Rose Garden", colors: ["#ffffff", "#000000", "#E11D48"] },
  ];

  const handleSelectPreset = (palette) => {
    if (onUpdateColors) {
      onUpdateColors(palette.colors);
    }
  };

  const handleApplyCustomHex = (hex) => {
    const valid = normalizeHex(hex);
    setCustomHex(hex);
    if (valid && onUpdateColors) {
      onUpdateColors([currentColors[0] || "#ffffff", currentColors[1] || "#000000", valid]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white select-none overflow-hidden">
      {/* Drawer Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/80 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <LuPalette className="text-base" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">Templates & Colors</h2>
            <p className="text-[11px] text-slate-500 leading-tight">Live instant preview on canvas</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Templates drawer"
        >
          <LuX className="text-base" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
        {/* 1. Color Palette Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Accent Color
            </label>
            <button
              type="button"
              onClick={() => setShowCustomColorPicker((prev) => !prev)}
              className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              <LuPipette className="text-xs" />
              <span>{showCustomColorPicker ? "Hide Custom" : "Custom Hex"}</span>
            </button>
          </div>

          {/* Quick Swatches Bar */}
          <div className="flex items-center gap-2 flex-wrap pb-1">
            {quickPalettes.map((palette) => {
              const color = palette.colors[2];
              const isSelected = activeAccent.toLowerCase() === color.toLowerCase();

              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => handleSelectPreset(palette)}
                  className={`relative w-7 h-7 rounded-full transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                    isSelected ? "ring-2 ring-offset-2 ring-purple-600 scale-105" : "hover:shadow-xs"
                  }`}
                  style={{ backgroundColor: color }}
                  title={`${palette.label} (${color})`}
                >
                  {isSelected && (
                    <LuCheck className="absolute inset-0 m-auto text-white text-xs drop-shadow-md stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Collapsible Custom Color Picker & WCAG Contrast Rating */}
          {showCustomColorPicker && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 animate-in fade-in-0 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">Custom Brand Color</span>
                {/* Contrast Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    contrastData.status === "pass"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                  title={contrastData.feedback}
                >
                  {contrastData.status === "pass" ? (
                    <LuShieldCheck className="text-xs text-emerald-600" />
                  ) : (
                    <LuShieldAlert className="text-xs text-amber-600" />
                  )}
                  <span>WCAG {contrastData.score} ({contrastData.ratio.toFixed(1)}:1)</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={normalizeHex(customHex) || "#ca8a04"}
                  onChange={(e) => handleApplyCustomHex(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => handleApplyCustomHex(e.target.value)}
                  placeholder="#CA8A04"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* 12 Curated Brand Swatches */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {CURATED_ACCENTS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => handleApplyCustomHex(hex)}
                    className="w-5 h-5 rounded-md border border-black/10 transition-transform hover:scale-125 cursor-pointer shadow-2xs"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-slate-200/80" />

        {/* 2. Resume Templates Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              All 12 Templates
            </label>
            <span className="text-[11px] text-slate-400 font-medium">ATS-Friendly</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {RESUME_TEMPLATES.map((tpl) => {
              const isSelected = currentTemplate === tpl.id;

              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    if (onSelectTemplate) onSelectTemplate(tpl.id);
                  }}
                  className={`group text-left rounded-xl border p-2 transition-all cursor-pointer flex flex-col bg-white ${
                    isSelected
                      ? "border-purple-600 ring-2 ring-purple-600/30 shadow-md bg-purple-50/20"
                      : "border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative w-full aspect-[210/297] rounded-lg overflow-hidden bg-slate-100 border border-slate-200/70 mb-2 group-hover:opacity-95">
                    <img
                      src={tpl.thumbnail}
                      alt={tpl.name}
                      className="w-full h-full object-cover object-top transition-transform group-hover:scale-103 duration-200"
                      loading="lazy"
                    />

                    {/* Active Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-0.5">
                        <LuCheck className="text-[10px] stroke-[3]" />
                        <span>Active</span>
                      </div>
                    )}
                  </div>

                  {/* Template Details */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold truncate ${isSelected ? "text-purple-900" : "text-slate-800"}`}>
                      {tpl.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight mt-0.5">
                    {tpl.description || "Executive ATS Layout"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesDrawer;
