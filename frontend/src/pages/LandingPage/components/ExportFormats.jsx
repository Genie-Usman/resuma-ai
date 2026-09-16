import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuFileText,
  LuCode,
  LuFileCheck,
  LuArrowRight,
  LuShieldCheck,
  LuDownload,
  LuCheck,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const FORMATS = [
  {
    id: "pdf",
    extension: ".pdf",
    title: "Vector PDF Document",
    tag: "Industry Standard",
    desc: "1200 DPI print clarity with selectable text. Ideal for uploading to company websites and emailing directly to hiring managers.",
    icon: LuFileText,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    details: [
      "Selectable text parsed accurately by applicant tracking systems",
      "Vector typography remains razor-sharp at any zoom level",
      "Embedded standard fonts so formatting never shifts on different computers",
    ],
  },
  {
    id: "txt",
    extension: ".txt / .doc",
    title: "Clean Formatted Text",
    tag: "Portal Safe",
    desc: "Formatted plain text for fast, glitch-free pasting into online job application forms and text boxes without weird character bugs.",
    icon: LuFileCheck,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    details: [
      "Zero hidden formatting or broken table borders",
      "Easily paste into Workday, Taleo, or Greenhouse text boxes",
      "Clean standard bullet hierarchy",
    ],
  },
  {
    id: "json",
    extension: ".json",
    title: "JSON Resume Standard",
    tag: "Open Data",
    desc: "Complete career data portability. Export using the open-source JSON Resume standard so your history is always yours to keep.",
    icon: LuCode,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    details: [
      "100% data ownership with zero platform lock-in",
      "Compatible with developer toolchains and portfolio generators",
      "Import back into Resuma AI anytime with one click",
    ],
  },
];

const ExportFormats = () => {
  const navigate = useNavigate();
  const [activeFormat, setActiveFormat] = useState("pdf");

  const selected = FORMATS.find((f) => f.id === activeFormat) || FORMATS[0];

  return (
    <section className="py-24 relative bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Descriptive Content & Selector */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider">
              <LuShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Universal Compatibility</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Export in the formats recruiters actually want.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              No locked platforms or surprise watermarks. Download your resume in high-resolution vector PDF, application-safe text, or open-standard JSON.
            </p>

            {/* Format Selection Cards */}
            <div className="space-y-3 pt-2">
              {FORMATS.map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = activeFormat === fmt.id;
                return (
                  <div
                    key={fmt.id}
                    onClick={() => setActiveFormat(fmt.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-50 border-slate-900 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-slate-900">
                            {fmt.title}{" "}
                            <span className="text-xs text-slate-500 font-mono font-normal">
                              ({fmt.extension})
                            </span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                            {fmt.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {fmt.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Physical File Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="ml-2 text-xs font-mono text-slate-500">
                    preview_export{selected.extension}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  Ready to Download
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="py-6 space-y-5"
                >
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-sm">
                          {selected.extension.slice(1, 4).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            Alex_Rivera_Resume{selected.extension}
                          </div>
                          <div className="text-xs text-slate-500">
                            Updated today · 100% Vector Quality
                          </div>
                        </div>
                      </div>
                      <LuDownload className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  {/* Checklist for this format */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Format Capabilities
                    </span>
                    {selected.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-xs sm:text-sm text-slate-700"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <LuCheck className="w-3.5 h-3.5" />
                        </div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Call to action */}
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => navigate("/dashboard")}
                      className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Create and download your resume</span>
                      <LuArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExportFormats;
