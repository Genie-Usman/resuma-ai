// utils/sectionMapper.js
import Profiles from "../components/ResumeSections/Profiles";
import Summary from "../components/ResumeSections/Summary";
import Experience from "../components/ResumeSections/Experience";
import Education from "../components/ResumeSections/Education";
import Awards from "../components/ResumeSections/Azurill/Awards";
import Certifications from "../components/ResumeSections/Certifications";
import Skills from "../components/ResumeSections/Skills";
import Interests from "../components/ResumeSections/Interests";
import Publications from "../components/ResumeSections/Publications";
import Volunteer from "../components/ResumeSections/Volunteer";
import Languages from "../components/ResumeSections/Languages";
import Projects from "../components/ResumeSections/Projects";
import References from "../components/ResumeSections/References";

const components = {
  profiles: Profiles,
  summary: Summary,
  experience: Experience,
  education: Education,
  awards: Awards,
  certifications: Certifications,
  skills: Skills,
  interests: Interests,
  publications: Publications,
  volunteer: Volunteer,
  languages: Languages,
  projects: Projects,
  references: References,
};

export const mapSectionToComponent = (key, section, reactKey, themeColors) => {
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
