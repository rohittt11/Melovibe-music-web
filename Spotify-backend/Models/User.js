const mongoose = require("mongoose");
const User = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: false },
  password: { type: String, required: false, private: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  bio: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  role: { type: String, enum: ["artist", "admin"], default: "artist" },
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
