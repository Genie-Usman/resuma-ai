const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        thumbnailLink: { type: String },
        data: { type: mongoose.Schema.Types.Mixed, default: {} },
        isPublic: { type: Boolean, default: true },
        viewsCount: { type: Number, default: 0 },
        lastViewedAt: { type: Date, default: null },
        analytics: {
            countries: [
                {
                    country: { type: String, default: "Unknown" },
                    code: { type: String, default: "UN" },
                    count: { type: Number, default: 0 },
                },
            ],
            referrers: [
                {
                    source: { type: String, default: "Direct" },
                    count: { type: Number, default: 0 },
                },
            ],
            recentViews: [
                {
                    viewedAt: { type: Date, default: Date.now },
                    country: { type: String, default: "Unknown" },
                    countryCode: { type: String, default: "UN" },
                    referrer: { type: String, default: "Direct" },
                    device: { type: String, default: "Desktop" },
                    browser: { type: String, default: "Unknown" },
                },
            ],
        },
        protection: {
            isProtected: { type: Boolean, default: false },
            passwordHash: { type: String, default: null },
            protectType: { type: String, enum: ['contact_only', 'full'], default: 'contact_only' },
        },
    },
    { timestamps: true }
);

// Unique slug per user
ResumeSchema.index({ userId: 1, slug: 1 }, { unique: true });
// Fast public slug queries
ResumeSchema.index({ slug: 1 });
// Speed up user-based queries
ResumeSchema.index({ userId: 1 });

module.exports = mongoose.model('Resume', ResumeSchema);

