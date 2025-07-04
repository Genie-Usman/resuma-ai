import { useEffect } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { defaultLanguageItem } from "../../../constants";
import RatingInput from "../../../components/Inputs/RatingInput";

const LanguageForm = ({ languages, updateArrayItem, addArrayItem, removeArrayItem, setResumeData }) => {

    // Ensure at least one language item exists
    useEffect(() => {
        setResumeData((prev) => {
            const languageItems = prev.data.sections.languages.items || [];
            if (languageItems.length === 0) {
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        sections: {
                            ...prev.data.sections,
                            languages: {
                                ...prev.data.sections.languages,
                                items: [{ ...defaultLanguageItem }],
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Languages</h2>

            <div className="mt-4 flex flex-col gap-4 mb-3">
                {languages.map((item, index) => (
                    <div key={item.id || index} className="relative border border-gray-200/50 p-4 rounded-lg">

                        {/* Remove Button */}
                        {languages.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem( index)}
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
                                        updateArrayItem( index, "name", target.value)
                                    }
                                    placeholder="English"
                                    className="border border-gray-300 rounded px-3 py-2 w-full capitalize"
                                />
                            </div>
                            {/* Proficiency */}
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm">Proficiency ({item.level / 20 || 0}/5)</label>
                                <div className="mt-5">
                                    <RatingInput 
                                    value={item.level || 0}
                                    onChange={(value) => updateArrayItem(index, "level", value)}
                                    />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                ))}

                {/* Add More Button */}
                <button
                    type="button"
                    onClick={() =>
                        addArrayItem( {
                            ...defaultLanguageItem,
                        })
                    }
                    className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 transition-colors  cursor-pointer"
                >
                    <div className="flex flex-row items-center justify-center gap-1">
                        <LuPlus className="w-6 h-6" />{" "}
                        <span className="py-0.5 text-base">Add Another Language</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default LanguageForm;

