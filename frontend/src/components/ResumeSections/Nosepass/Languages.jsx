import Section from './Section';

const Languages = ({ section, themeColors }) => {

    return (
        <Section section={section} levelKey="level" themeColors={themeColors}>
            {(item) => (
                <div>
                    <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.name}</div>
                    <div style={{ color: themeColors[1] }}>{item.description}</div>
                </div>
            )}
        </Section>
    );
};

export default Languages