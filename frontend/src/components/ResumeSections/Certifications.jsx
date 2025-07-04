import { LinkedEntity } from '../../utils/helper';

// Components
import Section from './Section';

const Certifications = ({ section }) => (
    <Section section={section} urlKey="url" summaryKey="summary">
        {(item) => (
            <div key={item.id}>
                <div className="font-bold">{item.name}</div>
                <LinkedEntity
                    name={item.issuer}
                    url={item.url}
                    separateLinks={section.separateLinks}
                />
                <div className="font-bold">{item.date}</div>
            </div>
        )}
    </Section>
);

export default Certifications