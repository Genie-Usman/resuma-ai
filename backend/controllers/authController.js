const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Determine environment-safe cookie options
const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

const getCookieOptions = () => {
    return {
        httpOnly: true,
        secure: isProduction, // HTTPS required in production / Vercel
        sameSite: isProduction ? "none" : "lax", // "none" for cross-domain on Vercel; "lax" for localhost HTTP
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
    };
};

const setTokenCookie = (res, token) => {
    res.cookie("token", token, getCookieOptions());
};

const clearTokenCookie = (res) => {
    const options = getCookieOptions();
    delete options.maxAge;
    res.clearCookie("token", options);
};

const getFrontendUrl = () => {
    return (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
};

const getBackendUrl = (req) => {
    if (process.env.BACKEND_URL) {
        return process.env.BACKEND_URL.replace(/\/+$/, "");
    }
    const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
    return `${proto}://${req.get("host")}`.replace(/\/+$/, "");
};

// @desc    Register a new User
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageURL } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            authProvider: "local",
            profileImageURL,
        });

        const token = generateToken(user._id);

        // Set HttpOnly Cookie
        setTokenCookie(res, token);

        // Return user data with token (for dual-compatibility)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileimageURL: user.profileImageURL,
            authProvider: user.authProvider,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.password) {
            return res.status(400).json({
                message: `This account uses ${user.authProvider || "social"} login. Please sign in with ${user.authProvider || "Google/LinkedIn"}.`,
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        // Set HttpOnly Cookie
        setTokenCookie(res, token);

        // Return user data with token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileimageURL: user.profileImageURL,
            authProvider: user.authProvider,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Logout User / Clear Cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
    try {
        clearTokenCookie(res);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT via Cookie or Header)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ==========================================
// Google OAuth 2.0 Flow
// ==========================================

// @desc    Redirect to Google OAuth consent screen
// @route   GET /api/auth/google
// @access  Public
const googleAuth = (req, res) => {
    let callerOrigin = null;
    if (req.headers.referer) {
        try {
            callerOrigin = new URL(req.headers.referer).origin;
        } catch {}
    }
    const frontendUrl = (callerOrigin || getFrontendUrl()).replace(/\/+$/, "");
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.redirect(`${frontendUrl}/auth/login?oauth_error=google_credentials_missing`);
    }

    const redirectUri = `${getBackendUrl(req)}/api/auth/google/callback`;
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid profile email");
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");
    googleAuthUrl.searchParams.set("state", encodeURIComponent(frontendUrl));

    res.redirect(googleAuthUrl.toString());
};

// @desc    Google OAuth Callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = async (req, res) => {
    const { code, error, state } = req.query;

    let targetFrontendUrl = getFrontendUrl();
    if (state) {
        try {
            const decoded = decodeURIComponent(state);
            if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
                targetFrontendUrl = decoded.replace(/\/+$/, "");
            }
        } catch {}
    }

    if (error || !code) {
        return res.redirect(`${targetFrontendUrl}/auth/login?oauth_error=${encodeURIComponent(error || "access_denied")}`);
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = `${getBackendUrl(req)}/api/auth/google/callback`;

        // Exchange code for Google Access Token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error("Google token exchange error:", tokenData);
            return res.redirect(`${targetFrontendUrl}/auth/login?oauth_error=token_exchange_failed`);
        }

        // Fetch user profile from Google
        const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const googleUser = await userinfoResponse.json();

        if (!googleUser.email) {
            return res.redirect(`${targetFrontendUrl}/auth/login?oauth_error=email_not_provided`);
        }

        // Find or create user
        let user = await User.findOne({ email: googleUser.email });

        if (user) {
            if (!user.googleId) user.googleId = googleUser.id;
            if (!user.profileImageURL && googleUser.picture) user.profileImageURL = googleUser.picture;
            await user.save();
        } else {
            user = await User.create({
                name: googleUser.name || googleUser.email.split("@")[0],
                email: googleUser.email,
                googleId: googleUser.id,
                authProvider: "google",
                profileImageURL: googleUser.picture || null,
            });
        }

        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.redirect(`${targetFrontendUrl}/dashboard?oauth=success&token=${encodeURIComponent(token)}`);
    } catch (err) {
        console.error("Google OAuth callback exception:", err);
        res.redirect(`${targetFrontendUrl}/auth/login?oauth_error=internal_error`);
    }
};

