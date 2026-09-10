const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateItemSummary = async ({ section, item }) => {
    let prompt = "";

    switch (section) {
        case "personal-info":
            prompt = `
You are a resume expert. Generate 3 first-person professional summaries for a resume, based on the following data:

Name: ${item.name || "N/A"}
Headline: ${item.headline || "N/A"}
Location: ${item.location || "N/A"}

Write it for 3 experience levels:
- Fresher
- Junior
- Senior

Each summary should be:
- First-person
- 2–3 sentences
- Confident and professional
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
You are a resume expert. Generate 3 first-person professional experience summaries for a resume, based on the following data:

Company: ${item.company || "N/A"}
Position: ${item.position || "N/A"}
Location: ${item.lcation || "N/A"}
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
            const model = genAI.getGenerativeModel({ model: modelName });
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
    const prompt = `
You are an elite executive resume writer specializing in the Google "XYZ" formula ("Accomplished [X], as measured by [Y], by doing [Z]").

INPUT TEXT / DRAFT BULLET POINT:
"${text}"

CONTEXT:
Role/Position: ${context.position || "Professional"}
Company/Organization: ${context.company || "Company"}

DESIRED TONE: "${tone.toUpperCase()}"
Tone Guidelines:
- FORMAL: Executive, authoritative corporate vocabulary, polished phrasing, leadership emphasis.
- IMPACTFUL: Strong action verbs, quantified business impact, metrics, revenue/cost/time savings, Google XYZ formula.
- CONCISE: Punchy, tight, eliminating filler words, maximizing information density while retaining accomplishments.
- TECHNICAL: Deep engineering precision, architectural details, specific frameworks/tools, performance metrics, and systems design.

Instructions:
1. Generate 3 distinct, high-quality bullet point suggestions adhering strictly to the "${tone.toUpperCase()}" tone.
2. If the user's input lacks numbers, invent realistic, plausible benchmark metrics (e.g., percentages, latencies, user scale) that sound authentic.
3. Every suggestion must begin with a strong, active past-tense verb (e.g., "Engineered", "Orchestrated", "Accelerated", "Delivered").
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

module.exports = {
    generateItemSummary,
    analyzeJobMatch,
    improveBulletPoint,
};