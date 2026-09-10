const { z } = require("zod");

const generateSummarySchema = z.object({
    section: z.string().min(1, "Section identifier is required"),
    item: z.record(z.any()).refine((val) => typeof val === "object" && val !== null, {
        message: "Item details must be an object"
    }),
    tone: z.enum(["formal", "impactful", "concise", "technical"]).default("impactful").optional()
});

const jobMatchSchema = z.object({
    jobDescription: z.string().min(20, "Job description must be at least 20 characters long"),
    resumeData: z.record(z.any()).refine((val) => typeof val === "object" && val !== null, {
        message: "Resume data is required"
    })
});

const improveBulletSchema = z.object({
    text: z.string().min(3, "Text must be at least 3 characters long"),
    tone: z.enum(["formal", "impactful", "concise", "technical"]).default("impactful"),
    context: z.record(z.any()).optional()
});

const resumeAuditSchema = z.object({
    resumeData: z.record(z.any()).refine((val) => typeof val === "object" && val !== null, {
        message: "Resume data is required"
    }),
    targetRole: z.string().optional()
});

module.exports = {
    generateSummarySchema,
    jobMatchSchema,
    improveBulletSchema,
    resumeAuditSchema
};

