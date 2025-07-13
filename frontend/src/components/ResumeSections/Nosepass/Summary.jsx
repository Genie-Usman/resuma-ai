import { stripHtml } from '../../../utils/helper';

const Summary = ({ section, themeColors }) => {
    if (!section || !section.content || stripHtml(section.content)?.trim() === "") {
        return null;
    }

    return (
        <section id={section.id} className="grid grid-cols-4 gap-x-6">
            <div className="text-right">
                <h4 className="font-medium" style={{ color: themeColors[2] }}>{section.name}</h4>
            </div>

            <div className="col-span-3">
                <div className="relative">
                    <hr className="mt-3 pb-3" style={{ borderColor: themeColors[2] }} />
                    <div
                        className="absolute bottom-3 right-0 w-3 h-3 border"
                        style={{
                            borderColor: themeColors[2],
                            backgroundColor: themeColors[2],
                            borderWidth: '2px'
                        }}
                    />
                </div>

                <div
                    dangerouslySetInnerHTML={{ __html: section.content }}
                    style={{ columns: section.columns, color: themeColors[1] }}
                    className="wysiwyg"
                />
            </div>
        </section>
    );
};

export default Summary