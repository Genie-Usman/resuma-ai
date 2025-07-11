import Section from './Section';

const Awards = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div className="flex items-start justify-between">
                    <div className="text-left">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.name}</div>
                        <div style={{ color: themeColors[1] }}>{item.awarder}</div>
                    </div>

                    <div className="shrink-0 text-right">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default Awards