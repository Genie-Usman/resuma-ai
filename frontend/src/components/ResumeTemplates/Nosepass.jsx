import { useEffect, useRef, useState } from "react";
import { mapSectionToComponent } from "../../utils/sectionMapper";

// Components
import ResumeHeader from "../ResumeSections/Azurill/ResumeHeader.jsx";

// [Background, Text, Accent]
const DEFAULT_THEME = ['#ffffff', '#000000', '#059669']

const Nosepass = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

    const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

    const resumeRef = useRef();
    const [baseWidth, setBaseWidth] = useState(800);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const actualBaseWidth = resumeRef.current.offsetWidth;
        setBaseWidth(actualBaseWidth);
        setScale(containerWidth / actualBaseWidth);
    }, [containerWidth]);

    const [layout] = Array.isArray(metadata.layout) ? metadata.layout : [[]];
    const mainIds = Array.isArray(layout[0]) ? layout[0] : [];
    const sidebarIds = Array.isArray(layout[1]) ? layout[1] : [];

    return (
        <div
            ref={resumeRef}
            className="py-5 px-1 space-y-3 min-h-[800px]"
            style={{
                backgroundColor: themeColors[0],
                color: themeColors[1],
                transform: containerWidth > 0 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                width: containerWidth > 0 ? `${baseWidth}px` : "auto",
                height: "auto",
            }}
        >
            {isFirstPage && (
                <ResumeHeader basics={basics} themeColors={themeColors} />
            )}

            <div className="grid grid-cols-3 gap-x-4">
                <aside className="sidebar group space-y-4">
                    {sidebarIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key, themeColors)
                    )}
                </aside>

                <main
                    className={`main group space-y-4 ${sidebarIds.length > 0 ? "col-span-2" : "col-span-3"
                        }`}
                >
                    {mainIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key, themeColors)
                    )}
                </main>
            </div>
        </div>
    );
};

export default Nosepass;