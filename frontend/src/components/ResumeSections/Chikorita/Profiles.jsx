import { Link } from '../../../utils/helper';

// Components
import BrandIcon from '../../shared/BrandIcon';
import Section from './Section';

const Profiles = ({ section, themeColors }) => {
    return (
        <Section section={section} themeColors={themeColors}>
            {(item) => (
                <div className="flex items-center gap-x-2">
                    <BrandIcon
                        slug={item.icon}
                        style={{ color: themeColors[1] }}
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
};

export default Profiles