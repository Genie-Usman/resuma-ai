import { LinkedEntity } from '../../../utils/helper';

// Components
import Section from './Section';

const References = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div>
                    <LinkedEntity
                        name={item.name}
                        url={item.url}
                        separateLinks={section.separateLinks}
                        className="font-bold"
                        themeColors={themeColors}
                    />
                    <div style={{ color: themeColors[1] }}>{item.description}</div>
                </div>
            )}
        </Section>
    );
};

export default References
