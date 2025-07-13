import Section from './Section';

const Interests = ({ section, themeColors }) => {

    return (
        <Section section={section} keywordsKey="keywords" className="space-y-0.5" themeColors={themeColors}>
            {(item) => <div key={item.id} style={{ fontWeight: 'bold', color: themeColors[1] }}>
                {item.name}
            </div>}
        </Section>
    );
};

export default Interests