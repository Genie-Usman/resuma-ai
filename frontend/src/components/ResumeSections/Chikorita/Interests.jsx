import Section from './Section';

const Interests = ({ section, themeColors }) => {

    return (
        <Section section={section} keywordsKey="keywords" className="space-y-0.5" isSidebar={true} themeColors={themeColors}>
            {(item) => <div key={item.id} style={{ fontWeight: 'bold', color: themeColors[0] }}>
                {item.name}
            </div>}
        </Section>
    );
};

export default Interests