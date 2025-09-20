const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // If user pasted only the raw token, prepend "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    authHeader = `Bearer ${authHeader}`;
  }

  // Always split properly
  const token = authHeader.split(" ")[1];

  // 🔍 Debug logs
  console.log("Auth header:", authHeader);
  console.log("Extracted token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return res.status(403).json({ error: "Invalid token" });
  }
};
