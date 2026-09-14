const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAIInstance = null;
const getGenAI = () => {
    if (!genAIInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is not defined.");
        }
        genAIInstance = new GoogleGenerativeAI(apiKey);
    }
    return genAIInstance;
};

const TONE_DIRECTIVES = {
    formal: `
TONE: FORMAL (Executive & Leadership)
- Authoritative, polished corporate language suitable for director/executive review.
- Focus: Strategic governance, organizational impact, leadership, and operational excellence.
- Verbs: "Spearheaded", "Orchestrated", "Oversaw", "Championed", "Facilitated".
`,
    impactful: `
TONE: IMPACTFUL (Google XYZ Formula)
- Strict Google formula: "Accomplished [X], as measured by [Y], by doing [Z]".
- MUST include hard quantifiable business impact: revenue, cost reduction, percentage gains, time savings.
- Verbs: "Accelerated", "Maximized", "Delivered", "Outperformed", "Surpassed".
`,
    concise: `
TONE: CONCISE (Punchy & Direct)
- Maximum 15-20 words. Zero filler or fluff. High information density.
- Style: Immediate clarity of action and result in a single clean sentence.
`,
    technical: `
TONE: TECHNICAL (Deep Engineering & Systems Precision)
- Deep technical specificity: architecture, frameworks, protocols, scale, throughput, and performance benchmarks.
- Metrics: Latencies (ms), throughput (RPS/QPS), memory/CPU optimization, uptime SLAs.
`,
    conversational: `
TONE: CONVERSATIONAL (Modern, Personable & Authentic)
- Warm, collaborative, and authentic modern startup tone.
- Balance professional rigor with natural human passion for the craft and mission.
`
};

