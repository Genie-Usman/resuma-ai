import { Link } from '../../utils/helper';

// Components
import BrandIcon from '../shared/BrandIcon';
import Section from './Section';

const Profiles = ({ section, themeColors }) => (
    <Section section={section} themeColors={themeColors}>
        {(item) => (
            <div key={item.id} className="flex items-center gap-x-2">
                <BrandIcon
                    slug={item.icon}
                    className="size-4"
                    style={{ color: themeColors[2] }}
                />
                {item.url?.href ? (
                    <Link url={item.url} label={item.username} themeColors={themeColors} />
                ) : (
                    <span style={{ color: themeColors[1] }}>{item.username}</span>
                )}
            </div>
        )}
    </Section>
);

export default Profiles;
