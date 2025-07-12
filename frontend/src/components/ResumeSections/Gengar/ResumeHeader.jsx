import { LuLink, LuMapPin, LuPhone } from 'react-icons/lu';
import Picture from '../Picture';
import { MdAlternateEmail } from 'react-icons/md';

const ResumeHeader = ({ basics, themeColors }) => {

    const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");

    return (
        <div
            className="pt-4 pl-3 pb-4 space-y-4"
            style={{ color: themeColors[0], backgroundColor: themeColors[2] }}
        >
            <Picture
                picture={basics.picture}
                border={true}
                borderColor={themeColors[0]}
                borderWidth={3} />

            <div>
                <h2 className="text-2xl font-bold">{basics.name}</h2>
                <p>{basics.headline}</p>
            </div>

            <div className="flex flex-col items-start gap-y-2 text-sm">
                {basics.location && (
                    <div className="flex items-center gap-x-1.5">
                        <LuMapPin style={{ color: themeColors[0] }} className='font-bold' />
                        <div>{basics.location}</div>
                    </div>
                )}
                {basics.phone && (
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
                )}
                {basics.email && (
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
                )}
                {basics.url?.href && isValidUrl(basics.url.href) && (
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
                )}
            </div>
        </div>
    );
};

export default ResumeHeader