const generateItemSummary = async ({ section, item, tone = "impactful" }) => {
    let prompt = "";
    const toneInstruction = TONE_DIRECTIVES[tone] || TONE_DIRECTIVES.impactful;

    switch (section) {
        case "personal-info":
            prompt = `
You are an executive resume writer. Generate 3 first-person professional summaries for a resume, based on the following data:

Name: ${item.name || "N/A"}
Headline: ${item.headline || "N/A"}
Location: ${item.location || "N/A"}

${toneInstruction}

Write it for 3 experience levels:
- Fresher
- Junior
- Senior

Each summary should be:
- First-person
- 2–3 sentences
- Confident, tailored specifically to the ${tone.toUpperCase()} tone
- Avoid mentioning the person's name

Return the result as strict JSON like this (no markdown, no extra text):
{
  "fresher": "Summary here...",
  "junior": "Summary here...",
  "senior": "Summary here..."
}
`;
            break;

        case "experience":
            prompt = `
You are an executive resume writer. Generate 3 first-person professional experience summaries for a resume, based on the following data:

Company: ${item.company || "N/A"}
Position: ${item.position || "N/A"}
Location: ${item.location || item.lcation || "N/A"}
Date: ${item.date || "N/A"}

${toneInstruction}

Instructions:
- Generate 3 distinct summary suggestions strictly in the ${tone.toUpperCase()} tone
- All should be first-person
- Each should be 2–3 sentences
- Avoid mentioning the person's name
- Avoid using labels like "fresher", "junior", or "senior"

Return the result as strict JSON like this (no markdown, no extra text):
{
  "suggestion 1": "Summary here...",
  "suggestion 2": "Summary here...",
  "suggestion 3": "Summary here..."
}
`;
            break;

        case "education":
            prompt = `
You are a resume expert. Generate 3 first-person professional education summaries for a resume, based on the following data:

Institute: ${item.institution || "N/A"}
Location: ${item.area || "N/A"}
Degree: ${item.studyType || "N/A"}
Score: ${item.score || "N/A"}
Date: ${item.date || "N/A"}

Instructions:
- Generate 3 different summary suggestions, each with a slightly different writing style or tone
- All should be first-person
- Each should be 2–3 sentences
- Maintain a confident and professional voice
- Highlight relevant coursework, academic achievements, projects, or skills
- Avoid mentioning the person's name
- Avoid using labels like "fresher", "junior", or "senior"

Return the result as strict JSON like this (no markdown, no extra text):
{
  "suggestion 1": "Summary here...",
  "suggestion 2": "Summary here...",
  "suggestion 3": "Summary here..."
}
`;
            break;

        case "projects":
            prompt = `
You are a resume expert. Generate 3 first-person professional project summaries for a resume, based on the following data:

Name: ${item.name || "N/A"}
Description: ${item.description || "N/A"}
Date: ${item.date || "N/A"}
Keywords: ${item.keywords || "N/A"}

Instructions:
- Generate 3 different summary suggestions, each with a slightly different writing style or tone
- All should be first-person
- Each should be 2–3 sentences
- Maintain a confident and professional voice
- Highlight relevant coursework, academic achievements, projects, or skills
- Avoid mentioning the person's name
- Avoid using labels like "fresher", "junior", or "senior"

Return the result as strict JSON like this (no markdown, no extra text):
{
  "suggestion 1": "Summary here...",
  "suggestion 2": "Summary here...",
  "suggestion 3": "Summary here..."
}
`;
            break;

        case "certifications":
            prompt = `
You are a resume expert. Generate 3 first-person professional certification summaries for a resume, based on the following data:

Name: ${item.name || "N/A"}
Issuer: ${item.issuer || "N/A"}
Date: ${item.date || "N/A"}

Instructions:
- Generate 3 different summary suggestions, each with a slightly different writing style or tone
- All should be first-person
- Each should be 2–3 sentences
- Maintain a confident and professional voice
- Highlight relevant coursework, academic achievements, projects, or skills
- Avoid mentioning the person's name
- Avoid using labels like "fresher", "junior", or "senior"

Return the result as strict JSON like this (no markdown, no extra text):
{
  "suggestion 1": "Summary here...",
  "suggestion 2": "Summary here...",
  "suggestion 3": "Summary here..."
}
`;
            break;

        case "publications":
            prompt = `
You are a resume expert. Generate 3 first-person professional publication summaries for a resume, based on the following data:

Name: ${item.name || "N/A"}
Publisher: ${item.publisher || "N/A"}
Date: ${item.date || "N/A"}

Instructions:
- Generate 3 different summary suggestions, each with a slightly different writing style or tone
- All should be first-person
- Each should be 2–3 sentences
- Maintain a confident and professional voice
- Highlight relevant coursework, academic achievements, projects, or skills
- Avoid mentioning the person's name
- Avoid using labels like "fresher", "junior", or "senior"

Return the result as strict JSON like this (no markdown, no extra text):
{
  "suggestion 1": "Summary here...",
  "suggestion 2": "Summary here...",
  "suggestion 3": "Summary here..."
}
`;
            break;

        case "awards":
            prompt = `
You are a resume expert. Generate 3 first-person professional award summaries for a resume, based on the following data:

Name: ${item.name || "N/A"}
Awarder: ${item.awarder || "N/A"}
Date: ${item.date || "N/A"}

Instructions:
- Generate 3 different summary suggestions, each with a slightly different writing style or tone
- All should be first-person
- Each should be 2–3 sentences
- Maintain a confident and professional voice
- Highlight relevant coursework, academic achievements, projects, or skills
- Avoid mentioning the person's name
- Avoid using labels like "fresher", "junior", or "senior"

Return the result as strict JSON like this (no markdown, no extra text):
{
  "suggestion 1": "Summary here...",
  "suggestion 2": "Summary here...",
  "suggestion 3": "Summary here..."
}
`;
            break;

        case "volunteering":
            prompt = `
You are a resume expert. Generate 3 first-person professional volunteering summaries for a resume, based on the following data:

Organization: ${item.organization || "N/A"}
Position: ${item.position || "N/A"}
Date: ${item.date || "N/A"}
Location: ${item.location || "N/A"}

Instructions:
- Generate 3 different summary suggestions, each with a slightly different writing style or tone
- All should be first-person
- Each should be 2–3 sentences
- Maintain a confident and professional voice
- Highlight relevant coursework, academic achievements, projects, or skills
- Avoid mentioning the person's name
- Avoid using labels like "fresher", "junior", or "senior"

Return the result as strict JSON like this (no markdown, no extra text):
{
  "suggestion 1": "Summary here...",
  "suggestion 2": "Summary here...",
  "suggestion 3": "Summary here..."
}
`;
            break;

        default:
            prompt = `Return summaries in JSON format for the section "${section}" based on this item: ${JSON.stringify(item)}`;
    }

    return await generateWithFallback(prompt);
};

