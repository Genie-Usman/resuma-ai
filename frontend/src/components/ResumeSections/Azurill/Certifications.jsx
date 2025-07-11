import Section from './Section';

const Certifications = ({ section, themeColors }) => (
    <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
        {(item) => (
            <div key={item.id}>
                <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.name}</div>
                <div style={{ color: themeColors[1] }}>{item.issuer}</div>
                <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
            </div>
        )}
    </Section>
);

export default Certifications