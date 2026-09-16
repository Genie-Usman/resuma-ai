import { useEffect } from "react";
import { LuLanguages, LuPlus, LuTrash2, LuEye, LuEyeOff } from "react-icons/lu";
import { defaultLanguageItem } from "../../../constants";
import RatingInput from "../../../components/Inputs/RatingInput";
import SectionFormHeader from "../components/SectionFormHeader";
import { LANGUAGE_LEVEL_LABELS } from "../../../utils/ratingUtils";

const LanguageForm = ({
  languages,
  showRatings = true,
  onToggleShowRatings,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
  isVisible,
  onToggleVisibility,
  title,
  onRenameTitle,
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
      <SectionFormHeader
        title={title || "Languages"}
        subtitle="Spoken and written languages with professional fluency ratings."
        icon={LuLanguages}
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        sectionKey="languages"
        onRenameTitle={onRenameTitle}
      />

      {/* Section-Wide Rating Visibility Switch */}
      {onToggleShowRatings && (
        <div className="flex items-center justify-between p-3 bg-purple-50/60 border border-purple-200/70 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${showRatings ? "bg-purple-100 text-purple-700" : "bg-slate-200 text-slate-500"}`}>
              {showRatings ? <LuEye className="w-4 h-4" /> : <LuEyeOff className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Language Fluency Ratings
              </p>
              <p className="text-[11px] text-slate-500">
                {showRatings
                  ? "Displaying fluency meters on supported resume templates"
                  : "Ratings hidden across all languages"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleShowRatings(!showRatings)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              showRatings ? "bg-purple-600" : "bg-slate-300"
            }`}
            title={showRatings ? "Hide all ratings" : "Show ratings"}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                showRatings ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      {/* Language Cards */}
      <div className="space-y-4">
        {languages.map((item, index) => (
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
                  {item.name || `Language #${index + 1}`}
                </span>
              </div>

              {languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove Language"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs - Stacked cleanly for spacious, un-truncated layout */}
            <div className="space-y-3.5">
              <div>
                <label className="studio-label">Language</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. English, Urdu, Spanish, Mandarin, French"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">
                  Proficiency Rating
                </label>
                <div className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl">
                  <RatingInput
                    value={item.level || 0}
                    onChange={(value) => updateArrayItem(index, "level", value)}
                    showRating={item.showRating !== false}
                    onToggleShowRating={(val) => updateArrayItem(index, "showRating", val)}
                    labels={LANGUAGE_LEVEL_LABELS}
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
