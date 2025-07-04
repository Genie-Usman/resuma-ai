import Picture from './Picture';

// Icons
import { LuMapPin, LuPhone, LuLink } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";

const ResumeHeader = ({ basics }) => {
    const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");
    return (
        <div className="flex flex-col items-center space-y-2 pb-2 text-center">
            <Picture picture={basics.picture} />

            <div>
                <div className="text-2xl font-bold">{basics.name}</div>
                <div className="text-base">{basics.headline}</div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                {basics.location && (
                    <div className="flex items-center gap-x-1.5">
                        <LuMapPin className='text-primary font-bold'/>
                        <span>{basics.location}</span>
                    </div>
                )}
                {basics.phone && (
                    <div className="flex items-center gap-x-1.5">
                        <LuPhone className='text-primary font-bold'/>
                        <a href={`tel:${basics.phone}`} className="hover:underline">
                            {basics.phone}
                        </a>
                    </div>
                )}
                {basics.email && (
                    <div className="flex items-center gap-x-1.5">
                        <MdAlternateEmail className='text-primary font-bold'/>
                        <a href={`mailto:${basics.email}`} className="hover:underline">
                            {basics.email}
                        </a>
                    </div>
                )}
                {basics.url?.href && isValidUrl(basics.url.href) && (
                    <div className="flex items-center gap-x-1.5">
                       <LuLink className='text-primary font-bold'/>
                        <a
                            href={basics.url.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="hover:underline"
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