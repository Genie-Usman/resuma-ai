import Section from './Section';

const Awards = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" dateKey="date" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div>
                    <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.name}</div>
                    <div style={{ color: themeColors[1] }}>{item.awarder}</div>
                </div>
            )}
        </Section>
    );
};

export default Awards