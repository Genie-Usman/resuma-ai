import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Pikachu/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Pikachu/Profiles";
import Summary from "../ResumeSections/Pikachu/Summary";
import Experience from "../ResumeSections/Pikachu/Experience";
import Education from "../ResumeSections/Pikachu/Education";
import Skills from "../ResumeSections/Pikachu/Skills";
import Projects from "../ResumeSections/Pikachu/Projects";
import Languages from "../ResumeSections/Pikachu/Languages";
import Interests from "../ResumeSections/Pikachu/Interests";
import Certifications from "../ResumeSections/Pikachu/Certifications";
import Awards from "../ResumeSections/Pikachu/Awards";
import Publications from "../ResumeSections/Pikachu/Publications";
import Volunteer from "../ResumeSections/Pikachu/Volunteer";
import References from "../ResumeSections/Pikachu/References";
import Picture from "../ResumeSections/Picture.jsx";

const DEFAULT_THEME = ['#ffffff', '#000000', '#059669']

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


const Pikachu = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
            className="p-5 grid grid-cols-3 space-x-5"
            style={{
                backgroundColor: themeColors[0],
                color: themeColors[1],
                transform: containerWidth > 0 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                width: containerWidth > 0 ? `${baseWidth}px` : "auto",
                height: "auto",
            }}
        >
            <div className="sidebar group space-y-4">
                {isFirstPage && (
                    <Picture picture={basics.picture} size={250}/>
                )}

                {sidebarIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
            </div>
            <div className={`main group space-y-4 ${sidebarIds.length > 0 ? "col-span-2" : "col-span-3"}`}>
                {isFirstPage && (
                    <ResumeHeader basics={basics} themeColors={themeColors} />
                )}

                {mainIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
            </div>
        </div>
    );
};

export default Pikachu;