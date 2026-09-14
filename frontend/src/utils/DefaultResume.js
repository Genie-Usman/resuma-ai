export const getDefaultResumeData = (user = {}) => ({
  basics: {
    name: user.name || '',
    headline: '',
    email: user.email || '',
    phone: '',
    location: '',
    url: {
      label: '',
      href: ''
    },
    picture: {
      url: user.profileImageURL || '',
      size: 64,
      aspectRatio: 1,
      borderRadius: 0,
      effects: {
        hidden: false,
        border: false,
        grayscale: false
      }
    }
  },

  sections: {
    summary: {
      id: 'summary',
      name: 'Summary',
      columns: 1,
      separateLinks: true,
      visible: true,
      content: '<p>Innovative, results-driven professional with extensive experience leading strategic initiatives, collaborating with cross-functional teams, and delivering high-impact solutions that drive organizational growth.</p>'
    },
    experience: {
      id: 'experience',
      name: 'Work Experience',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: [
        {
          company: "HyperScale Global Innovations",
          position: "Lead Solutions Specialist",
          location: "San Francisco, CA",
          date: "2022 - Present",
          summary: "<p>• Spearheaded end-to-end technical initiatives resulting in a 35% increase in operational efficiency across distributed teams.<br>• Collaborated with senior leadership to architect scalable solutions and establish modern engineering workflows.<br>• Mentored high-performing team members in agile delivery and technical excellence.</p>",
          visible: true,
          url: { label: "hyperscale.tech", href: "https://hyperscale.tech" }
        },
        {
          company: "NovaCore Technologies",
          position: "Senior Systems Specialist",
          location: "Austin, TX",
          date: "2019 - 2022",
          summary: "<p>• Designed and deployed responsive client solutions supporting 500K+ active users with 99.9% uptime.<br>• Streamlined cross-department collaboration, reducing project delivery cycle times by 25%.</p>",
          visible: true,
          url: { label: "novacore.io", href: "https://novacore.io" }
        }
      ]
    },
    education: {
      id: 'education',
      name: 'Education',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: [
        {
          institution: "University of California, Berkeley",
          studyType: "Bachelor of Science",
          area: "Computer Science & Business Systems",
          score: "3.88 / 4.0 GPA",
          date: "2015 - 2019",
          summary: "<p>Dean's Honors List. Leadership award recipient.</p>",
          visible: true,
          url: { label: "", href: "" }
        }
      ]
    },
    skills: {
      id: 'skills',
      name: 'Key Skills',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: [
        {
          name: "Strategic Architecture",
          description: "Executive Level",
          level: 5,
          keywords: "System Design, Microservices, Cloud Infrastructure",
          visible: true
        },
        {
          name: "Cross-Functional Leadership",
          description: "Advanced",
          level: 5,
          keywords: "Agile, Roadmapping, Stakeholder Alignment",
          visible: true
        },
        {
          name: "Full-Stack Development",
          description: "Expert",
          level: 4,
          keywords: "React, Node.js, TypeScript, REST APIs",
          visible: true
        }
      ]
    },
    projects: {
      id: 'projects',
      name: 'Featured Projects',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: [
        {
          name: "Cloud Management Dashboard",
          description: "Enterprise Operations Portal",
          date: "2023",
          summary: "<p>Architected a high-throughput monitoring portal delivering real-time analytics with sub-second latency.</p>",
          keywords: ["React", "Analytics", "Cloud"],
          visible: true,
          url: { label: "github.com/project", href: "https://github.com" }
        }
      ]
    },
    awards: {
      id: 'awards',
      name: 'Awards',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
    },
    certifications: {
      id: 'certifications',
      name: 'Certifications',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2023",
          summary: "",
          visible: true,
          url: { label: "", href: "" }
        }
      ]
    },
    volunteer: {
      id: 'volunteer',
      name: 'Volunteering',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
    },
    interests: {
      id: 'interests',
      name: 'Interests',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
    },
    languages: {
      id: 'languages',
      name: 'Languages',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: [
        {
          name: "English",
          description: "Native / Bilingual",
          level: 5,
          visible: true
        }
      ]
    },
    profiles: {
      id: 'profiles',
      name: 'Profiles',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: [
        {
          network: "LinkedIn",
          username: "linkedin.com/in/professional",
          icon: "linkedin",
          visible: true,
          url: { label: "LinkedIn", href: "https://linkedin.com" }
        },
        {
          network: "GitHub",
          username: "github.com/developer",
          icon: "github",
          visible: true,
          url: { label: "GitHub", href: "https://github.com" }
        }
      ]
    },
    publications: {
      id: 'publications',
      name: 'Publications',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
    },
    references: {
      id: 'references',
      name: 'References',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: [
        {
          name: "Available upon request",
          description: "Professional references available upon request",
          visible: true
        }
      ]
    },
    custom: {}
  },

  coverLetter: {
    enabled: false,
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    tone: "impactful",
    recipient: {
      name: "Hiring Team",
      title: "Hiring Manager",
      company: "",
      address: "",
    },
    salutation: "Dear Hiring Team,",
    opening: "",
    bodyParagraphs: [],
    callToAction: "",
    signOff: "Sincerely,",
    signature: user.name || "",
  },

  metadata: {
    template: 'pikachu',
    layout: [
      [
        ['profiles', 'summary', 'experience', 'education', 'projects', 'volunteer', 'references'],
        ['skills', 'interests', 'certifications', 'awards', 'publications', 'languages']
      ]
    ],
    css: {
      value: '* {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}',
      visible: false
    },
    page: {
      margin: 18,
      format: 'a4',
      options: {
        breakLine: true,
        pageNumbers: true
      }
    },
    theme: {
      background: '#ffffff',
      text: '#000000',
      primary: '#dc2626'
    },
    typography: {
      font: {
        family: 'IBM Plex Serif',
        subset: 'latin',
        variants: ['regular', 'italic', '600'],
        size: 14
      },
      lineHeight: 1.5,
      hideIcons: false,
      underlineLinks: true
    },
    notes: ''
  }
});
