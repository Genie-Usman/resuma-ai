import { LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultAwardItem } from "../../../constants";
import SummarySectionForm from "./SummarySectionForm";

const AwardsForm = ({ awards, updateArrayItem, addArrayItem, removeArrayItem }) => {

    return (
        <div className="px-5 pt-5">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Awards
                <span className="ml-2 text-sm text-gray-400">(Optional)</span>
            </h2>

            <div className="mt-4 flex flex-col gap-4 mb-3">
                {awards.map((item, index) => (
                    <div key={item.id || index} className="relative border border-gray-200/50 p-4 rounded-lg">

                        {/* Remove Button */}
                        {awards.length > 0 && (
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
                            {/* Name */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Name</label>
                                <input
                                    type="text"
                                    value={item.name || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "name", target.value)
                                    }
                                    placeholder="Award Name"
                                    className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                                />
                            </div>
                            {/* Awarder */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Awarder</label>
                                <input
                                    type="text"
                                    value={item.awarder || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "awarder", target.value)
                                    }
                                    placeholder="Awarder Name"
                                    className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                                />
                            </div>
                            {/* Date */}
                            <div className="flex flex-col col-span-2">
                                <label className="mb-1 font-semibold text-sm">Date</label>
                                <input
                                    type="text"
                                    value={item.date || ""}
                                    onChange={({ target }) =>
                                        updateArrayItem(index, "date", target.value)
                                    }
                                    placeholder="January 2023"
                                    className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                                />
                            </div>
                            {/* Summary */}
                            <div className="flex flex-col md:col-span-2">
                                <SummarySectionForm
                                sectionId="certifications"
                                    item={{
                                        name: item.name || "",
                                        awarder: item.awarder || "",
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
                    onClick={() =>
                        addArrayItem({
                            ...defaultAwardItem,
                        })
                    }
                    className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 transition-colors  cursor-pointer"
                >
                    <div className="flex flex-row items-center justify-center gap-1">
                        <LuPlus className="w-6 h-6" />{" "}
                        <span className="py-0.5 text-base">{awards.length > 0 ? 'Add Another Award' : 'Add an Award'}</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default AwardsForm;

