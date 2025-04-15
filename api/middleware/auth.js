const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("../utils/tokenBlackList");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (isBlacklisted(token)) {
        return res.status(401).json({ msg: "Token has been revoked. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token." });
    }
};