import { LinkedEntity } from '../../utils/helper';

// Components
import Section from './Section';

const Awards = ({ section }) => (
    <Section section={section} urlKey="url" summaryKey="summary">
        {(item) => (
            <div key={item.id}>
                <div className="font-bold">{item.title}</div>
                <LinkedEntity
                    name={item.awarder}
                    url={item.url}
                    separateLinks={section.separateLinks}
                />
                <div className="font-bold">{item.date}</div>
            </div>
        )}
    </Section>
);

export default Awards