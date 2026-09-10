const { ZodError } = require("zod");

/**
 * Middleware factory to validate request body with a Zod schema
 * @param {import("zod").ZodSchema} schema 
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.issues || error.errors || [];
                const formattedErrors = issues.map((err) => ({
                    field: err.path.join(".") || "body",
                    message: err.message
                }));

                return res.status(400).json({
                    message: "Validation failed",
                    errors: formattedErrors
                });
            }
            return res.status(400).json({ message: "Invalid request data", error: error.message });
        }
    };
};

module.exports = { validateRequest };
