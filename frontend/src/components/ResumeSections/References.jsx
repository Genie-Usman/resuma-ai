import { LinkedEntity } from '../../utils/helper';

// Components
import Section from './Section';

const References = ({ section }) => (
    <Section section={section} urlKey="url" summaryKey="summary">
        {(item) => (
            <div key={item.id}>
                <LinkedEntity
                    name={item.name}
                    url={item.url}
                    separateLinks={section.separateLinks}
                    className="font-bold"
                />
                <div>{item.description}</div>
            </div>
        )}
    </Section>
);

export default References