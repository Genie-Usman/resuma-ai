import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Leafish/ResumeHeader.jsx";
import Experience from "../ResumeSections/Leafish/Experience";
import Education from "../ResumeSections/Leafish/Education";
import Skills from "../ResumeSections/Leafish/Skills";
import Projects from "../ResumeSections/Leafish/Projects";
import Languages from "../ResumeSections/Leafish/Languages";
import Interests from "../ResumeSections/Leafish/Interests";
import Certifications from "../ResumeSections/Leafish/Certifications";
import Awards from "../ResumeSections/Leafish/Awards";
import Publications from "../ResumeSections/Leafish/Publications";
import Volunteer from "../ResumeSections/Leafish/Volunteer";
import References from "../ResumeSections/Leafish/References";

const DEFAULT_THEME = ['#ffffff', '#000000', '#7B4F1A']

const components = {
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

const Leafish = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
            className=""
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
                <ResumeHeader basics={basics} themeColors={themeColors} sections={sections} />
            )}

            <div className="p-custom grid grid-cols-2 items-start space-x-6">
                <div className={`grid gap-y-4 ${sidebarIds.length === 0 ? "col-span-2" : ""}`}>
                    {mainIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key, themeColors)
                    )}
                </div>

                <div className={`grid gap-y-4 ${sidebarIds.length === 0 ? "hidden" : ""}`}>
                    {sidebarIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key, themeColors)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leafish;