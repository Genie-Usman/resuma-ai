const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for OAuth accounts
    authProvider: { type: String, enum: ['local', 'google', 'linkedin'], default: 'local' },
    googleId: { type: String, sparse: true },
    linkedinId: { type: String, sparse: true },
    profileImageURL: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);