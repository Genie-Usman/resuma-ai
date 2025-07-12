import { LuLink, LuMapPin, LuPhone } from 'react-icons/lu';
import Picture from '../Picture';
import { MdAlternateEmail } from 'react-icons/md';

const ResumeHeader = ({ basics, themeColors }) => {

    const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");

    return (
        <div className="pt-3.5 relative grid grid-cols-3 space-x-4 pb-0"
            style={{ color: themeColors[0] }}
        >   
            <Picture className="mx-auto" picture={basics.picture}  size={140}/>

            <div className="relative z-10 col-span-2" style={{ color: themeColors[0] }}>
                <div className="space-y-0.5">
                    <h2 className="text-3xl font-bold">{basics.name}</h2>
                    <p>{basics.headline}</p>
                </div>

                <div className="col-span-2 col-start-2 mt-10" style={{ color: themeColors[1] }}>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                        {basics.location && (
                            <>
                                <div className="flex items-center gap-x-1.5">
                                    <LuMapPin style={{ color: themeColors[2] }} className='font-bold' />
                                    <div>{basics.location}</div>
                                </div>
                                <div className="bg-text size-1 rounded-full last:hidden" />
                            </>
                        )}

                        {basics.phone && (
                            <>
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
                                <div className="bg-text size-1 rounded-full last:hidden" />
                            </>
                        )}
                        {basics.email && (
                            <>
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
                                <div className="bg-text size-1 rounded-full last:hidden" />
                            </>
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
        </div>
    );
};

export default ResumeHeader
