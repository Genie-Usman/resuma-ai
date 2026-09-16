import { useState, useMemo, useEffect } from "react";
import {
  LuPalette,
  LuX,
  LuCheck,
  LuSparkles,
  LuShieldCheck,
  LuShieldAlert,
  LuLayoutTemplate,
} from "react-icons/lu";
import { THEME_COLOR_PALETTE } from "../../../../constants";
import {
  calculateContrastRatio,
  CURATED_ACCENTS,
  CURATED_BACKGROUNDS,
  CURATED_TEXT_COLORS,
  normalizeHex,
} from "../../../../utils/contrastUtils";

const PALETTE_LABELS = {
  zenith: "Zenith Slate",
  cascade: "Zenith Slate",
  meridian: "Meridian Navy",
  clarity: "Clarity White",
  vanguard: "Vanguard Dark",
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
  sage: "Sage Forest",
  ivory: "Ivory Charcoal",
  denim: "Denim Blue",
  platinum: "Platinum Violet",
  monoWarm: "Warm Amber",
  ash: "Ash Amber",
  arctic: "Arctic Sky",
  pearl: "Pearl Sapphire",
};

/**
 * ColorsDrawer Component
 * Dedicated drawer for fine-tuning resume color schemes, paper tones, body text, and accents.
 * Provides:
 * - 34 Curated full-theme palettes with 3-stripe visual previews
 * - Real-time WCAG 2.2 contrast checking against paper background
 * - Custom palette builder with 12 executive swatches
 * - Neutral Dark (Body Text) color pills
 * - Paper Sheet Background pills
 */
