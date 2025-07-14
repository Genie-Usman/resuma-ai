import { LinkedEntity } from '../../../utils/helper';

// Components
import Section from './Section';

const Publications = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div className="flex items-start justify-between">
                    <div className="text-left">
                        <LinkedEntity
                            name={item.name}
                            url={item.url}
                            separateLinks={section.separateLinks}
                            themeColors={themeColors}
                            className="font-bold"
                        />
                        <div style={{ color: themeColors[1] }}>{item.publisher}</div>
                    </div>

                    <div className="shrink-0 text-right">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};


export default Publications
