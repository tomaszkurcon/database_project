const jwt = require("jsonwebtoken");
const Roles = require("../utils/roles");
exports.createAccessToken = (userId, roles=[Roles.USER]) => {
  return jwt.sign({ _id: userId, roles }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
};
