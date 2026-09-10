import { useState } from "react";
import {
  LuTarget,
  LuCheck,
  LuPlus,
  LuSparkles,
  LuFileText,
  LuRotateCcw,
  LuLightbulb,
} from "react-icons/lu";
import toast from "react-hot-toast";
import Modal from "../../../components/shared/Modal.jsx";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const SAMPLE_JOB_DESCRIPTION = `Senior Full Stack Developer
Location: Remote / Hybrid

About the Role:
We are seeking an experienced Senior Full Stack Developer to lead development of our next-generation web applications. You will collaborate with product designers, back-end architects, and DevOps to deliver reliable, high-performance web experiences.

Requirements:
- 4+ years of professional software engineering experience.
- Deep expertise in React, TypeScript, Next.js, and modern CSS (TailwindCSS).
- Strong back-end background with Node.js, Express, and REST / GraphQL APIs.
- Experience with relational and NoSQL databases (PostgreSQL, MongoDB).
- Familiarity with Docker, Kubernetes, CI/CD deployment pipelines, and AWS cloud infrastructure.
- Demonstrated experience writing automated unit and integration tests (Jest, Cypress).
- Excellent communication and collaborative problem-solving skills.`;

const JobMatchModal = ({ isOpen, onClose, resumeData, onAddSkill }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [addedSkills, setAddedSkills] = useState({});

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      toast.error("Please paste a job description (at least 20 characters).");
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await axiosInstance.post(API_PATHS.GEMINI.JOB_MATCH, {
        jobDescription: jobDescription.trim(),
        resumeData: resumeData?.data || resumeData || {},
      });

      setAnalysisResult(response.data);
      toast.success("Job match analysis complete!");
    } catch (err) {
      console.error("Job match analysis failed:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to analyze job match. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setAddedSkills({});
  };

  const handleAddMissingSkill = (skillName) => {
    if (onAddSkill) {
      onAddSkill(skillName);
      setAddedSkills((prev) => ({ ...prev, [skillName]: true }));
      toast.success(`Added "${skillName}" to your Skills section!`);
    }
  };

  // Score category color schemes
  const getScoreColor = (score = 0) => {
    if (score >= 80) {
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        badge: "bg-emerald-600 text-white",
        ring: "text-emerald-600",
      };
    }
    if (score >= 60) {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        badge: "bg-amber-600 text-white",
        ring: "text-amber-600",
      };
    }
    return {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      badge: "bg-rose-600 text-white",
      ring: "text-rose-600",
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Job Match"
      width="90vw"
      height="88vh"
    >
      <div className="flex flex-col h-full max-w-5xl mx-auto p-2 md:p-4 overflow-y-auto custom-scrollbar">
        {/* Header Description */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shadow-xs">
            <LuTarget className="text-2xl" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900">
              Compare with Job Description
            </h3>
            <p className="text-xs md:text-sm text-gray-500">
              Paste a job description to see matching keywords, missing skills, and suggestions for your resume.
            </p>
          </div>
        </div>

        {/* State 1: Input Form */}
        {!analysisResult && (
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <LuFileText className="text-purple-600" />
                Target Job Description
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium hover:underline cursor-pointer"
              >
                + Load Sample Job Description
              </button>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here (responsibilities, required skills, qualifications)..."
              rows={12}
              className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-gray-800 custom-scrollbar font-mono placeholder:font-sans placeholder:text-gray-400"
            />

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{jobDescription.length} characters</span>
              <span>Requires at least 20 characters</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAnalyzing || jobDescription.trim().length < 20}
                onClick={handleAnalyze}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <LuSparkles className="text-base" />
                    <span>Compare Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* State 2: Analysis Results Dashboard */}
        {analysisResult && (
          <div className="flex flex-col gap-6 flex-1 animate-fadeIn">
            {/* Top Score Banner */}
            {(() => {
              const colors = getScoreColor(analysisResult.atsScore);
              return (
                <div
                  className={`p-5 rounded-2xl border ${colors.border} ${colors.bg} flex flex-col md:flex-row items-center gap-6 shadow-xs`}
                >
                  {/* Score Gauge */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-md border border-gray-100">
                      <span className={`text-3xl font-extrabold ${colors.text}`}>
                        {analysisResult.atsScore}%
                      </span>
                    </div>
                    <span
                      className={`mt-2 px-3 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}
                    >
                      {analysisResult.scoreCategory || "Match Score"}
                    </span>
                  </div>

                  {/* Summary Assessment */}
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-base font-bold text-gray-900 mb-1">
                      Candidate Fit Assessment
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {analysisResult.summary}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Keyword Columns: Matched vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Matched Keywords */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <LuCheck className="text-sm" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Matched Keywords ({analysisResult.matchedKeywords?.length || 0})
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  These skills and keywords from the job description are already present on your resume:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.matchedKeywords?.map((kw, i) => (
                    <span
                      key={`matched-${i}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <LuCheck className="text-xs text-emerald-600" />
                      {kw}
                    </span>
                  ))}
                  {(!analysisResult.matchedKeywords ||
                    analysisResult.matchedKeywords.length === 0) && (
                    <span className="text-xs text-gray-400 italic">
                      No direct keyword matches detected.
                    </span>
                  )}
                </div>
              </div>

              {/* Missing Keywords (Gap Analysis) */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                    <LuPlus className="text-sm" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Missing Keywords ({analysisResult.missingKeywords?.length || 0})
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Crucial requirements in the JD not found on your resume. Click any tag to add it to your skills:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.missingKeywords?.map((kw, i) => {
                    const isAdded = addedSkills[kw];
                    return (
                      <button
                        key={`missing-${i}`}
                        type="button"
                        onClick={() => handleAddMissingSkill(kw)}
                        disabled={isAdded}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          isAdded
                            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-default"
                            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300"
                        }`}
                        title={isAdded ? "Added to your resume" : "Click to add to your skills"}
                      >
                        {isAdded ? (
                          <LuCheck className="text-xs text-gray-500" />
                        ) : (
                          <LuPlus className="text-xs text-rose-600" />
                        )}
                        <span>{kw}</span>
                      </button>
                    );
                  })}
                  {(!analysisResult.missingKeywords ||
                    analysisResult.missingKeywords.length === 0) && (
                    <span className="text-xs text-gray-400 italic">
                      Great job! No major missing skills identified.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations List */}
            {analysisResult.recommendations?.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                    <LuLightbulb className="text-sm" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Suggestions to Improve Your Match
                  </h4>
                </div>
                <div className="flex flex-col gap-2.5">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <div
                      key={`rec-${idx}`}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/80 border border-gray-100 text-xs md:text-sm text-gray-800"
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-200 text-purple-800 font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                <LuRotateCcw className="text-sm" />
                <span>Test Another Job Description</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default JobMatchModal;
