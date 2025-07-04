import { LinkedEntity } from '../../utils/helper';

// Components
import Section from './Section';

const Publications = ({ section }) => (
    <Section section={section} urlKey="url" summaryKey="summary">
        {(item) => (
            <div key={item.id}>
                <LinkedEntity
                    name={item.name}
                    url={item.url}
                    separateLinks={section.separateLinks}
                    className="font-bold"
                />
                <div>{item.publisher}</div>
                <div className="font-bold">{item.date}</div>
            </div>
        )}
    </Section>
);

export default Publications
