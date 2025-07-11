import { stripHtml } from '../../../utils/helper';

const Summary = ({ section, themeColors }) => {
  if (!section || !section.content || stripHtml(section.content)?.trim() === "") {
    return null;
  }

  return (
    <section id={section.id} className="grid grid-cols-5 border-t pt-2.5">
      <div>
        <h4 className="text-base font-bold" style={{ color: themeColors[1] }}>{section.name}</h4>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: section.content }}
        style={{ columns: section.columns }}
        className="wysiwyg col-span-4"
      />
    </section>
  );
};

export default Summary
