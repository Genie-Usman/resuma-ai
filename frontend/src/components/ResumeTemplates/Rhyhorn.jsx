import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Rhyhorn/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Rhyhorn/Profiles";
import Summary from "../ResumeSections/Rhyhorn/Summary";
import Experience from "../ResumeSections/Rhyhorn/Experience";
import Education from "../ResumeSections/Rhyhorn/Education";
import Skills from "../ResumeSections/Rhyhorn/Skills";
import Projects from "../ResumeSections/Rhyhorn/Projects";
import Languages from "../ResumeSections/Rhyhorn/Languages";
import Interests from "../ResumeSections/Rhyhorn/Interests";
import Certifications from "../ResumeSections/Rhyhorn/Certifications";
import Awards from "../ResumeSections/Rhyhorn/Awards";
import Publications from "../ResumeSections/Rhyhorn/Publications";
import Volunteer from "../ResumeSections/Rhyhorn/Volunteer";
import References from "../ResumeSections/Rhyhorn/References";

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

const Rhyhorn = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
            className="p-5 space-y-4"
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

            {mainIds.map((key) =>
                mapSectionToComponent(key, sections[key], key, themeColors)
            )}

            {sidebarIds.map((key) =>
                mapSectionToComponent(key, sections[key], key, themeColors)
            )}
        </div>
    );
};

export default Rhyhorn;