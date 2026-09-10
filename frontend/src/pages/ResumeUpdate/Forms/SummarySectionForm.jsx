import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import HardBreak from '@tiptap/extension-hard-break';

// Icons
import {
    AiOutlineBold,
    AiOutlineItalic,
    AiOutlineCode,
    AiOutlineUndo,
    AiOutlineRedo,
    AiOutlineUnderline,
    AiOutlineStrikethrough,
} from 'react-icons/ai';
import {
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdFormatAlignLeft,
    MdFormatAlignCenter,
    MdFormatAlignRight,
} from 'react-icons/md';
import {
    PiTextHOneBold,
    PiTextHTwoBold,
    PiTextHThreeBold
} from 'react-icons/pi';
import {
    RxDividerVertical,
    RxEnter
} from 'react-icons/rx';
import Button from '../../../components/shared/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosInstance';

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const baseBtn = `p-1.5 rounded transition`;
    const iconBtn = (isActive) =>
        `${baseBtn} ${isActive ? 'bg-gray-300 text-black' : 'hover:bg-gray-200 text-gray-600'}`;
    const disabledBtn = `${baseBtn} text-gray-400 cursor-not-allowed`;

    return (
        <div className="flex flex-wrap gap-1 border border-gray-300 bg-white rounded px-2 py-1 mb-3">
            {/* Bold */}
            <button
                type="button"
                className={iconBtn(editor.isActive('bold'))}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
            >
                <AiOutlineBold />
            </button>
            {/* Italic */}
            <button
                type="button"
                className={iconBtn(editor.isActive('italic'))}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
            >
                <AiOutlineItalic />
            </button>
            {/* Strikethrough */}
            <button
                type="button"
                className={iconBtn(editor.isActive('strike'))}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
            >
                <AiOutlineStrikethrough />
            </button>
            {/* UnderLine */}
            <button
                type="button"
                className={iconBtn(editor.isActive('underline'))}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
            >
                <AiOutlineUnderline />
            </button>
            {/* Code */}
            <button
                type="button"
                className={iconBtn(editor.isActive('code'))}
                onClick={() => editor.chain().focus().toggleCode().run()}
                title="Code"
            >
                <AiOutlineCode />
            </button>
            {/* Heading 1 */}
            <button
                type="button"
                className={editor.can().chain().toggleHeading({ level: 1 }).run()
                    ? iconBtn(editor.isActive('heading', { level: 1 }))
                    : disabledBtn}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                disabled={!editor.can().chain().toggleHeading({ level: 1 }).run()}
                title="Heading 1"
            >
                <PiTextHOneBold />
            </button>
            {/* Heading 2 */}
            <button
                type="button"
                className={editor.can().chain().toggleHeading({ level: 2 }).run()
                    ? iconBtn(editor.isActive('heading', { level: 2 }))
                    : disabledBtn}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                disabled={!editor.can().chain().toggleHeading({ level: 2 }).run()}
                title="Heading 2"
            >
                <PiTextHTwoBold />
            </button>
            {/* Heading 3 */}
            <button
                type="button"
                className={editor.can().chain().toggleHeading({ level: 3 }).run()
                    ? iconBtn(editor.isActive('heading', { level: 3 }))
                    : disabledBtn}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                disabled={!editor.can().chain().toggleHeading({ level: 3 }).run()}
                title="Heading 3"
            >
                <PiTextHThreeBold />
            </button>
            {/* Bullet List */}
            <button
                type="button"
                className={
                    editor.can().chain().toggleBulletList().run()
                        ? iconBtn(false)
                        : disabledBtn
                }
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().toggleBulletList().run()}
                title="Bullet List"
            >
                <MdFormatListBulleted />
            </button>
            {/* Ordered List */}
            <button
                type="button"
                className={
                    editor.can().chain().toggleOrderedList().run()
                        ? iconBtn(false)
                        : disabledBtn
                }
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={!editor.can().chain().toggleOrderedList().run()}
                title="Ordered List"
            >
                <MdFormatListNumbered />
            </button>
            {/* Align Left */}
            <button
                type="button"
                className={iconBtn(editor.isActive({ textAlign: 'left' }))}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                title="Align Left"
            >
                <MdFormatAlignLeft />
            </button>
            {/* Align Center */}
            <button
                type="button"
                className={iconBtn(editor.isActive({ textAlign: 'center' }))}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                title="Align Center"
            >
                <MdFormatAlignCenter />
            </button>
            {/* Align Right */}
            <button
                type="button"
                className={iconBtn(editor.isActive({ textAlign: 'right' }))}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                title="Align Right"
            >
                <MdFormatAlignRight />
            </button>
            {/* Line Break */}
            <button
                type="button"
                className={iconBtn(false)}
                onClick={() => editor.chain().focus().setHardBreak().run()}
                title="Line Break"
            >
                <RxEnter />
            </button>
            {/* Horizontal Rule */}
            <button
                type="button"
                className={iconBtn(false)}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <RxDividerVertical />
            </button>
            {/* Undo */}
            <button
                type="button"
                className={editor.can().chain().undo().run() ? iconBtn(false) : disabledBtn}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().undo().run()}
                title="Undo"
            >
                <AiOutlineUndo />
            </button>
            {/* Redo */}
            <button
                type="button"
                className={editor.can().chain().redo().run() ? iconBtn(false) : disabledBtn}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().redo().run()}
                title="Redo"
            >
                <AiOutlineRedo />
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
} from 'react-icons/lu';

