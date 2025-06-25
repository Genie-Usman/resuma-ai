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

const SummarySectionForm = ({ content, updateContent }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
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
        <div className="px-5 pt-5">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="col-span-2 mt-3">
                    <h2 className="mb-1 font-semibold text-lg">Summary</h2>
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};

export default SummarySectionForm;
