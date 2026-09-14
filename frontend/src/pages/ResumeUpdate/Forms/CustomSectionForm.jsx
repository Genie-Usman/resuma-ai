import React from "react";
import {
  LuPlus,
  LuTrash2,
  LuClock,
  LuListChecks,
  LuBookOpen,
  LuLanguages,
  LuSparkles,
} from "react-icons/lu";
import SectionFormHeader from "../components/SectionFormHeader";
import SummarySectionForm from "./SummarySectionForm";
import RatingInput from "../../../components/Inputs/RatingInput";

const TYPE_CONFIG = {
  timeline: {
    icon: LuClock,
    badge: "Timeline",
    subtitle: "Add roles, activities, responsibilities, and achievements.",
    addButtonText: "Add Another Role / Entry",
    defaultItem: () => ({
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      position: "",
      company: "",
      location: "",
      date: "",
      summary: "",
    }),
  },
  simple_list: {
    icon: LuListChecks,
    badge: "Simple List",
    subtitle: "Add credentials, honors, patents, or list entries.",
    addButtonText: "Add Another Item",
    defaultItem: () => ({
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: "",
      awarder: "",
      date: "",
      url: "",
      summary: "",
    }),
  },
  publications: {
    icon: LuBookOpen,
    badge: "Publications",
    subtitle: "Add papers, articles, speaking engagements, and DOIs.",
    addButtonText: "Add Another Publication",
    defaultItem: () => ({
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: "",
      publisher: "",
      date: "",
      url: "",
      summary: "",
    }),
  },
  language_matrix: {
    icon: LuLanguages,
    badge: "Language Matrix",
    subtitle: "Add languages or competencies with fluency ratings.",
    addButtonText: "Add Another Language / Skill",
    defaultItem: () => ({
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: "",
      level: 80,
      description: "Fluent",
    }),
  },
};

