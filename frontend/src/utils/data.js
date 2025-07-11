import AZURILL from "../assets/template_images/azurill.jpg"
import BRONZOR from "../assets/template_images/bronzor.jpg"
import CHIKORITA from "../assets/template_images/chikorita.jpg"
import DITTO from "../assets/template_images/ditto.jpg"
import GENGAR from "../assets/template_images/gengar.jpg"
import GLALIE from "../assets/template_images/glalie.jpg"
import KAKUNA from "../assets/template_images/kakuna.jpg"
import LEAFISH from "../assets/template_images/leafish.jpg"
import NOSEPASS from "../assets/template_images/nosepass.jpg"
import ONYX from "../assets/template_images/onyx.jpg"
import PIKACHU from "../assets/template_images/pikachu.jpg"
import RHYHORN from "../assets/template_images/rhyhorn.jpg"
import JOHNDOE from "../assets/JohnDoe.jpeg"

export const RESUME_TEMPLATES = [
    {
        id: 'azurill',
        thumbnail: AZURILL,
        colorPaletteCode: 'azurill'
    },
    {
        id: 'bronzor',
        thumbnail: BRONZOR,
        colorPaletteCode: 'bronzor'
    },
    {
        id: 'chikorita',
        thumbnail: CHIKORITA,
        colorPaletteCode: 'chikorita'
    },
    {
        id: 'ditto',
        thumbnail: DITTO,
        colorPaletteCode: 'ditto'
    },
    {
        id: 'gengar',
        thumbnail: GENGAR,
        colorPaletteCode: 'gengar'
    },
    {
        id: 'glalie',
        thumbnail: GLALIE,
        colorPaletteCode: 'glalie'
    },
    {
        id: 'kakuna',
        thumbnail: KAKUNA,
        colorPaletteCode: 'kakuna'
    },
    {
        id: 'leafish',
        thumbnail: LEAFISH,
        colorPaletteCode: 'leafish'
    },
    {
        id: 'nosepass',
        thumbnail: NOSEPASS,
        colorPaletteCode: 'nosepass'
    },
    {
        id: 'onyx',
        thumbnail: ONYX,
        colorPaletteCode: 'onyx'
    },
    {
        id: 'pikachu',
        thumbnail: PIKACHU,
        colorPaletteCode: 'pikachu'
    },
    {
        id: 'rhyhorn',
        thumbnail: RHYHORN,
        colorPaletteCode: 'rhyhorn'
    },
]

// [backgroundColor, textColor, accentColor]
export const THEME_COLOR_PALETTE = {
  classic: ['#ffffff', '#000000', '#ca8a04'],           // Default: white, black, amber
  midnight: ['#0f172a', '#f8fafc', '#38bdf8'],          // Navy bg, light text, sky accent
  graphite: ['#1e293b', '#e2e8f0', '#f59e0b'],          // Dark gray bg, slate text, amber
  sunrise: ['#fff7ed', '#1f2937', '#f97316'],           // Soft peach bg, gray text, orange
  lavender: ['#f5f3ff', '#1e1b4b', '#8b5cf6'],          // Light lavender bg, indigo text, purple
  forest: ['#ecfdf5', '#064e3b', '#10b981'],            // Mint bg, dark green text, emerald
  blush: ['#fdf2f8', '#831843', '#ec4899'],             // Pinky bg, wine text, fuchsia
  cobalt: ['#e0f2fe', '#1e3a8a', '#3b82f6'],            // Light blue bg, blue text, blue accent
  sand: ['#fefce8', '#78350f', '#eab308'],              // Cream bg, brown text, golden accent
  slate: ['#f1f5f9', '#0f172a', '#7c3aed'],             // Cool gray bg, dark text, violet
  chocolate: ['#fff7ed', '#4e1f0a', '#d97706'],          // Cream bg, chocolate text, burnt orange
  rose: ['#fff1f2', '#881337', '#f43f5e'],              // Blush bg, crimson text, rose accent
  ocean: ['#f0fdfa', '#134e4a', '#14b8a6'],             // Teal palette
  minty: ['#ecfdf5', '#022c22', '#5eead4'],             // Mint + teal
  thunder: ['#f8fafc', '#0f172a', '#facc15'],           // Storm gray + yellow
  crimson: ['#fef2f2', '#7f1d1d', '#ef4444'],           // Red palette
  steel: ['#f8fafc', '#1e293b', '#0ea5e9'],             // Steel blue
  bronze: ['#fdf4e6', '#3b2f2f', '#b45309'],            // Tan + bronze
  jade: ['#f0fdf4', '#14532d', '#22c55e'],              // Green-rich, fresh
  indigoSky: ['#eef2ff', '#1e3a8a', '#6366f1']          // Indigo dream
};

