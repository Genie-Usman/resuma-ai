import { stripHtml } from "../../../utils/helper";

const Summary = ({ section, themeColors }) => {
  if (!section || section.visible === false || !section.content || stripHtml(section.content)?.trim() === "") {
    return null;
  }

  return (
    <section id={section.id}>
      {/* Section Header */}
      <div className="mb-2 font-bold" style={{ color: themeColors[2] }}>
        <h4>{section.title || section.name}</h4>
      </div>

      {/* Main Content */}
      <div className="relative space-y-2 border-l pl-4" style={{ color: themeColors[2] }}>
        {/* Decorative dot on left */}
        <div
          className="absolute left-[-4.5px] top-[8px] size-[8px] rounded-full"
          style={{ backgroundColor: themeColors[2] }} />

        {/* Summary content */}
        <div
          dangerouslySetInnerHTML={{ __html: section.content }}
          style={{ columns: section.columns || 1, color: themeColors[1] }}
          className="wysiwyg"
        />
      </div>
    </section>
  );
};

export default Summary;