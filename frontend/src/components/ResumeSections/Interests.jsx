import Section from './Section';

const Interests = ({ section }) => (
    <Section section={section} keywordsKey="keywords" className="space-y-0.5">
        {(item) => (
            <div key={item.id} className="font-bold">
                {item.name}
            </div>
        )}
    </Section>
);

export default Interests
