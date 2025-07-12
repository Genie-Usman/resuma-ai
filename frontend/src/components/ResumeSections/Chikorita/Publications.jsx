import { LinkedEntity } from '../../../utils/helper';

// Components
import Section from './Section';

const Publications = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" isSidebar={true} themeColors={themeColors}>
            {(item) => (
                <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <LinkedEntity
                            name={item.name}
                            url={item.url}
                            separateLinks={section.separateLinks}
                            themeColors={themeColors}
                            className="font-bold"
                            isSidebar={true}
                        />
                        <div style={{ color: themeColors[0] }}>{item.publisher}</div>
                    </div>

                    <div className="shrink-0 text-right">
                        <div style={{ fontWeight: 'bold', color: themeColors[0] }}>{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default Publications
