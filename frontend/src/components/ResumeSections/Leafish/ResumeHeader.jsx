import { LuLink, LuMapPin, LuPhone } from 'react-icons/lu';
import Picture from '../Picture';
import { MdAlternateEmail } from 'react-icons/md';
import { hexToRgba, Link } from '../../../utils/helper';
import BrandIcon from '../../shared/BrandIcon';

const ResumeHeader = ({ basics, themeColors, sections }) => {
    const profileSection = sections?.profiles;
    const profiles = profileSection?.items || [];

    const summary = sections?.summary;

    const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");

    return (
        <div>
            <div
                className="p-6 flex items-center space-x-8"
                style={{ backgroundColor: hexToRgba(themeColors[2], 0.2) }}
            >
                <div className="space-y-3">
                    <div>
                        <div className="text-3xl font-bold">{basics.name}</div>
                        <div className="text-base font-medium" style={{ color: themeColors[2] }} >{basics.headline}</div>
                    </div>

                    {summary?.visible !== false && summary?.content && (
                        <div
                            dangerouslySetInnerHTML={{ __html: summary.content }}
                            style={{ columns: summary.columns, color: themeColors[1]  }}
                            className="wysiwyg"
                        />
                    )}
                </div>

                <Picture picture={basics.picture} size={120}/>
            </div>

            <div className="px-6 py-5 space-y-3" style={{ backgroundColor: hexToRgba(themeColors[2], 0.4) }}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                    {basics.location && (
                        <div className="flex items-center gap-x-1.5">
                            <LuMapPin style={{ color: themeColors[2] }} className='font-bold' />
                            <div>{basics.location}</div>
                        </div>
                    )}
                    {basics.phone && (
                        <div className="flex items-center gap-x-1.5">
                            <LuPhone style={{ color: themeColors[2] }} className='font-bold' />
                            <a
                                href={`tel:${basics.phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className='hover:underline'
                                style={{ color: themeColors[1] }}
                            >
                                {basics.phone}
                            </a>
                        </div>
                    )}
                    {basics.email && (
                        <div className="flex items-center gap-x-1.5">
                            <MdAlternateEmail style={{ color: themeColors[2] }} className='font-bold' />
                            <a
                                href={`mailto:${basics.email}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline"
                                style={{ color: themeColors[1] }}
                            >
                                {basics.email}
                            </a>
                        </div>
                    )}
                    {basics.url?.href && isValidUrl(basics.url.href) && (
                        <div className="flex items-center gap-x-1.5">
                            <LuLink style={{ color: themeColors[2] }} className='font-bold' />
                            <a
                                href={basics.url.href}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="hover:underline"
                                style={{ color: themeColors[1] }}
                            >
                                {basics.url.label || basics.url.href}
                            </a>
                        </div>
                    )}
                </div>

                {profileSection?.visible !== false && profiles.length > 0 && (
                    <div className="flex items-center gap-x-3 gap-y-0.5">
                        {profiles
                            .filter((item) => item.visible)
                            .map((item) => (
                                <div className="flex items-center gap-x-2" key={item.id || item.url.href}>
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
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default ResumeHeader
