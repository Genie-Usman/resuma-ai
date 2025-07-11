import Section from './Section';

const Education = ({ section, themeColors }) => (
    <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
        {(item) => (
            <div key={item.id}>
                <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.institution}</div>
                <div style={{ color: themeColors[1] }}>{item.area}</div>
                <div style={{ color: themeColors[1] }}>{item.score}</div>
                <div style={{ color: themeColors[1] }}>{item.studyType}</div>
                <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
            </div>
        )}
    </Section>
);

export default Education