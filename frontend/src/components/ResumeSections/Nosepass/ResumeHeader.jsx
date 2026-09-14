import { LuLink, LuMapPin, LuPhone } from 'react-icons/lu';
import Picture from '../Picture';
import { MdAlternateEmail } from 'react-icons/md';
import ResumeQrCode from '../ResumeQrCode';

const ResumeHeader = ({ basics, themeColors, profiles, sections }) => {
    const resolvedProfiles = profiles || sections?.profiles?.items || [];
    const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");

    return (
        <div className="grid grid-cols-4 gap-x-6" style={{ color: themeColors[1] }}>
            <div className="mt-1 space-y-2 text-right">
                <Picture picture={basics.picture} className='ml-auto' />
            </div>

            <div className="col-span-3 flex justify-between items-start gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                    <div>
                        <div className="text-2xl font-bold">{basics.name}</div>
                        <div className="text-base">{basics.headline}</div>
                    </div>

                <div className="space-y-1 text-sm">
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

            <ResumeQrCode
                qrCode={basics?.qrCode}
                basics={basics}
                profiles={resolvedProfiles}
                themeColors={themeColors}
                align="right"
                className="shrink-0"
            />
        </div>
    </div>
    );
};

export default ResumeHeader;
