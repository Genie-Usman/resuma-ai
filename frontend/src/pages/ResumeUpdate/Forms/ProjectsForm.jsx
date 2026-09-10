import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultProjectsItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";

const ProjectsForm = ({
  projects,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
}) => {
  // Ensure at least one project item exists
  useEffect(() => {
    document.title = "Resuma AI - Projects";
    setResumeData((prev) => {
      const projectsItems = prev.data.sections.projects.items || [];
      if (projectsItems.length === 0) {
        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              projects: {
                ...prev.data.sections.projects,
                items: [{ ...defaultProjectsItem }],
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
            Key Projects
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrate your hands-on problem solving, architecture, and technology stack.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
          Portfolio
        </span>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((item, index) => (
          <div
            key={item.id || index}
            className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all space-y-4"
          >
            {/* Item Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[240px] sm:max-w-xs">
                  {item.name || `Project #${index + 1}`}
                </span>
              </div>

              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Project"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Project Name</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. AI-Powered Analytics Engine"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Role / Subtitle</label>
                <input
                  type="text"
                  value={item.description || ""}
                  onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                  placeholder="e.g. Lead Architect & Creator"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Timeline / Period</label>
                <input
                  type="text"
                  value={item.date || ""}
                  onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                  placeholder="e.g. 2023 - Present"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Project / Demo URL</label>
                <input
                  type="text"
                  value={item.url?.href || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "url.href", target.value)
                  }
                  placeholder="https://github.com/org/repo"
                  className="studio-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="studio-label">Technologies & Keywords</label>
                <input
                  type="text"
                  value={item.keywords || ""}
                  onChange={({ target }) => updateArrayItem(index, "keywords", target.value)}
                  placeholder="e.g. Next.js, Python, PostgreSQL, Redis, Docker, AWS"
                  className="studio-input"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Comma-separated keywords help ATS matching algorithms discover your relevant stack.
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-1">
              <label className="studio-label mb-1.5">Project Overview & Key Accomplishments</label>
              <SummarySectionForm
                sectionId="projects"
                item={{
                  name: item.name || "",
                  description: item.description || "",
                  date: item.date || "",
                  keywords: item.keywords || "",
                }}
                content={item.summary}
                updateContent={(newSummary) => updateArrayItem(index, "summary", newSummary)}
              />
            </div>
          </div>
        ))}

        {/* Add Project Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultProjectsItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>Add Another Project</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectsForm;
