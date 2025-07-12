import Section from './Section';

const Certifications = ({ section, themeColors }) => {

    return (
        <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
            {(item) => (
                <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.name}</div>
                        <div style={{ color: themeColors[1] }}>{item.issuer}</div>
                    </div>

                    <div className="shrink-0 text-right">
                        <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default Certifications
