/**
 * Resume & ATS Diagnostic Engine
 * Provides instant (0ms latency) client-side evaluation across 6 analytical pillars:
 * 1. Content & Impact
 * 2. Sections & Structure
 * 3. Document Standards
 * 4. Professional Polish
 * 5. Career Signals
 * 6. Role Tailoring
 */

// Helper to strip HTML tags from strings
export const stripHtml = (html = "") => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
};

// Split HTML or text summary into individual bullet items
export const extractBullets = (summary = "") => {
  if (!summary) return [];
  const text = stripHtml(summary);
  // If bullets are separated by •, -, or line breaks
  const rawBullets = text
    .split(/(?:•|–|\n|\r|<br\s*\/?>)+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 5);

  if (rawBullets.length > 0) return rawBullets;
  return text.length > 10 ? [text] : [];
};

// Common executive buzzwords that weaken resume impact
const BUZZWORDS = [
  { term: "team player", reason: "Overused cliché; demonstrate collaboration through cross-functional project wins." },
  { term: "hard worker", reason: "Subjective filler; recruiters value quantifiable outputs over claims." },
  { term: "go-getter", reason: "Informal slang; replace with initiative verbs like 'Spearheaded' or 'Originated'." },
  { term: "detail-oriented", reason: "Show, don't tell; prove attention to detail through error reduction or quality metrics." },
  { term: "results-driven", reason: "Empty phrase unless immediately backed up by dollar or percentage gains." },
  { term: "think outside the box", reason: "Trite phrase; describe the specific innovative solution you engineered." },
  { term: "self-starter", reason: "Standard expectation; demonstrate autonomous leadership through project launches." },
  { term: "fast learner", reason: "Focus on technologies rapidly adopted and delivered rather than generic adaptability." },
  { term: "synergy", reason: "Corporate jargon; clarify actual cross-team integration or efficiency achievements." },
  { term: "rockstar", reason: "Unprofessional casual term not taken seriously by ATS recruiters." },
  { term: "ninja", reason: "Unprofessional casual term; use precise technical titles." },
];

// Passive opening phrases
const PASSIVE_OPENERS = [
  "responsible for",
  "helped with",
  "assisted in",
  "worked on",
  "tasked with",
  "involved in",
  "duties included",
  "helped to",
  "participated in",
];

// Strong leadership verbs
const LEADERSHIP_VERBS = [
  "spearheaded", "orchestrated", "architected", "championed", "mentored",
  "steered", "directed", "oversaw", "scaled", "negotiated", "accelerated",
  "maximized", "restructured", "transformed", "engineered", "pioneered"
];

/**
 * Main Diagnostic Function
 * @param {Object} resumeData - Full resume data object
 * @returns {Object} Comprehensive audit report
 */
