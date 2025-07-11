import { LinkedEntity } from '../../../utils/helper';

// Components
import Section from './Section';

const Projects = ({ section, themeColors }) => (
    <Section section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords" themeColors={themeColors}>
        {(item) => (
            <div key={item.id}>
                <LinkedEntity
                    name={item.name}
                    url={item.url}
                    separateLinks={section.separateLinks}
                    themeColors={themeColors}
                    className="font-bold"
                />
                <div style={{ color: themeColors[1] }}>{item.description}</div>
                <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
            </div>
        )}
    </Section>
);

export default Projects
