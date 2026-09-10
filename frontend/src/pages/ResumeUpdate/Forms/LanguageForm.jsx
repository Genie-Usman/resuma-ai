import { useEffect } from "react";
import { LuLanguages, LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultLanguageItem } from "../../../constants";
import RatingInput from "../../../components/Inputs/RatingInput";

const LanguageForm = ({
  languages,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
}) => {
  // Ensure at least one language item exists
  useEffect(() => {
    document.title = "Resuma AI - Languages";
    setResumeData((prev) => {
      const languageItems = prev.data.sections.languages.items || [];
      if (languageItems.length === 0) {
        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              languages: {
                ...prev.data.sections.languages,
                items: [{ ...defaultLanguageItem }],
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
            Languages
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Spoken and written languages with professional fluency ratings.
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 shadow-2xs">
          <LuLanguages className="w-3.5 h-3.5 text-purple-600" />
          Communication
        </span>
      </div>

      {/* Language Cards */}
      <div className="space-y-4">
        {languages.map((item, index) => (
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
                  {item.name || `Language #${index + 1}`}
                </span>
              </div>

              {languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Language"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Language</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. English, Spanish, French"
                  className="studio-input"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="studio-label mb-0">
                    Proficiency ({Math.round((item.level || 0) / 20)} / 5)
                  </label>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">
                    {(item.level || 0) >= 100
                      ? "Native"
                      : (item.level || 0) >= 80
                      ? "Fluent"
                      : (item.level || 0) >= 60
                      ? "Professional"
                      : (item.level || 0) >= 40
                      ? "Intermediate"
                      : "Basic"}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                  <RatingInput
                    value={item.level || 0}
                    onChange={(value) => updateArrayItem(index, "level", value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Language Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultLanguageItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>Add Another Language</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageForm;