export const DUMMY_RESUME_DATA = {
  basics: {
    name: "Usman",
    headline: "Full Stack Web Developer",
    email: "mani@gmail.com",
    phone: "+923187533014",
    location: "Sesame Street",
    url: {
      label: "Portfolio",
      href: "https://usman.dev"
    },
    picture: {
      url: JOHNDOE, 
      size: 64,
      aspectRatio: 1,
      borderRadius: 0.5,
      effects: {
        hidden: false,
        border: true,
        grayscale: false
      }
    }
  },

  sections: {
    summary: {
      id: "summary",
      name: "Summary",
      columns: 1,
      visible: true,
      separateLinks: true,
      content: `<p>Innovative Web Developer with 5+ years of experience in building modern, user-centric applications. Passionate about performance, accessibility, and elegant UI solutions. Strong communicator and team collaborator with a growth mindset.</p>`
    },

    profiles: {
      id: "profiles",
      name: "Profiles",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          network: "LinkedIn",
          username: "usman-dev",
          icon: "linkedin",
          visible: true,
          url: {
            label: "linkedin.com/in/usman-dev",
            href: "https://linkedin.com/in/usman-dev"
          }
        },
        {
          network: "GitHub",
          username: "usmanhub",
          icon: "github",
          visible: true,
          url: {
            label: "github.com/usmanhub",
            href: "https://github.com/usmanhub"
          }
        }
      ]
    },

    experience: {
      id: "experience",
      name: "Experience",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          company: "Creative Solutions Inc.",
          position: "Senior Web Developer",
          location: "San Francisco, CA",
          date: "Jan 2019 – Present",
          summary: `<p>Led the revamp of core products using React and Node.js, resulting in 40% better user engagement. Mentored 4 junior devs and deployed CI/CD pipelines.</p>`,
          visible: true,
          url: {
            label: "Company Site",
            href: "https://creativesolutions.com"
          }
        }
      ]
    },

    education: {
      id: "education",
      name: "Education",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          institution: "University of California",
          studyType: "Bachelor's",
          area: "Computer Science",
          score: "3.8 GPA",
          date: "Aug 2014 – May 2018",
          summary: "<p>Focused on full-stack development and software engineering principles.</p>",
          url: {
            label: "Transcript",
            href: "#"
          }
        }
      ]
    },

    projects: {
      id: "projects",
      name: "Projects",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          name: "E-Commerce Platform",
          description: "Built a scalable MERN stack e-commerce app.",
          date: "2022",
          summary: "<p>Integrated Stripe payments, user authentication, and product search with Algolia.</p>",
          keywords: ["React", "MongoDB", "Stripe"],
          url: {
            label: "Live Demo",
            href: "https://ecom.usman.dev"
          }
        }
      ]
    },

    volunteer: {
      id: "volunteer",
      name: "Volunteering",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          organization: "Code for Change",
          position: "Volunteer Mentor",
          location: "Remote",
          date: "2021 – 2023",
          summary: "<p>Mentored underrepresented students in web development through weekly live sessions.</p>"
        }
      ]
    },

    references: {
      id: "references",
      name: "References",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          name: "John Doe",
          description: "Former Manager at Creative Solutions",
          summary: "<p>John can speak to my technical leadership and reliability on key projects.</p>"
        }
      ]
    },

    certifications: {
      id: "certifications",
      name: "Certifications",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          name: "Google UX Design Professional Certificate",
          issuer: "Google / Coursera",
          date: "2024",
          summary: "<p>Covered user research, wireframing, prototyping, and usability testing.</p>",
          url: {
            label: "View Certificate",
            href: "#"
          }
        },
        {
          name: "Certified JavaScript Developer",
          issuer: "W3Schools",
          date: "2022",
          summary: "<p>Verified knowledge in ES6+, DOM, and asynchronous programming.</p>",
          url: {
            label: "W3Schools",
            href: "#"
          }
        }
      ]
    },

    awards: {
      id: "awards",
      name: "Awards",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          name: "Employee of the Year",
          awarder: "TechNova Inc.",
          date: "2023",
          summary: "<p>Recognized for exceptional delivery of 3 high-impact web projects.</p>"
        }
      ]
    },

    publications: {
      id: "publications",
      name: "Publications",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          name: "Building Scalable Web Apps with React",
          publisher: "Medium",
          date: "2024",
          summary: "<p>A deep-dive into optimizing React applications for performance and maintainability.</p>"
        }
      ]
    },

    interests: {
      id: "interests",
      name: "Interests",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          name: "Games",
          keywords: ["PUBG Mobile", "Sky: Children of Light"]
        }
      ]
    },

    languages: {
      id: "languages",
      name: "Languages",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          name: "English",
          level: 4
        },
        {
          name: "Urdu",
          level: 5
        }
      ]
    },

    skills: {
      id: "skills",
      name: "Skills",
      columns: 1,
      visible: true,
      separateLinks: true,
      items: [
        {
          name: "Web Frameworks",
          description: "Next.js, Alpine.js, AngularJS",
          level: 4,
          keywords: ["Next.js", "React", "SPA", "SSR"]
        }
      ]
    },

  },

  metadata: {
    template: "azurill",
    layout: [
      [
        ['profiles', 'summary', 'experience', 'education', 'projects', 'volunteer', 'references'],
        ['skills', 'interests', 'certifications', 'awards', 'publications', 'languages']
      ]
    ],
    css: {
      value: '',
      visible: false
    },
    page: {
      margin: 18,
      format: "a4",
      options: {
        breakLine: true,
        pageNumbers: true
      }
    },
    theme: {
      background: "#ffffff",
      text: "#000000",
      primary: "#ca8a04"
    },
    typography: {
      font: {
        family: "IBM Plex Serif",
        subset: "latin",
        variants: ["regular", "italic", "600"],
        size: 14
      },
      lineHeight: 1.5,
      hideIcons: false,
      underlineLinks: true
    },
    notes: "This is a sample resume used for development preview."
  }
};