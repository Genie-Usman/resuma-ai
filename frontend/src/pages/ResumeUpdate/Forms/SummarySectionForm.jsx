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

const SummarySectionForm = ({ content, updateContent, sectionId, item }) => {

    const fetchGeneratedItemSummary = async (section, item) => {
        const res = await axiosInstance.post(API_PATHS.GEMINI.GENERATE_ITEM_SUMMARY, { section, item });
        return res.data.summary;
    };

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGenerateSummary = async () => {
        setLoading(true);
        try {
            const summaries = await fetchGeneratedItemSummary(sectionId, item); 
            const levels = Object.entries(summaries).map(([level, summary]) => ({
                level,
                summary,
            }));

            setSuggestions(levels);

        } catch (err) {
            console.error("Failed to generate summary:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (summary) => {
        if (editor) {
            editor.commands.setContent(summary);
            updateContent(summary);
        }
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
                    'min-h-[200px] max-h-[200px] p-3 border overflow-auto custom-scrollbar border-gray-300 rounded bg-white focus:outline-none prose prose-sm max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            updateContent(editor.getHTML());
        },
    });

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className="col-span-2 mt-3">
                {/* heading & Generate Summary Button */}
                <div className='flex flex-row justify-between'>
                    <h2 className="mb-1 font-semibold text-xl">Summary</h2>
                    <Button onClick={handleGenerateSummary} disabled={loading} >
                        {!loading ? "Generate from AI" : "Generating..."}
                    </Button>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <div className="flex flex-col gap-3 mb-3">
                        {suggestions.map(({ level, summary }) => (
                            <div
                                key={level}
                                onClick={() => handleSuggestionClick(summary)}
                                className="flex-1 border border-purple-300 rounded-md p-3 cursor-pointer hover:bg-purple-50 transition"
                            >
                                <h3 className="font-semibold capitalize text-sm mb-1 text-purple-600">
                                    {level}
                                </h3>
                                <p className="text-sm 2xl:text-base text-gray-700">{summary}</p>
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
