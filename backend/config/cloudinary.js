const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const path = require("node:path");

const isCloudinaryConfigured = () => {
    return Boolean(
        process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
        process.env.CLOUDINARY_API_KEY?.trim() &&
        process.env.CLOUDINARY_API_SECRET?.trim()
    );
};

if (isCloudinaryConfigured()) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
        api_key: process.env.CLOUDINARY_API_KEY?.trim(),
        api_secret: process.env.CLOUDINARY_API_SECRET?.trim()
    });
}

/**
 * Upload a buffer to Cloudinary, or fall back to local disk storage if Cloudinary is not configured
 * @param {Buffer} buffer - File buffer
 * @param {string} originalname - Original file name
 * @param {string} req - Express request object for local host resolution
 * @param {object} options - Cloudinary upload options
 * @returns {Promise<string>} Public URL of uploaded image
 */
const uploadMedia = async (buffer, originalname = "upload.png", req = null, options = {}) => {
    if (isCloudinaryConfigured()) {
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                folder: "resuma_ai",
                resource_type: "image",
                ...options
            };

            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            });

            uploadStream.end(buffer);
        });
    }

    // Local Disk Fallback
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const sanitizedFilename = `${Date.now()}-${originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, sanitizedFilename);

    await fs.promises.writeFile(filePath, buffer);

    if (req) {
        return `${req.protocol}://${req.get("host")}/uploads/${sanitizedFilename}`;
    }
    return `/uploads/${sanitizedFilename}`;
};

module.exports = {
    isCloudinaryConfigured,
    uploadMedia
};
