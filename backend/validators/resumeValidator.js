const { z } = require("zod");

const createResumeSchema = z.object({
    title: z.string().trim().min(1, "Resume title is required").max(100, "Title cannot exceed 100 characters")
});

const updateResumeSchema = z.object({
    title: z.string().trim().min(1).max(100).optional(),
    slug: z.string().optional(),
    thumbnailLink: z.string().optional(),
    data: z.record(z.any()).optional()
}).passthrough(); // Allow extra fields if needed

module.exports = {
    createResumeSchema,
    updateResumeSchema
};
