/**
 * JSON Resume Standard Adapter (jsonresume.org)
 * Provides bidirectional conversion between Resuma AI's internal resume format
 * and the open standard JSON Resume specification.
 */

const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

/**
 * Export Resuma AI resume to official JSON Resume format and trigger file download
 *
 * @param {object} resume - Full resume object from backend or local state
 * @param {string} customTitle - Optional title for filename
 */
export const exportToJsonResume = (resume, customTitle) => {
  const data = resume?.data || resume || {};
  const basics = data.basics || {};
  const sections = data.sections || {};
  const metadata = data.metadata || {};

  const jsonResume = {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: basics.name || "",
      label: basics.headline || "",
      image: basics.picture?.url || "",
      email: basics.email || "",
      phone: basics.phone || "",
      url: basics.url?.href || basics.url?.label || "",
      summary: sections.summary?.content ? stripHtml(sections.summary.content) : "",
      location: {
        address: basics.location || "",
        city: basics.location || "",
      },
      profiles: (sections.profiles?.items || []).map((p) => ({
        network: p.network || "Profile",
        username: p.username || "",
        url: p.url?.href || p.url?.label || p.url || "",
      })),
    },
    work: (sections.experience?.items || []).map((exp) => ({
      name: exp.company || "",
      position: exp.position || "",
      location: exp.location || "",
      startDate: exp.date || "",
      endDate: "",
      summary: exp.summary ? stripHtml(exp.summary) : "",
      highlights: [],
    })),
    education: (sections.education?.items || []).map((ed) => ({
      institution: ed.institution || "",
      area: ed.area || "",
      studyType: ed.studyType || "",
      score: ed.score || "",
      startDate: ed.date || "",
      endDate: "",
    })),
    skills: (sections.skills?.items || []).map((s) => ({
      name: s.name || "Skill",
      level: s.level ? `Level ${s.level}` : "Master",
      keywords: typeof s.keywords === "string"
        ? s.keywords.split(/,\s*/).filter(Boolean)
        : Array.isArray(s.keywords)
        ? s.keywords
        : [],
    })),
    projects: (sections.projects?.items || []).map((proj) => ({
      name: proj.name || "",
      description: proj.description ? stripHtml(proj.description) : "",
      keywords: typeof proj.keywords === "string"
        ? proj.keywords.split(/,\s*/).filter(Boolean)
        : Array.isArray(proj.keywords)
        ? proj.keywords
        : [],
      url: proj.url?.href || proj.url?.label || "",
    })),
    certificates: (sections.certifications?.items || []).map((c) => ({
      name: c.name || "",
      issuer: c.issuer || "",
      date: c.date || "",
    })),
    awards: (sections.awards?.items || []).map((a) => ({
      title: a.name || "",
      awarder: a.awarder || "",
      date: a.date || "",
      summary: a.summary ? stripHtml(a.summary) : "",
    })),
    languages: (sections.languages?.items || []).map((l) => ({
      language: l.name || "",
      fluency: l.level ? `Level ${l.level}` : "Proficient",
    })),
    volunteer: (sections.volunteer?.items || []).map((v) => ({
      organization: v.organization || "",
      position: v.position || "",
      startDate: v.date || "",
      summary: v.summary ? stripHtml(v.summary) : "",
    })),
    interests: (sections.interests?.items || []).map((i) => ({
      name: i.name || "",
      keywords: typeof i.keywords === "string"
        ? i.keywords.split(/,\s*/).filter(Boolean)
        : Array.isArray(i.keywords)
        ? i.keywords
        : [],
    })),
    references: (sections.references?.items || []).map((r) => ({
      name: r.name || "",
      reference: r.summary ? stripHtml(r.summary) : "",
    })),
    meta: {
      template: metadata.template || "azurill",
      theme: metadata.theme || {},
      canonical: "https://jsonresume.org",
      version: "v1.0.0",
      generator: "Resuma AI Modern Builder",
    },
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(jsonResume, null, 2)
  )}`;
  const title = customTitle || resume?.title || basics.name || "resume";
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-jsonresume.json`;

  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  return jsonResume;
};

/**
 * Import a standard JSON Resume file content and convert to Resuma AI schema
 *
 * @param {string|object} jsonInput - Raw JSON string or parsed object
 * @param {object} defaultUser - Optional user context (name, email)
 * @returns {object} { title, data } ready for POST /api/resume
 */
