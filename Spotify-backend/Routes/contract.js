const express = require("express");
const router = express.Router();
const passport = require("passport");
const Contract = require("../Models/Contract");
const Song = require("../Models/Song");
const User = require("../Models/User");

/* Middleware: require admin */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ err: "Admin access required" });
  }
  next();
};

/* CREATE a contract — called after song upload */
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { songId, signature, agreedToTerms, exclusivity } = req.body;

      if (!songId || !signature || !agreedToTerms) {
        return res.status(400).json({ err: "Missing required fields" });
      }

      const song = await Song.findById(songId);
      if (!song) return res.status(404).json({ err: "Song not found" });

      if (!song.artist.equals(req.user._id)) {
        return res.status(403).json({ err: "Not your song" });
      }

      const artistFullName = `${req.user.firstname} ${
        req.user.lastname || ""
      }`.trim();

      // Signature must match artist name (case-insensitive)
      if (signature.trim().toLowerCase() !== artistFullName.toLowerCase()) {
        return res.status(400).json({
          err: `Signature must match your name exactly: "${artistFullName}"`,
        });
      }

      const contract = await Contract.create({
        artist: req.user._id,
        song: songId,
        artistName: artistFullName,
        songName: song.name,
        signature: signature.trim(),
        agreedToTerms: true,
        exclusivity: exclusivity || "non-exclusive",
      });

      return res.status(200).json(contract);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err: "Failed to create contract" });
    }
  }
);

/* GET contracts of the logged-in artist */
router.get(
  "/mine",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const contracts = await Contract.find({ artist: req.user._id })
        .populate("song")
        .sort({ signedAt: -1 });
      return res.status(200).json({ data: contracts });
    } catch (err) {
      return res.status(500).json({ err: "Failed to fetch contracts" });
    }
  }
);

/* ADMIN: get all contracts */
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  requireAdmin,
  async (req, res) => {
    try {
      const contracts = await Contract.find({})
        .populate("song")
        .populate("artist", "firstname lastname email username")
        .sort({ signedAt: -1 });
      return res.status(200).json({ data: contracts });
    } catch (err) {
      return res.status(500).json({ err: "Failed to fetch contracts" });
    }
  }
);

/* ADMIN: terminate a contract */
router.put(
  "/terminate/:contractId",
  passport.authenticate("jwt", { session: false }),
  requireAdmin,
  async (req, res) => {
    try {
      const contract = await Contract.findByIdAndUpdate(
        req.params.contractId,
        { status: "terminated" },
        { new: true }
      );
      if (!contract) return res.status(404).json({ err: "Not found" });
      return res.status(200).json(contract);
    } catch (err) {
      return res.status(500).json({ err: "Failed to terminate" });
    }
  }
);

module.exports = router;
