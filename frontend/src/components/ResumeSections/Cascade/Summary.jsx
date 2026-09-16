import { stripHtml } from "../../../utils/helper";

const Summary = ({ section, themeColors = [] }) => {
  if (
    !section ||
    section.visible === false ||
    !section.content ||
    stripHtml(section.content)?.trim() === ""
  ) {
    return null;
  }

  return (
    <section id={section.id} className="w-full min-w-0 break-words mb-4">
      {/* 1. Sidebar Section Header */}
      <div className="hidden group-[.sidebar]:block w-full bg-black/25 px-5 py-1.5 mb-2.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
          {section.title || section.name || "Summary"}
        </h4>
      </div>

      {/* 2. Main Column Section Header */}
      {section.title && section.title.trim() !== "" && (
        <div className="hidden group-[.main]:block mb-3 border-b border-slate-300 pb-1">
          <h4 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-900">
            {section.title || section.name}
          </h4>
        </div>
      )}

      {/* 3. Summary Content */}
      <div className="group-[.sidebar]:px-5">
        <div
          dangerouslySetInnerHTML={{ __html: section.content }}
          className="wysiwyg text-xs sm:text-[13px] leading-relaxed group-[.sidebar]:text-slate-200 group-[.main]:text-slate-700 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:pl-4 [&>ul]:list-disc [&>ul>li]:my-0.5"
        />
      </div>
    </section>
  );
};

export default Summary;
