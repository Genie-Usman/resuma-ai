import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuArrowRight,
  LuStar,
  LuPalette,
  LuType,
  LuLayers,
  LuBriefcase,
  LuGraduationCap,
  LuUser,
  LuSparkles,
  LuCode,
  LuCheck,
  LuRotateCcw,
} from "react-icons/lu";
import { loadGoogleFont } from "../../../utils/googleFonts";

const COLOR_SWATCHES = [
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Charcoal", hex: "#1e293b" },
  { name: "Forest", hex: "#065f46" },
  { name: "Amber", hex: "#9a3412" },
  { name: "Slate", hex: "#475569" },
];

const FONT_OPTIONS = [
  { label: "Clean Sans", name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif" },
  { label: "Classic Serif", name: "Merriweather", family: "'Merriweather', Georgia, serif" },
  { label: "Technical", name: "Space Mono", family: "'Space Mono', monospace" },
];

// Fixed compact document dimensions for sharp HD physical paper rendering
const SHEET_WIDTH = 280;
const SHEET_HEIGHT = 396;

const HeroSection = () => {
  const navigate = useNavigate();

  // Active Selected Resume (Index 0: Clarity, 1: Vanguard, 2: Meridian)
  const [activeIndex, setActiveIndex] = useState(0);

  // Customizer Controls (Applied across all 3 resumes)
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);

  // Preload curated Google Fonts on mount
  useEffect(() => {
    loadGoogleFont("Plus Jakarta Sans");
    loadGoogleFont("Merriweather");
    loadGoogleFont("Space Mono");
  }, []);

  const templateKeys = ["clarity", "vanguard", "meridian"];
  const activeTemplateId = templateKeys[activeIndex];

  const handleStart = () => {
    navigate("/dashboard", { state: { preferredTemplate: activeTemplateId } });
  };

  // 3D Stacking and Rotation Coordinates
  const getCardTransform = (index) => {
    const diff = (index - activeIndex + 3) % 3;

    if (diff === 0) {
      // Front and Center
      return {
        zIndex: 30,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        cursor: "default",
      };
    } else if (diff === 1) {
      // Behind to the Right
      return {
        zIndex: 20,
        x: 52,
        y: -10,
        rotate: 5.5,
        scale: 0.93,
        opacity: 0.88,
        cursor: "pointer",
      };
    } else {
      // Behind to the Left
      return {
        zIndex: 10,
        x: -52,
        y: -10,
        rotate: -5.5,
        scale: 0.93,
        opacity: 0.88,
        cursor: "pointer",
      };
    }
  };

  return (
    <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
      {/* Subtle Studio Draft Grid Background for Dimensional Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Lively, High-Converting Hero Value Prop      */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* Powerful Editorial Headline with Clean 2-Line Staggered Animation */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.05,
                  },
                },
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]"
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="block"
              >
                Make yourself look
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800"
              >
                exceptional on paper.
              </motion.span>
            </motion.h1>

            {/* Clear, Human Copy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Craft an interview-ready resume in minutes with clean,
              recruiter-tested templates and clear bullet suggestions that pass
              company hiring software.
            </p>

            {/* Tactile Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.025, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/20 hover:shadow-lg hover:shadow-slate-900/25 transition-all cursor-pointer tracking-tight"
              >
                <span>Create My Resume Free</span>
                <LuArrowRight className="w-4 h-4" />
              </motion.button>

              <Link
                to="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs"
              >
                <span>Explore Templates</span>
                <LuArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Candidate Trust Rating */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-x-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <LuStar key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                <span>4.9 / 5.0</span>
              </div>
              <span>•</span>
              <span>from 14,000+ candidate reviews</span>
            </div>

            {/* Social Proof Badges: "Candidates interviewed at" */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-slate-400">
              <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider shrink-0">
                Candidates hired at
              </span>
              <div className="flex items-center gap-4 sm:gap-5 font-bold text-slate-600 text-[13px] tracking-tight">
                <span className="hover:text-slate-900 transition-colors">Google</span>
                <span>•</span>
                <span className="hover:text-slate-900 transition-colors">Stripe</span>
                <span>•</span>
                <span className="hover:text-slate-900 transition-colors">Airbnb</span>
                <span>•</span>
                <span className="hover:text-slate-900 transition-colors">Amazon</span>
                <span>•</span>
                <span className="hover:text-slate-900 transition-colors">Meta</span>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Lively 3D Rotating Stack with Ambient Aura  */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex flex-col items-center"
          >
            {/* Dynamic Luminous Ambient Aura (Tints smoothly with active palette) */}
            <div
              className="absolute -top-12 -bottom-8 left-1/2 -translate-x-1/2 w-[340px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: selectedColor.hex }}
            />

            {/* Hardware-Accelerated 120fps Compositor Animation Style */}
            <style>{`
              @keyframes heroSilkyFloat {
                0%, 100% {
                  transform: translate3d(0, 0, 0);
                }
                50% {
                  transform: translate3d(0, -8px, 0);
                }
              }
              .hero-gpu-float {
                animation: heroSilkyFloat 7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
                will-change: transform;
                transform: translateZ(0);
                backface-visibility: hidden;
              }
            `}</style>

            {/* Dedicated GPU Compositor Layer (Zero lag, zero font jitter) */}
            <div
              className="hero-gpu-float relative flex items-center justify-center"
              style={{
                width: "100%",
                maxWidth: "420px",
                height: `${SHEET_HEIGHT + 28}px`,
              }}
            >
              {/* Floating Live Badge 1: Top-Right (ATS Verification) */}
              <motion.div
                initial={{ opacity: 0, y: 8, rotate: 3 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="absolute -top-2 -right-3 z-40 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/90 shadow-lg shadow-slate-900/5 flex items-center gap-2 text-[11px] font-bold text-slate-800 pointer-events-none select-none"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>98% ATS Pass Rate</span>
              </motion.div>

              {/* Floating Live Badge 2: Bottom-Left (Clean placement, no dock overlap) */}
              <motion.div
                initial={{ opacity: 0, y: -8, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="absolute bottom-6 -left-5 z-40 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/90 shadow-lg shadow-slate-900/5 flex items-center gap-1.5 text-[11px] font-bold text-slate-800 pointer-events-none select-none"
              >
                <span className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[9px]">
                  <LuCheck className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>Recruiter Approved</span>
              </motion.div>

              {/* ---------------- CARD 0: CLARITY LAYOUT (Taylor Morgan) ---------------- */}
              <motion.div
                onClick={() => {
                  if (activeIndex !== 0) setActiveIndex(0);
                }}
                animate={getCardTransform(0)}
                whileHover={activeIndex === 0 ? { y: -4, transition: { duration: 0.2 } } : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                style={{
                  width: `${SHEET_WIDTH}px`,
                  height: `${SHEET_HEIGHT}px`,
                  position: "absolute",
                  top: 10,
                  fontFamily: selectedFont.family,
                }}
                className="bg-white rounded-none ring-1 ring-slate-300/80 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col justify-between p-3.5 select-none transition-shadow"
              >
                <div>
                  {/* Clarity Header */}
                  <div>
                    <h2
                      className="text-[15px] font-black tracking-tight leading-none transition-colors"
                      style={{ color: selectedColor.hex }}
                    >
                      Taylor Morgan
                    </h2>
                    <p className="text-[9px] font-bold text-slate-700 mt-0.5">
                      IT Solutions Architect
                    </p>
                    <p className="text-[7px] leading-[1.3] text-slate-600 mt-1">
                      Professional with 8+ years specializing in enterprise distributed systems, cloud architecture, and multi-region microservices.
                    </p>
                  </div>

                  {/* Clarity 2-Column Split */}
                  <div className="grid grid-cols-12 gap-2.5 pt-2 border-t border-slate-200 mt-1.5">
                    {/* Left Column: Personal Info, Skills, Software */}
                    <div className="col-span-5 space-y-2">
                      <div>
                        <div className="flex items-center gap-1 text-[7px] font-bold text-slate-900 mb-0.5">
                          <span className="w-3 h-3 rounded-full bg-slate-800 text-white flex items-center justify-center text-[5.5px]">
                            <LuUser className="w-2 h-2" />
                          </span>
                          <span>Personal Info</span>
                        </div>
                        <div className="text-[6.5px] text-slate-600 space-y-0.5 pl-4">
                          <div>Portland, OR</div>
                          <div>+1 503-555-0192</div>
                          <div className="truncate">t.morgan@workmail.com</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-[7px] font-bold text-slate-900 mb-0.5">
                          <span className="w-3 h-3 rounded-full bg-slate-800 text-white flex items-center justify-center text-[5.5px]">
                            <LuSparkles className="w-2 h-2" />
                          </span>
                          <span>Key Skills</span>
                        </div>
                        <div className="text-[6.5px] text-slate-600 space-y-0.5 pl-4">
                          <div>Cloud Architecture</div>
                          <div>Kubernetes & Docker</div>
                          <div>Go & Python Systems</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-[7px] font-bold text-slate-900 mb-0.5">
                          <span className="w-3 h-3 rounded-full bg-slate-800 text-white flex items-center justify-center text-[5.5px]">
                            <LuCode className="w-2 h-2" />
                          </span>
                          <span>Software</span>
                        </div>
                        <div className="text-[6.5px] text-slate-600 space-y-0.5 pl-4">
                          <div className="flex items-center justify-between">
                            <span>AWS Infra</span>
                            <span className="text-[7px] tracking-widest text-slate-800 font-bold">•••••</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>PostgreSQL</span>
                            <span className="text-[7px] tracking-widest text-slate-800 font-bold">••••○</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Experience & Education */}
                    <div className="col-span-7 space-y-2 border-l border-slate-100 pl-2">
                      <div>
                        <div className="flex items-center gap-1 text-[7.5px] font-bold text-slate-900 mb-1">
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[6px]">
                            <LuBriefcase className="w-2 h-2" />
                          </span>
                          <span>Experience</span>
                        </div>

                        <div className="space-y-1.5 pl-1">
                          <div>
                            <div className="flex items-baseline justify-between text-[7px] font-bold text-slate-900 leading-tight">
                              <span>Lead Solutions Architect</span>
                              <span className="text-[6px] text-slate-400 font-normal">2022 - Pres.</span>
                            </div>
                            <div className="text-[6.5px] italic text-slate-600">Stripe Labs · SF</div>
                            <p className="text-[6.5px] leading-[1.25] text-slate-600 mt-0.5">
                              • Oversaw multi-region notification engine for 2.5M concurrent users.
                            </p>
                            <p className="text-[6.5px] leading-[1.25] text-slate-600">
                              • Reduced cloud compute expenditure by 34% via automated load balancing.
                            </p>
                          </div>

                          <div>
                            <div className="flex items-baseline justify-between text-[7px] font-bold text-slate-900 leading-tight">
                              <span>Senior Systems Engineer</span>
                              <span className="text-[6px] text-slate-400 font-normal">2019 - 2022</span>
                            </div>
                            <div className="text-[6.5px] italic text-slate-600">Cloudflare · SF</div>
                            <p className="text-[6.5px] leading-[1.25] text-slate-600 mt-0.5">
                              • Engineered API gateways handling 120k req/s with sub-5ms latency.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[7px] font-bold text-slate-900 mb-0.5">
                          <span className="w-3 h-3 rounded-full bg-slate-800 text-white flex items-center justify-center text-[5.5px]">
                            <LuGraduationCap className="w-2 h-2" />
                          </span>
                          <span>Education</span>
                        </div>
                        <div className="pl-1">
                          <div className="text-[6.5px] font-bold text-slate-800 leading-tight">
                            B.S. Computer Science · UC Berkeley
                          </div>
                          <div className="text-[6px] text-slate-500">Graduated Magna Cum Laude · 3.89 GPA</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar Stamp */}
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[7px] text-slate-400">
                  <span className="font-semibold text-slate-600">Clarity Template</span>
                  <span>100% Vector Quality</span>
                </div>
              </motion.div>

              {/* ---------------- CARD 1: VANGUARD LAYOUT (Jordan Reed) ---------------- */}
              <motion.div
                onClick={() => {
                  if (activeIndex !== 1) setActiveIndex(1);
                }}
                animate={getCardTransform(1)}
                whileHover={activeIndex === 1 ? { y: -4, transition: { duration: 0.2 } } : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                style={{
                  width: `${SHEET_WIDTH}px`,
                  height: `${SHEET_HEIGHT}px`,
                  position: "absolute",
                  top: 10,
                  fontFamily: selectedFont.family,
                }}
                className="bg-white rounded-none ring-1 ring-slate-300/80 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col justify-between select-none transition-shadow"
              >
                <div>
                  {/* Vanguard Full-Width Header Banner */}
                  <div
                    className="px-3.5 py-3 text-white transition-colors duration-200"
                    style={{ backgroundColor: selectedColor.hex }}
                  >
                    <h2 className="text-[15px] font-black tracking-tight leading-none text-white">
                      Jordan Reed
                    </h2>
                    <p
                      className="text-[9.5px] font-bold mt-0.5 tracking-wide"
                      style={{ color: "#ffffff" }}
                    >
                      IT Project Director
                    </p>
                  </div>

                  {/* Vanguard 2-Column Body */}
                  <div className="grid grid-cols-12 h-full">
                    {/* Left Main Column: Summary & Experience */}
                    <div className="col-span-8 p-3 space-y-2">
                      <p className="text-[7px] leading-[1.3] text-slate-600">
                        IT Professional with 10+ years specializing in enterprise infrastructure, cloud transformation, and cross-departmental program delivery.
                      </p>

                      <div>
                        <div className="text-[7.5px] font-bold text-slate-900 uppercase tracking-wider pb-0.5 border-b border-slate-200">
                          Experience
                        </div>

                        <div className="pt-1.5 space-y-1.5">
                          <div>
                            <div className="flex items-baseline justify-between text-[7px] font-bold text-slate-900 leading-tight">
                              <span>Senior Project Manager</span>
                              <span className="text-[6px] text-slate-400 font-normal">2021 - Pres.</span>
                            </div>
                            <div className="text-[6.5px] italic text-slate-600">FinTech Scale Corp · NY</div>
                            <p className="text-[6.5px] leading-[1.25] text-slate-600 mt-0.5">
                              • Oversaw enterprise cloud migration for 100K+ concurrent accounts.
                            </p>
                            <p className="text-[6.5px] leading-[1.25] text-slate-600">
                              • Reduced IT infrastructure maintenance costs by 32% within 18 months.
                            </p>
                          </div>

                          <div>
                            <div className="flex items-baseline justify-between text-[7px] font-bold text-slate-900 leading-tight">
                              <span>Junior Project Manager</span>
                              <span className="text-[6px] text-slate-400 font-normal">2017 - 2021</span>
                            </div>
                            <div className="text-[6.5px] italic text-slate-600">Datadog · NY</div>
                            <p className="text-[6.5px] leading-[1.25] text-slate-600 mt-0.5">
                              • Streamlined agile delivery cycles, cutting project latency by 25%.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Education */}
                      <div className="pt-1">
                        <div className="text-[7.5px] font-bold text-slate-900 uppercase tracking-wider pb-0.5 border-b border-slate-200">
                          Education
                        </div>
                        <div className="pt-1">
                          <div className="text-[6.5px] font-bold text-slate-900">
                            M.S. Computer Science · Columbia University
                          </div>
                          <div className="text-[6px] text-slate-500">Graduated Summa Cum Laude</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Sidebar: Personal Info & Skills */}
                    <div className="col-span-4 bg-slate-50/80 p-2.5 border-l border-slate-200/80 space-y-2">
                      <div>
                        <div className="text-[7px] font-bold text-slate-900 uppercase tracking-wider mb-0.5">
                          Personal Info
                        </div>
                        <div className="text-[6.5px] text-slate-600 space-y-0.5">
                          <div className="font-semibold text-slate-800">Address</div>
                          <div className="text-[6px]">New York, NY</div>
                          <div className="font-semibold text-slate-800 pt-0.5">Phone</div>
                          <div className="text-[6px]">+1 212-555-0143</div>
                          <div className="font-semibold text-slate-800 pt-0.5">Email</div>
                          <div className="text-[6px] truncate">j.reed@workmail.com</div>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-200/60">
                        <div className="text-[7px] font-bold text-slate-900 uppercase tracking-wider mb-0.5">
                          Skills
                        </div>
                        <div className="text-[6.5px] text-slate-600 space-y-0.5">
                          <div>• Process Improvement</div>
                          <div>• Vendor Management</div>
                          <div>• Agile Roadmapping</div>
                          <div>• Budgeting & OKRs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar Stamp */}
                <div className="p-1 px-3 border-t border-slate-100 flex items-center justify-between text-[7px] text-slate-400">
                  <span className="font-semibold text-slate-600">Vanguard Template</span>
                  <span>Executive Header</span>
                </div>
              </motion.div>

              {/* ---------------- CARD 2: MERIDIAN LAYOUT (Cameron Bailey) ---------------- */}
              <motion.div
                onClick={() => {
                  if (activeIndex !== 2) setActiveIndex(2);
                }}
                animate={getCardTransform(2)}
                whileHover={activeIndex === 2 ? { y: -4, transition: { duration: 0.2 } } : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                style={{
                  width: `${SHEET_WIDTH}px`,
                  height: `${SHEET_HEIGHT}px`,
                  position: "absolute",
                  top: 10,
                  fontFamily: selectedFont.family,
                }}
                className="bg-white rounded-none ring-1 ring-slate-300/80 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.18)] overflow-hidden flex flex-row select-none transition-shadow"
              >
                {/* Meridian Left Full-Height Solid Colored Bar */}
                <div
                  className="w-[58px] shrink-0 p-2 pt-16 flex flex-col justify-between text-right text-white transition-colors duration-200 select-none"
                  style={{ backgroundColor: selectedColor.hex }}
                >
                  <div className="space-y-6">
                    <div className="text-[6px] font-bold leading-tight opacity-95">
                      2021 -<br />present
                    </div>
                    <div className="text-[6px] font-bold leading-tight opacity-95">
                      2018 -<br />2021
                    </div>
                    <div className="text-[6px] font-bold leading-tight opacity-95 pt-2">
                      2014 -<br />2018
                    </div>
                  </div>
                  <div className="text-[5.5px] opacity-70 tracking-tight">Meridian</div>
                </div>

                {/* Meridian Main White Body */}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <div>
                      <h2
                        className="text-[15px] font-black tracking-tight leading-none transition-colors"
                        style={{ color: selectedColor.hex }}
                      >
                        Cameron Bailey
                      </h2>
                      <p className="text-[9px] font-bold text-slate-700 mt-0.5">
                        Cloud Systems Specialist
                      </p>
                      <div className="flex items-center gap-2 text-[6.5px] text-slate-500 mt-1">
                        <span>Seattle, WA</span>
                        <span>•</span>
                        <span>c.bailey@workmail.com</span>
                      </div>
                      <p className="text-[7px] leading-[1.3] text-slate-600 mt-1">
                        Specialist with 7+ years automating multi-cluster Kubernetes and cloud infrastructure with 99.99% uptime.
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-1 text-[7.5px] font-bold text-slate-900 mb-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full text-white flex items-center justify-center text-[6px]"
                          style={{ backgroundColor: selectedColor.hex }}
                        >
                          <LuBriefcase className="w-2 h-2" />
                        </span>
                        <span>Experience</span>
                      </div>

                      <div className="relative pl-3 border-l-2 ml-1 space-y-2" style={{ borderColor: selectedColor.hex }}>
                        <div className="relative">
                          <div
                            className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: selectedColor.hex }}
                          />
                          <div className="text-[7px] font-bold text-slate-900 leading-tight">
                            Senior Cloud Architect
                          </div>
                          <div className="text-[6.5px] italic text-slate-600">Amazon Web Services</div>
                          <p className="text-[6.5px] leading-[1.25] text-slate-600 mt-0.5">
                            • Designed automated failover clusters for tier-1 customer workloads.
                          </p>
                        </div>

                        <div className="relative pt-1">
                          <div
                            className="absolute -left-[16.5px] top-1.5 w-2 h-2 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: selectedColor.hex }}
                          />
                          <div className="text-[7px] font-bold text-slate-900 leading-tight">
                            Infrastructure Engineer
                          </div>
                          <div className="text-[6.5px] italic text-slate-600">Shopify · Seattle</div>
                          <p className="text-[6.5px] leading-[1.25] text-slate-600 mt-0.5">
                            • Scaled high-throughput checkout databases during peak spikes.
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center gap-1 text-[7px] font-bold text-slate-900 mb-0.5">
                          <span
                            className="w-3 h-3 rounded-full text-white flex items-center justify-center text-[5.5px]"
                            style={{ backgroundColor: selectedColor.hex }}
                          >
                            <LuGraduationCap className="w-2 h-2" />
                          </span>
                          <span>Education</span>
                        </div>
                        <div className="pl-3.5 text-[6.5px] font-bold text-slate-900">
                          B.S. Computer Engineering · Univ. of Washington
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[7px] text-slate-400">
                    <span className="font-semibold text-slate-600">Meridian Template</span>
                    <span>Timeline Spine</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* In-Hero Studio Dock with Smooth Animated Pill */}
            <div className="w-full max-w-[420px] mt-2 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md space-y-2.5">
              {/* Row 1: 3 Resumes Selector with Fluid Sliding Indicator */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 shrink-0">
                  <LuLayers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Resume Style:</span>
                </div>
                <div className="relative grid grid-cols-3 gap-1 flex-1 max-w-[280px] p-0.5 bg-slate-100/90 rounded-xl">
                  {[
                    { id: "clarity", name: "Clarity" },
                    { id: "vanguard", name: "Vanguard" },
                    { id: "meridian", name: "Meridian" },
                  ].map((item, index) => {
                    const isSelected = activeIndex === index;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveIndex(index)}
                        className={`relative z-10 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center truncate ${
                          isSelected ? "text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeDockPill"
                            className="absolute inset-0 bg-slate-900 rounded-lg -z-10 shadow-xs"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Theme Accent Colors */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 shrink-0">
                  <LuPalette className="w-3.5 h-3.5 text-slate-500" />
                  <span>Palette:</span>
                </div>
                <div className="flex items-center gap-2">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.name}
                      onClick={() => setSelectedColor(swatch)}
                      className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                        selectedColor.name === swatch.name
                          ? "scale-125 ring-2 ring-slate-900 ring-offset-2"
                          : "hover:scale-110 opacity-75 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>

              {/* Row 3: Typography Options */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 shrink-0">
                  <LuType className="w-3.5 h-3.5 text-slate-500" />
                  <span>Font:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.label}
                      onClick={() => setSelectedFont(f)}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                        selectedFont.label === f.label
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
