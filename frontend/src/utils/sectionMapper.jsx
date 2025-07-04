// Imports for all section components
import Profiles from "../components/ResumeSections/Profiles";
import Summary from "../components/ResumeSections/Summary";
import Experience from "../components/ResumeSections/Experience";
import Education from "../components/ResumeSections/Education";
import Awards from "../components/ResumeSections/Awards";
import Certifications from "../components/ResumeSections/Certifications";
import Skills from "../components/ResumeSections/Skills";
import Interests from "../components/ResumeSections/Interests";
import Publications from "../components/ResumeSections/Publications";
import Volunteer from "../components/ResumeSections/Volunteer";
import Languages from "../components/ResumeSections/Languages";
import Projects from "../components/ResumeSections/Projects";
import References from "../components/ResumeSections/References";

export const mapSectionToComponent = (key, section, reactKey) => {
  const sectionComponentMap = {
    profiles: <Profiles section={section} />,
    summary: <Summary section={section} />,
    experience: <Experience section={section} />,
    education: <Education section={section} />,
    awards: <Awards section={section} />,
    certifications: <Certifications section={section} />,
    skills: <Skills section={section} />,
    interests: <Interests section={section} />,
    publications: <Publications section={section} />,
    volunteer: <Volunteer section={section} />,
    languages: <Languages section={section} />,
    projects: <Projects section={section} />,
    references: <References section={section} />,
  };

  return sectionComponentMap[key]
    ? <div key={reactKey}>{sectionComponentMap[key]}</div>
    : null;
};