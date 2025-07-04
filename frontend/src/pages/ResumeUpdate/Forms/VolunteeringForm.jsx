import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultVolunteerItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";

const VolunteeringForm = ({ volunteer, updateArrayItem, addArrayItem, removeArrayItem, setResumeData }) => {

    // Ensure at least one volunteer item exists
    useEffect(() => {
        setResumeData((prev) => {
            const volunteerItem = prev.data.sections.volunteer.items || [];
            if (volunteerItem.length === 0) {
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        sections: {
                            ...prev.data.sections,
                            volunteer: {
                                ...prev.data.sections.volunteer,
                                items: [{ ...defaultVolunteerItem }],
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Volunteering</h2>

            <div className="mt-4 flex flex-col gap-4 mb-3">
                {volunteer.map((item, index) => (
                    <div key={item.id || index} className="relative border border-gray-200/50 p-4 rounded-lg">

                        {/* Remove Button */}
                        {volunteer.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem(index)}
                                title="Remove Language"
                                className="absolute top-2 right-2 cursor-pointer"
                            >
                                <LuTrash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                            </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Organization */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Organization</label>
                                <input
                                    type="text"
                                    value={item.organization || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "organization", target.value)
                                    }
                                    placeholder="Organization Name"
                                    className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                                />
                            </div>
                            {/* Position */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Position</label>
                                <input
                                    type="text"
                                    value={item.position || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "position", target.value)
                                    }
                                    placeholder="Position Name"
                                    className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                                />
                            </div>
                            {/* Date */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Date or Date Range</label>
                                <input
                                    type="text"
                                    value={item.date || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "date", target.value)
                                    }
                                    placeholder="January 2023 - Present"
                                    className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                                />
                            </div>
                            {/* Location */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Location</label>
                                <input
                                    type="text"
                                    value={item.location || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "location", target.value)
                                    }
                                    placeholder="Location Name"
                                    className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                                />
                            </div>
                            {/* Summary */}
                            <div className="flex flex-col md:col-span-2">
                                <SummarySectionForm
                                    content={item.summary}
                                    updateContent={(newSummary) =>
                                        updateArrayItem(index, "summary", newSummary)
                                    }
                                />
                            </div>

                        </div>
                    </div>
                ))}

                {/* Add More Button */}
                <button
                    type="button"
                    onClick={() =>
                        addArrayItem({
                            ...defaultVolunteerItem,
                        })
                    }
                    className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 transition-colors  cursor-pointer"
                >
                    <div className="flex flex-row items-center justify-center gap-1">
                        <LuPlus className="w-6 h-6" />{" "}
                        <span className="py-0.5 text-base">Add Another Volunteering</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default VolunteeringForm;

