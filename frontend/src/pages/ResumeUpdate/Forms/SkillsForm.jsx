import { useEffect } from "react";
import { LuPlus, LuTrash2, LuWrench } from "react-icons/lu";
import { defaultSkillsItem } from "../../../constants";
import RatingInput from "../../../components/Inputs/RatingInput";

const SkillsForm = ({
  skills,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
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
      <div className="pb-3 border-b border-slate-100 flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Technical & Professional Skills
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Group your proficiencies by category to optimize ATS keyword density.
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 shadow-2xs">
          <LuWrench className="w-3.5 h-3.5 text-purple-600" />
          Keywords
        </span>
      </div>

      {/* Skills Group Cards */}
      <div className="space-y-4">
        {skills.map((item, index) => (
          <div
            key={item.id || index}
            className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[240px] sm:max-w-xs">
                  {item.name || `Skill Category #${index + 1}`}
                </span>
              </div>

              {skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Skill"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Category / Area</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. Cloud & Infrastructure"
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

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="studio-label mb-0">
                    Proficiency Rating
                  </label>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">
                    {Math.round((item.level || 0) / 20)} / 5
                  </span>
                </div>
                <div className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                  <RatingInput
                    value={item.level || 0}
                    onChange={(value) => updateArrayItem(index, "level", value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
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
