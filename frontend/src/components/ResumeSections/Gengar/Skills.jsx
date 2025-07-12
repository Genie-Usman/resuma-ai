import Section from './Section';

const Skills = ({ section, themeColors }) => {

    return (
        <Section section={section} levelKey="level" keywordsKey="keywords" themeColors={themeColors}>
      {(item) => (
        <div>
          <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.name}</div>
                    <div style={{ color: themeColors[1] }}>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

export default Skills