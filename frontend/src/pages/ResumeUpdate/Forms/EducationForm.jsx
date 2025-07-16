import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import SummarySectionForm from "./SummarySectionForm";
import { defaultEducationItem } from "../../../constants";

const EducationForm = ({ education, updateArrayItem, addArrayItem, removeArrayItem, setResumeData }) => {

    // Ensure at least one education item exists
    useEffect(() => {
        setResumeData((prev) => {
            const educationItems = prev.data.sections.education.items || [];
            if (educationItems.length === 0) {
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        sections: {
                            ...prev.data.sections,
                            education: {
                                ...prev.data.sections.education,
                                items: [{ ...defaultEducationItem }],
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Education</h2>

            <div className="mt-4 flex flex-col gap-4 mb-3">
                {education.map((item, index) => (
                    <div key={item.id || index} className="relative border border-gray-200/50 p-4 rounded-lg">

                        {/* Remove Button */}
                        {education.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem("education", index)}
                                title="Remove Education"
                                className="absolute top-2 right-2 cursor-pointer"
                            >
                                <LuTrash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                            </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Institution */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Institution</label>
                                <input
                                    type="text"
                                    value={item.institution || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "institution", target.value)
                                    }
                                    placeholder="University of California"
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            {/* Degree */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Degree</label>
                                <input
                                    type="text"
                                    value={item.studyType || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "studyType", target.value)
                                    }
                                    placeholder="Bachelor's in Computer Science"
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            {/* Location */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Location</label>
                                <input
                                    type="text"
                                    value={item.area || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "area", target.value)
                                    }
                                    placeholder="Berkeley, CA"
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            {/* Score */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Score</label>
                                <input
                                    type="text"
                                    value={item.score || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "score", target.value)
                                    }
                                    placeholder="9.2 GPA"
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            {/* Date */}
                            <div className="flex flex-col col-span-2">
                                <label className="mb-1 font-semibold text-sm">Date or Date Range</label>
                                <input
                                    type="text"
                                    value={item.date || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "date", target.value)
                                    }
                                    placeholder="January 2025 - Present"
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            {/* Summary */}
                            <div className="flex flex-col md:col-span-2">
                                <SummarySectionForm
                                    sectionId="education"
                                    item={{
                                        institution: item.institution || "",
                                        degree: item.studyType || "",
                                        location: item.area || "",
                                        score: item.score || "",
                                        date: item.date || "",
                                    }}
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
                    onClick={() => addArrayItem({ ...defaultEducationItem, })}
                    className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 transition-colors  cursor-pointer"
                >
                    <div className="flex flex-row items-center justify-center gap-1">
                        <LuPlus className="w-6 h-6" />{" "}
                        <span className="py-0.5 text-base">Add Another Education</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default EducationForm
