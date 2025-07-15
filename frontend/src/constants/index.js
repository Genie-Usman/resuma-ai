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
  classic: ['#ffffff', '#000000', '#ca8a04'],
  midnight: ['#0f172a', '#f8fafc', '#38bdf8'],
  graphite: ['#1e293b', '#e2e8f0', '#f59e0b'],
  sunrise: ['#fff7ed', '#1f2937', '#f97316'],
  lavender: ['#f5f3ff', '#1e1b4b', '#8b5cf6'],
  forest: ['#ecfdf5', '#064e3b', '#10b981'],
  blush: ['#fdf2f8', '#831843', '#ec4899'],
  cobalt: ['#e0f2fe', '#1e3a8a', '#3b82f6'],
  sand: ['#fefce8', '#78350f', '#eab308'],
  slate: ['#f1f5f9', '#0f172a', '#7c3aed'],
  chocolate: ['#fff7ed', '#4e1f0a', '#d97706'],
  rose: ['#fff1f2', '#881337', '#f43f5e'],
  ocean: ['#f0fdfa', '#134e4a', '#14b8a6'],
  minty: ['#ecfdf5', '#022c22', '#5eead4'],
  thunder: ['#f8fafc', '#0f172a', '#facc15'],
  crimson: ['#fef2f2', '#7f1d1d', '#ef4444'],
  steel: ['#f8fafc', '#1e293b', '#0ea5e9'],
  bronze: ['#fdf4e6', '#3b2f2f', '#b45309'],
  jade: ['#f0fdf4', '#14532d', '#22c55e'],
  indigoSky: ['#eef2ff', '#1e3a8a', '#6366f1'],
  espresso: ['#fefefe', '#2e2e2e', '#b08968'],       
  charcoal: ['#f9fafb', '#111827', '#2563eb'],       
  sage: ['#f7fdf9', '#1c4532', '#48bb78'],           
  ivory: ['#fffefc', '#3f3f46', '#6b7280'],          
  denim: ['#f0f4f8', '#1e40af', '#3b82f6'],          
  platinum: ['#f5f5f5', '#1f2937', '#6d28d9'],       
  monoWarm: ['#ffffff', '#1f2937', '#f97316'],       
  ash: ['#f9fafb', '#374151', '#d97706'],            
  arctic: ['#f0f9ff', '#0c4a6e', '#38bdf8'],         
  pearl: ['#fefefe', '#2d3748', '#3182ce'],          
};

export const defaultProfileItem = {
  network: "",
  username: "",
  icon: "",
  visible: true,
  url: {
    label: "",
    href: ""
  }
};

export const defaultExperienceItem = {
    company: "",
    position: "",
    location: "",
    date: "",
    summary: "<p></p>",
    visible: true,
    url: {
        label: "",
        href: ""
    }
};

export const defaultEducationItem = {
    institution: "",
    studyType: "",
    area: "",
    score: "",
    date: "",
    summary: "<p></p>",
    url: {
        label: "",
        href: ""
    }
};

export const defaultSkillsItem = {
    name: "",
    description: "",
    level: 0,
    keywords: [],
    date: "",
    summary: "<p></p>",
    url: {
        label: "",
        href: ""
    }
};

export const defaultProjectsItem = {
    name: "",
    description: "",
    date: "",
    summary: "<p></p>",
    keywords: [],
    url: {
        label: "",
        href: ""
    }
};

export const defaultCertificationsItem = {
    name: "",
    issuer: "",
    date: "",
    summary: "<p></p>",
    url: {
        label: "",
        href: ""
    }
};

export const defaultInterestItem = {
    name: "",
    keywords: [],
};

export const defaultLanguageItem = {
    name: "",
    level: 0,
};

export const defaultPublicationItem = {
    name: "",
    publisher: "",
    date: "",
    summary: "<p></p>",
};

export const defaultAwardItem = {
    name: "",
    awarder: "",
    date: "",
    summary: "<p></p>",
};

export const defaultVolunteerItem = {
    organization: "",
    position: "",
    date: "",
    location: "",
    summary: "<p></p>",
};

export const defaultReferenceItem = {
    name: "",
    description: "",
    summary: "<p></p>",
};