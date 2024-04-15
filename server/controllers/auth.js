const User = require("../models/user");
exports.getLogin = (req, res) => {
  console.log("hello from login");
  const user = new User({ email: "test", password: "test" });
  user.save().then(() => {
    res.send("created test user");
  });
};
