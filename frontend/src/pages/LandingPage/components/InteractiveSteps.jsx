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
  LuCopy,
  LuCheck,
  LuType,
} from "react-icons/lu";

import clarityThumbnail from "../../../assets/template_images/clarity.webp";
import vanguardThumbnail from "../../../assets/template_images/vanguard.webp";
import meridianThumbnail from "../../../assets/template_images/meridian.webp";

const TEMPLATE_PREVIEWS = [
  {
    id: "clarity",
    name: "Clarity",
    badge: "2-Column Modern",
    thumbnail: clarityThumbnail,
    atsScore: "99% ATS Score",
    bestFor: "Tech & Product",
  },
  {
    id: "vanguard",
    name: "Vanguard",
    badge: "Executive Banner",
    thumbnail: vanguardThumbnail,
    atsScore: "98% ATS Score",
    bestFor: "Executive & Leadership",
  },
  {
    id: "meridian",
    name: "Meridian",
    badge: "Structured Timeline",
    thumbnail: meridianThumbnail,
    atsScore: "100% ATS Score",
    bestFor: "Engineering & Finance",
  },
];

const BULLET_EXAMPLES = [
  {
    role: "Product Designer",
    before: "Responsible for customer checkout flows and collaborated with developers to ship improvements.",
    after: "Spearheaded mobile checkout overhaul across 4 squads, lifting completed transactions by 14.2% and eliminating drop-offs for 2.4M monthly users.",
    metric: "+14.2% Conversion",
    keywords: ["checkout redesign", "cross-functional", "conversion optimization"],
  },
  {
    role: "Software Engineer",
    before: "Worked on the backend API and fixed several database performance bugs.",
    after: "Architected distributed caching layer on Redis, reducing P99 query latency from 320ms to 48ms across 18M daily API calls.",
    metric: "85% Latency Drop",
    keywords: ["distributed systems", "Redis caching", "P99 latency"],
  },
  {
    role: "Growth Marketer",
    before: "Managed Google ads campaigns and tracked weekly email newsletter signups.",
    after: "Scaled paid acquisition budget from $15K to $85K/mo at a 3.8x ROAS, onboarding 42,000 verified trial users in Q3.",
    metric: "3.8x ROAS",
    keywords: ["paid acquisition", "ROAS", "funnel scaling"],
  },
];

const STEPS = [
  {
    step: 1,
    id: "template",
    icon: LuLayoutTemplate,
    title: "Pick an ATS-Engineered Layout",
    tagline: "Single-column parsing with zero graphical traps",
    description:
      "Choose from precision-tested templates structured specifically so applicant tracking systems read your headers, work history, and contact details without scrambling words.",
    benefit: "Tested against greenhouse, Lever, and Workday parser engines.",
  },
  {
    step: 2,
    id: "content",
    icon: LuSparkles,
    title: "Turn Duties into Quantified Impact",
    tagline: "One-click bullet point rewrites with measurable results",
    description:
      "Replace passive job descriptions with high-leverage accomplishment statements. The assistant suggests relevant metrics, action verbs, and role-matched keywords automatically.",
    benefit: "Proven 3x higher callback rate for quantified bullet points.",
  },
  {
    step: 3,
    id: "customize",
    icon: LuSlidersHorizontal,
    title: "Calibrate Typography & Single-Page Fit",
    tagline: "Strict layout guardrails that never spill onto page two",
    description:
      "Select curated typography, adjust line heights, and activate our auto-fit guardrail that intelligently compacts vertical rhythm so your resume stays strictly on one page.",
    benefit: "Zero awkward two-line overflows on page two.",
  },
  {
    step: 4,
    id: "export",
    icon: LuDownload,
    title: "Export Vector PDF & Recruiter Link",
    tagline: "1200 DPI vector rendering ready for online applications",
    description:
      "Generate clean vector PDFs with selectable, selectable text layers that human recruiters and automated parsers love, plus private view links with instant engagement stats.",
    benefit: "100% crisp printing and automated portal extraction.",
  },
];

