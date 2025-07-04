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
      content: ''
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
      items: []
    },
    education: {
      id: 'education',
      name: 'Education',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
    },
    experience: {
      id: 'experience',
      name: 'Experience',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
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
      items: []
    },
    profiles: {
      id: 'profiles',
      name: 'Profiles',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
    },
    projects: {
      id: 'projects',
      name: 'Projects',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
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
      items: []
    },
    skills: {
      id: 'skills',
      name: 'Skills',
      columns: 1,
      separateLinks: true,
      visible: true,
      items: []
    },
    custom: {}
  },

  metadata: {
    template: 'rhyhorn',
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
