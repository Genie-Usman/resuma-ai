import { useEffect, useCallback } from "react";
import { LuTrash, LuPlus } from "react-icons/lu";

// Components
import BrandIcon from "../../../components/shared/BrandIcon";

const ProfilesInfoForm = ({ profiles = [], setResumeData }) => {

    // Update Profile
    const updateProfile = (index, key, value) => {
        setResumeData((prev) => {
            const items = [...prev.data.sections.profiles.items];

            if (key.startsWith("url.")) {
                const subKey = key.split(".")[1];
                items[index].url = { ...items[index].url, [subKey]: value };
            } else {
                items[index][key] = value;
            }

            return {
                ...prev,
                data: {
                    ...prev.data,
                    sections: {
                        ...prev.data.sections,
                        profiles: {
                            ...prev.data.sections.profiles,
                            items,
                        },
                    },
                },
            };
        });
    };

    // Add New Profile
    const addProfile = useCallback(() => {
        setResumeData((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                sections: {
                    ...prev.data.sections,
                    profiles: {
                        ...prev.data.sections.profiles,
                        items: [
                            ...prev.data.sections.profiles.items,
                            {
                                id: crypto.randomUUID(),
                                network: "",
                                username: "",
                                icon: "",
                                url: { label: "", href: "" },
                                visible: true,
                            },
                        ],
                    },
                },
            },
        }));
    }, [setResumeData]);

    // Remove Profile
    const removeProfile = (index) => {
        setResumeData((prev) => {
            const items = [...prev.data.sections.profiles.items];
            items.splice(index, 1);
            return {
                ...prev,
                data: {
                    ...prev.data,
                    sections: {
                        ...prev.data.sections,
                        profiles: {
                            ...prev.data.sections.profiles,
                            items,
                        },
                    },
                },
            };
        });
    };

    // Ensure at least one profile is rendered
    useEffect(() => {
        if (Array.isArray(profiles) && profiles.length === 0) {
            addProfile();
        }
    }, [profiles, addProfile]);

    if (!Array.isArray(profiles)) {
        console.warn("profiles is not an array:", profiles);
        return null;
    }

    return (
        <div className="px-5 pt-5">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Social Profiles
            </h2>

            <div className="mt-4 space-y-6">
                {profiles.map((profile, index) => (
                    <div
                        key={profile.id || index}
                        className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-purple-200 rounded-lg bg-white"
                    >
                        {/* Remove Button */}
                        {profiles.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeProfile(index)}
                                title="Remove Profile"
                                className="absolute top-2 right-2 cursor-pointer"
                            >
                                <LuTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
                            </button>
                        )}

                        {/* Network */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-semibold text-sm">Network</label>

                            <input
                                type="text"
                                value={profile.network}
                                onChange={(e) => updateProfile(index, "network", e.target.value)}
                                placeholder="GitHub"
                                className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                            />
                        </div>

                        {/* Username */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-semibold text-sm">Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                onChange={(e) => updateProfile(index, "username", e.target.value)}
                                placeholder="e.g. johndoe123"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        {/* URL */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-1 font-semibold text-sm">URL</label>
                            <input
                                type="url"
                                value={profile.url?.href || ""}
                                onChange={(e) => updateProfile(index, "url.href", e.target.value)}
                                placeholder="e.g. https://github.com/username"
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            />
                        </div>

                        {/* Icon */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-1 font-semibold text-sm">Icon</label>
                            <div className={`flex flex-row ${profile.icon ? 'gap-3' : 'gap-0'}`}>
                                <div className="flex items-center gap-2">
                                    {profile.icon && (
                                            <BrandIcon slug={profile.icon} />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={profile.icon}
                                    onChange={(e) => updateProfile(index, "icon", e.target.value)}
                                    placeholder="e.g. github"
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />

                            </div>
                        </div>

                    </div>
                ))}

                {/* Add More Button */}
                <button
                    type="button"
                    onClick={addProfile}
                    className="btn-small-light"
                >   
                <div className="flex flex-row items-center justify-center gap-1">
                    <LuPlus className="w-6 h-6"/> <span className="py-0.5 text-base">Add Another Profile</span>
                </div>
                </button>
            </div>
        </div>
    );
};

export default ProfilesInfoForm;
