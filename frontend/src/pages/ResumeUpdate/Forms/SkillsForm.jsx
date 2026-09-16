import { useEffect } from "react";
import { LuPlus, LuTrash2, LuSparkles, LuEye, LuEyeOff } from "react-icons/lu";
import { defaultSkillsItem } from "../../../constants";
import RatingInput from "../../../components/Inputs/RatingInput";
import SectionFormHeader from "../components/SectionFormHeader";

const SkillsForm = ({
  skills,
  showRatings = true,
  onToggleShowRatings,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
  isVisible,
  onToggleVisibility,
  title,
  onRenameTitle,
}) => {
  // Ensure at least one skills item exists
  useEffect(() => {
    document.title = "Resuma AI - Skills";
    setResumeData((prev) => {
      const skillsItems = prev.data.sections.skills.items || [];
      if (skillsItems.length === 0) {
        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              skills: {
                ...prev.data.sections.skills,
                items: [{ ...defaultSkillsItem }],
              },
            },
          },
        };
      }
      return prev;
    });
  }, [setResumeData]);

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <SectionFormHeader
        title={title || "Technical & Core Skills"}
        subtitle="Add your skills grouped by category (e.g. Languages, Frameworks, Tools)."
        icon={LuSparkles}
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        sectionKey="skills"
        onRenameTitle={onRenameTitle}
      />

      {/* Section-Wide Rating Visibility Switch */}
      {onToggleShowRatings && (
        <div className="flex items-center justify-between p-3 bg-purple-50/60 border border-purple-200/70 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${showRatings ? "bg-purple-100 text-purple-700" : "bg-slate-200 text-slate-500"}`}>
              {showRatings ? <LuEye className="w-4 h-4" /> : <LuEyeOff className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Proficiency Rating Bars
              </p>
              <p className="text-[11px] text-slate-500">
                {showRatings
                  ? "Displaying rating meters on supported resume templates"
                  : "Ratings hidden across all skill groups"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleShowRatings(!showRatings)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              showRatings ? "bg-purple-600" : "bg-slate-300"
            }`}
            title={showRatings ? "Hide all ratings" : "Show ratings"}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                showRatings ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      {/* Skills Group Cards */}
      <div className="space-y-4">
        {skills.map((item, index) => (
          <div
            key={item.id || index}
            className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate min-w-0">
                  {item.name || `Skill Category #${index + 1}`}
                </span>
              </div>

              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove Skill"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs - Stacked cleanly for spacious, un-truncated layout */}
            <div className="space-y-3.5">
              <div>
                <label className="studio-label">Category / Area</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. Cloud & Infrastructure, Frontend Engineering"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Experience Level / Subtitle</label>
                <input
                  type="text"
                  value={item.description || ""}
                  onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                  placeholder="e.g. Senior / Production Ready"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">
                  Proficiency Rating
                </label>
                <div className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                  <RatingInput
                    value={item.level || 0}
                    onChange={(value) => updateArrayItem(index, "level", value)}
                    showRating={item.showRating !== false}
                    onToggleShowRating={(val) => updateArrayItem(index, "showRating", val)}
                  />
                </div>
              </div>

              <div>
                <label className="studio-label">Skills & Technologies (Keywords)</label>
                <input
                  type="text"
                  value={item.keywords || ""}
                  onChange={({ target }) => updateArrayItem(index, "keywords", target.value)}
                  placeholder="e.g. AWS, Kubernetes, Terraform, Docker, CI/CD, Helm"
                  className="studio-input"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Comma-separated keywords are rendered as high-visibility badge chips on supported templates.
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Add Skill Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultSkillsItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>Add Another Skill Category</span>
        </button>
      </div>
    </div>
  );
};

export default SkillsForm;
