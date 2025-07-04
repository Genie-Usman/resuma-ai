import Section from './Section';

const Skills = ({ section, themeColors }) => (
    <Section section={section} levelKey="level" keywordsKey="keywords" themeColors={themeColors}>
        {(item) => (
            <div key={item.id}>
                <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.name}</div>
                <div style={{ color: themeColors[1] }}>{item.description}</div>
            </div>
        )}
    </Section>
);

export default Skills