const candidateModels = [
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
].filter(Boolean);

const generateWithFallback = async (prompt) => {
    let lastError = null;
    for (const modelName of candidateModels) {
        try {
            const model = getGenAI().getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            let responseText = await result.response.text();

            // Strip out markdown code fences if they exist
            responseText = responseText.trim()
                .replace(/^```json\s*/i, '')
                .replace(/^```/, '')
                .replace(/```$/, '')
                .trim();

            const parsed = JSON.parse(responseText);
            return parsed;
        } catch (err) {
            console.warn(`Model ${modelName} failed, trying fallback...`, err.message);
            lastError = err;
        }
    }

    console.error("All Gemini candidate models failed. Last error:", lastError);
    throw new Error("Invalid AI response. Please try again.");
};

/**
 * Analyze Job Match between a target Job Description and Candidate Resume
 */
const analyzeJobMatch = async ({ jobDescription, resumeData }) => {
    const basics = resumeData?.basics || {};
    const sections = resumeData?.sections || {};

    // Extract clean summary representation of the resume
    const cleanResume = {
        name: basics.name,
        headline: basics.headline,
        summary: basics.summary,
        skills: (sections.skills?.items || []).map((s) => ({
            name: s.name,
            keywords: s.keywords,
        })),
        experience: (sections.experience?.items || []).map((e) => ({
            company: e.company,
            position: e.position,
            date: e.date,
            summary: e.summary ? e.summary.replace(/<[^>]*>?/gm, ' ') : '',
        })),
        projects: (sections.projects?.items || []).map((p) => ({
            name: p.name,
            description: p.description,
            keywords: p.keywords,
        })),
        education: (sections.education?.items || []).map((ed) => ({
            institution: ed.institution,
            studyType: ed.studyType,
            area: ed.area,
        })),
        certifications: (sections.certifications?.items || []).map((c) => ({
            name: c.name,
            issuer: c.issuer,
        })),
    };

    const prompt = `
You are an expert ATS (Applicant Tracking System) recruiter and resume analyst.
Analyze the alignment between the target Job Description and the candidate's Resume.

TARGET JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${JSON.stringify(cleanResume, null, 2)}

Provide an in-depth, realistic ATS match assessment.
Return strictly valid JSON with the following structure (no extra text, no markdown fences):
{
  "atsScore": 82,
  "scoreCategory": "High Match",
  "summary": "2-3 sentence executive assessment of candidate fit for this role.",
  "matchedKeywords": ["React", "JavaScript", "REST APIs"],
  "missingKeywords": ["Docker", "GraphQL", "TypeScript"],
  "recommendations": [
    "Incorporate your TypeScript experience into your frontend project descriptions.",
    "Highlight automated testing metrics in your recent experience.",
    "Add containerization skills to your Technical Skills section."
  ]
}

Ensure "atsScore" is an integer between 0 and 100 based on keyword presence, technical qualification alignment, and experience relevance.
Ensure "scoreCategory" is "High Match" (80-100), "Moderate Match" (60-79), or "Low Match" (<60).
Matched keywords and missing keywords should be concise skill/tool/qualification names.
`;

    return await generateWithFallback(prompt);
};

/**
 * Optimize an Experience Bullet Point using the Google "XYZ" formula and specified tone
 */
const improveBulletPoint = async ({ text, tone = "impactful", context = {} }) => {
    const toneInstruction = TONE_DIRECTIVES[tone] || TONE_DIRECTIVES.impactful;
    const prompt = `
You are an elite executive resume writer. Transform the following draft bullet point into 3 high-caliber resume bullet points.

INPUT TEXT / DRAFT BULLET POINT:
"${text}"

CONTEXT:
Role/Position: ${context.position || "Professional"}
Company/Organization: ${context.company || "Company"}

${toneInstruction}

Instructions:
1. Generate 3 distinct, high-quality bullet point suggestions adhering strictly to the ${tone.toUpperCase()} tone requirements above.
2. If the user's input lacks numbers, invent realistic, plausible benchmark metrics (e.g., percentages, latencies, user scale) that sound authentic and credible.
3. Every suggestion must begin with a strong, active past-tense verb (e.g., "Engineered", "Orchestrated", "Accelerated", "Delivered", "Spearheaded").
4. Return strictly valid JSON (no markdown, no backticks, no extra text):
{
  "tone": "${tone}",
  "suggestions": [
    "Suggestion 1...",
    "Suggestion 2...",
    "Suggestion 3..."
  ]
}
`;

    return await generateWithFallback(prompt);
};

/**
 * Comprehensive Deep Resume & ATS Audit
 */
const auditResume = async ({ resumeData, targetRole = "" }) => {
    const basics = resumeData?.basics || {};
    const sections = resumeData?.sections || {};

    const cleanResume = {
        name: basics.name,
        headline: basics.headline,
        summary: basics.summary ? basics.summary.replace(/<[^>]*>?/gm, ' ').trim() : '',
        email: basics.email,
        phone: basics.phone,
        location: basics.location,
        url: basics.url,
        skills: (sections.skills?.items || []).map((s) => ({
            name: s.name,
            keywords: s.keywords,
        })),
        experience: (sections.experience?.items || []).map((e) => ({
            company: e.company,
            position: e.position,
            date: e.date,
            summary: e.summary ? e.summary.replace(/<[^>]*>?/gm, ' ').trim() : '',
        })),
        projects: (sections.projects?.items || []).map((p) => ({
            name: p.name,
            description: p.description ? p.description.replace(/<[^>]*>?/gm, ' ').trim() : '',
            keywords: p.keywords,
        })),
        education: (sections.education?.items || []).map((ed) => ({
            institution: ed.institution,
            studyType: ed.studyType,
            area: ed.area,
            date: ed.date,
        })),
        certifications: (sections.certifications?.items || []).map((c) => ({
            name: c.name,
            issuer: c.issuer,
        })),
    };

    const rolePrompt = targetRole ? ` TARGET ROLE / DOMAIN: "${targetRole}".` : "";

    const prompt = `
You are an elite executive recruiter and ATS resume audit specialist.${rolePrompt}
Perform a comprehensive diagnostic evaluation of the following candidate's resume.

CANDIDATE RESUME:
${JSON.stringify(cleanResume, null, 2)}

Provide an objective, in-depth audit covering:
1. Executive summary of candidate standing (strengths and areas needing polish).
2. Category score evaluations (integers 0-100) for:
   - contentImpact (quantifiable metrics, Google XYZ impact, action verbs)
   - sectionsStructure (organization, contact completeness, flow)
   - documentStandards (formatting, professionalism, link/date consistency)
   - professionalPolish (absence of first-person pronouns, strong vocabulary, elimination of buzzwords)
   - careerSignals (career trajectory, evidence of skills, leadership)
3. Overall score (0-100 integer) weighted by recruiting importance.
4. Top 3 highest-leverage recommendations to boost hiring callbacks.
5. Specific bullet point rewrites (1-3 bullets from the resume that currently lack metrics or strong verbs, rewritten using Google's XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]").

Return strictly valid JSON with the following structure (no extra text, no markdown fences):
{
  "overallScore": 84,
  "scoreGrade": "Executive Ready",
  "executiveSummary": "2-3 sentence executive assessment of resume quality and hiring potential.",
  "categoryScores": {
    "contentImpact": 80,
    "sectionsStructure": 95,
    "documentStandards": 85,
    "professionalPolish": 78,
    "careerSignals": 82
  },
  "topRecommendations": [
    "Incorporate revenue or efficiency percentages in your lead role.",
    "Eliminate passive verbs in project descriptions.",
    "Add certification details to substantiate cloud expertise."
  ],
  "bulletRewrites": [
    {
      "original": "Worked on client applications and assisted with deployments.",
      "improved": "Architected high-throughput client applications, reducing deployment latencies by 35% across 500K+ monthly active users.",
      "reason": "Replaced weak passive verb with active architectural leadership and measurable performance metrics."
    }
  ]
}
`;

    return await generateWithFallback(prompt);
};

/**
 * Generate a synchronized, highly tailored 1-page Cover Letter (Roadmap Item 4.4)
 */
const generateCoverLetter = async ({
    jobDescription,
    companyName = "",
    jobTitle = "",
    tone = "impactful",
    resumeData = {},
}) => {
    const basics = resumeData?.basics || {};
    const sections = resumeData?.sections || {};

    const cleanCandidate = {
        name: basics.name || "Candidate",
        headline: basics.headline || "",
        email: basics.email || "",
        phone: basics.phone || "",
        location: basics.location || "",
        summary: basics.summary || "",
        experience: (sections.experience?.items || []).slice(0, 4).map((e) => ({
            company: e.company,
            position: e.position,
            date: e.date,
            summary: e.summary ? e.summary.replace(/<[^>]*>?/gm, " ").trim() : "",
        })),
        skills: (sections.skills?.items || []).slice(0, 6).map((s) => ({
            name: s.name,
            keywords: s.keywords,
        })),
        education: (sections.education?.items || []).slice(0, 2).map((ed) => ({
            institution: ed.institution,
            studyType: ed.studyType,
            area: ed.area,
        })),
        projects: (sections.projects?.items || []).slice(0, 3).map((p) => ({
            name: p.name,
            summary: p.summary ? p.summary.replace(/<[^>]*>?/gm, " ").trim() : "",
        })),
    };

    const toneInstruction = TONE_DIRECTIVES[tone] || TONE_DIRECTIVES.impactful;

    const prompt = `
You are an executive career advisor and expert cover letter writer.
Generate a compelling, highly tailored 1-page cover letter matching the candidate's authentic resume experience directly to the target role and company.

TARGET COMPANY: ${companyName || "Target Company (infer from Job Description if mentioned)"}
TARGET JOB TITLE: ${jobTitle || "Target Role (infer from Job Description if mentioned)"}

TARGET JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE & RESUME:
${JSON.stringify(cleanCandidate, null, 2)}

TONE GUIDELINES:
${toneInstruction}

WRITING RULES:
1. Ground the narrative in REAL candidate achievements and metrics from their resume (do not invent fake companies, degrees, or metrics).
2. Connect their specific accomplishments directly to the target company's mission, stack, and challenges outlined in the job description.
3. Structure for maximum hiring manager impact:
   - Compelling Hook/Opening: State the target role, why this company excites them, and a strong thesis statement.
   - Core Paragraph 1: Major relevant career win / leadership / technical contribution with quantifiable metrics.
   - Core Paragraph 2: Secondary strength (domain alignment, scalability, cross-functional execution, or relevant tech stack).
   - Confident Call to Action & Value Proposition: Why they are ready to deliver immediate value from day one.
4. Keep the length balanced so it fits comfortably on a single page (~250-350 words total).

Return strictly valid JSON with the following structure (no extra text, no markdown fences):
{
  "recipient": {
    "name": "Hiring Team",
    "title": "Hiring Manager",
    "company": "${companyName || "Company Name"}",
    "address": "San Francisco, CA"
  },
  "companyName": "${companyName || "Company Name"}",
  "jobTitle": "${jobTitle || "Target Role"}",
  "salutation": "Dear Hiring Team,",
  "opening": "Opening paragraph text...",
  "bodyParagraphs": [
    "First core body paragraph highlighting a key accomplishment...",
    "Second core body paragraph detailing skills and alignment..."
  ],
  "callToAction": "Closing call to action paragraph expressing enthusiasm for discussing how the candidate can drive results...",
  "signOff": "Sincerely,",
  "signature": "${cleanCandidate.name}",
  "fullHtml": "<p>Opening paragraph text...</p><p>First core body paragraph...</p><p>Second core body paragraph...</p><p>Closing call to action paragraph...</p>"
}
`;

    return await generateWithFallback(prompt);
};

module.exports = {
    generateItemSummary,
    analyzeJobMatch,
    improveBulletPoint,
    auditResume,
    generateCoverLetter,
};