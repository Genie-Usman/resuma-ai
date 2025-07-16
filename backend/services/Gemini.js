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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();

    // Strip out markdown code fences if they exist
    responseText = responseText.trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```/, '')
        .replace(/```$/, '')
        .trim();

    try {
        const parsed = JSON.parse(responseText);
        return parsed;
    } catch (err) {
        console.error("Failed to parse Gemini JSON:", err, "\nRaw response:", responseText);
        throw new Error("Invalid AI response. Please try again.");
    }
};


module.exports = {
    generateItemSummary,
};