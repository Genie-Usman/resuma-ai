import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultReferenceItem } from "../../../constants";

const ReferenceForm = ({ references, updateArrayItem, addArrayItem, removeArrayItem }) => {
  useEffect(() => {
    document.title = "Resuma AI - References";
  }, []);

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Professional References
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mentors, managers, or colleagues available to provide recommendations.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
          References
        </span>
      </div>

      {/* References Cards */}
      <div className="space-y-4">
        {references.map((item, index) => (
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
                  {item.name || `Reference #${index + 1}`}
                </span>
              </div>

              {references.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Reference"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Reference Name & Title</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. Dr. Jane Smith, VP of Engineering"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Relationship / Note</label>
                <input
                  type="text"
                  value={item.description || ""}
                  onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                  placeholder="e.g. Available upon request"
                  className="studio-input"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Reference Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultReferenceItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>{references.length > 0 ? "Add Another Reference" : "Add a Reference"}</span>
        </button>
      </div>
    </div>
  );
};

export default ReferenceForm;