import { useEffect } from "react";
import { LuHeart, LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultInterestItem } from "../../../constants";

const InterestForm = ({
  interests,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
}) => {
  // Ensure at least one interest item exists
  useEffect(() => {
    document.title = "Resuma AI - Interests";
    setResumeData((prev) => {
      const interestItems = prev.data.sections.interests.items || [];
      if (interestItems.length === 0) {
        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              interests: {
                ...prev.data.sections.interests,
                items: [{ ...defaultInterestItem }],
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
            Interests & Passions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal activities, domain curiosities, and passions that reflect your character.
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 shadow-2xs">
          <LuHeart className="w-3.5 h-3.5 text-purple-600" />
          Personal
        </span>
      </div>

      {/* Interest Cards */}
      <div className="space-y-4">
        {interests.map((item, index) => (
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
                  {item.name || `Interest #${index + 1}`}
                </span>
              </div>

              {interests.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Interest"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Interest / Passion</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. Open-Source AI, Robotics"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Keywords / Activities</label>
                <input
                  type="text"
                  value={item.keywords || ""}
                  onChange={({ target }) => updateArrayItem(index, "keywords", target.value)}
                  placeholder="e.g. LLM fine-tuning, Agentic workflows"
                  className="studio-input"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Interest Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultInterestItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>Add Another Interest</span>
        </button>
      </div>
    </div>
  );
};

export default InterestForm;
