import Section from './Section';

const Certifications = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" dateKey="date" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div>
                    <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.name}</div>
                    <div style={{ color: themeColors[1] }}>{item.issuer}</div>
                </div>
            )}
        </Section>
    );
};


export default Certifications
