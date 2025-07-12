import { LuLink, LuMapPin, LuPhone } from 'react-icons/lu';
import Picture from '../Picture';
import { MdAlternateEmail } from 'react-icons/md';

const ResumeHeader = ({ basics, themeColors }) => {

    const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");

    return (
        <div
            className="flex flex-col items-center space-y-4 text-center"
            style={{ color: themeColors[1] }}
        >
            <Picture picture={basics.picture} />

            <div className="space-y-4">
                <div>
                    <div className="text-2xl font-bold">{basics.name}</div>
                    <div className="text-base">{basics.headline}</div>
                </div>

                <div
                    className="flex flex-col items-start gap-y-1.5 rounded border px-3 py-4 text-left text-sm"
                    style={{ borderColor: themeColors[2] }}>
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
            </div>
        </div>
    );
};

export default ResumeHeader
