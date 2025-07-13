import { LinkedEntity } from '../../../utils/helper';

// Components
import Section from './Section';

const Projects = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords" themeColors={themeColors}>
            {(item) => (
                <div>
                    <div>
                        <LinkedEntity
                            name={item.name}
                            url={item.url}
                            themeColors={themeColors}
                            separateLinks={section.separateLinks}
                            className="font-bold"
                        />
                        <div style={{ color: themeColors[1] }}>{item.description}</div>
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default Projects