export const importFromJsonResume = (jsonInput, defaultUser = {}) => {
  const json = typeof jsonInput === "string" ? JSON.parse(jsonInput) : jsonInput;

  if (!json || typeof json !== "object") {
    throw new Error("Invalid JSON Resume format. File must contain a valid JSON object.");
  }

  const b = json.basics || {};

  const title = b.name
    ? `${b.name} Resume`
    : b.label
    ? `${b.label} Resume`
    : "Imported JSON Resume";

  const convertedData = {
    basics: {
      name: b.name || defaultUser.name || "",
      headline: b.label || "",
      email: b.email || defaultUser.email || "",
      phone: b.phone || "",
      location: b.location?.city || b.location?.address || (typeof b.location === "string" ? b.location : ""),
      url: {
        label: b.url || "",
        href: b.url || "",
      },
      picture: {
        url: b.image || defaultUser.profileImageURL || "",
        size: 64,
        aspectRatio: 1,
        borderRadius: 0,
        effects: {
          hidden: !b.image,
          border: false,
          grayscale: false,
        },
      },
    },
    sections: {
      summary: {
        id: "summary",
        name: "Summary",
        columns: 1,
        separateLinks: true,
        visible: !!b.summary,
        content: b.summary || "",
      },
      profiles: {
        id: "profiles",
        name: "Profiles",
        columns: 1,
        separateLinks: true,
        visible: Array.isArray(b.profiles) && b.profiles.length > 0,
        items: (b.profiles || []).map((p, idx) => ({
          id: `profile-${idx}`,
          network: p.network || "Profile",
          username: p.username || "",
          url: {
            label: p.url || p.network || "",
            href: p.url || "",
          },
        })),
      },
      experience: {
        id: "experience",
        name: "Experience",
        columns: 1,
        separateLinks: true,
        visible: Array.isArray(json.work) && json.work.length > 0,
        items: (json.work || []).map((w, idx) => ({
          id: `work-${idx}`,
          company: w.name || w.company || "",
          position: w.position || "",
          location: w.location || "",
          date: w.startDate
            ? w.endDate
              ? `${w.startDate} - ${w.endDate}`
              : `${w.startDate} - Present`
            : "",
          summary: w.summary || (Array.isArray(w.highlights) ? w.highlights.join("\n") : ""),
          url: {
            label: w.url || "",
            href: w.url || "",
          },
        })),
      },
      education: {
        id: "education",
        name: "Education",
        columns: 1,
        separateLinks: true,
        visible: Array.isArray(json.education) && json.education.length > 0,
        items: (json.education || []).map((ed, idx) => ({
          id: `education-${idx}`,
          institution: ed.institution || "",
          studyType: ed.studyType || "",
          area: ed.area || "",
          score: ed.score || "",
          date: ed.startDate
            ? ed.endDate
              ? `${ed.startDate} - ${ed.endDate}`
              : ed.startDate
            : "",
        })),
      },
      skills: {
        id: "skills",
        name: "Skills",
        columns: 2,
        separateLinks: true,
        visible: Array.isArray(json.skills) && json.skills.length > 0,
        items: (json.skills || []).map((s, idx) => ({
          id: `skill-${idx}`,
          name: s.name || "Skills Group",
          keywords: Array.isArray(s.keywords) ? s.keywords.join(", ") : s.keywords || "",
          level: 4,
        })),
      },
      projects: {
        id: "projects",
        name: "Projects",
        columns: 1,
        separateLinks: true,
        visible: Array.isArray(json.projects) && json.projects.length > 0,
        items: (json.projects || []).map((p, idx) => ({
          id: `project-${idx}`,
          name: p.name || "",
          description: p.description || (Array.isArray(p.highlights) ? p.highlights.join("\n") : ""),
          keywords: Array.isArray(p.keywords) ? p.keywords.join(", ") : p.keywords || "",
          url: {
            label: p.url || "",
            href: p.url || "",
          },
        })),
      },
      certifications: {
        id: "certifications",
        name: "Certifications",
        columns: 1,
        separateLinks: true,
        visible: Array.isArray(json.certificates) && json.certificates.length > 0,
        items: (json.certificates || []).map((c, idx) => ({
          id: `cert-${idx}`,
          name: c.name || "",
          issuer: c.issuer || "",
          date: c.date || "",
        })),
      },
      awards: {
        id: "awards",
        name: "Awards",
        columns: 1,
        separateLinks: true,
        visible: Array.isArray(json.awards) && json.awards.length > 0,
        items: (json.awards || []).map((a, idx) => ({
          id: `award-${idx}`,
          name: a.title || a.name || "",
          awarder: a.awarder || "",
          date: a.date || "",
          summary: a.summary || "",
        })),
      },
      languages: {
        id: "languages",
        name: "Languages",
        columns: 2,
        separateLinks: true,
        visible: Array.isArray(json.languages) && json.languages.length > 0,
        items: (json.languages || []).map((l, idx) => ({
          id: `lang-${idx}`,
          name: l.language || l.name || "",
          level: 4,
        })),
      },
      volunteer: {
        id: "volunteer",
        name: "Volunteering",
        columns: 1,
        separateLinks: true,
        visible: Array.isArray(json.volunteer) && json.volunteer.length > 0,
        items: (json.volunteer || []).map((v, idx) => ({
          id: `volunteer-${idx}`,
          organization: v.organization || "",
          position: v.position || "",
          date: v.startDate || "",
          summary: v.summary || "",
        })),
      },
      interests: {
        id: "interests",
        name: "Interests",
        columns: 2,
        separateLinks: true,
        visible: Array.isArray(json.interests) && json.interests.length > 0,
        items: (json.interests || []).map((i, idx) => ({
          id: `interest-${idx}`,
          name: i.name || "",
          keywords: Array.isArray(i.keywords) ? i.keywords.join(", ") : i.keywords || "",
        })),
      },
      references: {
        id: "references",
        name: "References",
        columns: 1,
        separateLinks: true,
        visible: Array.isArray(json.references) && json.references.length > 0,
        items: (json.references || []).map((r, idx) => ({
          id: `ref-${idx}`,
          name: r.name || "",
          summary: r.reference || "",
        })),
      },
    },
    metadata: {
      template: json.meta?.template || "azurill",
      theme: {
        background: json.meta?.theme?.background || "#FFFFFF",
        text: json.meta?.theme?.text || "#000000",
        primary: json.meta?.theme?.primary || "#9328E7",
      },
      layout: [
        [
          "summary",
          "experience",
          "education",
          "projects",
          "volunteer",
          "references",
        ],
        [
          "skills",
          "profiles",
          "certifications",
          "awards",
          "languages",
          "interests",
        ],
      ],
    },
  };

  return {
    title,
    data: convertedData,
  };
};
