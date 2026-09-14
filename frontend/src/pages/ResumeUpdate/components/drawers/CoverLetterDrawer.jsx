import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  LuSparkles,
  LuMail,
  LuBuilding,
  LuBriefcase,
  LuX,
  LuDownload,
  LuFileText,
  LuLayers,
  LuRefreshCw,
  LuCheck,
  LuUser,
  LuMapPin,
  LuAlignLeft,
} from "react-icons/lu";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineUndo,
  AiOutlineRedo,
} from "react-icons/ai";
import { MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";
import toast from "react-hot-toast";
import axiosInstance from "../../../../utils/axiosInstance";
import { API_PATHS } from "../../../../utils/apiPaths";

/**
 * Editor Toolbar for Cover Letter Body
 */
const LetterEditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const baseBtn =
    "p-1.5 rounded-md transition-colors text-xs font-medium cursor-pointer flex items-center justify-center";
  const iconBtn = (isActive) =>
    `${baseBtn} ${
      isActive
        ? "bg-purple-100 text-purple-800 font-semibold shadow-2xs"
        : "hover:bg-slate-200/70 text-slate-600"
    }`;
  const disabledBtn = `${baseBtn} text-slate-300 cursor-not-allowed`;

  return (
    <div className="flex items-center gap-1 border border-slate-200/90 bg-slate-50/90 rounded-t-xl px-2.5 py-1.5 border-b-0">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? iconBtn(true) : iconBtn(false)}
        title="Bold (Ctrl+B)"
      >
        <AiOutlineBold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? iconBtn(true) : iconBtn(false)}
        title="Italic (Ctrl+I)"
      >
        <AiOutlineItalic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? iconBtn(true) : iconBtn(false)}
        title="Underline (Ctrl+U)"
      >
        <AiOutlineUnderline className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-3.5 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? iconBtn(true) : iconBtn(false)}
        title="Bullet List"
      >
        <MdFormatListBulleted className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? iconBtn(true) : iconBtn(false)}
        title="Numbered List"
      >
        <MdFormatListNumbered className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-3.5 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={editor.can().undo() ? iconBtn(false) : disabledBtn}
        title="Undo (Ctrl+Z)"
      >
        <AiOutlineUndo className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={editor.can().redo() ? iconBtn(false) : disabledBtn}
        title="Redo (Ctrl+Y)"
      >
        <AiOutlineRedo className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

/**
 * CoverLetterDrawer Component (Roadmap Item 4.4)
 * Allows generating a tailored cover letter synchronized with resume aesthetics,
 * and gives 100% full editing power over the recipient, salutation, body paragraphs, and sign-off.
 */
