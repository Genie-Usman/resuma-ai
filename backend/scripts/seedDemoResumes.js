const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Resume = require("../models/Resume");

// High-fidelity demo resumes data for all 12 templates
const demoResumesData = [
  // 1. AZURILL - Staff AI & Cloud Solutions Architect
  {
    title: "Muhammad Usman - Staff AI & Cloud Solutions Architect",
    slug: "muhammad-usman-azurill-ai-architect",
    template: "azurill",
    data: {
      basics: {
        name: "Muhammad Usman",
        headline: "Staff AI & Cloud Solutions Architect",
        email: "musman7533@gmail.com",
        phone: "+1 (415) 890-3421",
        location: "San Francisco, CA",
        url: { label: "portfolio.dev", href: "https://musman.dev" },
        picture: {
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 6,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://musman.dev/architecture-portfolio",
          subtitle: "Scan for Architecture Portfolio",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Executive Summary",
          visible: true,
          columns: 1,
          content:
            "<p>Enterprise Cloud & AI Architect with 9+ years architecting multi-region distributed systems, enterprise LLM inference pipelines, and fault-tolerant cloud backbones on AWS and GCP. Scaled systems serving 40M+ monthly active users at 99.995% availability while slashing compute operational expenditure by 34%.</p>",
        },
        experience: {
          name: "Experience",
          title: "Professional Experience",
          visible: true,
          columns: 1,
          items: [
            {
              id: "az-exp-1",
              company: "NovaScale Cloud Systems",
              position: "Staff Cloud & AI Architect",
              location: "San Francisco, CA",
              date: "2022 - Present",
              summary:
                "<ul><li>Architected high-throughput RAG semantic retrieval engine reducing p99 latency from 420ms to 68ms across 100M+ vector embeddings.</li><li>Spearheaded zero-downtime migration of 60+ microservices to Kubernetes EKS mesh, saving $1.2M annually in idle cloud allocations.</li><li>Mentored 14 senior engineers across distributed systems design and autonomous observability practices.</li></ul>",
            },
            {
              id: "az-exp-2",
              company: "Aetheria Technologies",
              position: "Senior Distributed Systems Engineer",
              location: "Palo Alto, CA",
              date: "2018 - 2022",
              summary:
                "<ul><li>Designed streaming ingestion pipeline processing 250,000 events/sec via Apache Kafka and Go worker pools.</li><li>Implemented automated Canary deployments and chaos testing regimes reducing production incidents by 73%.</li></ul>",
            },
          ],
        },
        custom_ai_initiatives: {
          id: "custom_ai_initiatives",
          isCustom: true,
          type: "timeline",
          name: "AI & Cloud Initiatives",
          title: "Strategic AI Initiatives",
          visible: true,
          columns: 1,
          items: [
            {
              id: "az-init-1",
              company: "Enterprise LLM Inference Gateway",
              position: "Principal Architect",
              date: "2023 - 2024",
              summary:
                "<ul><li>Engineered dynamic token bucket rate-limiter and semantic caching layer cutting third-party model inference bills by 48%.</li></ul>",
            },
            {
              id: "az-init-2",
              company: "Autonomous Telemetry Self-Healing Mesh",
              position: "Initiative Lead",
              date: "2021 - 2022",
              summary:
                "<ul><li>Developed eBPF-powered network anomaly detector with automatic failover triggers across three AWS availability zones.</li></ul>",
            },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "az-edu-1",
              institution: "University of California, Berkeley",
              studyType: "M.S. in Computer Science (Distributed Systems)",
              area: "Berkeley, CA",
              score: "3.92 GPA",
              date: "2016 - 2018",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Core Competencies",
          visible: true,
          columns: 1,
          items: [
            { name: "Distributed Systems & Microservices", level: 5 },
            { name: "AWS, GCP & Kubernetes (EKS/GKE)", level: 5 },
            { name: "LLM Gateways & Vector DBs (Pinecone/Milvus)", level: 5 },
            { name: "Go, Rust, Python, TypeScript", level: 4 },
            { name: "Terraform & Infrastructure as Code", level: 5 },
          ],
        },
        certifications: {
          name: "Certifications",
          title: "Certifications",
          visible: true,
          columns: 1,
          items: [
            { id: "az-c1", name: "AWS Certified Solutions Architect - Professional", issuer: "Amazon Web Services", date: "2024" },
            { id: "az-c2", name: "Certified Kubernetes Administrator (CKA)", issuer: "Cloud Native Computing Foundation", date: "2023" },
          ],
        },
        languages: {
          name: "Languages",
          title: "Languages",
          visible: true,
          columns: 1,
          items: [
            { name: "English", description: "Native / Bilingual" },
            { name: "Urdu", description: "Native" },
            { name: "German", description: "Professional Working" },
          ],
        },
        interests: {
          name: "Interests",
          title: "Interests",
          visible: true,
          columns: 1,
          items: [
            { name: "Open Source Compilers" },
            { name: "High-Altitude Trekking" },
            { name: "Mechanized Watchmaking" },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Connect",
          visible: true,
          columns: 1,
          items: [
            { id: "p1", network: "LinkedIn", username: "musman-cloud", url: "https://linkedin.com/in/musman-cloud" },
            { id: "p2", network: "GitHub", username: "usman-architect", url: "https://github.com/usman-architect" },
          ],
        },
      },
      metadata: {
        template: "azurill",
        layout: [
          [
            ["summary", "experience", "education", "custom_ai_initiatives"],
            ["profiles", "skills", "certifications", "languages", "interests"],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#212529",
          primary: "#ca8a04",
        },
        typography: {
          font: { family: "Merriweather", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 2. BRONZOR - Executive VP & General Counsel
  {
    title: "Victoria Sterling, J.D. - Executive VP & General Counsel",
    slug: "victoria-sterling-bronzor-general-counsel",
    template: "bronzor",
    data: {
      basics: {
        name: "Victoria Sterling, J.D.",
        headline: "Executive Vice President & General Counsel",
        email: "v.sterling@sterling-advisory.com",
        phone: "+1 (212) 555-8902",
        location: "New York, NY",
        url: { label: "sterling-advisory.com", href: "https://sterling-advisory.com" },
        picture: {
          url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 4,
          effects: { hidden: false, border: false, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://linkedin.com/in/victoria-sterling-legal",
          subtitle: "Scan for Verified Credentials",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Executive Profile",
          visible: true,
          columns: 1,
          content:
            "<p>Senior Corporate Legal Executive with 18+ years orchestrating global M&A transactions, cross-border intellectual property litigation, and SEC regulatory compliance for public technology enterprises. Proven track record negotiating $4.8B+ in cumulative liquidity events, institutional financings, and antitrust clearances.</p>",
        },
        experience: {
          name: "Experience",
          title: "Legal Executive Career",
          visible: true,
          columns: 1,
          items: [
            {
              id: "br-exp-1",
              company: "OmniTech Global Media Corp.",
              position: "EVP, Chief Legal Officer & Corporate Secretary",
              location: "New York, NY",
              date: "2019 - Present",
              summary:
                "<ul><li>Steered corporate counsel and governed board legal oversight for a $6.2B market-cap global entertainment & SaaS conglomerate.</li><li>Directly led legal structuring of $1.4B cross-border acquisition of Nordic streaming platform with complete FTC and EU Commission clearances.</li><li>Mitigated class-action consumer privacy litigation risk, achieving zero-liability dismissals across 3 federal jurisdictions.</li></ul>",
            },
            {
              id: "br-exp-2",
              company: "Wellington, Sterling & Hayes LLP",
              position: "Senior Partner - Corporate M&A Practice",
              location: "New York, NY",
              date: "2010 - 2019",
              summary:
                "<ul><li>Advised Fortune 100 boards on activist shareholder defense, hostile takeover countermeasures, and NASDAQ compliance.</li><li>Counseled early-to-late stage technology issuers across 12 successful initial public offerings (IPOs).</li></ul>",
            },
          ],
        },
        custom_board_appointments: {
          id: "custom_board_appointments",
          isCustom: true,
          type: "simple_list",
          name: "Board Appointments",
          title: "Board Appointments & Advisory",
          visible: true,
          columns: 1,
          items: [
            { id: "ba-1", name: "Independent Audit Committee Chair", awarder: "FinTech Governance Institute", date: "2021 - Present" },
            { id: "ba-2", name: "Advisory Council Member", awarder: "Nasdaq Regulatory Working Group", date: "2018 - 2023" },
            { id: "ba-3", name: "Board Member & Governance Lead", awarder: "New York Legal Aid Society", date: "2016 - 2021" },
          ],
        },
        education: {
          name: "Education",
          title: "Education & Bar Admissions",
          visible: true,
          columns: 1,
          items: [
            {
              id: "br-edu-1",
              institution: "Harvard Law School",
              studyType: "Juris Doctor (J.D.), Magna Cum Laude",
              area: "Cambridge, MA",
              score: "Editor, Harvard Law Review",
              date: "2007 - 2010",
            },
            {
              id: "br-edu-2",
              institution: "Columbia University",
              studyType: "B.A. in Political Science & Economics",
              area: "New York, NY",
              score: "Summa Cum Laude",
              date: "2003 - 2007",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Executive Competencies",
          visible: true,
          columns: 1,
          items: [
            { name: "Cross-Border Mergers & Acquisitions", level: 5 },
            { name: "SEC Filings & Public Company Governance", level: 5 },
            { name: "Antitrust & Intellectual Property Strategy", level: 5 },
            { name: "Executive Compensation & Audit Committee", level: 4 },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Executive Network",
          visible: true,
          columns: 1,
          items: [
            { id: "bp-1", network: "LinkedIn", username: "victoria-sterling-legal", url: "https://linkedin.com/in/victoria-sterling-legal" },
          ],
        },
      },
      metadata: {
        template: "bronzor",
        layout: [
          [
            ["summary", "experience", "custom_board_appointments", "education", "skills", "profiles"],
            [],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#1e293b",
          primary: "#0284c7",
        },
        typography: {
          font: { family: "IBM Plex Sans", category: "sans-serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 3. CHIKORITA - Principal Product & Interaction Designer
  {
    title: "Elena Rostova - Principal Product & Interaction Designer",
    slug: "elena-rostova-chikorita-principal-designer",
    template: "chikorita",
    data: {
      basics: {
        name: "Elena Rostova",
        headline: "Principal Product & Interaction Designer",
        email: "elena@rostova.design",
        phone: "+1 (312) 843-9201",
        location: "Chicago, IL",
        url: { label: "rostova.design", href: "https://rostova.design" },
        picture: {
          url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 8,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://rostova.design/interactive-case-studies",
          subtitle: "Scan for Interactive Case Studies",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Design Philosophy",
          visible: true,
          columns: 1,
          content:
            "<p>Award-winning Principal Interaction Designer with 11+ years championing human-centered design systems, micro-interactions, and accessible enterprise UX. Built unified multi-brand design systems powering 120M+ user sessions across mobile, desktop, and automotive touchpoints.</p>",
        },
        experience: {
          name: "Experience",
          title: "Design Experience",
          visible: true,
          columns: 1,
          items: [
            {
              id: "chk-exp-1",
              company: "Kinetic UI Labs",
              position: "Principal Interaction Designer",
              location: "Chicago, IL",
              date: "2021 - Present",
              summary:
                "<ul><li>Architected Aurora Design System adopted across 24 product squads, slashing front-end designer-to-developer handoff time by 55%.</li><li>Spearheaded full redesign of fintech mobile application, boosting Day-30 user retention from 34% to 59%.</li><li>Established rigorous WCAG 2.2 AAA accessibility standards across all design token repositories.</li></ul>",
            },
            {
              id: "chk-exp-2",
              company: "Hyperion Digital Products",
              position: "Senior Product Designer",
              location: "San Francisco, CA",
              date: "2016 - 2021",
              summary:
                "<ul><li>Conducted 200+ hours of contextual user interviews and biometric eye-tracking studies for enterprise analytics tool.</li><li>Designed frictionless checkout experience processing $800M in annual transactions with 4.9/5 satisfaction score.</li></ul>",
            },
          ],
        },
        projects: {
          name: "Projects",
          title: "Key Design Systems",
          visible: true,
          columns: 1,
          items: [
            {
              id: "chk-prj-1",
              name: "Aurora Cross-Platform Token Engine",
              description: "Universal design token engine converting Figma variables into platform-native Swift, Jetpack Compose, and Tailwind tokens automatically via GitHub Actions.",
              date: "2023",
            },
          ],
        },
        custom_design_honors: {
          id: "custom_design_honors",
          isCustom: true,
          type: "simple_list",
          name: "Design Honors",
          title: "Design Honors & Patents",
          visible: true,
          columns: 1,
          items: [
            { id: "dh-1", name: "Red Dot Best of the Best 2024", awarder: "Red Dot Design Award", date: "2024" },
            { id: "dh-2", name: "US Patent #11,492,019: Adaptive Spatial Menu Interaction", awarder: "USPTO", date: "2023" },
            { id: "dh-3", name: "Awwwards Mobile Site of the Year", awarder: "Awwwards International", date: "2022" },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "chk-edu-1",
              institution: "Rhode Island School of Design (RISD)",
              studyType: "B.F.A. in Graphic & Interactive Design",
              area: "Providence, RI",
              score: "Departmental Honors",
              date: "2012 - 2016",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Design Stack",
          visible: true,
          columns: 1,
          items: [
            { name: "Figma & Design Tokens", level: 5 },
            { name: "Interaction Prototyping (Principle/Protopie)", level: 5 },
            { name: "Design Systems Architecture", level: 5 },
            { name: "WCAG 2.2 AAA Accessibility", level: 5 },
            { name: "User Research & Usability Testing", level: 4 },
          ],
        },
        languages: {
          name: "Languages",
          title: "Languages",
          visible: true,
          columns: 1,
          items: [
            { name: "English", description: "Fluent" },
            { name: "Russian", description: "Native" },
            { name: "French", description: "Conversational" },
          ],
        },
        interests: {
          name: "Interests",
          title: "Creative Pursuits",
          visible: true,
          columns: 1,
          items: [
            { name: "Ceramics & Glaze Chemistry" },
            { name: "Kinetic Typography" },
            { name: "Swiss Graphic Posters" },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Design Network",
          visible: true,
          columns: 1,
          items: [
            { id: "chkp-1", network: "LinkedIn", username: "elena-rostova-design", url: "https://linkedin.com/in/elena-rostova-design" },
            { id: "chkp-2", network: "Dribbble", username: "elenarostova", url: "https://dribbble.com/elenarostova" },
          ],
        },
      },
      metadata: {
        template: "chikorita",
        layout: [
          [
            ["summary", "experience", "projects", "education"],
            ["skills", "custom_design_honors", "languages", "interests", "profiles"],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#0f172a",
          primary: "#059669",
        },
        typography: {
          font: { family: "Merriweather", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 4. DITTO - Staff SRE & Platform Infrastructure Lead
  {
    title: "Alex Chen - Staff SRE & Platform Infrastructure Lead",
    slug: "alex-chen-ditto-staff-sre",
    template: "ditto",
    data: {
      basics: {
        name: "Alex Chen",
        headline: "Staff Site Reliability Engineer & Platform Lead",
        email: "alex.chen@infra-mesh.io",
        phone: "+1 (206) 912-7744",
        location: "Seattle, WA",
        url: { label: "alexchen.dev", href: "https://alexchen.dev" },
        picture: {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 6,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://github.com/alexchen-infra",
          subtitle: "Scan for Open Source Tooling",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Infrastructure Overview",
          visible: true,
          columns: 1,
          content:
            "<p>Staff SRE with 10+ years specializing in multi-cloud Kubernetes platforms, high-throughput service meshes, and automated chaos engineering. Champion of zero-toil operations, GitOps infrastructure delivery, and sub-second mean-time-to-detection across 15,000+ bare-metal and cloud nodes.</p>",
        },
        experience: {
          name: "Experience",
          title: "SRE & Platform Career",
          visible: true,
          columns: 1,
          items: [
            {
              id: "dit-exp-1",
              company: "CloudCore Global Infrastructure",
              position: "Staff Site Reliability Engineer",
              location: "Seattle, WA",
              date: "2021 - Present",
              summary:
                "<ul><li>Maintained 99.999% availability for payment routing platform processing $3B daily across 4 continental regions.</li><li>Designed declarative GitOps deployment control plane with ArgoCD and Crossplane supporting 350+ software developers.</li><li>Authored custom Envoy WASM filter dynamically shedding non-essential telemetry during black swan traffic spikes.</li></ul>",
            },
            {
              id: "dit-exp-2",
              company: "Pacific Microgrid Tech",
              position: "Senior Infrastructure Engineer",
              location: "Portland, OR",
              date: "2017 - 2021",
              summary:
                "<ul><li>Engineered unified Prometheus and VictoriaMetrics monitoring cluster digesting 40M active timeseries metrics.</li><li>Reduced multi-region network latency by 42% via custom BGP routing peering configurations.</li></ul>",
            },
          ],
        },
        custom_incident_response: {
          id: "custom_incident_response",
          isCustom: true,
          type: "timeline",
          name: "Infrastructure Milestones",
          title: "Critical Infrastructure Milestones",
          visible: true,
          columns: 1,
          items: [
            {
              id: "im-1",
              company: "Zero-Downtime Data Center Evacuation",
              position: "Incident Commander & Architect",
              date: "Q3 2023",
              summary:
                "<ul><li>Executed live state migration of 4,200 workloads across 8 Kubernetes clusters during hurricane contingency with 0 dropped client requests.</li></ul>",
            },
            {
              id: "im-2",
              company: "Global eBPF Observability Rollout",
              position: "Lead Engineer",
              date: "Q1 2022",
              summary:
                "<ul><li>Eliminated kernel tracing overhead across 12,000 Linux nodes, saving $450k in profiling CPU cycles.</li></ul>",
            },
          ],
        },
        projects: {
          name: "Projects",
          title: "Open Source Systems",
          visible: true,
          columns: 1,
          items: [
            {
              id: "dit-prj-1",
              name: "KubeMesh-AutoRemediate",
              description: "Open source Kubernetes operator automating pod quarantine, memory heap dumps, and node drain upon anomaly detection.",
              date: "2023",
            },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "dit-edu-1",
              institution: "University of Washington",
              studyType: "B.S. in Computer Systems Engineering",
              area: "Seattle, WA",
              score: "Dean's List",
              date: "2013 - 2017",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Infrastructure Stack",
          visible: true,
          columns: 1,
          items: [
            { name: "Kubernetes & ArgoCD GitOps", level: 5 },
            { name: "Go & Rust Systems Programming", level: 5 },
            { name: "Terraform & Pulumi Infrastructure as Code", level: 5 },
            { name: "Prometheus, Grafana, OpenTelemetry", level: 5 },
            { name: "eBPF & Linux Kernel Internals", level: 4 },
          ],
        },
        certifications: {
          name: "Certifications",
          title: "Certifications",
          visible: true,
          columns: 1,
          items: [
            { id: "dc-1", name: "Certified Kubernetes Security Specialist (CKS)", issuer: "Linux Foundation", date: "2023" },
            { id: "dc-2", name: "AWS Certified DevOps Engineer - Professional", issuer: "Amazon Web Services", date: "2022" },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Dev & Ops Profiles",
          visible: true,
          columns: 1,
          items: [
            { id: "dit-p1", network: "GitHub", username: "alexchen-infra", url: "https://github.com/alexchen-infra" },
            { id: "dit-p2", network: "LinkedIn", username: "alexchen-sre", url: "https://linkedin.com/in/alexchen-sre" },
          ],
        },
      },
      metadata: {
        template: "ditto",
        layout: [
          [
            ["summary", "experience", "custom_incident_response", "projects"],
            ["skills", "certifications", "education", "profiles"],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#18181b",
          primary: "#0891b2",
        },
        typography: {
          font: { family: "Merriweather", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 5. GENGAR - Lead Cryptography & SecOps Engineer
  {
    title: "Marcus Vance, CISSP - Lead Cryptography & SecOps Engineer",
    slug: "marcus-vance-gengar-cryptography-secops",
    template: "gengar",
    data: {
      basics: {
        name: "Marcus Vance, CISSP",
        headline: "Lead Cryptography & SecOps Engineer",
        email: "m.vance@cipherdefense.sec",
        phone: "+1 (703) 882-1923",
        location: "Arlington, VA",
        url: { label: "cipherdefense.sec", href: "https://cipherdefense.sec" },
        picture: {
          url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 4,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://github.com/marcusvance-crypto",
          subtitle: "Scan for Cryptographic Proofs",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Security Clearance & Focus",
          visible: true,
          columns: 1,
          content:
            "<p>Lead Cryptographic Systems Engineer with 12+ years hardening national security enclaves, post-quantum cryptographic (PQC) transitions, and Hardware Security Module (HSM) cluster architectures. Subject matter expert in zero-knowledge proofs, formal verification, and adversary simulation.</p>",
        },
        experience: {
          name: "Experience",
          title: "Security Engineering Career",
          visible: true,
          columns: 1,
          items: [
            {
              id: "gen-exp-1",
              company: "Aegis Quantum Defense",
              position: "Lead Cryptographic Engineer",
              location: "Arlington, VA",
              date: "2020 - Present",
              summary:
                "<ul><li>Architected migration roadmap for NIST post-quantum cryptographic primitives (ML-KEM and ML-DSA) across 40 federal data pipelines.</li><li>Managed cluster of FIPS 140-3 Level 4 Hardware Security Modules handling 85M signing operations per day.</li><li>Conducted formal verification in Coq to mathematically guarantee zero side-channel leakage in key exchange protocols.</li></ul>",
            },
            {
              id: "gen-exp-2",
              company: "Vanguard Cyber Research",
              position: "Senior Security Operations Engineer",
              location: "McLean, VA",
              date: "2015 - 2020",
              summary:
                "<ul><li>Led red team adversary simulations discovering 14 critical CVE vulnerabilities in commercial cryptographic libraries.</li><li>Automated zero-trust identity federation and ephemeral credential rotation via HashiCorp Vault.</li></ul>",
            },
          ],
        },
        projects: {
          name: "Projects",
          title: "Security Architectures",
          visible: true,
          columns: 1,
          items: [
            {
              id: "gen-prj-1",
              name: "QuantumShield Rust Enclave",
              description: "Zero-allocation Rust library implementing post-quantum lattice-based encryption algorithms for edge IoT hardware.",
              date: "2023",
            },
          ],
        },
        custom_clearances: {
          id: "custom_clearances",
          isCustom: true,
          type: "simple_list",
          name: "Security Clearances",
          title: "Clearances & Responsible Disclosures",
          visible: true,
          columns: 1,
          items: [
            { id: "sc-1", name: "U.S. Department of Defense Top Secret (TS/SCI)", awarder: "DoD DSS", date: "Active" },
            { id: "sc-2", name: "CVE-2023-9182: Elliptic Curve Nonce Leakage Discovery", awarder: "MITRE CVE", date: "2023" },
            { id: "sc-3", name: "NSA Commercial Solutions for Classified (CSfC) Lead", awarder: "NSA", date: "2021" },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "gen-edu-1",
              institution: "Carnegie Mellon University",
              studyType: "M.S. in Information Security",
              area: "Pittsburgh, PA",
              score: "CyLab Fellowship",
              date: "2013 - 2015",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Cryptographic Core",
          visible: true,
          columns: 1,
          items: [
            { name: "Post-Quantum Cryptography (PQC)", level: 5 },
            { name: "HSM Management (Thales / Luna)", level: 5 },
            { name: "Rust & C Cryptographic Engineering", level: 5 },
            { name: "Zero-Knowledge Proofs (ZK-SNARKs)", level: 4 },
            { name: "FIPS 140-3 Compliance Auditing", level: 5 },
          ],
        },
        certifications: {
          name: "Certifications",
          title: "Certifications",
          visible: true,
          columns: 1,
          items: [
            { id: "gc-1", name: "Certified Information Systems Security Professional (CISSP)", issuer: "(ISC)²", date: "2018" },
            { id: "gc-2", name: "Offensive Security Certified Professional (OSCP)", issuer: "OffSec", date: "2017" },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Sec Profiles",
          visible: true,
          columns: 1,
          items: [
            { id: "gen-p1", network: "GitHub", username: "marcusvance-crypto", url: "https://github.com/marcusvance-crypto" },
            { id: "gen-p2", network: "Keybase", username: "marcusvance", url: "https://keybase.io/marcusvance" },
          ],
        },
      },
      metadata: {
        template: "gengar",
        layout: [
          [
            ["summary", "experience", "projects", "education"],
            ["skills", "custom_clearances", "certifications", "profiles"],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#0f172a",
          primary: "#3730a3",
        },
        typography: {
          font: { family: "IBM Plex Serif", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 6. GLALIE - Senior Quantitative Researcher & ML Fellow
  {
    title: "Dr. Aris Thorne - Senior Quantitative Researcher & ML Fellow",
    slug: "dr-aris-thorne-glalie-quantitative-researcher",
    template: "glalie",
    data: {
      basics: {
        name: "Dr. Aris Thorne",
        headline: "Senior Quantitative Researcher & ML Fellow",
        email: "aris.thorne@oxford-quant.ac.uk",
        phone: "+44 20 7946 0912",
        location: "London, UK",
        url: { label: "aristhorne.math", href: "https://aristhorne.math" },
        picture: {
          url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 6,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://scholar.google.com/citations?user=aristhorne",
          subtitle: "Scan for Preprints & Code",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Research Profile",
          visible: true,
          columns: 1,
          content:
            "<p>Mathematical Physicist and Quantitative Researcher with 8+ years developing algorithmic alpha strategies, non-equilibrium stochastic volatility models, and GPU-accelerated deep generative models for quantitative hedge funds and high-performance academic computing clusters.</p>",
        },
        experience: {
          name: "Experience",
          title: "Quantitative Experience",
          visible: true,
          columns: 1,
          items: [
            {
              id: "gla-exp-1",
              company: "Centurion Quantitative Capital",
              position: "Lead Statistical Arbitrage Researcher",
              location: "London, UK",
              date: "2021 - Present",
              summary:
                "<ul><li>Researched and deployed automated statistical arbitrage signals yielding a Sharpe Ratio of 3.4 across European equity index futures.</li><li>Pioneered GPU tensor decomposition framework in PyTorch CUDA decreasing signal backtesting runtimes from 8 hours to 12 minutes.</li><li>Managed $450M allocated risk capital with maximum recorded portfolio drawdown strictly bounded under 2.1%.</li></ul>",
            },
            {
              id: "gla-exp-2",
              company: "Alan Turing Institute",
              position: "Postdoctoral Research Fellow",
              location: "London, UK",
              date: "2018 - 2021",
              summary:
                "<ul><li>Investigated neural stochastic differential equations for high-dimensional financial contagion modeling.</li><li>Co-authored 6 peer-reviewed papers in NeurIPS, ICML, and Mathematical Finance.</li></ul>",
            },
          ],
        },
        custom_research_papers: {
          id: "custom_research_papers",
          isCustom: true,
          type: "publications",
          name: "Peer-Reviewed Research",
          title: "Selected Peer-Reviewed Research",
          visible: true,
          columns: 1,
          items: [
            {
              id: "pub-1",
              name: "Continuous-Time Latent Volatility Estimation via Score-Based Diffusion Models",
              publisher: "NeurIPS (Advances in Neural Information Processing Systems)",
              date: "2024",
              summary: "Introduced non-parametric volatility estimators with rigorous stochastic convergence bounds.",
            },
            {
              id: "pub-2",
              name: "Deep Calibration of Rough Heston Models Under Market Liquidity Regimes",
              publisher: "Journal of Financial and Quantitative Analysis",
              date: "2023",
              summary: "Derived closed-form asymptotic expansions yielding 10x faster smile surface calibration.",
            },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "gla-edu-1",
              institution: "University of Oxford",
              studyType: "D.Phil. (Ph.D.) in Applied Mathematics & Mathematical Physics",
              area: "Oxford, UK",
              score: "Clarendon Scholar",
              date: "2014 - 2018",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Quantitative Stack",
          visible: true,
          columns: 1,
          items: [
            { name: "Stochastic Calculus & Martingale Theory", level: 5 },
            { name: "PyTorch, JAX & Custom CUDA Kernels", level: 5 },
            { name: "C++20 High Frequency Signal Execution", level: 4 },
            { name: "Non-Linear Time Series & Kalman Filters", level: 5 },
          ],
        },
        awards: {
          name: "Awards",
          title: "Academic Honors",
          visible: true,
          columns: 1,
          items: [
            { id: "gla-a1", name: "Clarendon Fellowship Award", awarder: "Oxford University Press", date: "2014" },
            { id: "gla-a2", name: "British Mathematical Olympiad Gold Medalist", awarder: "UKMT", date: "2010" },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Academic Profiles",
          visible: true,
          columns: 1,
          items: [
            { id: "gla-p1", network: "Google Scholar", username: "aristhorne", url: "https://scholar.google.com/citations?user=aristhorne" },
            { id: "gla-p2", network: "GitHub", username: "aristhorne-math", url: "https://github.com/aristhorne-math" },
          ],
        },
      },
      metadata: {
        template: "glalie",
        layout: [
          [
            ["summary", "experience", "custom_research_papers", "education"],
            ["skills", "awards", "profiles"],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#1c1917",
          primary: "#0d9488",
        },
        typography: {
          font: { family: "IBM Plex Serif", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 7. KAKUNA - Senior Frontend Architect & Design Systems Lead
  {
    title: "Devon Park - Senior Frontend Architect & Design Systems Lead",
    slug: "devon-park-kakuna-frontend-architect",
    template: "kakuna",
    data: {
      basics: {
        name: "Devon Park",
        headline: "Senior Frontend Architect & Design Systems Lead",
        email: "devon@devonpark.tech",
        phone: "+1 (415) 309-8812",
        location: "San Francisco, CA",
        url: { label: "devonpark.tech", href: "https://devonpark.tech" },
        picture: {
          url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 9999,
          effects: { hidden: false, border: false, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://devonpark.tech/ui-showcase",
          subtitle: "Scan for UI Showcase",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Engineering Manifesto",
          visible: true,
          columns: 1,
          content:
            "<p>Design-conscious Frontend Architect with 9+ years creating lightning-fast web applications, accessible component primitives, and WebGL animation pipelines. Obsessed with sub-50ms interaction response times, zero layout shifts, and semantic web craft.</p>",
        },
        experience: {
          name: "Experience",
          title: "Engineering Experience",
          visible: true,
          columns: 1,
          items: [
            {
              id: "kak-exp-1",
              company: "Prism UI Technologies",
              position: "Staff Frontend Architect",
              location: "San Francisco, CA",
              date: "2021 - Present",
              summary:
                "<ul><li>Re-architected enterprise browser IDE to React 19 concurrent mode, eliminating 90% of re-renders on 50,000-line codebases.</li><li>Pioneered hardware-accelerated Canvas 2D and WebGL renderer for interactive flowcharts operating at continuous 60fps.</li><li>Reduced JavaScript client bundle size by 44% utilizing tree-shakeable ES modules and dynamic imports.</li></ul>",
            },
            {
              id: "kak-exp-2",
              company: "Starlight Digital Studio",
              position: "Lead UI Developer",
              location: "New York, NY",
              date: "2017 - 2021",
              summary:
                "<ul><li>Built interactive editorial web experiences winning 5 Awwwards Site of the Day and FWA of the Day honors.</li><li>Engineered custom accessible keyboard navigation hooks ensuring full WCAG AAA keyboard focus trapping.</li></ul>",
            },
          ],
        },
        custom_language_matrix: {
          id: "custom_language_matrix",
          isCustom: true,
          type: "language_matrix",
          name: "Framework Mastery",
          title: "Frontend Framework & Tooling Matrix",
          visible: true,
          columns: 1,
          items: [
            { name: "React 19, Next.js & Server Components", description: "Native / Architectural Level" },
            { name: "TypeScript & Static Analysis", description: "Expert / Strict Typing" },
            { name: "Three.js, WebGL & GLSL Shaders", description: "Fluent / Interactive 3D" },
            { name: "WebAssembly (Rust to Wasm)", description: "Working Knowledge / High-Perf Audio" },
          ],
        },
        projects: {
          name: "Projects",
          title: "Open Source Projects",
          visible: true,
          columns: 1,
          items: [
            {
              id: "kak-prj-1",
              name: "MotionTokens Engine",
              description: "High-performance physics-based spring animation micro-library weighing under 2.4kb with zero dependencies.",
              date: "2024",
            },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "kak-edu-1",
              institution: "Cornell University",
              studyType: "B.S. in Computer Science & Interactive Media",
              area: "Ithaca, NY",
              score: "Magna Cum Laude",
              date: "2013 - 2017",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Technical Skills",
          visible: true,
          columns: 1,
          items: [
            { name: "React & Next.js Architecture", level: 5 },
            { name: "Tailwind CSS & Vanilla CSS Modules", level: 5 },
            { name: "Micro-Frontend & Module Federation", level: 4 },
            { name: "Core Web Vitals & Performance Profiling", level: 5 },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Profiles",
          visible: true,
          columns: 1,
          items: [
            { id: "kak-p1", network: "GitHub", username: "devonpark-ui", url: "https://github.com/devonpark-ui" },
            { id: "kak-p2", network: "LinkedIn", username: "devonpark-arch", url: "https://linkedin.com/in/devonpark-arch" },
          ],
        },
      },
      metadata: {
        template: "kakuna",
        layout: [
          [
            ["summary", "experience", "custom_language_matrix", "projects", "education", "skills", "profiles"],
            [],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#1e293b",
          primary: "#4f46e5",
        },
        typography: {
          font: { family: "Lora", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 8. LEAFISH - Chief Marketing Officer & Brand Strategist
  {
    title: "Sophia Laurent - Chief Marketing Officer & Brand Strategist",
    slug: "sophia-laurent-leafish-chief-marketing-officer",
    template: "leafish",
    data: {
      basics: {
        name: "Sophia Laurent",
        headline: "Chief Marketing Officer & Brand Strategist",
        email: "sophia@laurent-luxury.com",
        phone: "+1 (310) 902-4411",
        location: "Los Angeles, CA",
        url: { label: "laurent-luxury.com", href: "https://laurent-luxury.com" },
        picture: {
          url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 8,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://linkedin.com/in/sophia-laurent-cmo",
          subtitle: "Scan for Executive Brand Deck",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Executive Overview",
          visible: true,
          columns: 1,
          content:
            "<p>Visionary Chief Marketing Officer with 15+ years scaling direct-to-consumer and luxury lifestyle brands from pre-revenue to $120M+ run-rates. Architect of viral cultural campaigns, global influencer ecosystems, and performance media attribution engines with 4.8x blended ROAS.</p>",
        },
        experience: {
          name: "Experience",
          title: "Executive Leadership",
          visible: true,
          columns: 1,
          items: [
            {
              id: "lea-exp-1",
              company: "Maison d'Or Parfumerie & Goods",
              position: "Chief Marketing Officer",
              location: "Paris / Los Angeles",
              date: "2020 - Present",
              summary:
                "<ul><li>Propelled global omnichannel revenue from $22M to $94M within 36 months, capturing #1 market share in prestige clean fragrance.</li><li>Directed $28M multi-platform digital, cinema, and experiential media budget achieving record customer lifetime value (LTV).</li><li>Built proprietary creator ambassador collective generating 450M organic TikTok and Instagram video impressions.</li></ul>",
            },
            {
              id: "lea-exp-2",
              company: "Aura Lifestyle Group",
              position: "VP of Global Brand Marketing",
              location: "New York, NY",
              date: "2015 - 2020",
              summary:
                "<ul><li>Spearheaded product launch campaigns across 400 Sephora and Nordstrom flagship doors.</li><li>Reduced customer acquisition cost (CAC) by 38% while scaling monthly active subscribers by 300%.</li></ul>",
            },
          ],
        },
        custom_keynote_speaking: {
          id: "custom_keynote_speaking",
          isCustom: true,
          type: "timeline",
          name: "Keynote Leadership",
          title: "Industry Keynotes & Honors",
          visible: true,
          columns: 1,
          items: [
            {
              id: "ks-1",
              company: "Cannes Lions International Festival of Creativity",
              position: "Grand Prix Brand Jury Member",
              date: "2023",
              summary: "<ul><li>Keynote: 'The Convergence of Generative Aesthetics and Luxury Brand Heritage.'</li></ul>",
            },
            {
              id: "ks-2",
              company: "Web Summit Lisbon",
              position: "Featured Speaker",
              date: "2022",
              summary: "<ul><li>Addressed 12,000 attendees on hyper-personalized digital brand narratives and zero-party data.</li></ul>",
            },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "lea-edu-1",
              institution: "The Wharton School, University of Pennsylvania",
              studyType: "M.B.A. in Strategic Marketing & Brand Management",
              area: "Philadelphia, PA",
              date: "2013 - 2015",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Marketing Core",
          visible: true,
          columns: 1,
          items: [
            { name: "Omnichannel Brand Strategy & P&L Ownership", level: 5 },
            { name: "Paid Media Attribution & Performance Marketing", level: 5 },
            { name: "Creator Ecosystems & Cultural Partnerships", level: 5 },
            { name: "Consumer Insights & Quantitative Segmentation", level: 4 },
          ],
        },
        awards: {
          name: "Awards",
          title: "Industry Accolades",
          visible: true,
          columns: 1,
          items: [
            { id: "lea-a1", name: "Adweek 50 Most Indispensable Executives", awarder: "Adweek", date: "2023" },
            { id: "lea-a2", name: "Forbes CMO Next Honoree", awarder: "Forbes", date: "2021" },
          ],
        },
        languages: {
          name: "Languages",
          title: "Languages",
          visible: true,
          columns: 1,
          items: [
            { name: "English", description: "Native" },
            { name: "French", description: "Native" },
            { name: "Italian", description: "Professional" },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Executive Profiles",
          visible: true,
          columns: 1,
          items: [
            { id: "lea-p1", network: "LinkedIn", username: "sophia-laurent-cmo", url: "https://linkedin.com/in/sophia-laurent-cmo" },
          ],
        },
      },
      metadata: {
        template: "leafish",
        layout: [
          [
            ["experience", "education", "custom_keynote_speaking"],
            ["skills", "awards", "languages", "profiles"],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#1c1917",
          primary: "#7b4f1a",
        },
        typography: {
          font: { family: "IBM Plex Serif", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 9. NOSEPASS - Clinical Director & Neuro-Oncologist
  {
    title: "Dr. Julian Mercer, M.D., Ph.D. - Clinical Director & Neuro-Oncologist",
    slug: "dr-julian-mercer-nosepass-clinical-director",
    template: "nosepass",
    data: {
      basics: {
        name: "Dr. Julian Mercer, M.D., Ph.D.",
        headline: "Clinical Director of Neuro-Oncology & Translational Medicine",
        email: "j.mercer@hopkinsmedicine.org",
        phone: "+1 (410) 955-5000",
        location: "Baltimore, MD",
        url: { label: "hopkinsmedicine.org/mercer", href: "https://hopkinsmedicine.org" },
        picture: {
          url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 4,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://clinicaltrials.gov/search?term=Julian+Mercer",
          subtitle: "Scan for Active Clinical Trials",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Curriculum Vitae Summary",
          visible: true,
          columns: 1,
          content:
            "<p>Board-Certified Neuro-Oncologist and Clinical Trialist with 14+ years spearheading precision targeted immunotherapy trials for glioblastoma multiforme. Principal Investigator on 7 Phase II/III multicenter trials backed by $16M in NIH and NCI RO1 grants.</p>",
        },
        experience: {
          name: "Experience",
          title: "Clinical Appointments",
          visible: true,
          columns: 1,
          items: [
            {
              id: "nos-exp-1",
              company: "Johns Hopkins Medicine",
              position: "Director, Comprehensive Brain Tumor Center",
              location: "Baltimore, MD",
              date: "2019 - Present",
              summary:
                "<ul><li>Direct 28-bed inpatient neuro-oncology service and outpatient clinic treating 1,200 newly diagnosed malignant brain tumor patients annually.</li><li>Led clinical protocol design for novel CAR-T intracranial cell therapy trials showing 40% reduction in tumor progression.</li><li>Oversee residency training program, supervising 16 neuro-oncology fellows and neurology residents.</li></ul>",
            },
            {
              id: "nos-exp-2",
              company: "Memorial Sloan Kettering Cancer Center",
              position: "Attending Physician & Assistant Professor",
              location: "New York, NY",
              date: "2014 - 2019",
              summary:
                "<ul><li>Spearheaded genomic sequencing integration for all pediatric and adult medulloblastoma patient cohorts.</li><li>Authored institutional guidelines for adverse immunotherapy neuro-toxicity management.</li></ul>",
            },
          ],
        },
        custom_hospital_appointments: {
          id: "custom_hospital_appointments",
          isCustom: true,
          type: "timeline",
          name: "Hospital Appointments",
          title: "Hospital Appointments & Fellowships",
          visible: true,
          columns: 1,
          items: [
            {
              id: "ha-1",
              company: "National Institutes of Health (NIH)",
              position: "Senior Clinical Investigator - Neuro-Oncology Branch",
              date: "2018 - Present",
              summary: "<ul><li>Lead investigator for multi-omic analysis of recurrent high-grade glioma tissue banks.</li></ul>",
            },
            {
              id: "ha-2",
              company: "Massachusetts General Hospital",
              position: "Chief Fellow - Neuro-Oncology Clinical Fellowship",
              date: "2012 - 2014",
              summary: "<ul><li>Completed specialized training in stereotactic radiosurgery and intrathecal chemotherapy.</li></ul>",
            },
          ],
        },
        education: {
          name: "Education",
          title: "Medical & Academic Degrees",
          visible: true,
          columns: 1,
          items: [
            {
              id: "nos-edu-1",
              institution: "Harvard Medical School",
              studyType: "Doctor of Medicine (M.D.) & Ph.D. in Cellular Neuroscience",
              area: "Boston, MA",
              date: "2004 - 2012",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Clinical Core",
          visible: true,
          columns: 1,
          items: [
            { name: "Precision Immunotherapy & CAR-T Trials", level: 5 },
            { name: "Stereotactic Radiosurgery (Gamma Knife)", level: 5 },
            { name: "Translational Oncology Biomarker Discovery", level: 5 },
            { name: "FDA IND Protocol Submissions", level: 5 },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Medical Registries",
          visible: true,
          columns: 1,
          items: [
            { id: "nos-p1", network: "PubMed", username: "mercer-julian", url: "https://pubmed.ncbi.nlm.nih.gov/?term=Mercer+Julian" },
            { id: "nos-p2", network: "LinkedIn", username: "dr-julian-mercer", url: "https://linkedin.com/in/dr-julian-mercer" },
          ],
        },
      },
      metadata: {
        template: "nosepass",
        layout: [
          [
            ["summary", "experience", "education", "custom_hospital_appointments", "skills", "profiles"],
            [],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#1e293b",
          primary: "#0284c7",
        },
        typography: {
          font: { family: "Work Sans", category: "sans-serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 10. ONYX - VP Global Supply Chain & Logistics
  {
    title: "David K. Miller - VP Global Supply Chain & Logistics",
    slug: "david-miller-onyx-vp-supply-chain",
    template: "onyx",
    data: {
      basics: {
        name: "David K. Miller",
        headline: "Vice President of Global Supply Chain & Logistics",
        email: "d.miller@apexlogistics.com",
        phone: "+1 (312) 555-7319",
        location: "Chicago, IL",
        url: { label: "apexlogistics.com/leadership", href: "https://apexlogistics.com" },
        picture: {
          url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 4,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://linkedin.com/in/david-k-miller-supplychain",
          subtitle: "Scan for Verified Executive Profile",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Executive Profile",
          visible: true,
          columns: 1,
          content:
            "<p>Global Supply Chain Executive with 16+ years optimizing multi-billion-dollar freight networks, cold chain logistics, and predictive inventory automation across 48 countries. Master Black Belt in Lean Six Sigma with a proven record slashing carrying costs by $85M while elevating on-time-in-full (OTIF) delivery to 99.2%.</p>",
        },
        experience: {
          name: "Experience",
          title: "Supply Chain Leadership",
          visible: true,
          columns: 1,
          items: [
            {
              id: "onx-exp-1",
              company: "Apex Global Freight & Retail",
              position: "Vice President, Global Supply Chain",
              location: "Chicago, IL",
              date: "2019 - Present",
              summary:
                "<ul><li>Orchestrated $2.4B annual logistics spend spanning maritime, intermodal rail, and automated distribution fulfillment centers.</li><li>Engineered digital twin inventory prediction engine cutting inventory stockouts by 63% during volatile global port disruptions.</li><li>Negotiated multi-year carrier freight contracts delivering $42M in direct bottom-line operating savings.</li></ul>",
            },
            {
              id: "onx-exp-2",
              company: "Trans-Pacific Logistics Corp.",
              position: "Director of International Operations",
              location: "Long Beach, CA",
              date: "2013 - 2019",
              summary:
                "<ul><li>Supervised 14 automated distribution centers totaling 8M square feet of robotic fulfillment space.</li><li>Instituted customs automated clearance protocols reducing average container dwell time by 3.5 days.</li></ul>",
            },
          ],
        },
        custom_trade_certifications: {
          id: "custom_trade_certifications",
          isCustom: true,
          type: "simple_list",
          name: "Trade Accreditations",
          title: "Supply Chain & Trade Accreditations",
          visible: true,
          columns: 1,
          items: [
            { id: "tc-1", name: "Certified Supply Chain Professional (CSCP)", awarder: "ASCM / APICS", date: "2022" },
            { id: "tc-2", name: "Lean Six Sigma Master Black Belt", awarder: "Institute of Industrial Engineers", date: "2018" },
            { id: "tc-3", name: "Customs-Trade Partnership Against Terrorism (C-TPAT) Lead", awarder: "U.S. Customs and Border Protection", date: "2016" },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "onx-edu-1",
              institution: "Northwestern University (Kellogg School of Management)",
              studyType: "M.B.A. in Operations & Global Supply Management",
              area: "Evanston, IL",
              date: "2011 - 2013",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Core Competencies",
          visible: true,
          columns: 1,
          items: [
            { name: "Multi-Modal Freight & Fleet Management", level: 5 },
            { name: "Digital Twin & SAP S/4HANA Supply Chain", level: 5 },
            { name: "Lean Six Sigma & Kaizen Transformation", level: 5 },
            { name: "Supplier Relationship Management (SRM)", level: 5 },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Executive Profiles",
          visible: true,
          columns: 1,
          items: [
            { id: "onx-p1", network: "LinkedIn", username: "david-k-miller-supplychain", url: "https://linkedin.com/in/david-k-miller-supplychain" },
          ],
        },
      },
      metadata: {
        template: "onyx",
        layout: [
          [
            ["summary", "experience", "education", "custom_trade_certifications", "skills", "profiles"],
            [],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#18181b",
          primary: "#dc2626",
        },
        typography: {
          font: { family: "PT Serif", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 11. PIKACHU - Senior Mobile & iOS Native Architect
  {
    title: "Kai Takahashi - Senior Mobile & iOS Native Architect",
    slug: "kai-takahashi-pikachu-ios-architect",
    template: "pikachu",
    data: {
      basics: {
        name: "Kai Takahashi",
        headline: "Senior Mobile & iOS Native Architect",
        email: "kai@takahashi-mobile.io",
        phone: "+1 (408) 723-9184",
        location: "San Jose, CA",
        url: { label: "takahashi.app", href: "https://takahashi.app" },
        picture: {
          url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 8,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://testflight.apple.com/join/kai-architect-demo",
          subtitle: "Scan to Test Live iOS App",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Mobile Architecture Profile",
          visible: true,
          columns: 1,
          content:
            "<p>Senior iOS & Mobile Systems Architect with 8+ years crafting top-ranking native iOS applications with over 20M+ combined downloads. Specializing in high-framerate SwiftUI state architectures, offline-first CoreData/SwiftData synchronizations, and custom Metal compute pipelines.</p>",
        },
        experience: {
          name: "Experience",
          title: "Mobile Engineering",
          visible: true,
          columns: 1,
          items: [
            {
              id: "pik-exp-1",
              company: "PulseBeat Health & Fitness",
              position: "Staff iOS Architect",
              location: "San Jose, CA",
              date: "2021 - Present",
              summary:
                "<ul><li>Architected Swift 6 strict concurrency mobile application with 15M downloads, maintaining a flawless 4.9 App Store rating across 180k reviews.</li><li>Developed real-time computer vision workout rep counter in CoreML and Metal running at zero thermal throttling.</li><li>Reduced app launch cold-start time from 1.8s to 280ms via dynamic binary pre-warming and asset slicing.</li></ul>",
            },
            {
              id: "pik-exp-2",
              company: "Zenith Mobile Games",
              position: "Lead iOS Graphics Engineer",
              location: "San Francisco, CA",
              date: "2017 - 2021",
              summary:
                "<ul><li>Built procedural particle rendering engine using Metal Shading Language operating at 120fps on ProMotion displays.</li><li>Integrated StoreKit 2 in-app purchases generating $18M in recurring subscription ARR.</li></ul>",
            },
          ],
        },
        custom_mobile_matrix: {
          id: "custom_mobile_matrix",
          isCustom: true,
          type: "language_matrix",
          name: "Native Stack Mastery",
          title: "Native iOS & Mobile Stack Mastery",
          visible: true,
          columns: 1,
          items: [
            { name: "Swift 6 & SwiftUI (Strict Concurrency)", description: "Native / Architectural Level" },
            { name: "Metal Shading Language & CoreML", description: "Expert / High-Perf Graphics" },
            { name: "Kotlin Multiplatform (KMP)", description: "Fluent / Cross-Platform Core" },
            { name: "Reverse Engineering & Cryptography", description: "Working Knowledge / App Attest" },
          ],
        },
        projects: {
          name: "Projects",
          title: "Featured App Store Launches",
          visible: true,
          columns: 1,
          items: [
            {
              id: "pik-prj-1",
              name: "AudioWave - Lossless Equalizer",
              description: "Native SwiftUI audio processing app utilizing Accelerate framework and vDSP digital signal processing. Apple Design Award Nominee 2023.",
              date: "2023",
            },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "pik-edu-1",
              institution: "Stanford University",
              studyType: "B.S. in Symbolic Systems (Human-Computer Interaction)",
              area: "Stanford, CA",
              date: "2013 - 2017",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Technical Arsenal",
          visible: true,
          columns: 1,
          items: [
            { name: "SwiftUI, Combine & Swift Concurrency", level: 5 },
            { name: "Metal Compute & Shading Language", level: 5 },
            { name: "CoreData, SwiftData & CloudKit Sync", level: 5 },
            { name: "StoreKit 2 & App Store Optimization", level: 4 },
          ],
        },
        awards: {
          name: "Awards",
          title: "Industry Honors",
          visible: true,
          columns: 1,
          items: [
            { id: "pik-a1", name: "Apple Design Award Finalist", awarder: "Apple Inc.", date: "2023" },
            { id: "pik-a2", name: "WWDC Swift Student Challenge Mentor", awarder: "Apple Developer Academy", date: "2022" },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Developer Profiles",
          visible: true,
          columns: 1,
          items: [
            { id: "pik-p1", network: "GitHub", username: "kaitakahashi-swift", url: "https://github.com/kaitakahashi-swift" },
            { id: "pik-p2", network: "AppStore", username: "KaiTakahashiApps", url: "https://apps.apple.com/developer/kai-takahashi" },
          ],
        },
      },
      metadata: {
        template: "pikachu",
        layout: [
          [
            ["summary", "experience", "projects", "education"],
            ["skills", "custom_mobile_matrix", "awards", "profiles"],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#1f2937",
          primary: "#d97706",
        },
        typography: {
          font: { family: "Titillium Web", category: "sans-serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },

  // 12. RHYHORN - Director Enterprise Data Engineering & Analytics
  {
    title: "Sarah Jenkins - Director Enterprise Data Engineering & Analytics",
    slug: "sarah-jenkins-rhyhorn-director-data-engineering",
    template: "rhyhorn",
    data: {
      basics: {
        name: "Sarah Jenkins",
        headline: "Director of Enterprise Data Engineering & Analytics",
        email: "sarah.jenkins@datalakehouse.org",
        phone: "+1 (512) 809-2231",
        location: "Austin, TX",
        url: { label: "sarahjenkins.io", href: "https://sarahjenkins.io" },
        picture: {
          url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&fit=crop&crop=faces",
          size: 110,
          aspectRatio: 1,
          borderRadius: 4,
          effects: { hidden: false, border: true, grayscale: false },
        },
        qrCode: {
          enabled: true,
          destination: "https://sarahjenkins.io/data-lake-whitepapers",
          subtitle: "Scan for Data Lake Whitepapers",
        },
      },
      sections: {
        summary: {
          name: "Summary",
          title: "Executive Profile",
          visible: true,
          columns: 1,
          content:
            "<p>Enterprise Data Engineering Director with 13+ years building petabyte-scale lakehouse architectures, real-time event streaming backbones, and governance meshes for Fortune 50 enterprises. Spearheaded data transformations saving $18M in cloud compute while unlocking real-time operational analytics for 4,000 internal stakeholders.</p>",
        },
        experience: {
          name: "Experience",
          title: "Leadership Career",
          visible: true,
          columns: 1,
          items: [
            {
              id: "rhy-exp-1",
              company: "Vertex Financial Data Systems",
              position: "Director of Data Platform Engineering",
              location: "Austin, TX",
              date: "2020 - Present",
              summary:
                "<ul><li>Direct 32 data engineers, analytics engineers, and MLOps architects across 4 distributed teams.</li><li>Architected migration from legacy Hadoop cluster to Snowflake & Databricks Lakehouse processing 14B rows daily.</li><li>Instituted automated data quality testing with Great Expectations and dbt reducing production data incidents by 82%.</li></ul>",
            },
            {
              id: "rhy-exp-2",
              company: "StreamSphere Telemetry",
              position: "Principal Data Architect",
              location: "Dallas, TX",
              date: "2015 - 2020",
              summary:
                "<ul><li>Designed real-time streaming analytics engine on Apache Kafka, Flink, and ClickHouse handling 800,000 events/sec.</li><li>Established centralized data catalog and automated GDPR/CCPA PII masking governance.</li></ul>",
            },
          ],
        },
        custom_stem_mentorship: {
          id: "custom_stem_mentorship",
          isCustom: true,
          type: "timeline",
          name: "Community Leadership",
          title: "STEM Community Leadership & Open Source",
          visible: true,
          columns: 1,
          items: [
            {
              id: "stem-1",
              company: "Women in Data Engineering Global Network",
              position: "Board Member & Advisory Chair",
              date: "2021 - Present",
              summary: "<ul><li>Mentored 120+ early-career women engineers in distributed database systems and cloud infrastructure.</li></ul>",
            },
            {
              id: "stem-2",
              company: "Apache Software Foundation",
              position: "Apache Iceberg & Arrow Project Contributor",
              date: "2019 - Present",
              summary: "<ul><li>Contributed partition pruning optimizations improving read speeds across partitioned Parquet lakes.</li></ul>",
            },
          ],
        },
        education: {
          name: "Education",
          title: "Education",
          visible: true,
          columns: 1,
          items: [
            {
              id: "rhy-edu-1",
              institution: "The University of Texas at Austin",
              studyType: "M.S. in Electrical & Computer Engineering (Data Science)",
              area: "Austin, TX",
              date: "2011 - 2013",
            },
          ],
        },
        skills: {
          name: "Skills",
          title: "Technical Arsenal",
          visible: true,
          columns: 1,
          items: [
            { name: "Snowflake, Databricks & Delta Lake", level: 5 },
            { name: "Apache Spark, Kafka & Flink Streaming", level: 5 },
            { name: "dbt (data build tool) & Data Modeling", level: 5 },
            { name: "Python, SQL & Distributed Query Tuning", level: 5 },
          ],
        },
        profiles: {
          name: "Profiles",
          title: "Connect",
          visible: true,
          columns: 1,
          items: [
            { id: "rhy-p1", network: "LinkedIn", username: "sarah-jenkins-data", url: "https://linkedin.com/in/sarah-jenkins-data" },
            { id: "rhy-p2", network: "GitHub", username: "sarahjenkins-data", url: "https://github.com/sarahjenkins-data" },
          ],
        },
      },
      metadata: {
        template: "rhyhorn",
        layout: [
          [
            ["summary", "experience", "education", "custom_stem_mentorship", "skills", "profiles"],
            [],
          ],
        ],
        theme: {
          background: "#ffffff",
          text: "#1e293b",
          primary: "#475569",
        },
        typography: {
          font: { family: "Merriweather", category: "serif" },
          fontScale: 1,
          density: "normal",
          headerStyle: "default",
        },
        page: { format: "a4", marginPreset: "standard" },
      },
    },
  },
];

async function seedResumes() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGO_URI ? "URI configured" : "NO URI");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully.");

    // Find target user (Muhammad Usman or fallback to first active user)
    let user = await User.findOne({ email: "musman7533@gmail.com" });
    if (!user) {
      user = await User.findOne({});
      console.log("User musman7533@gmail.com not found, using first user:", user?.email);
    } else {
      console.log("Found primary user:", user.email, user._id);
    }

    if (!user) {
      console.error("No users found in database. Please register a user first.");
      process.exit(1);
    }

    // Save JSON bundle to frontend assets for offline preview / export
    const exportDir = path.join(__dirname, "../../frontend/src/assets/demo_resumes");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(exportDir, "all_demo_resumes.json"),
      JSON.stringify(demoResumesData, null, 2),
      "utf8"
    );
    console.log("Exported all_demo_resumes.json bundle to frontend/src/assets/demo_resumes/");

    // Seed into MongoDB for target user
    console.log(`Seeding ${demoResumesData.length} demo resumes for user: ${user.email} (${user._id})`);

    for (const resumeItem of demoResumesData) {
      // Find or upsert resume by userId and slug
      const existing = await Resume.findOne({ userId: user._id, slug: resumeItem.slug });
      
      const payload = {
        userId: user._id,
        title: resumeItem.title,
        slug: resumeItem.slug,
        thumbnailLink: `/src/assets/template_images/${resumeItem.template}.jpg`,
        data: resumeItem.data,
        isPublic: true,
        viewsCount: Math.floor(Math.random() * 45) + 12,
        lastViewedAt: new Date(),
      };

      if (existing) {
        await Resume.updateOne({ _id: existing._id }, { $set: payload });
        console.log(`[UPDATED] ${resumeItem.template.toUpperCase().padEnd(10)}: ${resumeItem.title}`);
      } else {
        await Resume.create(payload);
        console.log(`[CREATED] ${resumeItem.template.toUpperCase().padEnd(10)}: ${resumeItem.title}`);
      }
    }

    // Also seed for test user if one exists so test logins also see the full suite
    const testUser = await User.findOne({ email: "test_user_1637173158@example.com" });
    if (testUser && testUser._id.toString() !== user._id.toString()) {
      console.log(`Also seeding for test user: ${testUser.email}`);
      for (const resumeItem of demoResumesData) {
        const testSlug = `${resumeItem.slug}-test`;
        const payload = {
          userId: testUser._id,
          title: resumeItem.title,
          slug: testSlug,
          thumbnailLink: `/src/assets/template_images/${resumeItem.template}.jpg`,
          data: resumeItem.data,
          isPublic: true,
          viewsCount: 20,
          lastViewedAt: new Date(),
        };
        const existing = await Resume.findOne({ userId: testUser._id, slug: testSlug });
        if (existing) {
          await Resume.updateOne({ _id: existing._id }, { $set: payload });
        } else {
          await Resume.create(payload);
        }
      }
      console.log("Test user seeded successfully.");
    }

    console.log("All 12 demo resumes successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding demo resumes:", error);
    process.exit(1);
  }
}

seedResumes();
