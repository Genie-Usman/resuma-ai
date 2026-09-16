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
import CASCADE from "../assets/template_images/cascade.jpg"
import MERIDIAN from "../assets/template_images/meridian.webp"
import CLARITY from "../assets/template_images/clarity.webp"
import VANGUARD from "../assets/template_images/vanguard.webp"

export { TWO_COLUMN_TEMPLATES, isTwoColumnTemplate } from "../utils/layoutUtils";

export const RESUME_TEMPLATES = [
    {
        id: 'azurill',
        name: 'Azurill',
        thumbnail: AZURILL,
        colorPaletteCode: 'azurill',
        columns: 2,
        layoutType: 'two-column',
        description: 'Modern Clean Dot 2-Column',
    },
    {
        id: 'bronzor',
        name: 'Bronzor',
        thumbnail: BRONZOR,
        colorPaletteCode: 'bronzor',
        columns: 1,
        layoutType: 'single-column',
        description: 'Executive Minimal 1-Column',
    },
    {
        id: 'chikorita',
        name: 'Chikorita',
        thumbnail: CHIKORITA,
        colorPaletteCode: 'chikorita',
        columns: 2,
        layoutType: 'two-column',
        description: 'Forest Bleed Sidebar 2-Column',
    },
    {
        id: 'ditto',
        name: 'Ditto',
        thumbnail: DITTO,
        colorPaletteCode: 'ditto',
        columns: 2,
        layoutType: 'two-column',
        description: 'Cyan Header Bar 2-Column',
    },
    {
        id: 'gengar',
        name: 'Gengar',
        thumbnail: GENGAR,
        colorPaletteCode: 'gengar',
        columns: 2,
        layoutType: 'two-column',
        description: 'Dark Indigo Contrast 2-Column',
    },
    {
        id: 'glalie',
        name: 'Glalie',
        thumbnail: GLALIE,
        colorPaletteCode: 'glalie',
        columns: 2,
        layoutType: 'two-column',
        description: 'Tinted Sage Contact 2-Column',
    },
    {
        id: 'kakuna',
        name: 'Kakuna',
        thumbnail: KAKUNA,
        colorPaletteCode: 'kakuna',
        columns: 1,
        layoutType: 'single-column',
        description: 'Centered Editorial 1-Column',
    },
    {
        id: 'leafish',
        name: 'Leafish',
        thumbnail: LEAFISH,
        colorPaletteCode: 'leafish',
        columns: 2,
        layoutType: 'two-column',
        description: 'Dual-Tier Warm Banner 2-Column',
    },
    {
        id: 'nosepass',
        name: 'Nosepass',
        thumbnail: NOSEPASS,
        colorPaletteCode: 'nosepass',
        columns: 1,
        layoutType: 'single-column',
        description: 'Europass Split Date 1-Column',
    },
    {
        id: 'onyx',
        name: 'Onyx',
        thumbnail: ONYX,
        colorPaletteCode: 'onyx',
        columns: 1,
        layoutType: 'single-column',
        description: 'Crimson Corporate 1-Column',
    },
    {
        id: 'pikachu',
        name: 'Pikachu',
        thumbnail: PIKACHU,
        colorPaletteCode: 'pikachu',
        columns: 2,
        layoutType: 'two-column',
        description: 'Warm Amber Card 2-Column',
    },
    {
        id: 'rhyhorn',
        name: 'Rhyhorn',
        thumbnail: RHYHORN,
        colorPaletteCode: 'rhyhorn',
        columns: 1,
        layoutType: 'single-column',
        description: 'Clean Border Divider 1-Column',
    },
    {
        id: 'cascade',
        name: 'Cascade',
        thumbnail: CASCADE,
        colorPaletteCode: 'cascade',
        columns: 2,
        layoutType: 'two-column',
        description: 'Sleek design with a modern edge, blending professionalism and creativity',
    },
    {
        id: 'meridian',
        name: 'Meridian',
        thumbnail: MERIDIAN,
        colorPaletteCode: 'meridian',
        columns: 2,
        layoutType: 'two-column',
        description: 'Timeline spine with left date bar and circular node badges',
    },
    {
        id: 'clarity',
        name: 'Clarity',
        thumbnail: CLARITY,
        colorPaletteCode: 'clarity',
        columns: 2,
        layoutType: 'two-column',
        description: 'Modern crisp white layout with top summary and circular icon badges',
    },
    {
        id: 'vanguard',
        name: 'Vanguard',
        thumbnail: VANGUARD,
        colorPaletteCode: 'vanguard',
        columns: 2,
        layoutType: 'two-column',
        description: 'Executive dark header banner with left narrative and tinted sidebar block',
    },
]

// [backgroundColor, textColor, accentColor]
export const THEME_COLOR_PALETTE = {
  cascade: ['#ffffff', '#1e293b', '#1a365d'],
  meridian: ['#ffffff', '#1e293b', '#0d2f5a'],
  clarity: ['#ffffff', '#1e293b', '#1e293b'],
  vanguard: ['#ffffff', '#1e293b', '#2d3748'],
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