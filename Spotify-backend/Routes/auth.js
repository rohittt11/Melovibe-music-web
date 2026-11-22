const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { getToken } = require("../utils/help");

router.post("/register", async (req, res) => {
  const { email, password, firstname, lastname, username } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    return res
      .status(403)
      .json({ error: "A user with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserData = {
    email,
    password: hashedPassword,
    firstname,
    lastname,
    username,
  };
  const newUser = await User.create(newUserData);
  console.log(newUserData);

  const token = await getToken(email, newUser);

  const userToReturn = { ...newUser.toJSON(), token };
  console.log(userToReturn);
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  console.log(user);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  const token = await getToken(user.email, user);
  const userToReturn = { ...user.toJSON(), token };
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

/* ============ GET CURRENT USER (for profile load) ============ */
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  }
);

/* ============ UPDATE PROFILE ============ */
router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { firstname, lastname, username, bio, profileImage } = req.body;

    if (!firstname || !username) {
      return res.status(400).json({ err: "Firstname and username required" });
    }

    // Optional: prevent username collision
    if (username !== req.user.username) {
      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(409).json({ err: "Username already taken" });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { firstname, lastname, username, bio, profileImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(updated);
  }
);

/* ============ CHANGE PASSWORD (with security) ============ */
router.put(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ err: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ err: "New passwords do not match" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ err: "New password must be at least 8 characters" });
    }

    // Strong password: at least 1 letter + 1 number
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res
        .status(400)
        .json({ err: "Password must contain letters and numbers" });
    }

    if (newPassword === currentPassword) {
      return res
        .status(400)
        .json({ err: "New password must differ from current" });
    }

    // Load user with password for comparison
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ err: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ err: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  }
);

module.exports = router;
