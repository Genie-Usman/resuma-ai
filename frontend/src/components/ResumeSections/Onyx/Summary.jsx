import { stripHtml } from '../../../utils/helper';

const Summary = ({ section, themeColors }) => {
  if (!section || !section.content || stripHtml(section.content)?.trim() === "") {
    return null;
  }

  return (
    <section id={section.id}>
      <h4 className="font-bold" style={{ color: themeColors[2] }}>{section.name}</h4>

      <div
        dangerouslySetInnerHTML={{ __html: section.content }}
        style={{ columns: section.columns, color: themeColors[1] }}
        className="wysiwyg"
      />
    </section>
  );
};

export default Summary
