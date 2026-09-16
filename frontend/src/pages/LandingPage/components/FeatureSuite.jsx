import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSparkles,
  LuMail,
  LuShare2,
  LuPrinter,
  LuCheck,
  LuArrowRight,
  LuQrCode,
  LuCopy,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const FEATURES = [
  {
    id: "ai-writer",
    icon: LuSparkles,
    label: "Bullet Assistant",
    title: "Write Stronger Bullets Without the Stress",
    subtitle:
      "Transform basic job descriptions into clear, quantifiable achievements that catch a hiring manager's eye in under 6 seconds.",
    highlights: [
      "Suggests strong action verbs like 'Spearheaded', 'Optimized', and 'Delivered'",
      "Adds realistic metric placeholders so your impact stands out",
      "Identifies passive phrasing and suggests direct, active voice",
    ],
    demoType: "ai-writer",
  },
  {
    id: "cover-letter",
    icon: LuMail,
    label: "Matching Cover Letter",
    title: "1-Click Matching Cover Letters",
    subtitle:
      "Send a unified application package. Resuma AI creates a cover letter with the identical header, font, and color theme as your resume.",
    highlights: [
      "Automatically synchronizes with your resume's style and typography",
      "Customizable greeting, intro, core qualifications, and sign-off",
      "Download together as a synchronized application package",
    ],
    demoType: "cover-letter",
  },
  {
    id: "share-link",
    icon: LuShare2,
    label: "Web Link & QR Code",
    title: "Share Your Resume Directly Online",
    subtitle:
      "Create a private, responsive web link to send in emails or add to LinkedIn. Recruiters can view your resume instantly on mobile.",
    highlights: [
      "Dedicated clean URL for your resume (e.g. resuma.ai/p/your-name)",
      "Printable vector QR code for career fairs and networking cards",
      "Toggle link privacy on or off anytime with one click",
    ],
    demoType: "share-link",
  },
  {
    id: "vector-pdf",
    icon: LuPrinter,
    label: "Vector Print PDF",
    title: "Crisp, Professional Print Quality",
    subtitle:
      "Say goodbye to blurry text and misaligned margins. Resuma AI renders true vector PDFs so your resume looks sharp at any zoom level.",
    highlights: [
      "100% vector typography (never an image capture)",
      "Tested on both A4 and US Letter standard paper sizes",
      "Guaranteed text selectability for search and copy-pasting",
    ],
    demoType: "vector-pdf",
  },
];

const FeatureSuite = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const current = FEATURES[activeTab];

  return (
    <section id="features" className="py-24 relative bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <span>Integrated Tools</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Everything you need for your job search.
          </h2>

          <p className="text-base text-slate-600">
            More than just a template editor. Built-in tools that help you write,
            match, and send applications faster.
          </p>

          {/* Feature Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === index
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{feat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm">
          {/* Left Column: Feature Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-bold">
              <span>Capability 0{activeTab + 1} of 04</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {current.subtitle}
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {current.highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <LuCheck className="w-3 h-3" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>Try this tool free</span>
                <LuArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Feature Demo Simulation */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {current.demoType === "ai-writer" && (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <LuSparkles className="w-4 h-4 text-slate-700" />
                        AI Bullet Rewriter
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Active
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <span className="font-bold text-slate-800">Role:</span> Senior Marketing Specialist
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-slate-800">
                        Recommended Bullet:
                      </div>
                      <p className="text-xs text-slate-900 leading-relaxed font-medium">
                        "Directed multi-channel acquisition campaigns across search and social, driving a 45% increase in qualified leads while reducing cost-per-lead by $12."
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>✓ Action verb &nbsp;•&nbsp; ✓ Quantified metrics &nbsp;•&nbsp; ✓ Scannable</span>
                    </div>
                  </div>
                )}

                {current.demoType === "cover-letter" && (
                  <div className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-black text-slate-900">Alex Morgan</h4>
                        <p className="text-[11px] font-semibold text-slate-500">
                          alex@workmail.com · (555) 234-5678
                        </p>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        Matching Header & Fonts
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                      <p className="font-bold">Dear Hiring Team,</p>
                      <p>
                        I am writing to express my strong interest in the Senior Solutions Architect role. With over eight years designing fault-tolerant cloud systems...
                      </p>
                      <p className="text-slate-400 italic text-[11px]">
                        [Typography and color scheme synchronized with your resume]
                      </p>
                    </div>
                  </div>
                )}

                {current.demoType === "share-link" && (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <LuShare2 className="w-4 h-4 text-slate-700" />
                        Private Recruiter Web Link
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Live Link
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-700 truncate">
                        https://resuma.ai/p/alex-morgan
                      </span>
                      <button className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-[11px] flex items-center gap-1">
                        <LuCopy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-white p-1 flex items-center justify-center border border-slate-200 shrink-0">
                        <LuQrCode className="w-12 h-12 text-slate-900" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 mb-0.5">
                          Downloadable Vector QR Code
                        </div>
                        <div className="text-[11px] text-slate-500 leading-relaxed">
                          Add this QR code to your printed resume or business card so recruiters can view your profile on mobile with one scan.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {current.demoType === "vector-pdf" && (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mx-auto">
                      <LuPrinter className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">
                        1200 DPI Vector PDF Engine
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Unlike builders that export rasterized screenshots, Resuma AI prints genuine vector text directly to PDF.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="text-slate-900 font-bold mb-0.5">✓ US Letter</div>
                        <div className="text-[10px] text-slate-500">8.5 × 11 in (North America)</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="text-slate-900 font-bold mb-0.5">✓ Standard A4</div>
                        <div className="text-[10px] text-slate-500">210 × 297 mm (International)</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSuite;
