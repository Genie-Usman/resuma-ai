import Section from './Section';

const Skills = ({ section }) => (
    <Section section={section} levelKey="level" keywordsKey="keywords">
        {(item) => (
            <div key={item.id}>
                <div className="font-bold">{item.name}</div>
                <div>{item.description}</div>
            </div>
        )}
    </Section>
);

export default Skills