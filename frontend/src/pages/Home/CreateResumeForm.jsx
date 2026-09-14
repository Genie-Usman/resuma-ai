import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuCheck, LuArrowRight, LuRefreshCw } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const SUGGESTIONS = [
  "Senior Full-Stack Engineer",
  "Product Designer",
  "Cloud Solutions Architect",
  "AI & ML Specialist",
  "Executive Leadership CV",
];

const TEMPLATES = [
  { id: "azurill", name: "Azurill", subtitle: "Modern Clean Dot", cols: "2-Col" },
  { id: "bronzor", name: "Bronzor", subtitle: "Executive Minimal", cols: "1-Col" },
  { id: "chikorita", name: "Chikorita", subtitle: "Forest Bleed Sidebar", cols: "2-Col" },
  { id: "ditto", name: "Ditto", subtitle: "Cyan Header Bar", cols: "2-Col" },
  { id: "gengar", name: "Gengar", subtitle: "Dark Indigo Contrast", cols: "2-Col" },
  { id: "glalie", name: "Glalie", subtitle: "Tinted Sage Contact", cols: "2-Col" },
  { id: "kakuna", name: "Kakuna", subtitle: "Centered Editorial", cols: "1-Col" },
  { id: "leafish", name: "Leafish", subtitle: "Dual-Tier Warm Banner", cols: "2-Col" },
  { id: "nosepass", name: "Nosepass", subtitle: "Europass Split Date", cols: "1-Col" },
  { id: "onyx", name: "Onyx", subtitle: "Crimson Corporate", cols: "1-Col" },
  { id: "pikachu", name: "Pikachu", subtitle: "Warm Amber Card", cols: "2-Col" },
  { id: "rhyhorn", name: "Rhyhorn", subtitle: "Clean Border Divider", cols: "1-Col" },
];

const CreateResumeForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("azurill");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title for your resume.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title: title.trim(),
        template: selectedTemplate,
      });

      if (response.data?._id) {
        navigate(`/resume/${response.data._id}`);
      }
    } catch (err) {
      console.error("Failed to create resume:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the resume. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 flex flex-col justify-center">
      {/* Header with Icon */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
          <LuSparkles className="text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Create New Resume
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Give your resume a title to begin. You can customize the template, colors, and layout anytime.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateResume} className="space-y-5">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Resume Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Senior Software Engineer"
            autoFocus
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-purple-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/15 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />
          {error && (
            <p className="text-rose-500 text-xs mt-1.5 font-medium">{error}</p>
          )}

          {/* Quick Suggestions Chips */}
          <div className="mt-2.5">
            <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setTitle(suggestion);
                    if (error) setError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 hover:border-purple-200 border border-transparent transition-all cursor-pointer select-none"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Starting Template Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Starter Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? "border-purple-500 bg-purple-50/70 shadow-2xs ring-2 ring-purple-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-800 capitalize truncate">
                      {tmpl.name}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      tmpl.cols === "2-Col" 
                        ? "bg-blue-50 text-blue-600 border border-blue-200/60" 
                        : "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                    }`}>
                      {tmpl.cols}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {tmpl.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LuRefreshCw className="text-xs animate-spin" />
                <span>Creating Studio...</span>
              </>
            ) : (
              <>
                <span>Create Resume</span>
                <LuArrowRight className="text-xs" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResumeForm;
