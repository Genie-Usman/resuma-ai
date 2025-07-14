import { LinkedEntity } from '../../../utils/helper';

// Components
import Section from './Section';

const Volunteer = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div className="flex items-start justify-between">
                    <div className="text-left">
                        <LinkedEntity
                            name={item.organization}
                            url={item.url}
                            separateLinks={section.separateLinks}
                            className="font-bold"
                            themeColors={themeColors}
                        />
                        <div style={{ color: themeColors[1] }}>{item.position}</div>
                    </div>

                    <div className="shrink-0 text-right">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                        <div style={{ color: themeColors[1] }}>{item.location}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default Volunteer