import Section from './Section';

const Education = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div className="flex items-start justify-between">
                    <div className="text-left">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.institution}</div>
                        <div style={{ color: themeColors[1] }}>{item.area}</div>
                        <div style={{ color: themeColors[1] }}>{item.score}</div>
                    </div>

                    <div className="shrink-0 text-right">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                        <div style={{ color: themeColors[1] }}>{item.studyType}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default Education
