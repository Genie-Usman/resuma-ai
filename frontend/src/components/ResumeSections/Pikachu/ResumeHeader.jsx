import { LuLink, LuMapPin, LuPhone } from 'react-icons/lu';
import { MdAlternateEmail } from 'react-icons/md';

const ResumeHeader = ({ basics, themeColors }) => {
    const borderRadius = basics.picture.borderRadius;

    const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");

    return (
        <div
            className="summary group px-6 pb-7 pt-6"
            style={{ borderRadius: `calc(${borderRadius}px - 2px)`, backgroundColor: themeColors[2], color: themeColors[1] }}
        >
            <div className="col-span-2 space-y-2.5">
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: themeColors[0] }}>{basics.name}</h2>
                    <p style={{ color: themeColors[0] }}>{basics.headline}</p>
                </div>

                <hr className="opacity-50" style={{ borderColor: themeColors[0] }} />

                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                    {basics.location && (
                        <>
                            <div className="flex items-center gap-x-1.5">
                                <LuMapPin style={{ color: themeColors[0] }} className='font-bold' />
                                <div style={{ color: themeColors[0] }}>{basics.location}</div>
                            </div>
                            <div className="size-1 rounded-full last:hidden" style={{ backgroundColor: themeColors[0] }} />
                        </>
                    )}
                    {basics.phone && (
                        <>
                            <div className="flex items-center gap-x-1.5">
                                <LuPhone style={{ color: themeColors[0] }} className='font-bold' />
                                <a
                                    href={`tel:${basics.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className='hover:underline'
                                    style={{ color: themeColors[0] }}
                                >
                                    {basics.phone}
                                </a>
                            </div>
                            <div className="size-1 rounded-full last:hidden" style={{ backgroundColor: themeColors[0] }} />
                        </>
                    )}
                    {basics.email && (
                        <>
                            <div className="flex items-center gap-x-1.5">
                                <MdAlternateEmail style={{ color: themeColors[0] }} className='font-bold' />
                                <a
                                    href={`mailto:${basics.email}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                    style={{ color: themeColors[0] }}
                                >
                                    {basics.email}
                                </a>
                            </div>
                        </>
                    )}
                    {basics.url?.href && isValidUrl(basics.url.href) && (
                        <>
                            <div className="flex items-center gap-x-1.5">
                                <LuLink style={{ color: themeColors[0] }} className='font-bold' />
                                <a
                                    href={basics.url.href}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="hover:underline"
                                    style={{ color: themeColors[0] }}
                                >
                                    {basics.url.label || basics.url.href}
                                </a>
                            </div>
                            <div className="size-1 rounded-full last:hidden" style={{ backgroundColor: themeColors[0] }} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeHeader
