const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { createAccessToken } = require("../helpers/createAccessToken");

exports.postRegister = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .send({ error: "User with entered email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error occurred during registration" });
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ error: "User with entered email not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: "Invalid password" });
    }
    const token = createAccessToken(user._id);
    res.status(200).send({ accessToken: token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error occurred during login" });
  }
};
