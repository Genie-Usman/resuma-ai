import { hexToRgba, stripHtml } from '../../../utils/helper';

const Summary = ({ section, themeColors }) => {
    if (!section || !section.content || stripHtml(section.content)?.trim() === "") {
        return null;
    }

    return (
        <div
            className="px-4 py-4.5 space-y-4"
            style={{ backgroundColor: hexToRgba(themeColors[2], 0.25) }} // 0.25 background transparency only
        >
            <section id={section.id}>
                <div
                    dangerouslySetInnerHTML={{ __html: section.content }}
                    style={{ columns: section.columns, color: themeColors[1] }} // text stays solid
                    className="wysiwyg"
                />
            </section>
        </div>

    );
};

export default Summary
