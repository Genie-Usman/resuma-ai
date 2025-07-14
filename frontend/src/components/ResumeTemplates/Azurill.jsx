import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Azurill/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Azurill/Profiles";
import Summary from "../ResumeSections/Azurill/Summary";
import Experience from "../ResumeSections/Azurill/Experience";
import Education from "../ResumeSections/Azurill/Education";
import Skills from "../ResumeSections/Azurill/Skills";
import Projects from "../ResumeSections/Azurill/Projects";
import Languages from "../ResumeSections/Azurill/Languages";
import Interests from "../ResumeSections/Azurill/Interests";
import Certifications from "../ResumeSections/Azurill/Certifications";
import Awards from "../ResumeSections/Azurill/Awards";
import Publications from "../ResumeSections/Azurill/Publications";
import Volunteer from "../ResumeSections/Azurill/Volunteer";
import References from "../ResumeSections/Azurill/References";

const components = {
    profiles: Profiles,
    summary: Summary,
    experience: Experience,
    education: Education,
    skills: Skills,
    projects: Projects,
    languages: Languages,
    interests: Interests,
    certifications: Certifications,
    awards: Awards,
    publications: Publications,
    volunteer: Volunteer,
    references: References,
};

// [Background, Text, Accent]

const mapSectionToComponent = (key, section, reactKey, themeColors) => {
    if (!section?.visible) return null;

    const usesItems = ['profiles', 'experience', 'education', 'awards', 'certifications', 'skills', 'interests', 'publications', 'volunteer', 'languages', 'projects', 'references'];

    if (usesItems.includes(key) && !section.items?.length) return null;

    const Component = components[key];
    return Component ? (
        <div key={reactKey}>
            <Component section={section} themeColors={themeColors} />
        </div>
    ) : null;
};

// [Background, Text, Accent]
const DEFAULT_THEME = ['#FFFFFF', '#000000', '#CA8A04']

const Azurill = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
            className="p-5 space-y-3 min-h-[800px]"
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

export default Azurill;