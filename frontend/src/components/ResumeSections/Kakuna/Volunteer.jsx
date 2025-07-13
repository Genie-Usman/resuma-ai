import { LinkedEntity } from '../../../utils/helper';

// Components
import Section from './Section';

const Volunteer = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div>
                    <LinkedEntity
                        name={item.organization}
                        url={item.url}
                        separateLinks={section.separateLinks}
                        className="font-bold"
                        themeColors={themeColors}
                    />
                    <div style={{ color: themeColors[1] }}>{item.position}</div>
                    <div style={{ color: themeColors[1] }}>{item.location}</div>
                    <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                </div>
            )}
        </Section>
    );
};

export default Volunteer