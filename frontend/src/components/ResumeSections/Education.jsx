import { LinkedEntity } from '../../utils/helper';

// Components
import Section from './Section';

const Education = ({ section }) => (
    <Section section={section} urlKey="url" summaryKey="summary">
        {(item) => (
            <div key={item.id}>
                <LinkedEntity
                    name={item.institution}
                    url={item.url}
                    separateLinks={section.separateLinks}
                    className="font-bold"
                />
                <div>{item.area}</div>
                <div>{item.score}</div>
                <div>{item.studyType}</div>
                <div className="font-bold">{item.date}</div>
            </div>
        )}
    </Section>
);

export default Education