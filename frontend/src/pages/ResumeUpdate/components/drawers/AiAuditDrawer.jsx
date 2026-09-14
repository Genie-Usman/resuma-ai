import { useMemo } from "react";
import {
  LuSparkles,
  LuX,
  LuShieldCheck,
  LuCheck,
  LuCircleAlert,
  LuArrowRight,
  LuTarget,
  LuTrendingUp,
} from "react-icons/lu";
import { runResumeAudit } from "../../../../utils/resumeAuditEngine";

/**
 * AiAuditDrawer Component
 * Provides a persistent, live ATS score ring and checklist directly beside the canvas,
 * with quick triggers for Job Description Match and deep AI enhancements.
 */
const AiAuditDrawer = ({
  resumeData,
  onOpenJobMatch,
  onOpenFullAudit,
  onNavigateSection,
  onClose,
}) => {
  const auditReport = useMemo(() => {
    return runResumeAudit(resumeData?.data || resumeData || {});
  }, [resumeData]);

  const score = auditReport.overallScore;

  const scoreColor =
    score >= 80
      ? "text-emerald-600 stroke-emerald-600"
      : score >= 65
      ? "text-amber-500 stroke-amber-500"
      : "text-rose-500 stroke-rose-500";

  const scoreBg =
    score >= 80
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : score >= 65
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-rose-50 text-rose-800 border-rose-200";

  return (
    <div className="w-full h-full flex flex-col bg-white select-none overflow-hidden">
      {/* Drawer Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/80 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <LuSparkles className="text-base" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">Resume Review</h2>
            <p className="text-[11px] text-slate-500 leading-tight">Score & suggestions for improvement</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Review drawer"
        >
          <LuX className="text-base" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
        {/* 1. Big Score Hero Card */}
        <div className={`p-4 rounded-2xl border text-center flex flex-col items-center ${scoreBg}`}>
          <div className="relative w-20 h-20 flex items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-black/10 stroke-current"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${scoreColor} transition-all duration-700 ease-out`}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-black text-2xl tracking-tight">
              {score}
            </span>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider mt-1">
            {score >= 80 ? "Great Shape" : score >= 65 ? "Good Progress" : "Needs a Few Tweaks"}
          </div>
          <p className="text-[11px] opacity-80 mt-0.5 max-w-[240px]">
            {score >= 80
              ? "Your resume is clear, easy to read, and ready for job applications."
              : "A few small improvements can help make your resume stand out."}
          </p>
        </div>

        {/* 2. Quick Action CTAs */}
        <div className="space-y-2">
          {onOpenJobMatch && (
            <button
              type="button"
              onClick={onOpenJobMatch}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LuTarget className="text-sm" />
              <span>Compare with a Job Description</span>
            </button>
          )}

          {onOpenFullAudit && (
            <button
              type="button"
              onClick={onOpenFullAudit}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All Suggestions</span>
              <LuArrowRight className="text-xs" />
            </button>
          )}
        </div>

        <div className="h-px bg-slate-200/80" />

        {/* 3. Pillar Health Meters */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
            Quality Breakdown
          </label>

          <div className="space-y-3">
            {auditReport.pillars?.map((pillar) => {
              const pScore = pillar.score || 0;
              const pColor =
                pScore >= 80
                  ? "bg-emerald-500"
                  : pScore >= 60
                  ? "bg-amber-500"
                  : "bg-rose-500";

              return (
                <div key={pillar.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">{pillar.name}</span>
                    <span className="font-bold text-slate-600">{pScore}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${pColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${pScore}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-1">
                    {pillar.feedback || `${pillar.checksPassed || 0} of ${pillar.totalChecks || 0} checks passed`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAuditDrawer;
