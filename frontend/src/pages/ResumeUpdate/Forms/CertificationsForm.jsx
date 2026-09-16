import { useEffect } from "react";
import { LuAward, LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultCertificationsItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";
import SectionFormHeader from "../components/SectionFormHeader";

const CertificationsForm = ({
  certifications,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  isVisible,
  onToggleVisibility,
  title,
  onRenameTitle,
}) => {
  useEffect(() => {
    document.title = "Resuma AI - Certifications";
  }, []);

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <SectionFormHeader
        title={title || "Certifications & Licenses"}
        subtitle="Accredited qualifications, professional credentials, and vendor certifications."
        icon={LuAward}
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        sectionKey="certifications"
        onRenameTitle={onRenameTitle}
      />

      {/* Certification Cards */}
      <div className="space-y-4">
        {certifications.map((item, index) => (
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
                  {item.name || `Certification #${index + 1}`}
                </span>
              </div>

              {certifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove Certificate"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs - Stacked cleanly for full visibility of long names and URLs */}
            <div className="space-y-3.5">
              <div>
                <label className="studio-label">Certificate Name</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect - Professional"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Issuing Authority / Organization</label>
                <input
                  type="text"
                  value={item.issuer || ""}
                  onChange={({ target }) => updateArrayItem(index, "issuer", target.value)}
                  placeholder="e.g. Amazon Web Services, Google Cloud, Microsoft"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Issue Date / Validity</label>
                <input
                  type="text"
                  value={item.date || ""}
                  onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                  placeholder="e.g. Nov 2023 - Nov 2026, 2024"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Verification URL / Credential ID</label>
                <input
                  type="url"
                  value={item.url?.href || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "url.href", target.value)
                  }
                  placeholder="https://cp.certmetrics.com/... or Credential ID"
                  className="studio-input"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="pt-1">
              <SummarySectionForm
                sectionId="certifications"
                label="Key Skills & Competencies Covered"
                item={{
                  name: item.name || "",
                  issuer: item.issuer || "",
                  date: item.date || "",
                }}
                content={item.summary}
                updateContent={(newSummary) => updateArrayItem(index, "summary", newSummary)}
              />
            </div>
          </div>
        ))}

        {/* Add Certificate Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultCertificationsItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>{certifications.length > 0 ? "Add Another Certificate" : "Add a Certificate"}</span>
        </button>
      </div>
    </div>
  );
};

export default CertificationsForm;