const InteractiveSteps = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("clarity");
  const [activeBulletIndex, setActiveBulletIndex] = useState(0);
  const [selectedFont, setSelectedFont] = useState("sans");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentTemplate =
    TEMPLATE_PREVIEWS.find((t) => t.id === selectedTemplate) ||
    TEMPLATE_PREVIEWS[0];

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 relative bg-[#fafafc] border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* SECTION HEADER: Restrained Editorial Craft               */}
        {/* ========================================================= */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
          <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            The Resuma Method
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Craft an ATS-proof resume in four clean steps.
          </h2>

          <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            No messy Word formatting. No guessing what hiring software expects.
            Move from a blank page to an interview-ready application in minutes.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 2-COLUMN WORKFLOW: Interactive Studio Simulator          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: Live Interactive Studio Canvas */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl bg-gradient-to-b from-white to-slate-50/40 border border-slate-200/90 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.07)] overflow-hidden min-h-[490px] flex flex-col justify-center p-5 sm:p-7">
              {/* Dynamic Step Visualization */}
              <div className="w-full">
                <AnimatePresence mode="wait">
                  {/* STEP 1: CRISP VECTOR RESUME SHEET WITH SUBTLE ATS SCANNER (ZERO SCRAMBLED ANTS) */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3.5"
                    >
                      {/* Segmented Layout Selector */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg gap-1">
                          {TEMPLATE_PREVIEWS.map((tmpl) => {
                            const isSelected = selectedTemplate === tmpl.id;
                            return (
                              <button
                                key={tmpl.id}
                                onClick={() => setSelectedTemplate(tmpl.id)}
                                className={`relative px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-white text-slate-950 shadow-xs font-bold"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                {tmpl.name}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span>99% ATS Parse</span>
                        </div>
                      </div>

                      {/* CRISP REAL-TYPOGRAPHY DOCUMENT SHEET (SHARP UNROUNDED CORNERS) */}
                      <div className="relative bg-white border border-slate-200 shadow-sm overflow-hidden h-[310px]">
                        {/* Subtle Animated ATS Scanner Beam */}
                        <motion.div
                          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none z-20"
                          animate={{ top: ["3%", "94%", "3%"] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="w-full h-8 -mt-4 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent blur-xs pointer-events-none" />
                        </motion.div>

                        {/* TEMPLATE A: CLARITY (2-Column Modern) */}
                        {selectedTemplate === "clarity" && (
                          <motion.div
                            key="clarity-doc"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 sm:p-5"
                          >
                            {/* Document Header */}
                            <div className="border-b border-slate-200/80 pb-2.5 mb-3">
                              <div className="text-sm sm:text-base font-bold text-slate-950 tracking-tight">
                                Elena Vance
                              </div>
                              <div className="text-[11px] text-slate-600 mt-0.5">
                                Senior Product Designer · San Francisco, CA · elena.design · (415) 890-2134
                              </div>
                            </div>

                            {/* 2-Column Split */}
                            <div className="grid grid-cols-12 gap-3 text-[10px]">
                              {/* Left Column: Skills & Education */}
                              <div className="col-span-4 pr-2 border-r border-slate-100 space-y-2.5">
                                <div>
                                  <div className="font-bold uppercase tracking-wider text-slate-900 mb-1 text-[9px]">
                                    Core Skills
                                  </div>
                                  <div className="space-y-0.5 text-slate-600 leading-tight">
                                    <div>Design Systems</div>
                                    <div>Figma & Prototyping</div>
                                    <div>WCAG 2.2 Standards</div>
                                    <div>React & TypeScript</div>
                                  </div>
                                </div>

                                <div>
                                  <div className="font-bold uppercase tracking-wider text-slate-900 mb-1 text-[9px]">
                                    Education
                                  </div>
                                  <div className="text-slate-700 font-semibold leading-tight">
                                    B.S. Interaction Design
                                  </div>
                                  <div className="text-slate-500 text-[9px]">
                                    Stanford University
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Experience */}
                              <div className="col-span-8 space-y-2.5">
                                <div>
                                  <div className="font-bold uppercase tracking-wider text-slate-900 mb-1 text-[9px]">
                                    Experience
                                  </div>

                                  <div className="space-y-2">
                                    <div>
                                      <div className="flex items-center justify-between text-slate-900 font-bold">
                                        <span>Lead UX Architect · Stripe</span>
                                        <span className="text-[9px] text-slate-400 font-normal">2021 — Present</span>
                                      </div>
                                      <ul className="list-disc pl-3 text-slate-600 mt-0.5 space-y-0.5 leading-snug">
                                        <li>Overhauled global checkout funnel, increasing completion rate by <strong className="text-slate-900 font-semibold">+14.2%</strong>.</li>
                                        <li>Architected tokenized component library adopted across 180+ frontend engineers.</li>
                                      </ul>
                                    </div>

                                    <div>
                                      <div className="flex items-center justify-between text-slate-900 font-bold">
                                        <span>Senior Product Designer · Figma</span>
                                        <span className="text-[9px] text-slate-400 font-normal">2018 — 2021</span>
                                      </div>
                                      <ul className="list-disc pl-3 text-slate-600 mt-0.5 space-y-0.5 leading-snug">
                                        <li>Redesigned real-time collaborative commenting canvas, reducing input lag by <strong className="text-slate-900 font-semibold">40%</strong>.</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* TEMPLATE B: VANGUARD (Executive Banner) */}
                        {selectedTemplate === "vanguard" && (
                          <motion.div
                            key="vanguard-doc"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Executive Top Banner */}
                            <div className="bg-slate-900 text-white p-3.5 sm:p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm sm:text-base font-bold tracking-tight">
                                    Elena Vance
                                  </div>
                                  <div className="text-[10px] text-slate-300 mt-0.5">
                                    Executive Product Director · Systems & Operations
                                  </div>
                                </div>
                                <div className="text-[9px] text-slate-400 text-right space-y-0.5">
                                  <div>San Francisco, CA</div>
                                  <div>elena@vance.io</div>
                                </div>
                              </div>
                            </div>

                            {/* Vanguard 2-Column Body */}
                            <div className="grid grid-cols-12 text-[10px]">
                              {/* Left Main (65%) */}
                              <div className="col-span-8 p-3.5 space-y-2 border-r border-slate-100">
                                <div>
                                  <div className="font-bold uppercase tracking-wider text-slate-900 mb-0.5 text-[8.5px]">
                                    Executive Summary
                                  </div>
                                  <p className="text-slate-600 leading-snug">
                                    10+ years architecting enterprise product systems. Proven track record driving ARR expansion through high-velocity self-serve onboarding.
                                  </p>
                                </div>

                                <div className="pt-1.5 border-t border-slate-100">
                                  <div className="font-bold uppercase tracking-wider text-slate-900 mb-1 text-[8.5px]">
                                    Experience
                                  </div>
                                  <div className="space-y-1.5">
                                    <div>
                                      <div className="flex items-center justify-between font-bold text-slate-900">
                                        <span>Head of Product Experience · Stripe</span>
                                        <span className="text-[8.5px] text-slate-400 font-normal">2020 — Pres.</span>
                                      </div>
                                      <p className="text-slate-600 leading-snug mt-0.5">
                                        Directed 18-person cross-functional division, driving $48M in net new ARR and cutting churn by 22%.
                                      </p>
                                    </div>
                                    <div>
                                      <div className="flex items-center justify-between font-bold text-slate-900">
                                        <span>Senior Product Lead · Figma</span>
                                        <span className="text-[8.5px] text-slate-400 font-normal">2017 — 2020</span>
                                      </div>
                                      <p className="text-slate-600 leading-snug mt-0.5">
                                        Scaled self-serve customer onboarding from 40K to 650K teams worldwide.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Tinted Sidebar (35%) */}
                              <div className="col-span-4 bg-slate-50 p-3 space-y-2.5">
                                <div>
                                  <div className="font-bold uppercase tracking-wider text-slate-900 mb-1 text-[8px]">
                                    Core Competencies
                                  </div>
                                  <div className="space-y-1 text-slate-600 text-[8.5px]">
                                    <div>• Enterprise Architecture</div>
                                    <div>• P&L & Budgeting</div>
                                    <div>• Cross-Functional Org</div>
                                    <div>• Agile Roadmapping</div>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-200">
                                  <div className="font-bold uppercase tracking-wider text-slate-900 mb-0.5 text-[8px]">
                                    Education
                                  </div>
                                  <div className="text-[8.5px] font-semibold text-slate-900">Stanford University</div>
                                  <div className="text-[8px] text-slate-500">M.S. Management Systems</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* TEMPLATE C: MERIDIAN (Structured Timeline) */}
                        {selectedTemplate === "meridian" && (
                          <motion.div
                            key="meridian-doc"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex"
                          >
                            {/* Meridian Left Full-Height Solid Colored Spine */}
                            <div className="w-20 sm:w-24 shrink-0 bg-[#0d2f5a] text-white p-3 pt-6 flex flex-col justify-between text-right select-none">
                              <div className="space-y-6 text-[8.5px] font-bold">
                                <div>
                                  <span className="opacity-95 block">2021 —</span>
                                  <span className="opacity-75 font-normal">Present</span>
                                </div>
                                <div className="pt-2">
                                  <span className="opacity-95 block">2018 —</span>
                                  <span className="opacity-75 font-normal">2021</span>
                                </div>
                                <div className="pt-2">
                                  <span className="opacity-95 block">2014 —</span>
                                  <span className="opacity-75 font-normal">2018</span>
                                </div>
                              </div>
                              <div className="text-[7.5px] opacity-70 tracking-widest uppercase">
                                Meridian
                              </div>
                            </div>

                            {/* Meridian Main Body with Connected Timeline Nodes */}
                            <div className="flex-1 p-3.5 sm:p-4 space-y-2.5 text-[10px]">
                              {/* Header */}
                              <div className="pb-2 border-b border-slate-200">
                                <h3 className="text-sm sm:text-base font-bold text-[#0d2f5a] tracking-tight">
                                  Elena Vance
                                </h3>
                                <p className="text-[9.5px] font-semibold text-slate-700">
                                  Staff Interaction Architect · Systems & Motion
                                </p>
                                <p className="text-[8.5px] text-slate-500 mt-0.5">
                                  San Francisco, CA · elena.systems · (415) 890-2134
                                </p>
                              </div>

                              {/* Timeline Content */}
                              <div className="relative pl-3 border-l-2 border-slate-200 space-y-3.5 pt-1">
                                {/* Timeline Node 1 */}
                                <div className="relative">
                                  <span className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-[#0d2f5a] ring-2 ring-white" />
                                  <div className="font-bold text-slate-900 text-[10px]">
                                    Staff Interaction Architect — Stripe
                                  </div>
                                  <p className="text-slate-600 leading-snug mt-0.5 text-[9px]">
                                    Standardized checkout component contracts across web and native clients, lifting mobile conversion by 14.2%.
                                  </p>
                                </div>

                                {/* Timeline Node 2 */}
                                <div className="relative">
                                  <span className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-[#0d2f5a] ring-2 ring-white" />
                                  <div className="font-bold text-slate-900 text-[10px]">
                                    Senior UX Specialist — Figma
                                  </div>
                                  <p className="text-slate-600 leading-snug mt-0.5 text-[9px]">
                                    Authored core accessibility compliance baseline achieving 100% WCAG AA adherence across 32 canvas tools.
                                  </p>
                                </div>

                                {/* Timeline Node 3 */}
                                <div className="relative">
                                  <span className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-[#0d2f5a] ring-2 ring-white" />
                                  <div className="font-bold text-slate-900 text-[10px]">
                                    Product Engineer — Linear
                                  </div>
                                  <p className="text-slate-600 leading-snug mt-0.5 text-[9px]">
                                    Engineered keyboard-first shortcuts engine used across desktop applications with &lt;16ms response rate.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Bottom Context Pill (Locked Height, Zero Wrapping Layout Shift) */}
                      <div className="h-10 px-3 bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs overflow-hidden">
                        <div className="text-slate-600 font-medium truncate mr-2">
                          Layout: <strong className="text-slate-900">{currentTemplate.name}</strong> · {currentTemplate.bestFor}
                        </div>
                        <div className="font-bold text-slate-900 whitespace-nowrap shrink-0 text-[11px] sm:text-xs">
                          Standard 0.75" Margins
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: AI BULLET REWRITER WORKBENCH */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3.5"
                    >
                      {/* Role Context Selector */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {BULLET_EXAMPLES.map((ex, idx) => (
                          <button
                            key={ex.role}
                            onClick={() => setActiveBulletIndex(idx)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                              activeBulletIndex === idx
                                ? "bg-slate-900 text-white shadow-xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                          >
                            {ex.role}
                          </button>
                        ))}
                      </div>

                      {/* Before (Weak Draft) */}
                      <div className="p-3 bg-slate-50 border border-slate-200/90 text-xs min-h-[72px]">
                        <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 flex items-center justify-between">
                          <span>Raw Draft (Passive)</span>
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[9px] font-semibold">
                            Lacks metrics
                          </span>
                        </div>
                        <p className="text-slate-500 italic">
                          "{BULLET_EXAMPLES[activeBulletIndex].before}"
                        </p>
                      </div>

                      {/* After (AI Quantified Rewrite with Subtle Sweep) */}
                      <div className="relative overflow-hidden p-3.5 bg-white border-2 border-emerald-600 shadow-sm text-xs min-h-[148px]">
                        {/* Subtle Shimmer Sweep */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent -skew-x-12 pointer-events-none"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                        />

                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                            <LuCircleCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Optimized Statement
                          </span>
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {BULLET_EXAMPLES[activeBulletIndex].metric}
                          </span>
                        </div>
                        <p className="text-slate-900 font-medium leading-relaxed">
                          "{BULLET_EXAMPLES[activeBulletIndex].after}"
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-medium">
                            Keywords:
                          </span>
                          {BULLET_EXAMPLES[activeBulletIndex].keywords.map(
                            (kw) => (
                              <span
                                key={kw}
                                className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                              >
                                {kw}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: STUDIO CUSTOMIZER CONTROLS */}
                  {activeStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3.5"
                    >
                      {/* Typography Palette */}
                      <div className="p-3.5 bg-slate-50 border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <LuType className="w-3.5 h-3.5 text-slate-600" />
                            Typography Family
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Unicode Safe
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "sans", label: "Inter Display", font: "font-sans" },
                            { id: "serif", label: "Source Serif", font: "font-serif" },
                            { id: "mono", label: "JetBrains Mono", font: "font-mono" },
                          ].map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setSelectedFont(f.id)}
                              className={`p-2 text-center border text-xs transition-all cursor-pointer ${
                                selectedFont === f.id
                                  ? "bg-white border-slate-950 shadow-xs font-bold text-slate-950 ring-1 ring-slate-950"
                                  : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                              }`}
                            >
                              <div className={`text-sm ${f.font}`}>Aa</div>
                              <div className="text-[10px] mt-0.5 truncate">
                                {f.label}
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Real-time Dynamic Font Preview */}
                        <div className="p-2.5 bg-white border border-slate-200 text-xs">
                          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                            Live Font Render
                          </div>
                          <p className={`text-slate-800 leading-snug transition-all ${
                            selectedFont === "serif" ? "font-serif" : selectedFont === "mono" ? "font-mono" : "font-sans"
                          }`}>
                            "Architected distributed checkout systems with zero visual shifts and 99.8% ATS readability."
                          </p>
                        </div>
                      </div>

                      {/* Single Page Fit Guardrail with Animated Capacity Gauge */}
                      <div className="p-3.5 bg-white border border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>Smart Single-Page Fit</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Auto-balances line heights to prevent awkward page 2 spillage
                            </div>
                          </div>

                          <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 text-right">
                            <div>Page 1 of 1</div>
                            <div className="text-[9px] font-semibold text-emerald-700">
                              94% Balanced
                            </div>
                          </div>
                        </div>

                        {/* Animated Capacity Progress Bar */}
                        <div className="w-full bg-slate-100 h-1.5 overflow-hidden rounded-full mt-2">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "94%" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-emerald-600 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: VECTOR EXPORT & SHARING */}
                  {activeStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 text-center py-2"
                    >
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center mx-auto shadow-md"
                      >
                        <LuFileCheck className="w-6 h-6 text-emerald-400" />
                      </motion.div>

                      <div>
                        <h3 className="text-base font-bold text-slate-950">
                          Ready for Production Applications
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                          Vector PDF format guarantees razor-sharp typography at any zoom level, while your private web link provides instant recruiter read tracking.
                        </p>
                      </div>

                      {/* Export Format Pills */}
                      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto pt-1">
                        <div className="p-2 bg-slate-50 border border-slate-200 text-center">
                          <div className="text-xs font-bold text-slate-900">PDF/A</div>
                          <div className="text-[10px] text-slate-500">1200 DPI Vector</div>
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-200 text-center">
                          <div className="text-xs font-bold text-slate-900">DOCX</div>
                          <div className="text-[10px] text-slate-500">MS Word Match</div>
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-200 text-center">
                          <div className="text-xs font-bold text-slate-900">Web Link</div>
                          <div className="text-[10px] text-slate-500">Private URL</div>
                        </div>
                      </div>

                      {/* Interactive Copy Recruiter Link */}
                      <div className="pt-2 flex items-center justify-center gap-2">
                        <button
                          onClick={handleCopyLink}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          {copiedLink ? (
                            <>
                              <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">
                                Link Copied!
                              </span>
                            </>
                          ) : (
                            <>
                              <LuCopy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy Recruiter Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT: High-Craft Interactive Stepper Accordion */}
          <div className="lg:col-span-6 space-y-3">
            {STEPS.map((item) => {
              const Icon = item.icon;
              const isActive = activeStep === item.step;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(item.step)}
                  className={`group rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                    isActive
                      ? "bg-white border-slate-950 shadow-md ring-1 ring-slate-950"
                      : "bg-white/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3.5">
                      {/* Numeric Badge */}
                      <div
                        className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                          isActive
                            ? "bg-slate-950 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        }`}
                      >
                        0{item.step}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-slate-950 leading-snug">
                            {item.title}
                          </h3>
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive ? "text-slate-900" : "text-slate-400"
                            }`}
                          />
                        </div>

                        <div className="text-xs font-semibold text-slate-500 mt-0.5">
                          {item.tagline}
                        </div>

                        {/* Expandable Content for Active Step */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs text-slate-600 leading-relaxed mt-2.5 pt-2.5 border-t border-slate-100">
                                {item.description}
                              </p>
                              <div className="mt-2 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>{item.benefit}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Action Strip */}
            <div className="pt-3 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                No credit card required. Free tier available.
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Launch 4-Step Builder</span>
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
