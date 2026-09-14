import { useEffect } from "react";
import { LuFolderGit2, LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultProjectsItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";
import SectionFormHeader from "../components/SectionFormHeader";

const ProjectsForm = ({
  projects,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
  isVisible,
  onToggleVisibility,
  title,
  onRenameTitle,
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
      <SectionFormHeader
        title={title || "Key Projects"}
        subtitle="Demonstrate your hands-on problem solving, architecture, and technology stack."
        icon={LuFolderGit2}
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        sectionKey="projects"
        onRenameTitle={onRenameTitle}
      />

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((item, index) => (
          <div
            key={item.id || index}
            className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all space-y-4"
          >
            {/* Item Header */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate min-w-0">
                  {item.name || `Project #${index + 1}`}
                </span>
              </div>

              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove Project"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="studio-label">Project Name</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. AI-Powered Analytics & Search Engine"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Role / Subtitle</label>
                <input
                  type="text"
                  value={item.description || ""}
                  onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                  placeholder="e.g. Lead Architect & Open-Source Creator"
                  className="studio-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    placeholder="https://github.com/..."
                    className="studio-input"
                  />
                </div>
              </div>

              <div>
                <label className="studio-label">Technologies Used</label>
                <input
                  type="text"
                  value={item.keywords || ""}
                  onChange={({ target }) => updateArrayItem(index, "keywords", target.value)}
                  placeholder="e.g. React, Node.js, Docker, PostgreSQL"
                  className="studio-input"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Separate technologies with commas
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-1">
              <SummarySectionForm
                sectionId="projects"
                label="Project Overview & Accomplishments"
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
