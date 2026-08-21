const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.get("Authorization");
  const token =
    header && header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Authentication required", errors: [] });
  if (!process.env.JWT_SECRET)
    return next(new Error("JWT_SECRET is not configured"));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.userId || !payload.role)
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid authentication token",
          errors: [],
        });
    req.auth = { userId: payload.userId, role: payload.role };
    return next();
  } catch (_error) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid or expired authentication token",
        errors: [],
      });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth)
      return res
        .status(401)
        .json({
          success: false,
          message: "Authentication required",
          errors: [],
        });
    if (!roles.includes(req.auth.role))
      return res
        .status(403)
        .json({
          success: false,
          message: "You do not have permission for this resource",
          errors: [],
        });
    return next();
  };
}

module.exports = { requireAuth, requireRole };
