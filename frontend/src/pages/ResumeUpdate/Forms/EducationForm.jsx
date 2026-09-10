import { useEffect } from "react";
import { LuGraduationCap, LuPlus, LuTrash2 } from "react-icons/lu";
import SummarySectionForm from "./SummarySectionForm";
import { defaultEducationItem } from "../../../constants";

const EducationForm = ({
  education,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
}) => {
  // Ensure at least one education item exists
  useEffect(() => {
    document.title = "Resuma AI - Education";
    setResumeData((prev) => {
      const educationItems = prev.data.sections.education.items || [];
      if (educationItems.length === 0) {
        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              education: {
                ...prev.data.sections.education,
                items: [{ ...defaultEducationItem }],
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
            Education
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic degrees, institutions, GPA/honors, and notable coursework.
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 shadow-2xs">
          <LuGraduationCap className="w-3.5 h-3.5 text-purple-600" />
          Core Section
        </span>
      </div>

      {/* Education Item Cards */}
      <div className="space-y-4">
        {education.map((item, index) => (
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
                  {item.studyType || item.institution
                    ? `${item.studyType || "Degree"} at ${item.institution || "Institution"}`
                    : `Education #${index + 1}`}
                </span>
              </div>

              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("education", index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Education"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="studio-label">Degree / Field of Study</label>
                <input
                  type="text"
                  value={item.studyType || ""}
                  onChange={({ target }) => updateArrayItem(index, "studyType", target.value)}
                  placeholder="e.g. B.S. in Computer Science & Artificial Intelligence"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Institution / University</label>
                <input
                  type="text"
                  value={item.institution || ""}
                  onChange={({ target }) => updateArrayItem(index, "institution", target.value)}
                  placeholder="e.g. Stanford University"
                  className="studio-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="studio-label">Location / City</label>
                  <input
                    type="text"
                    value={item.area || ""}
                    onChange={({ target }) => updateArrayItem(index, "area", target.value)}
                    placeholder="e.g. Stanford, CA"
                    className="studio-input"
                  />
                </div>

                <div>
                  <label className="studio-label">Graduation Dates / Period</label>
                  <input
                    type="text"
                    value={item.date || ""}
                    onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                    placeholder="e.g. Sep 2018 - Jun 2022"
                    className="studio-input"
                  />
                </div>
              </div>

              <div>
                <label className="studio-label">Score / GPA / Honors</label>
                <input
                  type="text"
                  value={item.score || ""}
                  onChange={({ target }) => updateArrayItem(index, "score", target.value)}
                  placeholder="e.g. 3.9/4.0 GPA, Magna Cum Laude"
                  className="studio-input"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="pt-1">
              <SummarySectionForm
                sectionId="education"
                label="Academic Highlights & Coursework"
                item={{
                  institution: item.institution || "",
                  degree: item.studyType || "",
                  location: item.area || "",
                  score: item.score || "",
                  date: item.date || "",
                }}
                content={item.summary}
                updateContent={(newSummary) => updateArrayItem(index, "summary", newSummary)}
              />
            </div>
          </div>
        ))}

        {/* Add Education Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultEducationItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>Add Another Education</span>
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
