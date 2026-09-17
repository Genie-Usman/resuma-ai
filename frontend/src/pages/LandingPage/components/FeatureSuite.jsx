import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuSparkles,
  LuFileText,
  LuShare2,
  LuCopy,
  LuCheck,
  LuArrowRight,
  LuQrCode,
  LuGlobe,
  LuSearch,
  LuPlus,
  LuDownload,
  LuEye,
} from "react-icons/lu";

const SAMPLE_BULLETS = [
  {
    id: "healthcare",
    role: "Healthcare",
    fullName: "Registered Nurse",
    before: "Checked patient vitals, administered medications, and updated daily charts.",
    after:
      "Administered personalized care plans for 18 acute patients daily with zero medication errors, raising patient satisfaction to 96%.",
    highlights: ["18 daily patients", "Zero medication errors", "96% satisfaction"],
  },
  {
    id: "sales",
    role: "Sales",
    fullName: "Account Executive",
    before: "Called potential clients and helped the sales team reach monthly numbers.",
    after:
      "Closed $320,000 in new commercial contracts across 24 regional accounts, beating annual revenue target by 22%.",
    highlights: ["$320K new revenue", "24 client accounts", "22% over target"],
  },
  {
    id: "education",
    role: "Education",
    fullName: "High School Teacher",
    before: "Planned lessons, graded student assignments, and held regular parent meetings.",
    after:
      "Designed interactive STEM lesson plans for 85 students, raising standardized test pass rates by 19% across two terms.",
    highlights: ["85 students taught", "+19% test pass rate", "Interactive curriculum"],
  },
  {
    id: "operations",
    role: "Operations",
    fullName: "Operations Manager",
    before: "Ordered office supplies, handled vendor bills, and coordinated team schedules.",
    after:
      "Renegotiated 14 vendor contracts and restructured supply orders, saving $16,500 in annual overhead with zero delivery delays.",
    highlights: ["$16,500 saved", "14 vendor accounts", "On-time delivery"],
  },
];

const JOB_ROLES = [
  {
    id: "healthcare",
    roleName: "Healthcare",
    title: "Registered Nurse (RN)",
    skills: [
      { id: "assessment", label: "Patient Care & Assessment", defaultChecked: true },
      { id: "med", label: "Medication Administration", defaultChecked: true },
      { id: "ehr", label: "Electronic Health Records (EHR)", defaultChecked: true },
      { id: "triage", label: "Emergency Triage Protocols", defaultChecked: false },
      { id: "infection", label: "Infection Control Standards", defaultChecked: false },
    ],
  },
  {
    id: "finance",
    roleName: "Finance",
    title: "Financial Analyst",
    skills: [
      { id: "budget", label: "Budget Forecasting", defaultChecked: true },
      { id: "excel", label: "Financial Modeling", defaultChecked: true },
      { id: "reporting", label: "Executive Reporting", defaultChecked: true },
      { id: "variance", label: "Variance & Cost Analysis", defaultChecked: false },
      { id: "erp", label: "ERP Systems (SAP / NetSuite)", defaultChecked: false },
    ],
  },
  {
    id: "logistics",
    roleName: "Logistics",
    title: "Operations Coordinator",
    skills: [
      { id: "vendor", label: "Vendor Negotiations", defaultChecked: true },
      { id: "inventory", label: "Inventory Management", defaultChecked: true },
      { id: "scheduling", label: "Shift & Route Scheduling", defaultChecked: true },
      { id: "safety", label: "OSHA & Safety Compliance", defaultChecked: false },
      { id: "process", label: "Workflow Optimization", defaultChecked: false },
    ],
  },
];

const COVER_THEMES = [
  { id: "slate", label: "Charcoal Slate", hex: "#1e293b" },
  { id: "navy", label: "Classic Navy", hex: "#0f294a" },
  { id: "emerald", label: "Forest Green", hex: "#064e3b" },
  { id: "terracotta", label: "Warm Terracotta", hex: "#9a3412" },
  { id: "plum", label: "Royal Plum", hex: "#581c87" },
];

