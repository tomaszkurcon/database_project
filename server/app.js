const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes/admin");
const userRoutes = require("./routes/userRoutes/user");
const guestRoutes = require("./routes/guestRoutes/guest");

const requireAuth = require("./middlewares/requireAuth");
const authorizeRole = require("./middlewares/authorizeRole");
const Roles = require("./utils/roles");
const { generateData } = require("./faker/generateData");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use("/auth", authRoutes);
app.use("/guest", guestRoutes);

app.use("/admin",requireAuth,authorizeRole(Roles.ADMIN), adminRoutes);
app.use("/user",requireAuth,authorizeRole(Roles.USER), userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // generateData({ users: 10, cars: 10, rentals: 10, reviews: 10 }, true);
    app.listen(process.env.PORT);
    console.log(`app is listening on port ${process.env.PORT}`);
  })
  .catch((err) => console.log(err));
