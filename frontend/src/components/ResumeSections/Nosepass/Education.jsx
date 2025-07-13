import Section from './Section';

const Education = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" dateKey="date" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div>
                    <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.institution}</div>
                    <div style={{ color: themeColors[1] }}>{item.area}</div>
                    <div style={{ color: themeColors[1] }}>{item.score}</div>
                    <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                    <div style={{ color: themeColors[1] }}>{item.studyType}</div>
                </div>
            )}
        </Section>
    );
};

export default Education