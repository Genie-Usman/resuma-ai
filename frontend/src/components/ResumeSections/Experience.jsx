import { LinkedEntity } from '../../utils/helper';

// Components
import Section from './Section';

const Experience = ({ section }) => (
    <Section section={section} urlKey="url" summaryKey="summary">
        {(item) => (
            <div key={item.id}>
                <LinkedEntity
                    name={item.company}
                    url={item.url}
                    separateLinks={section.separateLinks}
                    className="font-bold"
                />
                <div>{item.position}</div>
                <div>{item.location}</div>
                <div className="font-bold">{item.date}</div>
            </div>
        )}
    </Section>
);

export default Experience