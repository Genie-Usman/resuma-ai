import { useEffect } from "react";
import { LuPlus, LuTrash2, LuHeartHandshake } from "react-icons/lu";
import { defaultVolunteerItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";
import SectionFormHeader from "../components/SectionFormHeader";

const VolunteeringForm = ({
  volunteer,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  isVisible,
  onToggleVisibility,
  title,
  onRenameTitle,
}) => {
  useEffect(() => {
    document.title = "Resuma AI - Volunteering";
  }, []);

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <SectionFormHeader
        title={title || "Volunteering & Leadership"}
        subtitle="Non-profit work, community involvement, mentorship, and leadership roles."
        icon={LuHeartHandshake}
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        sectionKey="volunteer"
        onRenameTitle={onRenameTitle}
      />

      {/* Volunteering Cards */}
      <div className="space-y-4">
        {volunteer.map((item, index) => (
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
                  {item.position || item.organization
                    ? `${item.position || "Role"} at ${item.organization || "Organization"}`
                    : `Volunteering #${index + 1}`}
                </span>
              </div>

              {volunteer.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove Volunteering"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs - Stacked cleanly for spacious, un-truncated layout */}
            <div className="space-y-3.5">
              <div>
                <label className="studio-label">Organization / Initiative</label>
                <input
                  type="text"
                  value={item.organization || ""}
                  onChange={({ target }) => updateArrayItem(index, "organization", target.value)}
                  placeholder="e.g. Code for Good, Red Cross"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Role / Position</label>
                <input
                  type="text"
                  value={item.position || ""}
                  onChange={({ target }) => updateArrayItem(index, "position", target.value)}
                  placeholder="e.g. Volunteer Lead Mentor"
                  className="studio-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="studio-label">Location</label>
                  <input
                    type="text"
                    value={item.location || ""}
                    onChange={({ target }) => updateArrayItem(index, "location", target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="studio-input"
                  />
                </div>

                <div>
                  <label className="studio-label">Dates / Period</label>
                  <input
                    type="text"
                    value={item.date || ""}
                    onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                    placeholder="e.g. 2023 - Present"
                    className="studio-input"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-1">
              <SummarySectionForm
                sectionId="volunteering"
                label="Responsibilities & Impact"
                item={{
                  organization: item.organization || "",
                  position: item.position || "",
                  date: item.date || "",
                  location: item.location || "",
                }}
                content={item.summary}
                updateContent={(newSummary) => updateArrayItem(index, "summary", newSummary)}
              />
            </div>
          </div>
        ))}

        {/* Add Volunteering Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultVolunteerItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>{volunteer.length > 0 ? "Add Another Volunteering" : "Add a Volunteering Role"}</span>
        </button>
      </div>
    </div>
  );
};

export default VolunteeringForm;
