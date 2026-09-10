import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Ditto/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Ditto/Profiles";
import Summary from "../ResumeSections/Ditto/Summary";
import Experience from "../ResumeSections/Ditto/Experience";
import Education from "../ResumeSections/Ditto/Education";
import Skills from "../ResumeSections/Ditto/Skills";
import Projects from "../ResumeSections/Ditto/Projects";
import Languages from "../ResumeSections/Ditto/Languages";
import Interests from "../ResumeSections/Ditto/Interests";
import Certifications from "../ResumeSections/Ditto/Certifications";
import Awards from "../ResumeSections/Ditto/Awards";
import Publications from "../ResumeSections/Ditto/Publications";
import Volunteer from "../ResumeSections/Ditto/Volunteer";
import References from "../ResumeSections/Ditto/References";

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
const DEFAULT_THEME = ['#ffffff', '#000000', '#059669']

const Ditto = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

    const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

    const resumeRef = useRef();
    const [baseWidth, setBaseWidth] = useState(800);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (resumeRef.current) {
            const actualBaseWidth = resumeRef.current.offsetWidth;
            setBaseWidth(actualBaseWidth);
            setScale(containerWidth / actualBaseWidth);
        }
    }, [containerWidth]);

    const [layout] = Array.isArray(metadata.layout) ? metadata.layout : [[]];
    const mainIds = Array.isArray(layout[0]) ? layout[0] : [];
    const sidebarIds = Array.isArray(layout[1]) ? layout[1] : [];

    return (
        <div
            ref={resumeRef}
            className="min-h-0 print:min-h-0"
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

            <div className="grid grid-cols-12 gap-6 px-8 py-6">
                {sidebarIds.length > 0 && (
                    <div className="sidebar col-span-4 group space-y-5">
                        {sidebarIds.map((key) =>
                            mapSectionToComponent(key, sections[key], key, themeColors)
                        )}
                    </div>
                )}

                <div
                    className={`main group space-y-5 ${sidebarIds.length > 0 ? "col-span-8" : "col-span-12"}`}
                >
                    {mainIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key, themeColors)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ditto;