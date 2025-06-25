import ProfilePhotoSelector from "../../../components/Inputs/ProfilePhotoSelector";

const ProfileInfoForm = ({ profileData, updateSection, onNext }) => {
    return (
        <div className="px-5 pt-5">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Personal Information</h2>

            <div className="mt-4">
                {/* Profile Photo */}
                <ProfilePhotoSelector
                    image={profileData?.picture?.url || ''}
                    setImage={(value) =>
                        updateSection('picture', {
                            ...profileData?.picture,
                            url: value,
                        })
                    }
                    preview={profileData?.picture?.url || ''}
                    setPreview={(value) =>
                        updateSection('picture', {
                            ...profileData?.picture,
                            url: value,
                        })
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-sm">Full Name</label>
                        <input
                            type="text"
                            value={profileData?.name || ''}
                            onChange={({ target }) => updateSection('name', target.value)}
                            placeholder="John Doe"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>

                    {/* Headline / Designation */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-sm">Headline</label>
                        <input
                            type="text"
                            value={profileData?.headline || ''}
                            onChange={({ target }) => updateSection('headline', target.value)}
                            placeholder="Full Stack Developer"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-sm">Email</label>
                        <input
                            type="email"
                            value={profileData?.email || ''}
                            onChange={({ target }) => updateSection('email', target.value)}
                            placeholder="johndoe@gmail.com"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-sm">Phone</label>
                        <input
                            type="tel"
                            value={profileData?.phone || ''}
                            onChange={({ target }) => updateSection('phone', target.value)}
                            placeholder="+1 (234) 567-8901"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>

                    {/* Location */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-sm">Location</label>
                        <input
                            type="text"
                            value={profileData?.location || ''}
                            onChange={({ target }) => updateSection('location', target.value)}
                            placeholder="Sesame Street, New York"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>

                    {/* Website URL */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-sm">Website</label>
                        <input
                            type="url"
                            value={profileData?.url?.href || ''}
                            onChange={({ target }) =>
                                updateSection('url', {
                                    ...profileData?.url,
                                    href: target.value,
                                })
                            }
                            placeholder="https://johndoe.me"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileInfoForm;