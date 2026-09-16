import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuEye,
  LuFileCode,
  LuCircleCheck,
  LuShieldCheck,
  LuArrowRight,
} from "react-icons/lu";

const AtsScannerPreview = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("compare");

  return (
    <section id="ats-scanner" className="py-24 relative bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <LuShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Applicant System Compatibility</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            See what company hiring software reads.
          </h2>

          <p className="text-base text-slate-600">
            Most company application portals read plain text, not fancy graphics.
            If your resume has strange formatting or unreadable tables, it gets
            skipped.
          </p>

          {/* View Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-white border border-slate-200 shadow-2xs mt-2">
            <button
              onClick={() => setViewMode("compare")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "compare"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode("visual")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "visual"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Human View
            </button>
            <button
              onClick={() => setViewMode("text")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "text"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Software Scanner View
            </button>
          </div>
        </div>

        {/* Dual Inspection Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* View 1: Visual Resume Document */}
          {(viewMode === "compare" || viewMode === "visual") && (
            <div
              className={`${
                viewMode === "compare" ? "lg:col-span-6" : "lg:col-span-12 max-w-2xl mx-auto w-full"
              } rounded-2xl bg-white text-slate-900 border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <LuEye className="w-4 h-4 text-slate-600" />
                    <span>How Recruiters See Your Resume</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Visual Format
                  </span>
                </div>

                {/* Simulated Document Layout */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-xl font-black text-slate-900">
                      Taylor Bennett
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      Cloud Solutions Architect
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      taylor@email.com · (555) 234-5678 · Seattle, WA · linkedin.com/in/taylor
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                      Professional Experience
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Staff Cloud Architect</span>
                        <span className="text-slate-500 font-normal">2021 – Present</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">Amazon Web Services</div>
                      <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                        • Architected distributed cloud infrastructure serving 40M+ active users.<br />
                        • Reduced annual cloud operational costs by 34% through automated scaling.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                      Key Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["AWS & GCP", "Kubernetes", "System Architecture", "Python", "Terraform"].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Clean typographic hierarchy</span>
                <span className="text-emerald-700 font-bold">100% Readable</span>
              </div>
            </div>
          )}

          {/* View 2: What the Software Extractor Reads */}
          {(viewMode === "compare" || viewMode === "text") && (
            <div
              className={`${
                viewMode === "compare" ? "lg:col-span-6" : "lg:col-span-12 max-w-2xl mx-auto w-full"
              } rounded-2xl bg-[#0e121e] text-slate-200 border border-slate-800 shadow-md p-6 sm:p-8 flex flex-col justify-between font-mono text-xs`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 font-sans">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <LuFileCode className="w-4 h-4 text-emerald-400" />
                    <span>How Company Applicant Software Reads It</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Parse Rate: 100%
                  </span>
                </div>

                {/* Plain Text Extracted Layer */}
                <div className="space-y-3 text-slate-300">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="text-emerald-400 font-bold">
                      [PARSED_CANDIDATE_RECORD]
                    </div>
                    <div>NAME: Taylor Bennett</div>
                    <div>TITLE: Cloud Solutions Architect</div>
                    <div>CONTACT: taylor@email.com | (555) 234-5678 | Seattle, WA</div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="text-emerald-400 font-bold">
                      [WORK_HISTORY_CHRONOLOGY]
                    </div>
                    <div>COMPANY: Amazon Web Services</div>
                    <div>ROLE: Staff Cloud Architect (2021-Present)</div>
                    <div>METRIC_MATCH: "40M+ active users" [VERIFIED]</div>
                    <div>METRIC_MATCH: "34% cost reduction" [VERIFIED]</div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="text-emerald-400 font-bold">
                      [SKILLS_INDEXED]
                    </div>
                    <div className="text-slate-300">
                      AWS, GCP, Kubernetes, System Architecture, Python, Terraform
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between font-sans text-xs">
                <span className="text-slate-400">Zero dropped text or garbled characters</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <LuCircleCheck className="w-3.5 h-3.5" />
                  Verified Safe
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ATS Checklist Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Standard Headings",
              desc: "Clear sections like Experience, Education, and Skills so computers never get confused.",
            },
            {
              title: "Selectable Text",
              desc: "100% genuine vector text layer, never exported as a flattened image or unreadable graphic.",
            },
            {
              title: "Chronological Flow",
              desc: "Dates, companies, and job titles formatted in the exact order hiring software expects.",
            },
            {
              title: "No Hidden Tables",
              desc: "Clean document flow without complicated floating tables that scramble text.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3"
            >
              <LuCircleCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900 mb-0.5">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <span>Create an ATS-Safe Resume Now</span>
            <LuArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AtsScannerPreview;