const AI_TONES = [
    { id: "impactful", label: "🚀 Impactful (XYZ)", title: "Google XYZ formula: Accomplished [X], measured by [Y], by [Z]" },
    { id: "formal", label: "👔 Formal", title: "Executive leadership vocabulary and grammatical polish" },
    { id: "concise", label: "⚡ Concise", title: "Punchy, tight, removes fluff while keeping metrics" },
    { id: "technical", label: "💻 Technical", title: "Architecture, frameworks, engineering scale, and metrics" },
];

const SummarySectionForm = ({ content, updateContent, sectionId, item }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [improving, setImproving] = useState(false);
    const [selectedTone, setSelectedTone] = useState("impactful");
    const [copiedIndex, setCopiedIndex] = useState(null);

    const fetchGeneratedItemSummary = async (section, item) => {
        const res = await axiosInstance.post(API_PATHS.GEMINI.GENERATE_ITEM_SUMMARY, { section, item });
        return res.data.summary;
    };

    // Generate summaries from scratch
    const handleGenerateSummary = async () => {
        setLoading(true);
        try {
            const summaries = await fetchGeneratedItemSummary(sectionId, item); 
            const levels = Object.entries(summaries).map(([level, summary]) => ({
                level,
                summary,
            }));

            setSuggestions(levels);
            toast.success("AI summaries generated!");
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
                    level: `Option ${i + 1} (${selectedTone})`,
                    summary: sug,
                }));
                setSuggestions(list);
                toast.success(`Generated 3 ${selectedTone} Google-XYZ suggestions!`);
            }
        } catch (err) {
            console.error("Failed to improve bullet:", err);
            toast.error(err.response?.data?.message || "Failed to improve bullet point.");
        } finally {
            setImproving(false);
        }
    };

    const handleReplaceAll = (summary) => {
        if (editor) {
            editor.commands.setContent(summary);
            updateContent(summary);
            toast.success("Replaced editor content!");
        }
    };

    const handleInsertBullet = (summary) => {
        if (editor) {
            const bulletHtml = `<ul><li><p>${summary}</p></li></ul>`;
            editor.chain().focus().insertContent(bulletHtml).run();
            updateContent(editor.getHTML());
            toast.success("Inserted as bullet point!");
        }
    };

    const handleCopy = (summary, index) => {
        navigator.clipboard.writeText(summary);
        setCopiedIndex(index);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                hardBreak: false,
                horizontalRule: false,
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Underline,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            HorizontalRule,
            HardBreak.configure({
                keepMarks: true,
                keepAttributes: false,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class:
                    'min-h-[180px] max-h-[220px] p-3 border overflow-auto custom-scrollbar border-gray-300 rounded-b bg-white focus:outline-none prose prose-sm max-w-none text-gray-900',
            },
        },
        onUpdate: ({ editor }) => {
            updateContent(editor.getHTML());
        },
    });

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className="col-span-2 mt-3">
                {/* Header with Title & Action Buttons */}
                <div className='flex flex-wrap items-center justify-between gap-2 mb-2'>
                    <div>
                        <h2 className="font-bold text-base md:text-lg text-gray-900">
                            Description & Bullet Points
                        </h2>
                        <p className="text-xs text-gray-500">
                            Draft achievements or click "Improve with AI" to apply the Google XYZ formula.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Improve with AI Button */}
                        <button
                            type="button"
                            disabled={improving || loading}
                            onClick={handleImproveText}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer"
                            title="Transform draft into Google XYZ high-impact bullet points"
                        >
                            {improving ? (
                                <LuRefreshCw className="text-xs animate-spin" />
                            ) : (
                                <LuSparkles className="text-xs" />
                            )}
                            <span>{improving ? "Improving..." : "✨ Improve Text"}</span>
                        </button>

                        {/* Generate from Scratch Button */}
                        <button
                            type="button"
                            disabled={loading || improving}
                            onClick={handleGenerateSummary}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 disabled:opacity-50 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                            title="Generate a full professional summary from role information"
                        >
                            {loading ? (
                                <LuRefreshCw className="text-xs animate-spin" />
                            ) : (
                                <LuRefreshCw className="text-xs" />
                            )}
                            <span>{loading ? "Generating..." : "Generate New"}</span>
                        </button>
                    </div>
                </div>

                {/* AI Tone Selector Bar */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg border border-gray-200 mb-3 text-xs">
                    <span className="font-semibold text-gray-500 px-1 text-[11px] uppercase tracking-wide">
                        AI Tone:
                    </span>
                    {AI_TONES.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTone(t.id)}
                            title={t.title}
                            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                                selectedTone === t.id
                                    ? "bg-purple-600 text-white shadow-xs"
                                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
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
        </div>
    );
};

export default SummarySectionForm;

