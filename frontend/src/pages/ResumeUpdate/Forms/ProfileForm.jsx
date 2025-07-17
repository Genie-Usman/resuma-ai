import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultProfileItem } from "../../../constants";

// Components
import BrandIcon from "../../../components/shared/BrandIcon";

const ProfileForm = ({ profiles, updateArrayItem, addArrayItem, removeArrayItem, setResumeData }) => {

    // Ensure at least one profiles item exists
    useEffect(() => {
        document.title = "Resuma AI - Profile Info";
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
    }, []);

    return (
        <div className="px-5 pt-5">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Social Profiles
            </h2>

            <div className="mt-4 space-y-6">
                {profiles.map((item, index) => (
                    <div
                        key={item.id || index}
                        className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-purple-200 rounded-lg bg-white"
                    >
                        {/* Remove Button */}
                        {profiles.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem("profiles", index)}
                                title="Remove Profile"
                                className="absolute top-2 right-2 cursor-pointer"
                            >
                                <LuTrash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                            </button>
                        )}

                        {/* Network */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-semibold text-sm">Network</label>

                            <input
                                type="text"
                                value={item.network || ""}
                                onChange={({ target }) =>
                                    updateArrayItem(index, "network", target.value)
                                }
                                placeholder="Github"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        {/* Username */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-semibold text-sm">Username</label>
                            <input
                                type="text"
                                value={item.username || ""}
                                onChange={({ target }) =>
                                    updateArrayItem(index, "username", target.value)
                                }
                                placeholder="Genie-Usman"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        {/* URL */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-1 font-semibold text-sm">URL</label>
                            <input
                                type="text"
                                value={item.url.href || ""}
                                onChange={({ target }) => {
                                    const updatedUrl = {
                                        ...item.url,
                                        href: target.value,
                                    };
                                    updateArrayItem(index, "url", updatedUrl);
                                }}
                                placeholder="https://www.github.com/Genie-Usman"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        {/* Icon */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-1 font-semibold text-sm">Icon</label>
                            <div className={`flex flex-row ${item.icon ? 'gap-3' : 'gap-0'}`}>
                                <div className="flex items-center gap-2">
                                    {item.icon && (
                                        <BrandIcon slug={item.icon} />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={item.icon || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "icon", target.value)
                                    }
                                    placeholder="github, linkedin"
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />

                            </div>
                        </div>

                    </div>
                ))}

                {/* Add More Button */}
                <button
                    type="button"
                    onClick={() =>
                        addArrayItem({ ...defaultProfileItem, })}
                    className="btn-small-light"
                >
                    <div className="flex flex-row items-center justify-center gap-1">
                        <LuPlus className="w-6 h-6" />{" "}
                        <span className="py-0.5 text-base">Add Another Profile</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ProfileForm;