import Section from './Section';

const Skills = ({ section, themeColors }) => {

    return (
        <Section section={section} levelKey="level" keywordsKey="keywords" isSidebar={true} themeColors={themeColors}>
            {(item) => (
                <div>
                    <div style={{ fontWeight: 'bold', color: themeColors[0] }}>{item.name}</div>
                    <div style={{ color: themeColors[0] }}>{item.description}</div>
                </div>
            )}
        </Section>
    );
}

export default Skills;