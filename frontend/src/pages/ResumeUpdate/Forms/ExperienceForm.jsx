import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import SummarySectionForm from "./SummarySectionForm";
import { defaultExperienceItem } from "../../../constants";

const ExperienceForm = ({
  experience,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
}) => {
  // Ensure at least one experience item exists
  useEffect(() => {
    document.title = "Resuma AI - Work Experience";
    setResumeData((prev) => {
      const experienceItems = prev.data.sections.experience.items || [];
      if (experienceItems.length === 0) {
        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              experience: {
                ...prev.data.sections.experience,
                items: [{ ...defaultExperienceItem }],
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
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Work Experience
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Highlight your career trajectory, achievements, and quantifiable business impact.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
          Core Section
        </span>
      </div>

      {/* Experience Item Cards */}
      <div className="space-y-4">
        {experience.map((item, index) => (
          <div
            key={item.id || index}
            className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all space-y-4"
          >
            {/* Item Card Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[240px] sm:max-w-xs">
                  {item.position || item.company
                    ? `${item.position || "Role"} at ${item.company || "Company"}`
                    : `Experience #${index + 1}`}
                </span>
              </div>

              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("experience", index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Experience"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Company / Organization</label>
                <input
                  type="text"
                  value={item.company || ""}
                  onChange={({ target }) => updateArrayItem(index, "company", target.value)}
                  placeholder="e.g. Google, Stripe, OpenAI"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Job Title / Position</label>
                <input
                  type="text"
                  value={item.position || ""}
                  onChange={({ target }) => updateArrayItem(index, "position", target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Location / City</label>
                <input
                  type="text"
                  value={item.location || ""}
                  onChange={({ target }) => updateArrayItem(index, "location", target.value)}
                  placeholder="e.g. San Francisco, CA (Remote)"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Employment Dates</label>
                <input
                  type="text"
                  value={item.date || ""}
                  onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                  placeholder="e.g. Jan 2022 - Present"
                  className="studio-input"
                />
              </div>
            </div>

            {/* Summary / Bullet Points */}
            <div className="pt-1">
              <label className="studio-label mb-1.5">Responsibilities & Key Accomplishments</label>
              <SummarySectionForm
                sectionId="experience"
                item={{
                  company: item.company || "",
                  position: item.position || "",
                  location: item.location || "",
                  date: item.date || "",
                }}
                content={item.summary}
                updateContent={(newSummary) => updateArrayItem(index, "summary", newSummary)}
              />
            </div>
          </div>
        ))}

        {/* Add Experience Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultExperienceItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>Add Another Experience</span>
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
