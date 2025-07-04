import Section from './Section';

const Languages = ({ section }) => (
    <Section section={section} levelKey="level">
        {(item) => (
            <div key={item.id}>
                <div className="font-bold">{item.name}</div>
                <div>{item.description}</div>
            </div>
        )}
    </Section>
);

export default Languages