const COVER_STYLES = [
  { id: "banner", label: "Header Band" },
  { id: "bar", label: "Accent Line" },
  { id: "border", label: "Side Border" },
];

const FeatureSuite = () => {
  const navigate = useNavigate();

  // Card 1: Bullet Rewriter State
  const [activeBulletIndex, setActiveBulletIndex] = useState(0);
  const [copiedBullet, setCopiedBullet] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const activeBullet = SAMPLE_BULLETS[activeBulletIndex];

  const handleCopyBullet = () => {
    navigator.clipboard?.writeText(activeBullet.after);
    setCopiedBullet(true);
    setTimeout(() => setCopiedBullet(false), 2000);
  };

  const handleSwitchBullet = (idx) => {
    if (idx === activeBulletIndex) return;
    setIsPolishing(true);
    setActiveBulletIndex(idx);
    setTimeout(() => setIsPolishing(false), 300);
  };

  // Card 2: Job Matcher State
  const [activeJobRoleIndex, setActiveJobRoleIndex] = useState(0);
  const currentJobRole = JOB_ROLES[activeJobRoleIndex];
  const [matchedSkillIds, setMatchedSkillIds] = useState(() => {
    const initial = {};
    JOB_ROLES.forEach((role) => {
      initial[role.id] = role.skills.filter((s) => s.defaultChecked).map((s) => s.id);
    });
    return initial;
  });

  const currentRoleMatchedIds = matchedSkillIds[currentJobRole.id] || [];

  const toggleSkill = (skillId) => {
    setMatchedSkillIds((prev) => {
      const existing = prev[currentJobRole.id] || [];
      const updated = existing.includes(skillId)
        ? existing.filter((id) => id !== skillId)
        : [...existing, skillId];
      return { ...prev, [currentJobRole.id]: updated };
    });
  };

  const matchPercent = Math.round(
    (currentRoleMatchedIds.length / currentJobRole.skills.length) * 100
  );

  // Card 3: Cover Letter State
  const [selectedTheme, setSelectedTheme] = useState(COVER_THEMES[0]);
  const [selectedStyle, setSelectedStyle] = useState(COVER_STYLES[0].id);

  // Card 4: Web Share & QR State
  const [shareMode, setShareMode] = useState("link"); // "link" | "qr"
  const [copiedLink, setCopiedLink] = useState(false);
  const [mockDownloaded, setMockDownloaded] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText("https://resuma.me/marcus-vance");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleMockDownload = () => {
    setMockDownloaded(true);
    setTimeout(() => setMockDownloaded(false), 2000);
  };

  return (
    <section id="features" className="py-20 sm:py-24 relative bg-[#fafafc] border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Every tool you need to land the interview.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            Whether you work in healthcare, education, sales, finance, or operations,
            Resuma gives you the practical tools to build an application that stands out.
          </p>
        </div>

        {/* 2x2 Interactive Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* ========================================================= */}
          {/* CARD 1: Interactive Bullet Rewriter                       */}
          {/* ========================================================= */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-7 flex flex-col justify-between select-none">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
                    <LuSparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                      Bullet Point Rewriter
                    </h3>
                    <p className="text-xs text-slate-500">
                      Turn daily tasks into clear, memorable results
                    </p>
                  </div>
                </div>

                {/* Role Tabs - Healthcare, Sales, Education, Operations */}
                <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                  {SAMPLE_BULLETS.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSwitchBullet(idx)}
                      className={`relative z-10 px-2 sm:px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        activeBulletIndex === idx
                          ? "text-slate-950 font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {activeBulletIndex === idx && (
                        <motion.div
                          layoutId="bullet-role-pill"
                          className="absolute inset-0 bg-white rounded-md shadow-xs -z-10"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span>{item.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Before & Standout Interactive Comparison */}
              <div className="space-y-2.5 pt-1">
                {/* Before: Weak Draft */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Common Draft ({activeBullet.fullName})</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{activeBullet.before}"
                  </p>
                </div>

                {/* Standout Version */}
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Standout Version</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBullet}
                      className="px-2 py-0.5 rounded bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-800 text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
                    >
                      {copiedBullet ? (
                        <>
                          <LuCheck className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <LuCopy className="w-3 h-3 text-emerald-600" />
                          <span>Copy bullet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeBullet.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: isPolishing ? 0.4 : 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="text-xs text-slate-900 font-medium leading-relaxed"
                    >
                      "{activeBullet.after}"
                    </motion.p>
                  </AnimatePresence>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {activeBullet.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 text-[10px] font-medium inline-flex items-center gap-1"
                      >
                        <LuCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Works for any industry or career level</span>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="font-bold text-slate-900 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer text-xs"
              >
                <span>Write Stronger Bullets</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 2: Interactive Job Match Checklist                   */}
          {/* ========================================================= */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-7 flex flex-col justify-between select-none">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border border-sky-200/60 flex items-center justify-center shrink-0">
                    <LuSearch className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                      Job Match Checklist
                    </h3>
                    <p className="text-xs text-slate-500">
                      See what the job posting asks for and match it on your resume
                    </p>
                  </div>
                </div>

                {/* Job Role Tabs - Healthcare, Finance, Logistics */}
                <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                  {JOB_ROLES.map((role, idx) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setActiveJobRoleIndex(idx)}
                      className={`relative z-10 px-2 py-1 rounded-md transition-colors cursor-pointer ${
                        activeJobRoleIndex === idx
                          ? "text-slate-950 font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {activeJobRoleIndex === idx && (
                        <motion.div
                          layoutId="job-role-pill"
                          className="absolute inset-0 bg-white rounded-md shadow-xs -z-10"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span>{role.roleName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Match Score Bar & Live Keywords */}
              <div className="space-y-3 pt-1">
                {/* Target Role & Dynamic Match Counter */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block leading-tight">
                        Target Job Description
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        {currentJobRole.title}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono transition-colors ${
                        matchPercent === 100
                          ? "bg-emerald-100 text-emerald-800"
                          : matchPercent >= 80
                          ? "bg-sky-100 text-sky-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      <span>{matchPercent}% Match</span>
                    </div>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full transition-colors duration-200 ${
                        matchPercent === 100 ? "bg-emerald-500" : "bg-sky-500"
                      }`}
                      initial={false}
                      animate={{ width: `${matchPercent}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>

                  {/* Live Status Message */}
                  <div className="text-[11px] text-slate-600 flex items-center gap-1">
                    {matchPercent === 100 ? (
                      <span className="text-emerald-700 font-medium">
                        🎉 All key requirements found on your resume!
                      </span>
                    ) : matchPercent >= 80 ? (
                      <span className="text-sky-800 font-medium">
                        👍 Strong match — tap missing skills to include them
                      </span>
                    ) : (
                      <span className="text-slate-600">
                        Tap skills below to see your score update live:
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive Skills Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Key Skills in Job Posting</span>
                    <span className="text-[9.5px] text-slate-400 font-normal">
                      {currentRoleMatchedIds.length} of {currentJobRole.skills.length} on resume
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {currentJobRole.skills.map((kw) => {
                      const isMatched = currentRoleMatchedIds.includes(kw.id);
                      return (
                        <button
                          key={kw.id}
                          type="button"
                          onClick={() => toggleSkill(kw.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                            isMatched
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-900"
                          }`}
                        >
                          {isMatched ? (
                            <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <LuPlus className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{kw.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Paste any job posting to test your resume</span>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="font-bold text-slate-900 hover:text-sky-700 transition-colors inline-flex items-center gap-1 cursor-pointer text-xs"
              >
                <span>Check a Job Description</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 3: Synchronized Cover Letters with Live Styling       */}
          {/* ========================================================= */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-7 flex flex-col justify-between select-none">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0">
                    <LuFileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                      Matching Cover Letter
                    </h3>
                    <p className="text-xs text-slate-500">
                      Keep your resume and cover letter styled as a matching pair
                    </p>
                  </div>
                </div>

                {/* Live Color Picker Dots */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full">
                  {COVER_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      title={theme.label}
                      onClick={() => setSelectedTheme(theme)}
                      className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                        selectedTheme.id === theme.id
                          ? "ring-2 ring-slate-950 scale-110"
                          : "hover:scale-105 opacity-80"
                      }`}
                      style={{ backgroundColor: theme.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Dynamic Document Duo Demonstration */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  {/* Left Mini Sheet: Resume */}
                  <div
                    className={`w-34 h-42 bg-white border border-slate-300/90 shadow-2xs rounded-none p-2.5 flex flex-col justify-between text-[7px] shrink-0 transition-all ${
                      selectedStyle === "border" ? "border-l-4" : ""
                    }`}
                    style={
                      selectedStyle === "border"
                        ? { borderLeftColor: selectedTheme.hex }
                        : {}
                    }
                  >
                    <div>
                      {/* Live Themed Header Accent */}
                      {selectedStyle === "banner" ? (
                        <div
                          className="text-white p-1 mb-1.5 rounded-none transition-colors duration-200"
                          style={{ backgroundColor: selectedTheme.hex }}
                        >
                          <div className="font-bold text-[7.5px] leading-none">Elena Martinez</div>
                          <div className="text-[5.5px] text-white/80 leading-none mt-0.5">
                            Operations & Project Lead
                          </div>
                        </div>
                      ) : (
                        <div className="mb-1.5">
                          <div className="font-bold text-[7.5px] text-slate-900 leading-none">
                            Elena Martinez
                          </div>
                          <div className="text-[5.5px] text-slate-500 leading-none mt-0.5">
                            Operations & Project Lead
                          </div>
                          {selectedStyle === "bar" && (
                            <div
                              className="h-0.5 w-full mt-1 transition-colors duration-200"
                              style={{ backgroundColor: selectedTheme.hex }}
                            />
                          )}
                        </div>
                      )}

                      {/* Section Lines */}
                      <div className="border-b border-slate-200 pb-0.5 mb-1 text-[6px] font-bold text-slate-800">
                        EXPERIENCE
                      </div>
                      <div className="space-y-0.5 text-[5.5px] text-slate-600">
                        <div className="font-semibold text-slate-900">Regional Health · Ops Manager</div>
                        <div className="text-[5px] text-slate-500 leading-none">
                          Directed clinic logistics & staff of 45
                        </div>
                      </div>
                      <div className="mt-1 text-[5px] text-slate-400">
                        Budgeting · Vendor Management · Team Leadership
                      </div>
                    </div>
                    <div className="text-[6.5px] font-bold text-slate-500 text-center font-mono border-t border-slate-100 pt-1">
                      RESUME
                    </div>
                  </div>

                  {/* Auto-Sync Badge */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                      ✓
                    </div>
                    <span className="text-[7.5px] font-bold font-mono text-indigo-700 uppercase tracking-tight">
                      Paired
                    </span>
                  </div>

                  {/* Right Mini Sheet: Cover Letter */}
                  <div
                    className={`w-34 h-42 bg-white border border-slate-300/90 shadow-2xs rounded-none p-2.5 flex flex-col justify-between text-[7px] shrink-0 transition-all ${
                      selectedStyle === "border" ? "border-l-4" : ""
                    }`}
                    style={
                      selectedStyle === "border"
                        ? { borderLeftColor: selectedTheme.hex }
                        : {}
                    }
                  >
                    <div>
                      {/* Live Themed Header Accent */}
                      {selectedStyle === "banner" ? (
                        <div
                          className="text-white p-1 mb-1.5 rounded-none transition-colors duration-200"
                          style={{ backgroundColor: selectedTheme.hex }}
                        >
                          <div className="font-bold text-[7.5px] leading-none">Elena Martinez</div>
                          <div className="text-[5.5px] text-white/80 leading-none mt-0.5">
                            Operations & Project Lead
                          </div>
                        </div>
                      ) : (
                        <div className="mb-1.5">
                          <div className="font-bold text-[7.5px] text-slate-900 leading-none">
                            Elena Martinez
                          </div>
                          <div className="text-[5.5px] text-slate-500 leading-none mt-0.5">
                            Operations & Project Lead
                          </div>
                          {selectedStyle === "bar" && (
                            <div
                              className="h-0.5 w-full mt-1 transition-colors duration-200"
                              style={{ backgroundColor: selectedTheme.hex }}
                            />
                          )}
                        </div>
                      )}

                      {/* Body */}
                      <div className="space-y-0.5 text-[5.5px] text-slate-600 leading-tight">
                        <div className="font-semibold text-slate-900">Dear Search Committee,</div>
                        <div className="text-[5px] text-slate-500 leading-normal">
                          I am writing to express my strong interest in the Operations Director position. With 7 years coordinating regional operations...
                        </div>
                        <div className="text-[5px] text-slate-500 leading-normal pt-1">
                          Sincerely, Elena
                        </div>
                      </div>
                    </div>
                    <div className="text-[6.5px] font-bold text-slate-500 text-center font-mono border-t border-slate-100 pt-1">
                      COVER LETTER
                    </div>
                  </div>
                </div>

                {/* Accent Style Selector Buttons */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-medium mr-1">Header Accent:</span>
                  {COVER_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                        selectedStyle === style.id
                          ? "bg-white text-slate-950 border border-slate-300 shadow-2xs font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Fonts, colors, and layout stay 100% in sync</span>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="font-bold text-slate-900 hover:text-indigo-700 transition-colors inline-flex items-center gap-1 cursor-pointer text-xs"
              >
                <span>Create Matching Letter</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 4: Private Web Link & QR Code                        */}
          {/* ========================================================= */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-7 flex flex-col justify-between select-none">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shrink-0">
                    <LuShare2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                      Web Link & QR Code
                    </h3>
                    <p className="text-xs text-slate-500">
                      Share a private link or let hiring managers scan on mobile
                    </p>
                  </div>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setShareMode("link")}
                    className={`relative z-10 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      shareMode === "link"
                        ? "text-slate-950 font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {shareMode === "link" && (
                      <motion.div
                        layoutId="share-mode-pill"
                        className="absolute inset-0 bg-white rounded-md shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>Web Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareMode("qr")}
                    className={`relative z-10 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      shareMode === "qr"
                        ? "text-slate-950 font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {shareMode === "qr" && (
                      <motion.div
                        layoutId="share-mode-pill"
                        className="absolute inset-0 bg-white rounded-md shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>Phone Scan</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Share Showcase */}
              <div className="space-y-3 pt-1">
                {shareMode === "link" ? (
                  <motion.div
                    key="link-view"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-2.5"
                  >
                    {/* URL Input Bar */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 pl-1.5">
                        <LuGlobe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-xs text-slate-800 truncate select-all">
                          resuma.me/marcus-vance
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-2xs active:scale-95"
                      >
                        {copiedLink ? (
                          <>
                            <LuCheck className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <LuCopy className="w-3 h-3" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Live Recruiter Web Preview */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      {/* Browser Mockup Top Bar */}
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">
                          Recruiter Preview Mode
                        </span>
                      </div>

                      {/* Recruiter View Card Content */}
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            MV
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 leading-tight">
                              Marcus Vance
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Healthcare & Operations Lead
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleMockDownload}
                          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[10px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors active:scale-95"
                        >
                          {mockDownloaded ? (
                            <>
                              <LuCheck className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Downloaded</span>
                            </>
                          ) : (
                            <>
                              <LuDownload className="w-3 h-3 text-slate-500" />
                              <span>Download PDF</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-500">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Live web link
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <LuEye className="w-3 h-3 text-slate-400" />
                          24 views from hiring managers
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="qr-view"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center shrink-0 shadow-2xs relative">
                      <LuQrCode className="w-16 h-16 text-slate-900" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-slate-900 text-xs">
                        Instant Phone Scanning
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Point your camera to test. Perfect for career fairs, in-person interviews, and printed business cards.
                      </p>
                      <div className="pt-0.5 text-[10px] text-slate-400 font-mono">
                        Opens on mobile with zero app or login required
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Private by default — only people with your link can view</span>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="font-bold text-slate-900 hover:text-purple-700 transition-colors inline-flex items-center gap-1 cursor-pointer text-xs"
              >
                <span>Share Online</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSuite;
