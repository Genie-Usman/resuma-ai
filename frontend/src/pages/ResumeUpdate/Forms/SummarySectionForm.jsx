import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

// Icons
import {
    AiOutlineBold,
    AiOutlineItalic,
    AiOutlineUndo,
    AiOutlineRedo,
    AiOutlineUnderline,
} from 'react-icons/ai';
import {
    MdFormatListBulleted,
    MdFormatListNumbered,
} from 'react-icons/md';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosInstance';

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const baseBtn = "p-1.5 rounded-md transition-colors text-xs font-medium cursor-pointer";
    const iconBtn = (isActive) =>
        `${baseBtn} ${isActive ? 'bg-purple-100 text-purple-800 font-semibold shadow-2xs' : 'hover:bg-slate-200/70 text-slate-600'}`;
    const disabledBtn = `${baseBtn} text-slate-300 cursor-not-allowed`;

    return (
        <div className="flex items-center gap-1 border border-slate-200/80 bg-slate-50/90 rounded-t-xl px-2.5 py-1.5 border-b-0">
            {/* Bold */}
            <button
                type="button"
                className={iconBtn(editor.isActive('bold'))}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold (Ctrl+B)"
            >
                <AiOutlineBold className="w-3.5 h-3.5" />
            </button>
            {/* Italic */}
            <button
                type="button"
                className={iconBtn(editor.isActive('italic'))}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic (Ctrl+I)"
            >
                <AiOutlineItalic className="w-3.5 h-3.5" />
            </button>
            {/* Underline */}
            <button
                type="button"
                className={iconBtn(editor.isActive('underline'))}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline (Ctrl+U)"
            >
                <AiOutlineUnderline className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-3.5 bg-slate-200 mx-1" />

            {/* Bullet List */}
            <button
                type="button"
                className={
                    editor.can().chain().toggleBulletList().run()
                        ? iconBtn(editor.isActive('bulletList'))
                        : disabledBtn
                }
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().toggleBulletList().run()}
                title="Bullet List"
            >
                <MdFormatListBulleted className="w-3.5 h-3.5" />
            </button>
            {/* Ordered List */}
            <button
                type="button"
                className={
                    editor.can().chain().toggleOrderedList().run()
                        ? iconBtn(editor.isActive('orderedList'))
                        : disabledBtn
                }
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={!editor.can().chain().toggleOrderedList().run()}
                title="Numbered List"
            >
                <MdFormatListNumbered className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-3.5 bg-slate-200 mx-1" />

            {/* Undo */}
            <button
                type="button"
                className={editor.can().chain().undo().run() ? iconBtn(false) : disabledBtn}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().undo().run()}
                title="Undo (Ctrl+Z)"
            >
                <AiOutlineUndo className="w-3.5 h-3.5" />
            </button>
            {/* Redo */}
            <button
                type="button"
                className={editor.can().chain().redo().run() ? iconBtn(false) : disabledBtn}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().redo().run()}
                title="Redo (Ctrl+Y)"
            >
                <AiOutlineRedo className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

import {
    LuSparkles,
    LuListPlus,
    LuCopy,
    LuCheck,
    LuRefreshCw,
    LuTrendingUp,
    LuBriefcase,
    LuMinimize2,
    LuCpu,
    LuFileText,
} from 'react-icons/lu';

const AI_TONES = [
    {
        id: "impactful",
        label: "Impactful",
        icon: LuTrendingUp,
        description: "Google XYZ formula: Accomplished [X], measured by [Y], by [Z]",
    },
    {
        id: "formal",
        label: "Formal",
        icon: LuBriefcase,
        description: "Executive leadership vocabulary and strategic governance",
    },
    {
        id: "concise",
        label: "Concise",
        icon: LuMinimize2,
        description: "Punchy, tight, high-density bullet points with zero fluff",
    },
    {
        id: "technical",
        label: "Technical",
        icon: LuCpu,
        description: "Deep engineering precision, architecture, and system metrics",
    },
];

