import { useEffect } from "react";
import { LuBookOpen, LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultPublicationItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";
import SectionFormHeader from "../components/SectionFormHeader";

const PublicationsForm = ({
  publications,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  isVisible,
  onToggleVisibility,
  title,
  onRenameTitle,
}) => {
  useEffect(() => {
    document.title = "Resuma AI - Publications";
  }, []);

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <SectionFormHeader
        title={title || "Publications & Research"}
        subtitle="Peer-reviewed papers, patents, journal articles, and conference talks."
        icon={LuBookOpen}
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        sectionKey="publications"
        onRenameTitle={onRenameTitle}
      />

      {/* Publications Cards */}
      <div className="space-y-4">
        {publications.map((item, index) => (
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
                  {item.name || `Publication #${index + 1}`}
                </span>
              </div>

              {publications.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove Publication"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Publication Title</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. Scaling Transformer Inference on Edge Hardware"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Publisher / Conference</label>
                <input
                  type="text"
                  value={item.publisher || ""}
                  onChange={({ target }) => updateArrayItem(index, "publisher", target.value)}
                  placeholder="e.g. NeurIPS 2024, IEEE, ACM"
                  className="studio-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="studio-label">Date Published</label>
                <input
                  type="text"
                  value={item.date || ""}
                  onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                  placeholder="e.g. December 2024"
                  className="studio-input"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="pt-1">
              <SummarySectionForm
                sectionId="publications"
                label="Abstract & Key Findings"
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
        ))}

        {/* Add Publication Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultPublicationItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>{publications.length > 0 ? "Add Another Publication" : "Add a Publication"}</span>
        </button>
      </div>
    </div>
  );
};

export default PublicationsForm;