const CustomSectionForm = ({
  sectionId,
  section = {},
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  isVisible = true,
  onToggleVisibility,
  onRenameTitle,
  onRemoveSection,
}) => {
  const type = section.type || "timeline";
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.timeline;
  const items = Array.isArray(section.items) ? section.items : [];

  const handleAddItem = () => {
    if (addArrayItem) {
      addArrayItem(config.defaultItem());
    }
  };

  const getProficiencyLabel = (level = 0) => {
    if (level >= 100) return "Native";
    if (level >= 80) return "Fluent";
    if (level >= 60) return "Professional";
    if (level >= 40) return "Intermediate";
    return "Basic";
  };

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <SectionFormHeader
        title={section.name || "Custom Section"}
        subtitle={config.subtitle}
        icon={config.icon}
        badge={config.badge}
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        sectionKey={sectionId}
        onRenameTitle={onRenameTitle}
        onRemoveSection={onRemoveSection ? () => onRemoveSection(sectionId) : undefined}
      />

      {/* Item Cards */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const itemKey = item.id || `item_${index}`;

          return (
            <div
              key={itemKey}
              className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all space-y-4"
            >
              {/* Item Card Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {type === "timeline" && (item.position || item.company ? `${item.position || "Role"} at ${item.company || "Org"}` : `Entry #${index + 1}`)}
                    {type === "simple_list" && (item.name || item.awarder ? `${item.name || "Item"} — ${item.awarder || ""}` : `Item #${index + 1}`)}
                    {type === "publications" && (item.name || `Publication #${index + 1}`)}
                    {type === "language_matrix" && (item.name || `Language / Skill #${index + 1}`)}
                  </span>
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Item"
                  >
                    <LuTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* 1. TIMELINE INPUTS */}
              {type === "timeline" && (
                <div className="space-y-3.5">
                  <div>
                    <label className="studio-label">Role / Position</label>
                    <input
                      type="text"
                      value={item.position || item.title || ""}
                      onChange={({ target }) => {
                        updateArrayItem(index, "position", target.value);
                        updateArrayItem(index, "title", target.value);
                      }}
                      placeholder="e.g. Volunteer Lead, Adjunct Lecturer, Freelance Consultant"
                      className="studio-input"
                    />
                  </div>

                  <div>
                    <label className="studio-label">Organization / Institution / Client</label>
                    <input
                      type="text"
                      value={item.company || item.organization || ""}
                      onChange={({ target }) => {
                        updateArrayItem(index, "company", target.value);
                        updateArrayItem(index, "organization", target.value);
                      }}
                      placeholder="e.g. Red Cross, Columbia University, Independent"
                      className="studio-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="studio-label">Location / City</label>
                      <input
                        type="text"
                        value={item.location || ""}
                        onChange={({ target }) => updateArrayItem(index, "location", target.value)}
                        placeholder="e.g. New York, NY / Remote"
                        className="studio-input"
                      />
                    </div>

                    <div>
                      <label className="studio-label">Dates / Period</label>
                      <input
                        type="text"
                        value={item.date || ""}
                        onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                        placeholder="e.g. 2022 - Present"
                        className="studio-input"
                      />
                    </div>
                  </div>

                  {/* Summary Bullets */}
                  <div className="pt-1">
                    <SummarySectionForm
                      sectionId={sectionId}
                      label="Responsibilities & Accomplishments"
                      item={{
                        position: item.position || "",
                        company: item.company || "",
                        location: item.location || "",
                        date: item.date || "",
                      }}
                      content={item.summary}
                      updateContent={(newSummary) => updateArrayItem(index, "summary", newSummary)}
                    />
                  </div>
                </div>
              )}

              {/* 2. SIMPLE LIST INPUTS */}
              {type === "simple_list" && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="studio-label">Title / Credential Name</label>
                      <input
                        type="text"
                        value={item.name || item.title || ""}
                        onChange={({ target }) => {
                          updateArrayItem(index, "name", target.value);
                          updateArrayItem(index, "title", target.value);
                        }}
                        placeholder="e.g. US Patent 10,234,567, Bar Admission"
                        className="studio-input"
                      />
                    </div>

                    <div>
                      <label className="studio-label">Issuing Authority / Organization</label>
                      <input
                        type="text"
                        value={item.awarder || item.issuer || ""}
                        onChange={({ target }) => {
                          updateArrayItem(index, "awarder", target.value);
                          updateArrayItem(index, "issuer", target.value);
                        }}
                        placeholder="e.g. USPTO, State Bar, Medical Board"
                        className="studio-input"
                      />
                    </div>

                    <div>
                      <label className="studio-label">Date / Year</label>
                      <input
                        type="text"
                        value={item.date || ""}
                        onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                        placeholder="e.g. 2023, Issued May 2022"
                        className="studio-input"
                      />
                    </div>

                    <div>
                      <label className="studio-label">Verification Link / Credential URL</label>
                      <input
                        type="url"
                        value={typeof item.url === "object" ? item.url?.href || "" : item.url || ""}
                        onChange={({ target }) => updateArrayItem(index, "url", target.value)}
                        placeholder="https://..."
                        className="studio-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="studio-label">Notes / Description (Optional)</label>
                    <input
                      type="text"
                      value={item.summary || ""}
                      onChange={({ target }) => updateArrayItem(index, "summary", target.value)}
                      placeholder="e.g. Awarded for breakthrough research in distributed systems"
                      className="studio-input"
                    />
                  </div>
                </div>
              )}

              {/* 3. PUBLICATIONS INPUTS */}
              {type === "publications" && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="studio-label">Publication / Paper Title</label>
                      <input
                        type="text"
                        value={item.name || item.title || ""}
                        onChange={({ target }) => {
                          updateArrayItem(index, "name", target.value);
                          updateArrayItem(index, "title", target.value);
                        }}
                        placeholder="e.g. Scaling Transformer Inference on Edge Hardware"
                        className="studio-input"
                      />
                    </div>

                    <div>
                      <label className="studio-label">Journal / Conference / Publisher</label>
                      <input
                        type="text"
                        value={item.publisher || item.journal || ""}
                        onChange={({ target }) => {
                          updateArrayItem(index, "publisher", target.value);
                          updateArrayItem(index, "journal", target.value);
                        }}
                        placeholder="e.g. NeurIPS 2024, IEEE, Harvard Law Review"
                        className="studio-input"
                      />
                    </div>

                    <div>
                      <label className="studio-label">Date Published / Year</label>
                      <input
                        type="text"
                        value={item.date || ""}
                        onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                        placeholder="e.g. December 2024"
                        className="studio-input"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="studio-label">DOI / Paper URL</label>
                      <input
                        type="url"
                        value={typeof item.url === "object" ? item.url?.href || "" : item.url || ""}
                        onChange={({ target }) => updateArrayItem(index, "url", target.value)}
                        placeholder="https://doi.org/10.1145/..."
                        className="studio-input"
                      />
                    </div>
                  </div>

                  {/* Abstract / Summary */}
                  <div className="pt-1">
                    <SummarySectionForm
                      sectionId={sectionId}
                      label="Abstract & Key Contributions"
                      item={{
                        name: item.name || "",
                        publisher: item.publisher || "",
                        date: item.date || "",
                      }}
                      content={item.summary}
                      updateContent={(newSummary) => updateArrayItem(index, "summary", newSummary)}
                    />
                  </div>
                </div>
              )}

              {/* 4. LANGUAGE MATRIX INPUTS */}
              {type === "language_matrix" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="studio-label">Language / Skill / Framework</label>
                    <input
                      type="text"
                      value={item.name || ""}
                      onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                      placeholder="e.g. Spanish, Mandarin Chinese, Python"
                      className="studio-input"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="studio-label mb-0">
                        Proficiency Level ({Math.round((item.level || 0) / 20)} / 5)
                      </label>
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">
                        {item.description || getProficiencyLabel(item.level)}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                      <RatingInput
                        value={item.level || 0}
                        onChange={(value) => {
                          updateArrayItem(index, "level", value);
                          updateArrayItem(index, "description", getProficiencyLabel(value));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Entry Button */}
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>{config.addButtonText}</span>
        </button>
      </div>
    </div>
  );
};

export default CustomSectionForm;