const SummarySectionForm = ({ content, updateContent, sectionId, item, label }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [improving, setImproving] = useState(false);
    const [selectedTone, setSelectedTone] = useState("impactful");
    const [copiedIndex, setCopiedIndex] = useState(null);

    const fetchGeneratedItemSummary = async (section, item, tone) => {
        const res = await axiosInstance.post(API_PATHS.GEMINI.GENERATE_ITEM_SUMMARY, { section, item, tone });
        return res.data.summary;
    };

    // Generate summaries from scratch
    const handleGenerateSummary = async () => {
        setLoading(true);
        try {
            const summaries = await fetchGeneratedItemSummary(sectionId, item, selectedTone); 
            const levels = Object.entries(summaries).map(([level, summary]) => ({
                level: `${level.charAt(0).toUpperCase() + level.slice(1)} • ${selectedTone.toUpperCase()}`,
                summary,
            }));

            setSuggestions(levels);
            toast.success(`Generated ${selectedTone} summaries!`);
        } catch (err) {
            console.error("Failed to generate summary:", err);
            toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to generate summary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Improve existing bullet point or draft using Google XYZ & Tone
    const handleImproveText = async () => {
        const currentText = editor ? editor.getText().trim() : "";
        if (!currentText || currentText.length < 5) {
            toast.error("Please type a rough bullet point or sentence into the editor first!");
            return;
        }

        setImproving(true);
        try {
            const res = await axiosInstance.post(API_PATHS.GEMINI.IMPROVE_BULLET, {
                text: currentText,
                tone: selectedTone,
                context: item || {},
            });

            if (res.data?.suggestions) {
                const list = res.data.suggestions.map((sug, i) => ({
                    level: `Option ${i + 1} • ${selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)}`,
                    summary: sug,
                }));
                setSuggestions(list);
                toast.success(`Improved with ${selectedTone} tone!`);
            } else {
                toast.error("No suggestions received. Try tweaking your text.");
            }
        } catch (err) {
            console.error("Failed to improve bullet:", err);
            toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to improve text. Please try again.");
        } finally {
            setImproving(false);
        }
    };

    const handleReplaceAll = (summary) => {
        if (!editor) return;
        const formatted = summary.startsWith("<") ? summary : `<p>${summary}</p>`;
        editor.commands.setContent(formatted);
        updateContent(formatted);
        toast.success("Applied to editor!");
    };

    const handleInsertBullet = (summary) => {
        if (!editor) return;
        const cleanText = summary.replace(/<[^>]+>/g, "").trim();
        const bulletHtml = `<ul><li><p>${cleanText}</p></li></ul>`;
        editor.chain().focus().insertContent(bulletHtml).run();
        updateContent(editor.getHTML());
        toast.success("Added as bullet point!");
    };

    const handleCopy = (text, index) => {
        const plainText = text.replace(/<[^>]+>/g, "");
        navigator.clipboard.writeText(plainText);
        setCopiedIndex(index);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content || "",
        editorProps: {
            attributes: {
                class:
                    'min-h-[130px] max-h-[220px] p-3 border overflow-auto custom-scrollbar border-slate-200/80 rounded-b-xl bg-white focus:outline-none prose prose-sm max-w-none text-slate-800 focus:ring-1 focus:ring-purple-500/30 text-xs leading-relaxed',
            },
        },
        onUpdate: ({ editor }) => {
            updateContent(editor.getHTML());
        },
    });

    return (
        <div className='w-full'>
            {sectionId === "summary" && (
                /* Standalone Professional Summary Header */
                <div className="pb-3 border-b border-slate-100 flex items-start sm:items-center justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                            Professional Summary
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Highlight your core specialization, years of experience, and career value proposition.
                        </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 shadow-2xs">
                        <LuFileText className="w-3.5 h-3.5 text-purple-600" />
                        Summary
                    </span>
                </div>
            )}

            {/* Compact Studio Header: Label on Left, AI Actions on Right */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="studio-label mb-0 text-slate-700 font-semibold">
                    {label || (sectionId === "summary" ? "Executive Summary" : "Bullet Points & Achievements")}
                </label>

                <div className="flex items-center gap-1.5">
                    {/* Improve with AI Button */}
                    <button
                        type="button"
                        disabled={improving || loading}
                        onClick={handleImproveText}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 rounded-lg shadow-2xs transition-all cursor-pointer"
                        title={`Transform draft into ${selectedTone} high-impact bullet points`}
                    >
                        {improving ? (
                            <LuRefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                            <LuSparkles className="w-3 h-3" />
                        )}
                        <span>{improving ? "Improving..." : "Improve"}</span>
                    </button>

                    {/* Generate from Scratch Button */}
                    <button
                        type="button"
                        disabled={loading || improving}
                        onClick={handleGenerateSummary}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 rounded-lg border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
                        title="Generate a full professional summary tailored to the selected tone"
                    >
                        {loading ? (
                            <LuRefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                            <LuRefreshCw className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{loading ? "Generating..." : "Generate"}</span>
                    </button>
                </div>
            </div>

            {/* Tone Selector: Clean segmented pills, wrapping naturally with no scrollbars */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100/80 rounded-lg border border-slate-200/70 mb-2.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 shrink-0 select-none">
                    Tone:
                </span>
                {AI_TONES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = selectedTone === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTone(t.id)}
                            title={t.description}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                                isSelected
                                    ? "bg-white text-purple-700 shadow-2xs font-semibold"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                            }`}
                        >
                            <Icon className={`text-[12px] shrink-0 ${isSelected ? "text-purple-600" : "text-slate-400"}`} />
                            <span>{t.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Suggestions List */}
            {suggestions.length > 0 && (
                <div className="flex flex-col gap-2.5 mb-3 p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                            <LuSparkles className="text-purple-600" />
                            AI Suggestions ({selectedTone.toUpperCase()})
                        </span>
                        <button
                            type="button"
                            onClick={() => setSuggestions([])}
                            className="text-[11px] text-gray-400 hover:text-gray-600"
                        >
                            Dismiss
                        </button>
                    </div>

                    {suggestions.map(({ level, summary }, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-purple-200/80 rounded-lg p-3 shadow-xs hover:border-purple-400 transition"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold capitalize text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                    {level}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(summary, idx)}
                                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                        title="Copy to clipboard"
                                    >
                                        {copiedIndex === idx ? (
                                            <LuCheck className="text-xs text-emerald-600" />
                                        ) : (
                                            <LuCopy className="text-xs" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleInsertBullet(summary)}
                                        className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition cursor-pointer"
                                        title="Insert this point as a bullet into your editor"
                                    >
                                        <LuListPlus className="text-xs" />
                                        <span>+ Bullet</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleReplaceAll(summary)}
                                        className="px-2 py-0.5 text-[11px] font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded transition cursor-pointer"
                                        title="Replace entire editor content with this suggestion"
                                    >
                                        Replace
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs md:text-sm text-gray-800 leading-relaxed font-sans">
                                {summary}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default SummarySectionForm;

