import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuCheck,
  LuArrowRight,
  LuFileCode,
  LuEye,
  LuLayoutTemplate,
  LuCopy,
} from "react-icons/lu";

const AtsScannerPreview = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("compare");
  const [activeNode, setActiveNode] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="ats-scanner"
      className="py-14 sm:py-18 relative bg-[#fafafc] border-b border-slate-200/80"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-14">
          <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            ATS Readability
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            See how hiring systems read your resume.
          </h2>

          <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Recruiters evaluate your layout and typography; hiring software extracts your details.
            Resuma formats your resume so both review your experience clearly and accurately.
          </p>
        </div>

        {/* Unified Inspection Console Frame (Strict Locked Height, Zero OS Scrollbars) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          {/* Console Top Toolbar */}
          <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 select-none">
            {/* Sliding Pill View Mode Switcher */}
            <div className="relative inline-flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
              {[
                { id: "compare", label: "Side-by-Side", icon: LuLayoutTemplate },
                { id: "visual", label: "Resume View", icon: LuEye },
                { id: "json", label: "Parsed Data", icon: LuFileCode },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = viewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setViewMode(tab.id)}
                    className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? "text-slate-950 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="ats-active-pill"
                        className="absolute inset-0 bg-white rounded-md shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">Verified for Workday, Greenhouse & Lever</span>
              <span className="sm:hidden">ATS Verified</span>
            </div>
          </div>

          {/* Console Viewport Window: Sized so ALL content fits with ZERO overflow or clipping */}
          <div
            className="h-[490px] sm:h-[500px] bg-white select-none overflow-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <AnimatePresence mode="wait">
              {/* ======================================================= */}
              {/* VIEW 1: SIDE-BY-SIDE (Split Comparison)                 */}
              {/* ======================================================= */}
              {viewMode === "compare" && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full w-full flex flex-col md:flex-row overflow-hidden"
                >
                  {/* Left: Authentic Resume Sheet (Spanning Whole Panel, Unrounded Corners, Natural Spacing) */}
                  <div className="w-full md:w-1/2 h-full bg-white border-r border-slate-200/80 p-5 sm:p-6 flex flex-col justify-start space-y-3.5 rounded-none overflow-hidden">
                    {/* Resume Header */}
                    <div
                      onMouseEnter={() => setActiveNode("header")}
                      onMouseLeave={() => setActiveNode(null)}
                      className={`p-1.5 -m-1.5 cursor-pointer rounded-none border-l-2 transition-all duration-200 ease-out ${
                        activeNode === "header"
                          ? "bg-emerald-50/70 border-emerald-500 translate-x-1"
                          : "border-transparent translate-x-0"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight leading-none">
                            Taylor Bennett
                          </h3>
                          <p className="text-[11px] font-semibold text-slate-700 mt-1">
                            Staff Cloud Solutions Architect
                          </p>
                        </div>
                        <div className="text-[9px] text-slate-500 text-right space-y-0.5 leading-tight">
                          <div>Seattle, WA · (555) 234-5678</div>
                          <div className="font-mono text-slate-600 text-[8.5px]">taylor.bennett@cloudmail.io</div>
                        </div>
                      </div>

                      <p className="text-[9px] text-slate-600 leading-snug mt-2 pt-1 border-t border-slate-100">
                        Senior Cloud Architect with 8+ years designing high-throughput AWS/GCP distributed systems and automated multi-region scaling.
                      </p>
                    </div>

                    {/* Professional Experience Section */}
                    <div
                      onMouseEnter={() => setActiveNode("experience")}
                      onMouseLeave={() => setActiveNode(null)}
                      className={`p-1.5 -m-1.5 cursor-pointer rounded-none border-l-2 transition-all duration-200 ease-out ${
                        activeNode === "experience"
                          ? "bg-emerald-50/70 border-emerald-500 translate-x-1"
                          : "border-transparent translate-x-0"
                      }`}
                    >
                      <div className="border-b border-slate-200 pb-0.5 mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-900">
                          Work Experience
                        </span>
                      </div>

                      <div className="space-y-2 text-[9px]">
                        <div>
                          <div className="flex items-baseline justify-between font-bold text-slate-900">
                            <span>Staff Cloud Solutions Architect · AWS</span>
                            <span className="text-[8.5px] text-slate-500 font-normal font-mono">2021 – Present</span>
                          </div>
                          <ul className="text-slate-600 list-disc pl-3 mt-0.5 space-y-0.5 leading-snug text-[8.5px]">
                            <li>Architected multi-region infrastructure for <strong className="text-slate-900 font-semibold">40M+ active users</strong> at 99.99% uptime.</li>
                            <li>Automated Kubernetes scaling, cutting annual spend by <strong className="text-slate-900 font-semibold">34% ($1.2M savings)</strong>.</li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-baseline justify-between font-bold text-slate-900">
                            <span>Senior Infrastructure Engineer · Microsoft Partner</span>
                            <span className="text-[8.5px] text-slate-500 font-normal font-mono">2018 – 2021</span>
                          </div>
                          <p className="text-slate-600 pl-3 leading-snug text-[8.5px] mt-0.5">
                            • Standardized Terraform IaC across 14 teams, accelerating deployment speed <strong className="text-slate-900 font-semibold">3.2x</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Technical Skills Section */}
                    <div
                      onMouseEnter={() => setActiveNode("skills")}
                      onMouseLeave={() => setActiveNode(null)}
                      className={`p-1.5 -m-1.5 cursor-pointer rounded-none border-l-2 transition-all duration-200 ease-out ${
                        activeNode === "skills"
                          ? "bg-emerald-50/70 border-emerald-500 translate-x-1"
                          : "border-transparent translate-x-0"
                      }`}
                    >
                      <div className="border-b border-slate-200 pb-0.5 mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-900">
                          Technical Skills
                        </span>
                      </div>
                      <div className="text-[8.5px] text-slate-700 space-y-0.5 leading-snug">
                        <div><strong className="text-slate-900 font-semibold">Cloud & Platforms:</strong> AWS, GCP, Kubernetes, Docker, Linux</div>
                        <div><strong className="text-slate-900 font-semibold">Infrastructure as Code:</strong> Terraform, Helm, CI/CD Pipelines</div>
                        <div><strong className="text-slate-900 font-semibold">Languages & Databases:</strong> Python, Go, TypeScript, SQL, Bash</div>
                      </div>
                    </div>

                    {/* Education & Certifications Section */}
                    <div
                      onMouseEnter={() => setActiveNode("education")}
                      onMouseLeave={() => setActiveNode(null)}
                      className={`p-1.5 -m-1.5 cursor-pointer rounded-none border-l-2 transition-all duration-200 ease-out ${
                        activeNode === "education"
                          ? "bg-emerald-50/70 border-emerald-500 translate-x-1"
                          : "border-transparent translate-x-0"
                      }`}
                    >
                      <div className="border-b border-slate-200 pb-0.5 mb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-900">
                          Education & Certifications
                        </span>
                      </div>
                      <div className="space-y-0.5 text-[8.5px]">
                        <div className="flex items-baseline justify-between">
                          <span className="font-semibold text-slate-900">B.S. in Computer Engineering · University of Washington</span>
                          <span className="text-slate-500 font-mono text-[8px]">Summa Cum Laude</span>
                        </div>
                        <div className="text-slate-600">
                          AWS Certified Solutions Architect (Professional) · CKA Certified Kubernetes Administrator
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Clean ATS Data Extraction (Spanning Whole Panel, Unrounded Corners) */}
                  <div className="w-full md:w-1/2 h-full p-5 sm:p-6 bg-[#0a0e17] text-slate-300 font-mono text-[10px] flex flex-col justify-between rounded-none overflow-hidden">
                    <div>
                      {/* Status Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] font-sans">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>PARSED BY HIRING SOFTWARE</span>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-none border border-emerald-500/20 font-mono text-[9px] font-bold">
                          Clean Extraction
                        </span>
                      </div>

                      {/* Clean JSON Code View */}
                      <pre className="text-[9.5px] leading-[1.62] text-slate-300 selection:bg-emerald-900 selection:text-white overflow-hidden">
                        <code>
                          <span className="text-slate-600">&#123;</span>{"\n"}
                          <span
                            onMouseEnter={() => setActiveNode("header")}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`px-1.5 -mx-1.5 block cursor-pointer rounded-none border-l-2 transition-all duration-200 ease-out ${
                              activeNode === "header"
                                ? "bg-emerald-950/80 text-emerald-200 border-emerald-400 translate-x-1"
                                : "border-transparent translate-x-0"
                            }`}
                          >
                            {"  "}<span className="text-emerald-400">"applicant"</span>: &#123;{"\n"}
                            {"    "}<span className="text-sky-300">"name"</span>: <span className="text-amber-200">"Taylor Bennett"</span>,{"\n"}
                            {"    "}<span className="text-sky-300">"title"</span>: <span className="text-amber-200">"Staff Cloud Architect"</span>,{"\n"}
                            {"    "}<span className="text-sky-300">"email"</span>: <span className="text-amber-200">"taylor@cloudmail.io"</span>{"\n"}
                            {"  "}&#125;,
                          </span>
                          <span
                            onMouseEnter={() => setActiveNode("experience")}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`px-1.5 -mx-1.5 block cursor-pointer rounded-none border-l-2 transition-all duration-200 ease-out ${
                              activeNode === "experience"
                                ? "bg-emerald-950/80 text-emerald-200 border-emerald-400 translate-x-1"
                                : "border-transparent translate-x-0"
                            }`}
                          >
                            {"  "}<span className="text-emerald-400">"experience"</span>: [{"\n"}
                            {"    "}&#123;{"\n"}
                            {"      "}<span className="text-sky-300">"company"</span>: <span className="text-amber-200">"Amazon Web Services"</span>,{"\n"}
                            {"      "}<span className="text-sky-300">"role"</span>: <span className="text-amber-200">"Staff Cloud Architect"</span>,{"\n"}
                            {"      "}<span className="text-sky-300">"metrics"</span>: [<span className="text-emerald-300">"40M+ users"</span>, <span className="text-emerald-300">"34% savings"</span>]{"\n"}
                            {"    "}&#125;,{"\n"}
                            {"    "}&#123;{"\n"}
                            {"      "}<span className="text-sky-300">"company"</span>: <span className="text-amber-200">"Microsoft Partner"</span>,{"\n"}
                            {"      "}<span className="text-sky-300">"role"</span>: <span className="text-amber-200">"Senior Engineer"</span>{"\n"}
                            {"    "}&#125;{"\n"}
                            {"  "}],
                          </span>
                          <span
                            onMouseEnter={() => setActiveNode("skills")}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`px-1.5 -mx-1.5 block cursor-pointer rounded-none border-l-2 transition-all duration-200 ease-out ${
                              activeNode === "skills"
                                ? "bg-emerald-950/80 text-emerald-200 border-emerald-400 translate-x-1"
                                : "border-transparent translate-x-0"
                            }`}
                          >
                            {"  "}<span className="text-emerald-400">"skills"</span>: [ <span className="text-amber-200">"AWS"</span>, <span className="text-amber-200">"GCP"</span>, <span className="text-amber-200">"Kubernetes"</span>,{"\n"}
                            {"            "}<span className="text-amber-200">"Terraform"</span>, <span className="text-amber-200">"Python"</span>, <span className="text-amber-200">"Go"</span> ]
                          </span>
                          <span
                            onMouseEnter={() => setActiveNode("education")}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`px-1.5 -mx-1.5 block cursor-pointer rounded-none border-l-2 transition-all duration-200 ease-out ${
                              activeNode === "education"
                                ? "bg-emerald-950/80 text-emerald-200 border-emerald-400 translate-x-1"
                                : "border-transparent translate-x-0"
                            }`}
                          >
                            {"  "}<span className="text-emerald-400">"education"</span>: &#123; <span className="text-sky-300">"degree"</span>: <span className="text-amber-200">"B.S. Comp Eng"</span>, <span className="text-sky-300">"school"</span>: <span className="text-amber-200">"Univ of Washington"</span> &#125;
                          </span>
                          <span className="text-slate-600">&#125;</span>
                          <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-1 animate-pulse" />
                        </code>
                      </pre>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between font-sans">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>All Experience & Skills Indexed</span>
                      </span>
                      <span className="text-emerald-400 font-mono font-medium">
                        Zero Scrambled Text
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======================================================= */}
              {/* VIEW 2: RESUME VIEW (Spanning Full Panel, Unrounded)    */}
              {/* ======================================================= */}
              {viewMode === "visual" && (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full w-full bg-white p-7 sm:p-9 flex flex-col justify-start space-y-4 rounded-none overflow-hidden"
                >
                  {/* Header */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-200 pb-2.5">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                          Taylor Bennett
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                          Staff Cloud Solutions Architect
                        </p>
                      </div>
                      <div className="text-xs text-slate-500 sm:text-right space-y-0.5">
                        <div>Seattle, WA · (555) 234-5678</div>
                        <div className="font-mono text-slate-600 text-[11px]">taylor.bennett@cloudmail.io</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      Senior Cloud Architect with 8+ years designing high-throughput AWS/GCP distributed systems and automated multi-region scaling. Specialist in container orchestration, infrastructure-as-code, and cloud financial optimization.
                    </p>
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-1.5">
                    <div className="border-b border-slate-200 pb-0.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Work Experience
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex items-baseline justify-between font-bold text-slate-900">
                          <span>Staff Cloud Solutions Architect · Amazon Web Services</span>
                          <span className="text-[11px] text-slate-500 font-normal font-mono">2021 – Present</span>
                        </div>
                        <ul className="text-slate-600 list-disc pl-4 mt-0.5 space-y-0.5 leading-snug">
                          <li>Architected multi-region cloud infrastructure serving <strong className="text-slate-900 font-semibold">40M+ active users</strong> at 99.99% availability.</li>
                          <li>Automated Kubernetes auto-scaling policies, reducing annual cloud spend by <strong className="text-slate-900 font-semibold">34% ($1.2M cost savings)</strong>.</li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between font-bold text-slate-900">
                          <span>Senior Infrastructure Engineer · Microsoft Partner Engineering</span>
                          <span className="text-[11px] text-slate-500 font-normal font-mono">2018 – 2021</span>
                        </div>
                        <p className="text-slate-600 pl-4 leading-snug mt-0.5">
                          • Standardized Terraform IaC configurations across 14 teams, accelerating deployment speed <strong className="text-slate-900 font-semibold">3.2x</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Split for Skills & Education */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-0.5">
                    {/* Skills */}
                    <div className="space-y-1">
                      <div className="border-b border-slate-200 pb-0.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Technical Skills
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-700 space-y-0.5 leading-snug pt-0.5">
                        <div><strong className="text-slate-900 font-semibold">Cloud & Platforms:</strong> AWS, GCP, Kubernetes, Docker, Linux</div>
                        <div><strong className="text-slate-900 font-semibold">Infrastructure as Code:</strong> Terraform, Helm, CI/CD Pipelines</div>
                        <div><strong className="text-slate-900 font-semibold">Languages & Databases:</strong> Python, Go, TypeScript, SQL, Bash</div>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-1">
                      <div className="border-b border-slate-200 pb-0.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Education & Certifications
                        </span>
                      </div>
                      <div className="pt-0.5 text-[11px] space-y-0.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-semibold text-slate-900">B.S. in Computer Engineering</span>
                          <span className="text-slate-500 font-mono text-[10px]">Summa Cum Laude</span>
                        </div>
                        <div className="text-slate-600 text-[10.5px]">University of Washington · 2018</div>
                        <div className="text-slate-600 text-[10.5px]">AWS Certified Solutions Architect (Professional) · CKA</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======================================================= */}
              {/* VIEW 3: PARSED DATA (Spanning Full Panel, Unrounded)    */}
              {/* ======================================================= */}
              {viewMode === "json" && (
                <motion.div
                  key="json"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full w-full p-6 sm:p-7 bg-[#0a0e17] text-slate-300 font-mono text-xs flex flex-col justify-between rounded-none overflow-hidden"
                >
                  <div>
                    {/* Top Developer Bar */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                          <LuFileCode className="w-4 h-4" />
                          <span>parsed_resume.json</span>
                        </div>
                        <span className="text-slate-500 text-[11px]">Clean Structured Format</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-sans cursor-pointer transition-colors"
                      >
                        {copied ? (
                          <>
                            <LuCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <LuCopy className="w-3.5 h-3.5" />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* JSON Code Display */}
                    <pre className="text-[11px] leading-[1.7] text-slate-300 selection:bg-emerald-900 selection:text-white overflow-hidden">
                      <code>
                        <span className="text-slate-600">&#123;</span>{"\n"}
                        {"  "}<span className="text-emerald-400">"applicant"</span>: &#123;{"\n"}
                        {"    "}<span className="text-sky-300">"name"</span>: <span className="text-amber-200">"Taylor Bennett"</span>,{"\n"}
                        {"    "}<span className="text-sky-300">"title"</span>: <span className="text-amber-200">"Staff Cloud Solutions Architect"</span>,{"\n"}
                        {"    "}<span className="text-sky-300">"email"</span>: <span className="text-amber-200">"taylor.bennett@cloudmail.io"</span>,{"\n"}
                        {"    "}<span className="text-sky-300">"location"</span>: <span className="text-amber-200">"Seattle, WA"</span>{"\n"}
                        {"  "}&#125;,{"\n"}
                        {"  "}<span className="text-emerald-400">"experience"</span>: [{"\n"}
                        {"    "}&#123;{"\n"}
                        {"      "}<span className="text-sky-300">"company"</span>: <span className="text-amber-200">"Amazon Web Services"</span>,{"\n"}
                        {"      "}<span className="text-sky-300">"role"</span>: <span className="text-amber-200">"Staff Cloud Solutions Architect"</span>,{"\n"}
                        {"      "}<span className="text-sky-300">"metrics"</span>: [<span className="text-emerald-300">"40M+ active users"</span>, <span className="text-emerald-300">"34% cloud savings"</span>]{"\n"}
                        {"    "}&#125;,{"\n"}
                        {"    "}&#123;{"\n"}
                        {"      "}<span className="text-sky-300">"company"</span>: <span className="text-amber-200">"Microsoft Partner"</span>,{"\n"}
                        {"      "}<span className="text-sky-300">"role"</span>: <span className="text-amber-200">"Senior Infrastructure Engineer"</span>{"\n"}
                        {"    "}&#125;{"\n"}
                        {"  "}],{"\n"}
                        {"  "}<span className="text-emerald-400">"skills"</span>: [ <span className="text-amber-200">"AWS"</span>, <span className="text-amber-200">"GCP"</span>, <span className="text-amber-200">"Kubernetes"</span>, <span className="text-amber-200">"Terraform"</span>, <span className="text-amber-200">"Python"</span>, <span className="text-amber-200">"Go"</span> ]{"\n"}
                        <span className="text-slate-600">&#125;</span>
                      </code>
                    </pre>
                  </div>

                  {/* Bottom Metric Bar */}
                  <div className="pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between font-sans">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Ready for Workday, Greenhouse, Lever & Taleo</span>
                    </span>
                    <span className="text-emerald-400 font-mono font-medium">
                      0 Errors
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Integrated Console Footer: 4 Inline Verification Standards */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 select-none">
            <div className="flex items-center gap-1.5 group cursor-default">
              <LuCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[11px] text-slate-800">Standard Headings</span>
            </div>
            <div className="flex items-center gap-1.5 group cursor-default">
              <LuCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[11px] text-slate-800">Selectable Text</span>
            </div>
            <div className="flex items-center gap-1.5 group cursor-default">
              <LuCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[11px] text-slate-800">Chronological Flow</span>
            </div>
            <div className="flex items-center gap-1.5 group cursor-default">
              <LuCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[11px] text-slate-800">Single-Column Format</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Strip */}
        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
          >
            <span>Test Your Resume in Builder</span>
            <LuArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AtsScannerPreview;
