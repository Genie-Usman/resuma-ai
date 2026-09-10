const { z } = require("zod");

const generateSummarySchema = z.object({
    section: z.string().min(1, "Section identifier is required"),
    item: z.record(z.any()).refine((val) => typeof val === "object" && val !== null, {
        message: "Item details must be an object"
    })
});

module.exports = {
    generateSummarySchema
};
