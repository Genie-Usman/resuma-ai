import Section from './Section';

const Languages = ({ section, themeColors }) => {

    return (
        <Section section={section} levelKey="level" isSidebar={true} themeColors={themeColors}>
            {(item) => (
                <div className="space-y-0.5">
                    <div style={{ fontWeight: 'bold', color: themeColors[0] }}>{item.name}</div>
                    <div style={{ color: themeColors[0] }}>{item.description}</div>
                </div>
            )}
        </Section>
    );
};

export default Languages
