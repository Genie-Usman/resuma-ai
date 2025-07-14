import { LinkedEntity } from '../../../utils/helper';

// Components
import Section from './Section';

const Projects = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords" themeColors={themeColors}>
            {(item) => (
                <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <LinkedEntity
                            name={item.name}
                            url={item.url}
                            themeColors={themeColors}
                            separateLinks={section.separateLinks}
                            className="font-bold"
                        />
                        <div style={{ color: themeColors[1] }}>{item.description}</div>
                    </div>

                    <div className="shrink-0 text-right group-[.sidebar]:text-left">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default Projects