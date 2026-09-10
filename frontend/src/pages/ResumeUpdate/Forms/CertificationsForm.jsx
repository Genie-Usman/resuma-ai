import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultCertificationsItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";

const CertificationsForm = ({
  certifications,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  useEffect(() => {
    document.title = "Resuma AI - Certifications";
  }, []);

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Certifications & Licenses
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Accredited qualifications, professional credentials, and vendor certifications.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
          Credentials
        </span>
      </div>

      {/* Certification Cards */}
      <div className="space-y-4">
        {certifications.map((item, index) => (
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
                  {item.name || `Certification #${index + 1}`}
                </span>
              </div>

              {certifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Certificate"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Certificate Name</label>
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                  placeholder="e.g. AWS Solutions Architect - Professional"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Issuing Authority / Organization</label>
                <input
                  type="text"
                  value={item.issuer || ""}
                  onChange={({ target }) => updateArrayItem(index, "issuer", target.value)}
                  placeholder="e.g. Amazon Web Services, Google Cloud"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Issue Date / Validity</label>
                <input
                  type="text"
                  value={item.date || ""}
                  onChange={({ target }) => updateArrayItem(index, "date", target.value)}
                  placeholder="e.g. Nov 2023 - Nov 2026"
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
                  placeholder="https://cp.certmetrics.com/..."
                  className="studio-input"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="pt-1">
              <label className="studio-label mb-1.5">Key Skills & Competencies Covered</label>
              <SummarySectionForm
                sectionId="certifications"
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