export const runResumeAudit = (resumeData = {}) => {
  const basics = resumeData?.basics || {};
  const sections = resumeData?.sections || {};

  // Extract experience bullets
  const expItems = (sections.experience?.items || []).filter(Boolean);
  const projectItems = (sections.projects?.items || []).filter(Boolean);

  const allBullets = [];
  expItems.forEach((exp, expIdx) => {
    if (!exp) return;
    const bullets = extractBullets(exp.summary);
    bullets.forEach((b) => {
      allBullets.push({
        text: b,
        role: exp.position || "Experience",
        company: exp.company || "",
        sectionKey: "experience",
        itemIndex: expIdx,
      });
    });
  });

  projectItems.forEach((proj, projIdx) => {
    if (!proj) return;
    const bullets = extractBullets(proj.summary || proj.description);
    bullets.forEach((b) => {
      allBullets.push({
        text: b,
        role: proj.name || "Project",
        company: "",
        sectionKey: "projects",
        itemIndex: projIdx,
      });
    });
  });

  // -------------------------------------------------------------
  // PILLAR 1: CONTENT & IMPACT (30% weight)
  // -------------------------------------------------------------
  const contentChecks = [];

  // Check 1.1: Quantifying Impact (Metrics, numbers, %)
  const metricRegex = /\b\d+([.,]\d+)?%?\b|[$€£¥]\s*\d+|\b\d+\s*(?:k|m|million|billion)\b|\b\d+\+|\b#\d+/i;
  const quantifiedBullets = allBullets.filter((b) => metricRegex.test(b.text));
  const unquantifiedBullets = allBullets.filter((b) => !metricRegex.test(b.text));
  const quantPct = allBullets.length > 0 ? Math.round((quantifiedBullets.length / allBullets.length) * 100) : 0;

  const quantPassed = quantPct >= 40 && allBullets.length > 0;
  contentChecks.push({
    id: "quantifying_impact",
    name: "Quantifying Impact",
    status: quantPassed ? "pass" : allBullets.length === 0 ? "warning" : "issue",
    badge: quantPassed ? "No issues" : `${unquantifiedBullets.length} unquantified`,
    score: Math.min(100, Math.round((quantPct / 50) * 100)),
    description: "Recruiters and ATS look for quantifiable outcomes (percentages, revenue, throughput, time savings).",
    sectionKey: "experience",
    issuesCount: quantPassed ? 0 : unquantifiedBullets.length,
    findings: unquantifiedBullets.slice(0, 4).map((b) => ({
      text: b.text,
      context: `${b.role}${b.company ? ` at ${b.company}` : ""}`,
      suggestion: "Add a concrete metric using Google's formula: 'Accomplished [X], measured by [Y], by doing [Z]'.",
      sectionKey: b.sectionKey,
      itemIndex: b.itemIndex,
    })),
  });

  // Check 1.2: Action Verbs & Passive Phrasing
  const passiveFindings = [];
  allBullets.forEach((b) => {
    const lower = b.text.toLowerCase().trim();
    for (const passive of PASSIVE_OPENERS) {
      if (lower.startsWith(passive)) {
        passiveFindings.push({
          text: b.text,
          context: `${b.role}${b.company ? ` at ${b.company}` : ""}`,
          suggestion: `Replace weak opener '${passive}' with an active verb (e.g., 'Engineered', 'Delivered', 'Spearheaded').`,
          sectionKey: b.sectionKey,
          itemIndex: b.itemIndex,
        });
        break;
      }
    }
  });

  contentChecks.push({
    id: "action_verbs",
    name: "Action Verbs & Voice",
    status: passiveFindings.length === 0 ? "pass" : "issue",
    badge: passiveFindings.length === 0 ? "No issues" : `${passiveFindings.length} passive`,
    score: passiveFindings.length === 0 ? 100 : Math.max(40, 100 - passiveFindings.length * 15),
    description: "Every bullet should open with a decisive, past-tense active verb rather than passive task phrases.",
    sectionKey: "experience",
    issuesCount: passiveFindings.length,
    findings: passiveFindings.slice(0, 4),
  });

  // Check 1.3: Word Repetition (Overused Verbs)
  const firstWords = {};
  allBullets.forEach((b) => {
    const match = b.text.trim().match(/^([A-Za-z]+)/);
    if (match) {
      const verb = match[1].toLowerCase();
      if (verb.length > 3) {
        firstWords[verb] = (firstWords[verb] || 0) + 1;
      }
    }
  });

  const repeatedVerbs = Object.entries(firstWords)
    .filter(([_, count]) => count >= 3)
    .map(([verb, count]) => ({ verb, count }));

  contentChecks.push({
    id: "word_repetition",
    name: "Repetition & Variety",
    status: repeatedVerbs.length === 0 ? "pass" : "warning",
    badge: repeatedVerbs.length === 0 ? "No issues" : `${repeatedVerbs.length} repeated`,
    score: repeatedVerbs.length === 0 ? 100 : Math.max(50, 100 - repeatedVerbs.length * 20),
    description: "Using the same opening verb multiple times looks redundant to hiring managers.",
    sectionKey: "experience",
    issuesCount: repeatedVerbs.length,
    findings: repeatedVerbs.map((r) => ({
      text: `Opening verb "${r.verb}" is used ${r.count} times.`,
      suggestion: `Diversify your vocabulary with synonyms like 'Orchestrated', 'Delivered', or 'Accelerated'.`,
      sectionKey: "experience",
    })),
  });

  // Check 1.4: Bullet Length & Density
  const lengthIssues = [];
  allBullets.forEach((b) => {
    const wordCount = b.text.trim().split(/\s+/).length;
    if (wordCount < 6) {
      lengthIssues.push({
        text: b.text,
        context: `${b.role} (${wordCount} words)`,
        suggestion: "Too brief. Add context on how you executed this and the measurable result.",
        sectionKey: b.sectionKey,
        itemIndex: b.itemIndex,
      });
    } else if (wordCount > 38) {
      lengthIssues.push({
        text: b.text,
        context: `${b.role} (${wordCount} words)`,
        suggestion: "Too lengthy. Split into two crisp bullets to avoid dense text that recruiters skim past.",
        sectionKey: b.sectionKey,
        itemIndex: b.itemIndex,
      });
    }
  });

  contentChecks.push({
    id: "bullet_density",
    name: "Bullet Length & Density",
    status: lengthIssues.length === 0 ? "pass" : "warning",
    badge: lengthIssues.length === 0 ? "No issues" : `${lengthIssues.length} issues`,
    score: lengthIssues.length === 0 ? 100 : Math.max(50, 100 - lengthIssues.length * 15),
    description: "Ideal resume bullet points are 10–30 words with high information density.",
    sectionKey: "experience",
    issuesCount: lengthIssues.length,
    findings: lengthIssues.slice(0, 4),
  });

  // Calculate Content Pillar Score
  const contentScore = Math.round(
    contentChecks.reduce((acc, c) => acc + c.score, 0) / contentChecks.length
  );

  // -------------------------------------------------------------
  // PILLAR 2: SECTIONS & STRUCTURE (20% weight)
  // -------------------------------------------------------------
  const sectionsChecks = [];

  // Check 2.1: Essential Sections
  const missingEssential = [];
  if (!sections.experience?.items || sections.experience.items.length === 0) {
    missingEssential.push("Work Experience");
  }
  if (!sections.education?.items || sections.education.items.length === 0) {
    missingEssential.push("Education");
  }
  if (!sections.skills?.items || sections.skills.items.length === 0) {
    missingEssential.push("Skills");
  }

  sectionsChecks.push({
    id: "essential_sections",
    name: "Essential Sections",
    status: missingEssential.length === 0 ? "pass" : "issue",
    badge: missingEssential.length === 0 ? "No issues" : `${missingEssential.length} missing`,
    score: missingEssential.length === 0 ? 100 : Math.max(30, 100 - missingEssential.length * 30),
    description: "Every executive resume must include Work Experience, Education, and Skills.",
    sectionKey: missingEssential.length > 0 ? missingEssential[0].toLowerCase().replace(" ", "-") : "experience",
    issuesCount: missingEssential.length,
    findings: missingEssential.map((s) => ({
      text: `Missing section: ${s}`,
      suggestion: `Add the ${s} section to ensure ATS compliance.`,
      sectionKey: s === "Work Experience" ? "experience" : s.toLowerCase(),
    })),
  });

  // Check 2.2: Contact Information
  const contactIssues = [];
  if (!basics.name || basics.name.trim().length < 2) {
    contactIssues.push({ text: "Candidate name is missing", field: "name", sectionKey: "personal-info" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basics.email || !emailRegex.test(basics.email.trim())) {
    contactIssues.push({ text: "Valid email address is missing", field: "email", sectionKey: "personal-info" });
  }
  if (!basics.phone || basics.phone.replace(/\D/g, "").length < 7) {
    contactIssues.push({ text: "Direct phone number is missing", field: "phone", sectionKey: "personal-info" });
  }
  if (!basics.location || basics.location.trim().length < 3) {
    contactIssues.push({ text: "Location / City is missing", field: "location", sectionKey: "personal-info" });
  }

  sectionsChecks.push({
    id: "contact_information",
    name: "Contact Information",
    status: contactIssues.length === 0 ? "pass" : "issue",
    badge: contactIssues.length === 0 ? "No issues" : `${contactIssues.length} missing`,
    score: contactIssues.length === 0 ? 100 : Math.max(30, 100 - contactIssues.length * 20),
    description: "Recruiters require full name, verified email, direct phone, and general location.",
    sectionKey: "personal-info",
    issuesCount: contactIssues.length,
    findings: contactIssues.map((c) => ({
      text: c.text,
      suggestion: `Fill in your ${c.field} in the Personal Information section.`,
      sectionKey: "personal-info",
    })),
  });

  // Check 2.3: Professional Profiles & Links
  const hasLink = Boolean(basics.url?.href || basics.url?.label);
  sectionsChecks.push({
    id: "professional_links",
    name: "Portfolio & Professional Links",
    status: hasLink ? "pass" : "warning",
    badge: hasLink ? "No issues" : "Recommended",
    score: hasLink ? 100 : 70,
    description: "Adding a LinkedIn URL, GitHub profile, or portfolio website increases recruiter engagement by 40%.",
    sectionKey: "personal-info",
    issuesCount: hasLink ? 0 : 1,
    findings: hasLink ? [] : [{
      text: "No professional link (LinkedIn, GitHub, Portfolio) provided in header.",
      suggestion: "Add your LinkedIn or portfolio URL in Personal Information.",
      sectionKey: "personal-info",
    }],
  });

  // Check 2.4: Summary Substance
  const summaryText = stripHtml(sections.summary?.content || basics.summary || "");
  const summaryWordCount = summaryText.split(/\s+/).filter(Boolean).length;
  const summaryPassed = summaryWordCount >= 20;

  sectionsChecks.push({
    id: "summary_substance",
    name: "Executive Summary",
    status: summaryPassed ? "pass" : summaryWordCount === 0 ? "warning" : "issue",
    badge: summaryPassed ? "No issues" : summaryWordCount === 0 ? "Missing" : "Too short",
    score: summaryPassed ? 100 : summaryWordCount === 0 ? 60 : 75,
    description: "A 2–3 sentence executive summary sets the tone and anchors your key value proposition.",
    sectionKey: "summary",
    issuesCount: summaryPassed ? 0 : 1,
    findings: summaryPassed ? [] : [{
      text: summaryWordCount === 0 ? "Executive summary is empty." : `Summary is only ${summaryWordCount} words.`,
      suggestion: "Craft a 2–3 sentence executive summary highlighting your domain focus and key impact.",
      sectionKey: "summary",
    }],
  });

  const sectionsScore = Math.round(
    sectionsChecks.reduce((acc, c) => acc + c.score, 0) / sectionsChecks.length
  );

  // -------------------------------------------------------------
  // PILLAR 3: DOCUMENT STANDARDS (15% weight)
  // -------------------------------------------------------------
  const standardsChecks = [];

  // Check 3.1: Date Uniformity
  const allDates = [
    ...expItems.map((e) => e?.date),
    ...(sections.education?.items || []).filter(Boolean).map((ed) => ed?.date),
    ...projectItems.map((p) => p?.date),
  ].filter(Boolean);

  const hasPresent = allDates.some((d) => /present|current/i.test(d));
  const hasMixedNumeric = allDates.some((d) => /\d{1,2}\/\d{2,4}/.test(d)) && allDates.some((d) => /[A-Za-z]+\s+\d{4}/.test(d));

  standardsChecks.push({
    id: "date_uniformity",
    name: "Date Uniformity",
    status: hasMixedNumeric ? "warning" : "pass",
    badge: hasMixedNumeric ? "Mixed formats" : "No issues",
    score: hasMixedNumeric ? 75 : 100,
    description: "Maintain uniform date formatting across all entries (e.g. '2021 – Present' or 'May 2021 – Aug 2022').",
    sectionKey: "experience",
    issuesCount: hasMixedNumeric ? 1 : 0,
    findings: hasMixedNumeric ? [{
      text: "Detected mixed date formats (e.g. MM/YYYY mixed with Month YYYY).",
      suggestion: "Standardize all date ranges to use consistent Month YYYY or YYYY formatting.",
      sectionKey: "experience",
    }] : [],
  });

  // Check 3.2: Email Professionalism
  const emailVal = basics.email || "";
  const isEmailClean = !/\d{5,}@/.test(emailVal);
  standardsChecks.push({
    id: "email_professionalism",
    name: "Email Professionalism",
    status: isEmailClean ? "pass" : "warning",
    badge: isEmailClean ? "No issues" : "Needs Review",
    score: isEmailClean ? 100 : 70,
    description: "Professional email addresses should ideally consist of firstname.lastname@domain.com without random digits.",
    sectionKey: "personal-info",
    issuesCount: isEmailClean ? 0 : 1,
    findings: isEmailClean ? [] : [{
      text: `Email address '${emailVal}' contains a long sequence of numbers.`,
      suggestion: "Use a clean firstname.lastname handle for recruitment submissions.",
      sectionKey: "personal-info",
    }],
  });

  // Check 3.3: Standard File Naming
  const titleVal = resumeData.title || "";
  const hasGoodTitle = titleVal.length > 2 && !/untitled|draft|temp/i.test(titleVal);
  standardsChecks.push({
    id: "file_naming",
    name: "Export File Naming",
    status: hasGoodTitle ? "pass" : "warning",
    badge: hasGoodTitle ? "No issues" : "Standardize",
    score: hasGoodTitle ? 100 : 80,
    description: "Name your resume clearly with your name and role (e.g. 'Alex_Morgan_Solutions_Lead_Resume').",
    sectionKey: "personal-info",
    issuesCount: hasGoodTitle ? 0 : 1,
    findings: hasGoodTitle ? [] : [{
      text: `Resume title is '${titleVal || "Untitled"}'.`,
      suggestion: "Rename to 'FirstName_LastName_Resume' for easy discovery by hiring managers.",
      sectionKey: "personal-info",
    }],
  });

  const standardsScore = Math.round(
    standardsChecks.reduce((acc, c) => acc + c.score, 0) / standardsChecks.length
  );

  // -------------------------------------------------------------
  // PILLAR 4: PROFESSIONAL POLISH (15% weight)
  // -------------------------------------------------------------
  const polishChecks = [];

  // Check 4.1: First-Person Pronouns Audit (Crucial ATS rule)
  const pronounRegex = /\b(I|me|my|mine|myself|we|us|our|ours)\b/i;
  const pronounFindings = [];

  if (pronounRegex.test(summaryText)) {
    pronounFindings.push({
      text: "First-person pronouns detected in Executive Summary.",
      context: "Summary",
      suggestion: "Rewrite in third-person executive voice (e.g., 'Experienced Lead Engineer with...' instead of 'I am an experienced...').",
      sectionKey: "summary",
    });
  }

  allBullets.forEach((b) => {
    if (pronounRegex.test(b.text)) {
      pronounFindings.push({
        text: b.text,
        context: `${b.role}`,
        suggestion: "Remove first-person pronouns ('I', 'we', 'my'). Resume bullets must start directly with active verbs.",
        sectionKey: b.sectionKey,
        itemIndex: b.itemIndex,
      });
    }
  });

  polishChecks.push({
    id: "pronoun_audit",
    name: "First-Person Pronouns",
    status: pronounFindings.length === 0 ? "pass" : "issue",
    badge: pronounFindings.length === 0 ? "No issues" : `${pronounFindings.length} pronouns found`,
    score: pronounFindings.length === 0 ? 100 : Math.max(30, 100 - pronounFindings.length * 20),
    description: "Standard professional resumes never use personal pronouns ('I', 'me', 'my', 'we').",
    sectionKey: "experience",
    issuesCount: pronounFindings.length,
    findings: pronounFindings.slice(0, 4),
  });

  // Check 4.2: Buzzword & Cliche Detection
  const buzzwordFindings = [];
  const fullContent = [
    summaryText,
    ...allBullets.map((b) => b.text),
  ].join(" ").toLowerCase();

  BUZZWORDS.forEach(({ term, reason }) => {
    const regex = new RegExp(`\\b${term}\\b`, "i");
    if (regex.test(fullContent)) {
      buzzwordFindings.push({
        text: `Found cliché: "${term}"`,
        suggestion: reason,
        sectionKey: "summary",
      });
    }
  });

  polishChecks.push({
    id: "buzzword_detection",
    name: "Cliches & Buzzwords",
    status: buzzwordFindings.length === 0 ? "pass" : "warning",
    badge: buzzwordFindings.length === 0 ? "No issues" : `${buzzwordFindings.length} buzzwords`,
    score: buzzwordFindings.length === 0 ? 100 : Math.max(60, 100 - buzzwordFindings.length * 15),
    description: "Overused corporate clichés dilute your credibility and get filtered by modern recruiters.",
    sectionKey: "experience",
    issuesCount: buzzwordFindings.length,
    findings: buzzwordFindings.slice(0, 4),
  });

  const polishScore = Math.round(
    polishChecks.reduce((acc, c) => acc + c.score, 0) / polishChecks.length
  );

  // -------------------------------------------------------------
  // PILLAR 5: CAREER SIGNALS (10% weight)
  // -------------------------------------------------------------
  const careerChecks = [];

  // Check 5.1: Skill Substantiation (Are declared skills proven in bullets?)
  const skillItems = sections.skills?.items || [];
  const expBodyText = allBullets.map((b) => b.text).join(" ").toLowerCase();

  const unverifiedSkills = [];
  skillItems.forEach((s) => {
    if (!s || !s.name) return;
    const candidates = [s.name, ...(s.keywords || [])].filter((k) => k && k.trim().length > 1);
    const isProven = candidates.some((candidate) => {
      const regex = new RegExp(`\\b${candidate.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      return regex.test(expBodyText);
    });
    if (!isProven) {
      unverifiedSkills.push(s.name);
    }
  });

  const totalSkillCount = skillItems.filter((s) => s && s.name).length;
  const substantiationPct = totalSkillCount > 0
    ? Math.round(((totalSkillCount - unverifiedSkills.length) / totalSkillCount) * 100)
    : 100;

  careerChecks.push({
    id: "skill_substantiation",
    name: "Skill Substantiation",
    status: unverifiedSkills.length <= 1 ? "pass" : "warning",
    badge: unverifiedSkills.length === 0 ? "No issues" : `${unverifiedSkills.length} unproven`,
    score: totalSkillCount === 0 ? 80 : Math.max(50, substantiationPct),
    description: "Skills listed in your skills section carry 3x more weight when substantiated in your experience bullets.",
    sectionKey: "skills",
    issuesCount: unverifiedSkills.length,
    findings: unverifiedSkills.slice(0, 4).map((s) => ({
      text: `Skill '${s}' is listed in Skills but never mentioned in your experience.`,
      suggestion: `Incorporate '${s}' into a recent project or job bullet to prove hands-on application.`,
      sectionKey: "experience",
    })),
  });

  // Check 5.2: Leadership Signals
  const leadershipFound = [];
  allBullets.forEach((b) => {
    const lower = b.text.toLowerCase();
    for (const verb of LEADERSHIP_VERBS) {
      if (lower.includes(verb)) {
        leadershipFound.push(verb);
        break;
      }
    }
  });

  const hasLeadership = leadershipFound.length >= 2;
  careerChecks.push({
    id: "leadership_signals",
    name: "Leadership & Scope Signals",
    status: hasLeadership ? "pass" : "warning",
    badge: hasLeadership ? "No issues" : "Strengthen",
    score: hasLeadership ? 100 : Math.max(60, leadershipFound.length * 40),
    description: "Verbs like 'Spearheaded', 'Architected', and 'Mentored' signal high autonomy and seniority.",
    sectionKey: "experience",
    issuesCount: hasLeadership ? 0 : 1,
    findings: hasLeadership ? [] : [{
      text: "Limited leadership verbs detected in work experience.",
      suggestion: "Showcase strategic ownership using verbs like 'Orchestrated', 'Architected', or 'Pioneered'.",
      sectionKey: "experience",
    }],
  });

  const careerScore = Math.round(
    careerChecks.reduce((acc, c) => acc + c.score, 0) / careerChecks.length
  );

  // -------------------------------------------------------------
  // PILLAR 6: ROLE TAILORING (10% weight)
  // -------------------------------------------------------------
  const tailoringChecks = [];

  // Check 6.1: Target Headline Alignment
  const hasHeadline = Boolean(basics.headline && basics.headline.trim().length > 3);
  tailoringChecks.push({
    id: "target_headline",
    name: "Target Role Title",
    status: hasHeadline ? "pass" : "warning",
    badge: hasHeadline ? "No issues" : "Missing Title",
    score: hasHeadline ? 100 : 60,
    description: "A prominent role headline (e.g. 'Senior Full Stack Engineer') aligns your resume with ATS job searches.",
    sectionKey: "personal-info",
    issuesCount: hasHeadline ? 0 : 1,
    findings: hasHeadline ? [] : [{
      text: "Professional headline is blank.",
      suggestion: "Add a focused target headline in Personal Information.",
      sectionKey: "personal-info",
    }],
  });

  // Check 6.2: Skills Depth
  const declaredSkills = (sections.skills?.items || []).flatMap((s) => [
    s?.name,
    ...(s?.keywords || []),
  ]).filter((s) => s && s.trim().length > 1);
  const skillsCount = declaredSkills.length;
  const skillsPassed = skillsCount >= 6;
  tailoringChecks.push({
    id: "skills_depth",
    name: "Technical & Core Skills Breadth",
    status: skillsPassed ? "pass" : "warning",
    badge: skillsPassed ? "No issues" : `${skillsCount} skills`,
    score: skillsPassed ? 100 : Math.max(50, skillsCount * 15),
    description: "Aim for 6–15 core technical and industry competencies to maximize ATS keyword matches.",
    sectionKey: "skills",
    issuesCount: skillsPassed ? 0 : 1,
    findings: skillsPassed ? [] : [{
      text: `Only ${skillsCount} skills listed.`,
      suggestion: "Expand your Technical Skills with your core tools, frameworks, and proficiencies.",
      sectionKey: "skills",
    }],
  });

  const tailoringScore = Math.round(
    tailoringChecks.reduce((acc, c) => acc + c.score, 0) / tailoringChecks.length
  );

  // -------------------------------------------------------------
  // WEIGHTED OVERALL COMPOSITE SCORE (0 - 100)
  // -------------------------------------------------------------
  const overallScore = Math.round(
    contentScore * 0.30 +
    sectionsScore * 0.20 +
    standardsScore * 0.15 +
    polishScore * 0.15 +
    careerScore * 0.10 +
    tailoringScore * 0.10
  );

  // Score tier & grade label
  let grade = "Needs Polish";
  let gradeColor = "rose";
  if (overallScore >= 80) {
    grade = "Executive Ready";
    gradeColor = "emerald";
  } else if (overallScore >= 65) {
    grade = "Competitive Profile";
    gradeColor = "amber";
  }

  // Count total issues
  const allChecks = [
    ...contentChecks,
    ...sectionsChecks,
    ...standardsChecks,
    ...polishChecks,
    ...careerChecks,
    ...tailoringChecks,
  ];

  const totalIssues = allChecks.reduce((acc, c) => acc + (c.issuesCount || 0), 0);

  return {
    overallScore,
    grade,
    gradeColor,
    totalIssues,
    totalChecks: allChecks.length,
    pillars: [
      {
        key: "content",
        title: "CONTENT & IMPACT",
        score: contentScore,
        checks: contentChecks,
      },
      {
        key: "sections",
        title: "SECTIONS & CONTACT",
        score: sectionsScore,
        checks: sectionsChecks,
      },
      {
        key: "standards",
        title: "DOCUMENT STANDARDS",
        score: standardsScore,
        checks: standardsChecks,
      },
      {
        key: "polish",
        title: "PROFESSIONAL POLISH",
        score: polishScore,
        checks: polishChecks,
      },
      {
        key: "career",
        title: "CAREER & SIGNALS",
        score: careerScore,
        checks: careerChecks,
      },
      {
        key: "tailoring",
        title: "ROLE TAILORING",
        score: tailoringScore,
        checks: tailoringChecks,
      },
    ],
  };
};