const CoverLetterDrawer = ({
  resumeData,
  updateCoverLetter,
  onDownloadCoverLetterPdf,
  onDownloadApplicationPackage,
  isExporting = false,
  onClose,
  onSwitchToCoverLetterView,
  canvasDocType = "resume",
}) => {
  const coverLetter = resumeData?.data?.coverLetter || {};
  const candidateName = resumeData?.data?.basics?.name || "Candidate";

  // Generator inputs
  const [jobDescription, setJobDescription] = useState(
    coverLetter.jobDescription || ""
  );
  const [targetCompany, setTargetCompany] = useState(
    coverLetter.companyName || coverLetter.recipient?.company || ""
  );
  const [targetJobTitle, setTargetJobTitle] = useState(
    coverLetter.jobTitle || ""
  );
  const [tone, setTone] = useState(coverLetter.tone || "impactful");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("editor"); // "editor" | "generator"

  // Tiptap Rich Text Editor for Letter Body
  const initialHtml =
    coverLetter.bodyHtml ||
    (Array.isArray(coverLetter.bodyParagraphs) && coverLetter.bodyParagraphs.length > 0
      ? [
          coverLetter.opening ? `<p>${coverLetter.opening}</p>` : "",
          ...coverLetter.bodyParagraphs.map((p) => `<p>${p}</p>`),
          coverLetter.callToAction ? `<p>${coverLetter.callToAction}</p>` : "",
        ]
          .filter(Boolean)
          .join("")
      : "<p>Dear Hiring Team,</p><p>I am writing to express my enthusiastic interest...</p>");

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] max-h-[360px] p-3.5 border overflow-auto custom-scrollbar border-slate-200/90 rounded-b-xl bg-white focus:outline-none prose prose-sm max-w-none text-slate-800 focus:ring-1 focus:ring-purple-500/30 text-xs leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateCoverLetter({ bodyHtml: html });
    },
  });

  // Sync editor if external update occurred (e.g. AI generation)
  useEffect(() => {
    if (editor && coverLetter.bodyHtml && editor.getHTML() !== coverLetter.bodyHtml) {
      editor.commands.setContent(coverLetter.bodyHtml, false);
    }
  }, [editor, coverLetter.bodyHtml]);

  // Handle AI Cover Letter Generation
  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Synthesizing matched cover letter with AI...", {
      id: "cover-letter-gen",
    });

    try {
      const response = await axiosInstance.post(
        API_PATHS.GEMINI.GENERATE_COVER_LETTER,
        {
          resumeData: resumeData?.data || resumeData,
          jobDescription: jobDescription.trim(),
          companyName: targetCompany.trim(),
          targetCompany: targetCompany.trim(),
          jobTitle: targetJobTitle.trim(),
          targetJobTitle: targetJobTitle.trim(),
          tone,
        }
      );

      const generated = response.data?.coverLetter || response.data;
      if (!generated || typeof generated !== "object") {
        throw new Error("Invalid response format from AI service");
      }

      // Build consolidated HTML for rich text editor
      const paragraphsHtml = [
        generated.opening ? `<p>${generated.opening}</p>` : "",
        ...(Array.isArray(generated.bodyParagraphs)
          ? generated.bodyParagraphs.map((p) => `<p>${p}</p>`)
          : []),
        generated.callToAction ? `<p>${generated.callToAction}</p>` : "",
      ]
        .filter(Boolean)
        .join("");

      const finalBodyHtml = generated.fullHtml || paragraphsHtml;

      const updatedLetter = {
        companyName: targetCompany.trim() || generated.companyName || "",
        jobTitle: targetJobTitle.trim() || generated.jobTitle || "",
        jobDescription: jobDescription.trim(),
        tone,
        recipient: {
          name: generated.recipient?.name || "Hiring Team",
          title: generated.recipient?.title || "Hiring Manager",
          company: targetCompany.trim() || generated.recipient?.company || "",
          address: generated.recipient?.address || "",
        },
        salutation:
          generated.salutation ||
          (targetCompany.trim()
            ? `Dear Hiring Team at ${targetCompany.trim()},`
            : "Dear Hiring Team,"),
        opening: generated.opening || "",
        bodyParagraphs: generated.bodyParagraphs || [],
        callToAction: generated.callToAction || "",
        signOff: generated.signOff || "Sincerely,",
        signature: generated.signature || candidateName,
        bodyHtml: finalBodyHtml,
        lastGeneratedAt: new Date().toISOString(),
      };

      // Persist to resume state
      updateCoverLetter(updatedLetter, true);

      // Update editor instance
      if (editor) {
        editor.commands.setContent(finalBodyHtml, false);
      }

      // Automatically switch canvas preview to cover letter
      if (onSwitchToCoverLetterView) {
        onSwitchToCoverLetterView();
      }

      // Switch to editor subtab so user can immediately edit
      setActiveSubTab("editor");

      toast.success("Matched cover letter crafted! You can now edit any section.", {
        id: toastId,
      });
    } catch (err) {
      console.error("Cover letter generation failed:", err);
      const serverMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      toast.error(
        serverMsg || "Failed to generate cover letter. Please try again.",
        { id: toastId }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const recipient = coverLetter.recipient || {};

  return (
    <div className="w-full h-full flex flex-col bg-white select-none overflow-hidden">
      {/* 1. Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <LuMail className="text-base" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">
              Matched Cover Letter
            </h2>
            <p className="text-[11px] text-slate-500 leading-tight">
              Synchronized typography, palette & narrative
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Close drawer"
        >
          <LuX className="text-base" />
        </button>
      </div>

      {/* 2. Sub-Tabs: AI Generator vs Live Editor */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-200/70 bg-white shrink-0">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab("editor")}
            className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === "editor"
                ? "bg-white text-purple-700 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LuAlignLeft className="text-xs" />
            <span>Edit Letter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("generator")}
            className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === "generator"
                ? "bg-white text-purple-700 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LuSparkles className="text-xs text-purple-600" />
            <span>AI Match</span>
          </button>
        </div>

        {/* View Sync Notification / Toggle */}
        {canvasDocType !== "cover-letter" && onSwitchToCoverLetterView && (
          <button
            type="button"
            onClick={onSwitchToCoverLetterView}
            className="w-full mt-2 py-1 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/70 text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>✉️</span> View Cover Letter on Canvas
            </span>
            <span className="text-[10px] underline">Switch &rarr;</span>
          </button>
        )}
      </div>

      {/* 3. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* TAB 1: FULL EDITING MODE */}
        {activeSubTab === "editor" && (
          <div className="space-y-4">
            {/* Recipient Details Section */}
            <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <LuUser className="text-xs text-purple-600" /> Recipient Details
                </label>
                <span className="text-[10px] text-slate-400">Printed on header</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-500 block mb-0.5">
                    Hiring Manager / Team
                  </label>
                  <input
                    type="text"
                    value={recipient.name || ""}
                    onChange={(e) =>
                      updateCoverLetter({
                        recipient: { ...recipient, name: e.target.value },
                      })
                    }
                    placeholder="e.g. Hiring Team"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-500 block mb-0.5">
                    Recipient Title
                  </label>
                  <input
                    type="text"
                    value={recipient.title || ""}
                    onChange={(e) =>
                      updateCoverLetter({
                        recipient: { ...recipient, title: e.target.value },
                      })
                    }
                    placeholder="e.g. VP of Engineering"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-500 block mb-0.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={coverLetter.companyName || recipient.company || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTargetCompany(val);
                      updateCoverLetter({
                        companyName: val,
                        recipient: { ...recipient, company: val },
                      });
                    }}
                    placeholder="e.g. Stripe"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-500 block mb-0.5">
                    Company Location / Address
                  </label>
                  <input
                    type="text"
                    value={recipient.address || ""}
                    onChange={(e) =>
                      updateCoverLetter({
                        recipient: { ...recipient, address: e.target.value },
                      })
                    }
                    placeholder="e.g. San Francisco, CA"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Salutation Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Salutation Greeting
              </label>
              <input
                type="text"
                value={coverLetter.salutation || ""}
                onChange={(e) =>
                  updateCoverLetter({ salutation: e.target.value })
                }
                placeholder="e.g. Dear Hiring Team at Stripe,"
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 font-medium"
              />
            </div>

            {/* Rich Text Body Editor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Letter Body (Rich Text)
                </label>
                <span className="text-[10px] text-slate-400">
                  Bold, italic, and bullet lists supported
                </span>
              </div>

              <div className="w-full">
                <LetterEditorToolbar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Formal Sign-Off & Signature */}
            <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/80 space-y-2.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Sign-off & Signature
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-500 block mb-0.5">
                    Sign-off Phrase
                  </label>
                  <input
                    type="text"
                    value={coverLetter.signOff || "Sincerely,"}
                    onChange={(e) =>
                      updateCoverLetter({ signOff: e.target.value })
                    }
                    placeholder="Sincerely,"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-500 block mb-0.5">
                    Candidate Signature
                  </label>
                  <input
                    type="text"
                    value={coverLetter.signature || candidateName}
                    onChange={(e) =>
                      updateCoverLetter({ signature: e.target.value })
                    }
                    placeholder={candidateName}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI GENERATOR FORM */}
        {activeSubTab === "generator" && (
          <div className="space-y-3.5">
            <div className="p-3 bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-200/70 rounded-xl text-xs text-purple-900 leading-relaxed">
              <p className="font-semibold flex items-center gap-1 mb-1">
                <LuSparkles className="text-purple-600" /> Automatic Resume Synchronization
              </p>
              Resuma AI reads your work experience, quantified achievements, and target role to compose a tailored letter aligned directly with this employer.
            </div>

            {/* Target Company & Job Title */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Target Company
                </label>
                <div className="relative">
                  <LuBuilding className="absolute left-2.5 top-2.5 text-slate-400 text-xs" />
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. Figma, Google"
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Target Job Title
                </label>
                <div className="relative">
                  <LuBriefcase className="absolute left-2.5 top-2.5 text-slate-400 text-xs" />
                  <input
                    type="text"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Letter Tone & Voice
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "impactful", label: "Impactful", desc: "Results-driven & confident" },
                  { id: "formal", label: "Formal", desc: "Traditional executive cadence" },
                  { id: "technical", label: "Technical", desc: "Architecture & engineering focus" },
                  { id: "conversational", label: "Conversational", desc: "Modern startup warmth" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      tone === item.id
                        ? "bg-purple-50 border-purple-300 text-purple-900 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{item.label}</span>
                      {tone === item.id && <LuCheck className="text-purple-600 text-xs" />}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description Textarea */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Pasted Job Description
              </label>
              <textarea
                rows={7}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description or key requirements here..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 custom-scrollbar leading-relaxed"
              />
            </div>

            {/* Action Trigger */}
            <button
              type="button"
              disabled={isGenerating || !jobDescription.trim()}
              onClick={handleGenerateCoverLetter}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-50 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <LuRefreshCw className="text-sm animate-spin" />
                  <span>Synthesizing Matched Cover Letter...</span>
                </>
              ) : (
                <>
                  <LuSparkles className="text-sm" />
                  <span>Generate Matched Cover Letter</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 4. Bottom Drawer Export & Action Bar */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/70 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
          <span>Export Options</span>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full">
            Vector PDF
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Download Standalone Cover Letter */}
          <button
            type="button"
            disabled={isExporting}
            onClick={onDownloadCoverLetterPdf}
            className="py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Download matched 1-page Cover Letter PDF"
          >
            <LuFileText className="text-xs text-purple-600" />
            <span className="truncate">Cover Letter</span>
          </button>

          {/* Download 2-Page Application Package */}
          <button
            type="button"
            disabled={isExporting}
            onClick={onDownloadApplicationPackage}
            className="py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Download 2-Page Package (Resume + Cover Letter)"
          >
            <LuLayers className="text-xs" />
            <span className="truncate">2-Page Package</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterDrawer;
