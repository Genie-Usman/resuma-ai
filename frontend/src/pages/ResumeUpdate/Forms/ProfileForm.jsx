import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultProfileItem } from "../../../constants";
import BrandIcon from "../../../components/shared/BrandIcon";

const ProfileForm = ({
  profiles,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  setResumeData,
}) => {
  // Ensure at least one profile item exists
  useEffect(() => {
    document.title = "Resuma AI - Social Profiles";
    setResumeData((prev) => {
      const profileItems = prev.data.sections.profiles.items || [];
      if (profileItems.length === 0) {
        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              profiles: {
                ...prev.data.sections.profiles,
                items: [{ ...defaultProfileItem }],
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
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Online & Social Profiles
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect recruiters to your GitHub, LinkedIn, portfolio, and work samples.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
          Links
        </span>
      </div>

      {/* Profiles Cards */}
      <div className="space-y-4">
        {profiles.map((item, index) => (
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
                <div className="flex items-center gap-1.5">
                  {item.icon && <BrandIcon slug={item.icon} />}
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                    {item.network || `Profile #${index + 1}`}
                  </span>
                </div>
              </div>

              {profiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("profiles", index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Profile"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="studio-label">Network / Platform</label>
                <input
                  type="text"
                  value={item.network || ""}
                  onChange={({ target }) => {
                    const val = target.value;
                    updateArrayItem(index, "network", val);
                    if (!item.icon) {
                      updateArrayItem(index, "icon", val.toLowerCase().replace(/[^a-z0-9]/g, ""));
                    }
                  }}
                  placeholder="e.g. GitHub, LinkedIn, Twitter/X"
                  className="studio-input"
                />
              </div>

              <div>
                <label className="studio-label">Username / Handle</label>
                <input
                  type="text"
                  value={item.username || ""}
                  onChange={({ target }) => updateArrayItem(index, "username", target.value)}
                  placeholder="e.g. alexmorgan"
                  className="studio-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="studio-label">Profile URL</label>
                <input
                  type="url"
                  value={item.url?.href || ""}
                  onChange={({ target }) => {
                    const updatedUrl = {
                      ...item.url,
                      href: target.value,
                    };
                    updateArrayItem(index, "url", updatedUrl);
                  }}
                  placeholder="https://linkedin.com/in/alexmorgan"
                  className="studio-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="studio-label">Icon Slug</label>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {item.icon ? (
                      <BrandIcon slug={item.icon} />
                    ) : (
                      <span className="text-xs text-slate-400">#</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.icon || ""}
                    onChange={({ target }) => updateArrayItem(index, "icon", target.value)}
                    placeholder="github, linkedin, twitter, portfolio, medium"
                    className="studio-input flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Profile Button */}
        <button
          type="button"
          onClick={() => addArrayItem({ ...defaultProfileItem })}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>Add Another Profile</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;