// ==========================================
// LinkedIn OAuth 2.0 (OpenID Connect) Flow
// ==========================================

// @desc    Redirect to LinkedIn OAuth consent screen
// @route   GET /api/auth/linkedin
// @access  Public
const linkedinAuth = (req, res) => {
    let callerOrigin = null;
    if (req.headers.referer) {
        try {
            callerOrigin = new URL(req.headers.referer).origin;
        } catch {}
    }
    const frontendUrl = (callerOrigin || getFrontendUrl()).replace(/\/+$/, "");
    const clientId = process.env.LINKEDIN_CLIENT_ID;

    if (!clientId || !process.env.LINKEDIN_CLIENT_SECRET) {
        return res.redirect(`${frontendUrl}/auth/login?oauth_error=linkedin_credentials_missing`);
    }

    const redirectUri = `${getBackendUrl(req)}/api/auth/linkedin/callback`;
    const linkedinAuthUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    linkedinAuthUrl.searchParams.set("response_type", "code");
    linkedinAuthUrl.searchParams.set("client_id", clientId);
    linkedinAuthUrl.searchParams.set("redirect_uri", redirectUri);
    linkedinAuthUrl.searchParams.set("scope", "openid profile email");
    linkedinAuthUrl.searchParams.set("state", encodeURIComponent(frontendUrl));

    res.redirect(linkedinAuthUrl.toString());
};

// @desc    LinkedIn OAuth Callback
// @route   GET /api/auth/linkedin/callback
// @access  Public
const linkedinCallback = async (req, res) => {
    const { code, error, error_description, state } = req.query;

    let targetFrontendUrl = getFrontendUrl();
    if (state) {
        try {
            const decoded = decodeURIComponent(state);
            if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
                targetFrontendUrl = decoded.replace(/\/+$/, "");
            }
        } catch {}
    }

    if (error || !code) {
        return res.redirect(`${targetFrontendUrl}/auth/login?oauth_error=${encodeURIComponent(error_description || error || "access_denied")}`);
    }

    try {
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
        const redirectUri = `${getBackendUrl(req)}/api/auth/linkedin/callback`;

        // Exchange code for LinkedIn Access Token
        const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error("LinkedIn token exchange error:", tokenData);
            return res.redirect(`${targetFrontendUrl}/auth/login?oauth_error=token_exchange_failed`);
        }

        // Fetch user profile from LinkedIn OpenID UserInfo
        const userinfoResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const linkedinUser = await userinfoResponse.json();

        if (!linkedinUser.email) {
            return res.redirect(`${targetFrontendUrl}/auth/login?oauth_error=email_not_provided`);
        }

        // Find or create user
        let user = await User.findOne({ email: linkedinUser.email });

        if (user) {
            if (!user.linkedinId) user.linkedinId = linkedinUser.sub;
            if (!user.profileImageURL && linkedinUser.picture) user.profileImageURL = linkedinUser.picture;
            await user.save();
        } else {
            user = await User.create({
                name: linkedinUser.name || `${linkedinUser.given_name || ""} ${linkedinUser.family_name || ""}`.trim() || linkedinUser.email.split("@")[0],
                email: linkedinUser.email,
                linkedinId: linkedinUser.sub,
                authProvider: "linkedin",
                profileImageURL: linkedinUser.picture || null,
            });
        }

        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.redirect(`${targetFrontendUrl}/dashboard?oauth=success&token=${encodeURIComponent(token)}`);
    } catch (err) {
        console.error("LinkedIn OAuth callback exception:", err);
        res.redirect(`${targetFrontendUrl}/auth/login?oauth_error=internal_error`);
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    googleAuth,
    googleCallback,
    linkedinAuth,
    linkedinCallback,
    setTokenCookie,
    clearTokenCookie,
};
