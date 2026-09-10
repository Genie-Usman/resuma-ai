import React, { useState, useMemo } from "react";
import {
  LuShieldCheck,
  LuSparkles,
  LuCheck,
  LuCircleAlert,
  LuX,
  LuChevronDown,
  LuChevronUp,
  LuArrowRight,
  LuFileText,
  LuRefreshCw,
  LuLightbulb,
  LuAward,
  LuLayers,
  LuFileCheck,
  LuUserCheck,
  LuTrendingUp,
} from "react-icons/lu";
import Modal from "../../../components/shared/Modal.jsx";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { runResumeAudit } from "../../../utils/resumeAuditEngine";
import toast from "react-hot-toast";

const PILLAR_ICONS = {
  content: LuFileText,
  sections: LuLayers,
  standards: LuFileCheck,
  polish: LuUserCheck,
  career: LuTrendingUp,
  tailoring: LuAward,
};

const ResumeAuditModal = ({
  isOpen,
  onClose,
  resumeData,
  onNavigateSection,
  onApplyBulletRewrite,
}) => {
  // Compute instant (0ms) heuristic audit
  const auditReport = useMemo(() => {
    return runResumeAudit(resumeData);
  }, [resumeData]);

  // Accordion state: first pillar open by default
  const [openPillars, setOpenPillars] = useState({ content: true });
  const [expandedCheckId, setExpandedCheckId] = useState(null);

  // Deep Gemini AI Audit State
  const [isAiAuditing, setIsAiAuditing] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState(null);
  const [appliedRewrites, setAppliedRewrites] = useState({});

  const togglePillar = (key) => {
    setOpenPillars((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleCheck = (id) => {
    setExpandedCheckId((prev) => (prev === id ? null : id));
  };

  // Run Deep Gemini AI Audit
  const handleRunAiAudit = async () => {
    try {
      setIsAiAuditing(true);
      const response = await axiosInstance.post(API_PATHS.GEMINI.RESUME_AUDIT, {
        resumeData: resumeData || {},
        targetRole: resumeData?.basics?.headline || "",
      });
      setAiAuditResult(response.data);
      toast.success("Executive AI audit complete!");
    } catch (err) {
      console.error("AI audit failed:", err);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to complete AI audit. Please check your network connection."
      );
    } finally {
      setIsAiAuditing(false);
    }
  };

  // Navigate to section in editor
  const handleNavigate = (sectionKey) => {
    if (onNavigateSection) {
      onNavigateSection(sectionKey);
      onClose();
      toast(`Switched to ${sectionKey.replace("-", " ")} section`, {
        icon: "✏️",
      });
    }
  };

  // Semi-circle SVG arc calculations
  const score = auditReport.overallScore || 0;
  // Radius: 70, semi-circle perimeter: PI * 70 ≈ 220
  const radius = 70;
  const strokeDash = Math.PI * radius; // ~220
  const strokeOffset = strokeDash - (strokeDash * Math.min(100, Math.max(0, score))) / 100;

  const scoreColor =
    score >= 80 ? "#10b981" : score >= 65 ? "#f59e0b" : "#f43f5e";
  const scoreBadgeBg =
    score >= 80
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 65
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Audit"
      hideHeader
      width="94vw"
      height="92vh"
      maxWidth="56rem"
    >
      <div className="flex flex-col h-full bg-slate-50/50">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-linear-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl shadow-sm">
              <LuShieldCheck className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Resume Diagnostic Audit
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold text-purple-700 bg-purple-100 rounded-full tracking-wide">
                  6-Pillar ATS Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Deterministic rule evaluation & deep executive intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Close modal"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        {/* Modal Body: Scrollable Content with padding */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-6 space-y-6">
          {/* Hero Score Card (Inspired by benchmark gauge) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Gauge & Score */}
            <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-56 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Your Score
              </span>

              {/* Semi-Circle SVG Gauge */}
              <div className="relative w-44 h-24 flex items-center justify-center">
                <svg viewBox="0 0 180 100" className="w-full h-full overflow-visible">
                  {/* Background Track */}
                  <path
                    d="M 20 90 A 70 70 0 0 1 160 90"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Value Track */}
                  <path
                    d="M 20 90 A 70 70 0 0 1 160 90"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={strokeDash}
                    strokeDashoffset={strokeOffset}
                    style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                  />
                  {/* Center Pivot Indicator */}
                  <circle cx="90" cy="90" r="4" fill="#334155" />
                </svg>

                {/* Score Number Display */}
                <div className="absolute bottom-0 inset-x-0 flex flex-col items-center">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    {score}
                    <span className="text-sm font-semibold text-slate-400">/100</span>
                  </span>
                </div>
              </div>

              {/* Grade Badge */}
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border ${scoreBadgeBg}`}
                >
                  {auditReport.grade}
                </span>
              </div>
            </div>

            {/* Middle: Diagnostic Health Overview */}
            <div className="flex-1 space-y-2 text-center md:text-left border-y md:border-y-0 md:border-l border-slate-100 md:pl-6 py-3 md:py-0 w-full">
              <h3 className="text-sm font-bold text-slate-900">
                Executive Audit Status
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {score >= 80
                  ? "Your resume demonstrates high quantifiable impact, clear structural hierarchy, and compliant ATS formatting. Excellent work!"
                  : score >= 65
                  ? `Your profile is strong but has ${auditReport.totalIssues} high-leverage areas for refinement before top-tier ATS submission.`
                  : `Detected ${auditReport.totalIssues} critical issues that may cause automated ATS rejection or recruiter drop-off.`}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  {auditReport.totalChecks} Automated Checks
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      auditReport.totalIssues === 0 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  ></span>
                  {auditReport.totalIssues === 0
                    ? "0 Open Issues"
                    : `${auditReport.totalIssues} Items to Polish`}
                </span>
              </div>
            </div>

            {/* Right: AI Deep Audit Action Button */}
            <div className="shrink-0 w-full md:w-auto flex flex-col items-center md:items-end">
              <button
                type="button"
                disabled={isAiAuditing}
                onClick={handleRunAiAudit}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isAiAuditing ? (
                  <>
                    <LuRefreshCw className="text-sm animate-spin" />
                    <span>Analyzing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <LuSparkles className="text-sm" />
                    <span>Run Deep AI Audit</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-400 mt-1.5">
                Executive tone & bullet rewrites
              </span>
            </div>
          </div>

          {/* Deep AI Audit Results Panel (If Generated) */}
          {aiAuditResult && (
            <div className="bg-linear-to-br from-purple-50/70 via-indigo-50/40 to-white rounded-3xl p-6 border border-purple-200/80 shadow-xs space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-600 text-white rounded-xl">
                    <LuSparkles className="text-sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Executive Gemini AI Analysis
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Overall: {aiAuditResult.overallScore || score}%
                </span>
              </div>

              {aiAuditResult.executiveSummary && (
                <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-purple-100">
                  {aiAuditResult.executiveSummary}
                </p>
              )}

              {/* Top Recommendations */}
              {aiAuditResult.topRecommendations?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <LuLightbulb className="text-amber-500" />
                    Top Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {aiAuditResult.topRecommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-2xl border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bullet Point Rewrites (Google XYZ Formula) */}
              {aiAuditResult.bulletRewrites?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <LuAward className="text-purple-600" />
                    Recommended Bullet Rewrites (Google X-Y-Z Formula)
                  </h4>
                  <div className="space-y-2">
                    {aiAuditResult.bulletRewrites.map((rewrite, rIdx) => (
                      <div
                        key={rIdx}
                        className="bg-white p-3.5 rounded-2xl border border-purple-200/60 shadow-2xs space-y-2"
                      >
                        <div className="text-[11px] text-slate-500 line-through">
                          {rewrite.original}
                        </div>
                        <div className="text-xs font-medium text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/70 flex items-start gap-2">
                          <LuCheck className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rewrite.improved}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{rewrite.reason}</span>
                          {onApplyBulletRewrite && (
                            <button
                              type="button"
                              onClick={() => {
                                onApplyBulletRewrite(rewrite.original, rewrite.improved);
                                setAppliedRewrites((prev) => ({ ...prev, [rIdx]: true }));
                                toast.success("Applied rewrite to resume!");
                              }}
                              disabled={appliedRewrites[rIdx]}
                              className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {appliedRewrites[rIdx] ? "Applied" : "Apply Rewrite"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Diagnostic Pillars (6 Accordions) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Detailed Diagnostic Breakdown
              </h3>
              <span className="text-[11px] text-slate-400">
                Click any pillar or check to inspect findings
              </span>
            </div>

            {auditReport.pillars.map((pillar) => {
              const PillarIcon = PILLAR_ICONS[pillar.key] || LuFileText;
              const isOpen = openPillars[pillar.key];
              const pillarScoreColor =
                pillar.score >= 80
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : pillar.score >= 65
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200";

              return (
                <div
                  key={pillar.key}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => togglePillar(pillar.key)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                        <PillarIcon className="text-base" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 tracking-wide">
                        {pillar.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Pillar Score Pill */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${pillarScoreColor}`}
                      >
                        {pillar.score}%
                      </span>
                      {isOpen ? (
                        <LuChevronUp className="text-slate-400 text-base" />
                      ) : (
                        <LuChevronDown className="text-slate-400 text-base" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 divide-y divide-slate-100 border-t border-slate-100">
                      {pillar.checks.map((check) => {
                        const isCheckExpanded = expandedCheckId === check.id;
                        const isPass = check.status === "pass";
                        const isWarning = check.status === "warning";

                        const badgeClass = isPass
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                          : isWarning
                          ? "bg-amber-50 text-amber-700 border-amber-200/70"
                          : "bg-rose-50 text-rose-700 border-rose-200/70";

                        return (
                          <div key={check.id} className="py-3 space-y-2.5">
                            {/* Check Header Row */}
                            <div
                              onClick={() => toggleCheck(check.id)}
                              className="flex items-center justify-between cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5">
                                {isPass ? (
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                                    <LuCheck className="text-xs stroke-[3]" />
                                  </div>
                                ) : isWarning ? (
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 shrink-0">
                                    <LuCircleAlert className="text-xs" />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-600 shrink-0">
                                    <LuX className="text-xs stroke-[3]" />
                                  </div>
                                )}

                                <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                                  {check.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeClass}`}
                                >
                                  {check.badge}
                                </span>
                                {check.findings?.length > 0 && (
                                  <span className="text-xs text-slate-400 group-hover:text-slate-600">
                                    {isCheckExpanded ? (
                                      <LuChevronUp className="text-xs" />
                                    ) : (
                                      <LuChevronDown className="text-xs" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Check Description & Findings when expanded */}
                            {isCheckExpanded && (
                              <div className="pl-7 pr-2 space-y-2.5 text-xs text-slate-600 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60 animate-in fade-in duration-200">
                                <p className="leading-relaxed font-normal">
                                  {check.description}
                                </p>

                                {/* Findings List */}
                                {check.findings?.length > 0 && (
                                  <div className="space-y-2 pt-1">
                                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                                      Specific Findings ({check.findings.length}):
                                    </div>
                                    <div className="space-y-1.5">
                                      {check.findings.map((f, fIdx) => (
                                        <div
                                          key={fIdx}
                                          className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1"
                                        >
                                          {f.context && (
                                            <div className="text-[10px] font-bold text-purple-700 uppercase">
                                              {f.context}
                                            </div>
                                          )}
                                          <div className="text-xs font-medium text-slate-800">
                                            "{f.text}"
                                          </div>
                                          {f.suggestion && (
                                            <div className="text-[11px] text-slate-500 flex items-start gap-1">
                                              <LuLightbulb className="text-amber-500 shrink-0 mt-0.5" />
                                              <span>{f.suggestion}</span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Jump to Section Button */}
                                {check.sectionKey && (
                                  <div className="pt-2 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleNavigate(check.sectionKey)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors cursor-pointer"
                                    >
                                      <span>Jump to {check.sectionKey.replace("-", " ")}</span>
                                      <LuArrowRight className="text-xs" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-t border-slate-200/80 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LuShieldCheck className="text-emerald-600 text-sm" />
            <span>Resuma AI ATS Engine • Real-time & Verified</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ResumeAuditModal;
