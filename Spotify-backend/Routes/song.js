const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../Models/Song");
const User = require("../Models/User");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { name, thumbnail, track, duration } = req.body;
    if (!name || !thumbnail || !track || !duration) {
      return res
        .status(301)
        .json({ err: "Insufficient details to create song." });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist, duration };
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong);
  }
);

router.get(
  "/get/mysongs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const songs = await Song.find({ artist: req.user._id }).populate("artist");
    return res.status(200).json({ data: songs });
  }
);

router.get(
  "/get/artist/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { artistId } = req.params;

    const artist = await User.findOne({ _id: artistId });

    if (!artist) {
      return res.status(301).json({ err: "Artist does not exist" });
    }

    const songs = await Song.find({ artist: artistId }).populate("artist"); // <-- add populate
    return res.status(200).json({
      data: songs,
      artist: {
        _id: artist._id,
        firstname: artist.firstname,
        lastname: artist.lastname,
        username: artist.username,
      },
    });
  }
);

router.get(
  "/get/songname/:songName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { songName } = req.params;
      const escaped = songName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");

      // Find artists whose name matches
      const matchingArtists = await User.find({
        $or: [{ firstname: regex }, { lastname: regex }, { username: regex }],
      }).select("_id");

      const artistIds = matchingArtists.map((a) => a._id);

      const songs = await Song.find({
        $or: [{ name: regex }, { artist: { $in: artistIds } }],
      }).populate("artist");

      return res.status(200).json({ data: songs });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err: "Search failed" });
    }
  }
);

router.get(
  "/get/all-with-songs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const artists = await User.find({}, "firstname lastname username");
      const result = await Promise.all(
        artists.map(async (artist) => {
          const songs = await Song.find({ artist: artist._id }).populate(
            "artist"
          );
          return {
            _id: artist._id,
            firstname: artist.firstname,
            lastname: artist.lastname,
            username: artist.username,
            songs,
          };
        })
      );
      return res.status(200).json({ data: result });
    } catch (err) {
      return res.status(500).json({ err: "Failed to fetch artists" });
    }
  }
);

router.get(
  "/get/all",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const songs = await Song.find({}).populate("artist");
      return res.status(200).json({ data: songs });
    } catch (err) {
      return res.status(500).json({ err: "Failed to fetch songs" });
    }
  }
);

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ err: "Admin access required" });
  }
  next();
};

router.delete(
  "/delete/:songId",
  passport.authenticate("jwt", { session: false }),
  requireAdmin,
  async (req, res) => {
    try {
      const song = await Song.findByIdAndDelete(req.params.songId);
      if (!song) return res.status(404).json({ err: "Song not found" });
      // Also mark its contract as terminated
      const Contract = require("../Models/Contract");
      await Contract.updateMany(
        { song: req.params.songId },
        { status: "terminated" }
      );
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ err: "Failed to delete song" });
    }
  }
);

module.exports = router;
