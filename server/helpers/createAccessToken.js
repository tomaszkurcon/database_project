const jwt = require("jsonwebtoken");
exports.createAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: "10m",
  });
};
