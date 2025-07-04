import { Link } from '../../utils/helper';

// Components
import BrandIcon from '../shared/BrandIcon';
import Section from './Section';

const Profiles = ({ section }) => (
    <Section section={section}>
        {(item) => (
            <div key={item.id} className="flex items-center gap-x-2">
                <BrandIcon slug={item.icon} className="text-primary size-4" />
                {item.url?.href ? (
                    <Link url={item.url} label={item.username} />
                ) : (
                    <span>{item.username}</span>
                )}
            </div>
        )}
    </Section>
);

export default Profiles