const ColorsDrawer = ({
  currentColors = ["#ffffff", "#000000", "#ca8a04"],
  onUpdateColors,
  onOpenTemplates,
  onClose,
}) => {
  const [colorMode, setColorMode] = useState("presets"); // "presets" | "custom"

  const activeBg = currentColors[0] || "#ffffff";
  const activeText = currentColors[1] || "#000000";
  const activeAccent = currentColors[2] || "#ca8a04";

  const [customHex, setCustomHex] = useState(activeAccent);

  useEffect(() => {
    if (activeAccent) {
      setCustomHex(activeAccent);
    }
  }, [activeAccent]);

  // Live WCAG contrast calculations against active paper background
  const accentContrast = useMemo(() => {
    return calculateContrastRatio(customHex, activeBg);
  }, [customHex, activeBg]);

  const textContrast = useMemo(() => {
    return calculateContrastRatio(activeText, activeBg);
  }, [activeText, activeBg]);

  // Quick-pick accent presets
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

  const handleSelectPreset = (colors) => {
    if (onUpdateColors) {
      onUpdateColors(colors);
    }
    if (colors[2]) {
      setCustomHex(colors[2]);
    }
  };

  const handleApplyAccent = (hex) => {
    const valid = normalizeHex(hex);
    setCustomHex(hex);
    if (valid && onUpdateColors) {
      onUpdateColors([activeBg, activeText, valid]);
    }
  };

  const handleApplyText = (hex) => {
    const valid = normalizeHex(hex);
    if (valid && onUpdateColors) {
      onUpdateColors([activeBg, valid, activeAccent]);
    }
  };

  const handleApplyBg = (hex) => {
    const valid = normalizeHex(hex);
    if (valid && onUpdateColors) {
      onUpdateColors([valid, activeText, activeAccent]);
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
            <h2 className="text-sm font-bold text-slate-800 leading-tight">Colors & Themes</h2>
            <p className="text-[11px] text-slate-500 leading-tight">Live instant preview on canvas</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Colors drawer"
        >
          <LuX className="text-base" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {/* Mode Switcher: Presets vs Custom */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setColorMode("presets")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              colorMode === "presets"
                ? "bg-white text-purple-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Curated Presets ({Object.keys(THEME_COLOR_PALETTE).filter((k) => k !== "cascade").length})
          </button>

          <button
            type="button"
            onClick={() => setColorMode("custom")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              colorMode === "custom"
                ? "bg-white text-purple-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LuSparkles className="text-xs text-purple-600" />
            <span>Custom Palette</span>
          </button>
        </div>

        {/* VIEW A: Curated Presets */}
        {colorMode === "presets" && (
          <div className="space-y-4">
            {/* Quick Accent Circles Row */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Primary Accent
              </label>
              <div className="flex items-center gap-2 flex-wrap pb-1">
                {quickPalettes.map((palette) => {
                  const color = palette.colors[2];
                  const isSelected = activeAccent.toLowerCase() === color.toLowerCase();

                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => handleSelectPreset([activeBg, activeText, color])}
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
            </div>

            {/* Curated Theme Palettes Grid */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Harmonized 3-Color Themes (Paper, Text, Accent)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(THEME_COLOR_PALETTE)
                  .filter(([key]) => key !== "cascade")
                  .map(([name, colors]) => {
                    const isSelected =
                      colors[0]?.toLowerCase() === activeBg.toLowerCase() &&
                      colors[1]?.toLowerCase() === activeText.toLowerCase() &&
                      colors[2]?.toLowerCase() === activeAccent.toLowerCase();
                    const label = PALETTE_LABELS[name] || name.charAt(0).toUpperCase() + name.slice(1);

                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleSelectPreset(colors)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col gap-2 ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/30 shadow-xs"
                            : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-xs truncate ${
                              isSelected ? "text-purple-900 font-bold" : "text-slate-700 font-medium"
                            }`}
                          >
                            {label}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                              <LuCheck className="text-[10px] stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* 3-stripe Preview Bar: [Paper Background, Body Text, Primary Accent] */}
                        <div className="flex items-center h-4 w-full rounded-md overflow-hidden border border-slate-200 shadow-2xs">
                          <div
                            style={{ backgroundColor: colors[0] }}
                            className="flex-1 h-full"
                            title={`Paper: ${colors[0]}`}
                          />
                          <div
                            style={{ backgroundColor: colors[1] }}
                            className="flex-1 h-full"
                            title={`Text: ${colors[1]}`}
                          />
                          <div
                            style={{ backgroundColor: colors[2] }}
                            className="w-2/5 h-full"
                            title={`Primary: ${colors[2]}`}
                          />
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: Custom Palette Builder */}
        {colorMode === "custom" && (
          <div className="space-y-4">
            {/* 1. Primary Accent Builder */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Primary Accent</span>
                  <span className="text-[10px] text-slate-500">Headers, badges & icons</span>
                </div>

                {/* Accent Contrast Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${accentContrast.badgeColor}`}
                  title={accentContrast.description}
                >
                  {accentContrast.passesAALarge ? (
                    <LuShieldCheck className="text-xs" />
                  ) : (
                    <LuShieldAlert className="text-xs" />
                  )}
                  <span>WCAG {accentContrast.score} ({accentContrast.ratioText})</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label
                  className="relative w-9 h-9 rounded-xl border border-slate-300 shadow-2xs overflow-hidden cursor-pointer shrink-0 hover:scale-105 transition-transform"
                  title="Open color wheel"
                >
                  <input
                    type="color"
                    value={normalizeHex(customHex) || "#ca8a04"}
                    onChange={(e) => handleApplyAccent(e.target.value)}
                    className="absolute -inset-4 w-16 h-16 cursor-pointer opacity-0"
                  />
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: customHex }}
                  />
                </label>

                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 7) {
                      setCustomHex(val);
                      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                        handleApplyAccent(val);
                      }
                    }
                  }}
                  onBlur={() => {
                    const norm = normalizeHex(customHex);
                    handleApplyAccent(norm);
                  }}
                  placeholder="#CA8A04"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono uppercase font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* 12 Curated Executive Swatches with proper item.hex */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Curated Executive Swatches
                </span>
                <div className="grid grid-cols-6 gap-1.5">
                  {CURATED_ACCENTS.map((item) => {
                    const isMatch =
                      normalizeHex(customHex).toLowerCase() === item.hex.toLowerCase();

                    return (
                      <button
                        key={item.hex}
                        type="button"
                        onClick={() => handleApplyAccent(item.hex)}
                        style={{ backgroundColor: item.hex }}
                        className={`h-6 rounded-lg relative cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${
                          isMatch
                            ? "ring-2 ring-purple-600 ring-offset-1 scale-105 shadow-xs"
                            : "border border-black/10 shadow-2xs"
                        }`}
                        title={`${item.name} (${item.hex})`}
                      >
                        {isMatch && (
                          <LuCheck className="text-white text-xs stroke-[3] drop-shadow-xs" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Neutral Dark / Body Text Pills */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Neutral Dark (Body Text)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Paragraphs, summaries & descriptions
                  </span>
                </div>

                {/* Body Text Contrast Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${textContrast.badgeColor}`}
                  title={textContrast.description}
                >
                  <LuShieldCheck className="text-xs" />
                  <span>WCAG {textContrast.score} ({textContrast.ratioText})</span>
                </span>
              </div>

              {/* 4 Text Color Pills */}
              <div className="grid grid-cols-2 gap-2">
                {CURATED_TEXT_COLORS.map((item) => {
                  const isSelected =
                    activeText.toLowerCase() === item.hex.toLowerCase();

                  return (
                    <button
                      key={item.hex}
                      type="button"
                      onClick={() => handleApplyText(item.hex)}
                      className={`px-3 py-2 rounded-xl text-left border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/70 text-purple-900 font-bold ring-1 ring-purple-600/30 shadow-2xs"
                          : "border-slate-200/80 bg-white hover:bg-slate-100/70 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="text-xs truncate">{item.name}</span>
                      </div>
                      {isSelected && (
                        <LuCheck className="text-purple-700 text-xs stroke-[3] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Paper Sheet Background Pills */}
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Paper Sheet Background
                </span>
                <span className="text-[10px] text-slate-500">
                  Canvas & PDF export paper tone
                </span>
              </div>

              {/* 4 Background Pills */}
              <div className="grid grid-cols-2 gap-2">
                {CURATED_BACKGROUNDS.map((item) => {
                  const isSelected =
                    activeBg.toLowerCase() === item.hex.toLowerCase();

                  return (
                    <button
                      key={item.hex}
                      type="button"
                      onClick={() => handleApplyBg(item.hex)}
                      className={`px-3 py-2 rounded-xl text-left border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/70 text-purple-900 font-bold ring-1 ring-purple-600/30 shadow-2xs"
                          : "border-slate-200/80 bg-white hover:bg-slate-100/70 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="text-xs truncate">{item.name}</span>
                      </div>
                      {isSelected && (
                        <LuCheck className="text-purple-700 text-xs stroke-[3] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. WCAG Readability Scorecard */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                accentContrast.passesAALarge && textContrast.passesAA
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/80 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <LuShieldCheck className="text-sm shrink-0" />
                <span>WCAG 2.2 Scorecard</span>
              </div>
              <span className="text-[11px] font-semibold">
                {accentContrast.passesAALarge && textContrast.passesAA
                  ? "ATS & Print Compliant"
                  : "Caution: Low Contrast"}
              </span>
            </div>
          </div>
        )}

        {/* Shortcut to Templates Drawer */}
        {onOpenTemplates && (
          <div className="pt-3 border-t border-slate-200/80 text-center">
            <button
              type="button"
              onClick={onOpenTemplates}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1.5 mx-auto cursor-pointer py-1 px-3 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <LuLayoutTemplate className="text-sm" />
              <span>Looking for layouts? Switch to Templates</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorsDrawer;
