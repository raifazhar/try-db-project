require("dotenv").config();
const jwt = require("jsonwebtoken");
const tokenAuth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (token === null || token == "null") return res.status(401).json({ msg: "No authentication token, access denied" });
    const verified = jwt.verify(token, process.env.jwtsecret);
    if (!verified) return res.status(401).json({ msg: "Token verification failed, authorization denied" });
    req.user = verified.user;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = tokenAuth;
