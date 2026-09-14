import { useEffect } from "react";
import { LuPlus, LuTrash2, LuTrophy } from "react-icons/lu";
import { defaultAwardItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";
import SectionFormHeader from "../components/SectionFormHeader";

const AwardsForm = ({
  awards,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  isVisible,
  onToggleVisibility,
  title,
  onRenameTitle,
}) => {
  useEffect(() => {
    document.title = "Resuma AI - Awards & Honors";
  }, []);

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <SectionFormHeader
        title={title || "Honors & Awards"}
        subtitle="Competitions, hackathons, academic distinctions, and company recognitions."
        icon={LuTrophy}
        badge="Honors"
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        sectionKey="awards"
        onRenameTitle={onRenameTitle}
      />

      {/* Awards Cards */}
      <div className="space-y-4">
        {awards.map((item, index) => (
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
                  {item.name || `Award #${index + 1}`}
                </span>
              </div>

              {awards.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Award"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Award Title</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. 1st Place - Global AI Hackathon"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Awarder / Organization</label>
                <input
                  type="text"
                  value={item.awarder || ""}
                  onChange={({ target }) => updateArrayItem(index, "awarder", target.value)}
                  placeholder="e.g. OpenAI & Microsoft"
                  className="studio-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="studio-label">Date Received</label>
                <input
                  type="text"
                  value={item.date || ""}
                  onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                  placeholder="e.g. November 2024"
                  className="studio-input"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="pt-1">
              <SummarySectionForm
                sectionId="awards"
                label="Award Significance & Context"
                item={{
                  name: item.name || "",
                  awarder: item.awarder || "",
                  date: item.date || "",
                }}
                content={item.summary}
                updateContent={(newSummary) => updateArrayItem(index, "summary", newSummary)}
              />
            </div>
          </div>
        ))}

        {/* Add Award Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultAwardItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>{awards.length > 0 ? "Add Another Award" : "Add an Award"}</span>
        </button>
      </div>
    </div>
  );
};

export default AwardsForm;
