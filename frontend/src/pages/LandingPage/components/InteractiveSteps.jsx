import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuLayoutTemplate,
  LuSparkles,
  LuSlidersHorizontal,
  LuDownload,
  LuCircleCheck,
  LuArrowRight,
  LuFileCheck,
} from "react-icons/lu";

const STEPS = [
  {
    step: 1,
    id: "template",
    icon: LuLayoutTemplate,
    title: "Pick a Template",
    tagline: "Standard margins & clean typography",
    description:
      "Choose from our gallery of tested layouts. Every template is structured so applicant tracking software parses your contact info, experience, and skills without dropping words.",
  },
  {
    step: 2,
    id: "content",
    icon: LuSparkles,
    title: "Write with AI Assistance",
    tagline: "Turn duties into achievements",
    description:
      "Stuck on what to write? Our smart assistant suggests clear, metric-driven bullet points for your specific job title so you never have to face a blank page.",
  },
  {
    step: 3,
    id: "customize",
    icon: LuSlidersHorizontal,
    title: "Personalize Your Design",
    tagline: "Colors, fonts & single-page fit",
    description:
      "Easily tweak theme colors, Google typography, and line spacing. Use our one-click single-page fit tool to ensure your resume never awkwardly spills to page two.",
  },
  {
    step: 4,
    id: "export",
    icon: LuDownload,
    title: "Download & Apply",
    tagline: "Clean vector PDF or shareable link",
    description:
      "Download a crisp, vector-quality PDF ready for printing and online applications. You can also generate a private web link to share directly with recruiters.",
  },
];

const InteractiveSteps = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="how-it-works" className="py-24 relative bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <span>Simple Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Build your resume in 4 easy steps.
          </h2>

          <p className="text-base text-slate-600">
            No messy Word formatting. No guessing what recruiters want to see.
            Follow four simple steps to your next interview.
          </p>
        </div>

        {/* 2-Column Interactive Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Simulator Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200/90 p-6 sm:p-8 shadow-sm overflow-hidden min-h-[420px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <LuLayoutTemplate className="w-4 h-4 text-slate-900" />
                        Step 1: Pick an ATS-Ready Template
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        12 Formats Available
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {["Clarity (2-Col)", "Vanguard (Banner)", "Meridian (Timeline)"].map(
                        (name, i) => (
                          <div
                            key={name}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              i === 0
                                ? "bg-white border-slate-900 shadow-sm ring-1 ring-slate-900"
                                : "bg-white/60 border-slate-200 text-slate-400"
                            }`}
                          >
                            <div className="h-20 rounded-lg bg-slate-100 mb-2 flex items-center justify-center text-slate-500 text-xs font-bold">
                              {i === 0 ? "✓ Selected" : "Preview"}
                            </div>
                            <div className="text-[11px] font-bold text-slate-800">
                              {name}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        Standard letter margins & readable typography
                      </span>
                      <span className="font-bold text-emerald-700">100% Guaranteed</span>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <LuSparkles className="w-4 h-4 text-slate-900" />
                        Step 2: AI Bullet Enhancer
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        Before & After
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                        <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Original Draft (Generic)
                        </div>
                        <p className="text-slate-500 italic">
                          "Responsible for customer support tickets and answering client questions."
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border-2 border-emerald-600 text-xs shadow-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                            <LuCircleCheck className="w-3 h-3" />
                            AI Improved (High Impact)
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Quantified Result
                          </span>
                        </div>
                        <p className="text-slate-900 font-medium leading-relaxed">
                          "Resolved 120+ client inquiries weekly with a 98.5% satisfaction rating, decreasing ticket resolution time by 35%."
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs">
                        Accept Improvement
                      </button>
                      <button className="py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold">
                        Regenerate
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <LuSlidersHorizontal className="w-4 h-4 text-slate-900" />
                        Step 3: Studio Customizer
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        Instant Controls
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-slate-800">Accent Colors</div>
                        <div className="flex items-center gap-2.5">
                          {["#1e3a8a", "#1e293b", "#065f46", "#9a3412", "#475569"].map(
                            (c, idx) => (
                              <div
                                key={c}
                                className={`w-7 h-7 rounded-full transition-transform ${
                                  idx === 0 ? "scale-110 ring-2 ring-slate-900 ring-offset-2" : ""
                                }`}
                                style={{ backgroundColor: c }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Single-Page Fit</div>
                          <div className="text-[11px] text-slate-500">
                            Auto-calibrates spacing so text never spills to page 2
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          Active
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 text-center py-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                      <LuFileCheck className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Ready for Applications
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                        Export your high-resolution vector PDF for job portals, or generate a private web link for recruiters.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="py-2.5 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm"
                      >
                        Download Vector PDF
                      </button>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        Copy Share Link
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Step Accordion List */}
          <div className="lg:col-span-6 space-y-3">
            {STEPS.map((item) => {
              const Icon = item.icon;
              const isActive = activeStep === item.step;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(item.step)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-white border-slate-900 shadow-md ring-1 ring-slate-900"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <span className="text-xs font-bold text-slate-400">
                          0{item.step}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-500 mt-0.5">
                        {item.tagline}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Button */}
            <div className="pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start with the 4-Step Builder</span>
                <LuArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSteps;
