import Section from './Section';

const Experience = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div key={item.id}>
                    <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.company}</div>
                    <div style={{ color: themeColors[1] }}>{item.position}</div>
                    <div style={{ color: themeColors[1] }}>{item.location}</div>
                    <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                </div>
            )}
        </Section>
    );
};

export default Experience;