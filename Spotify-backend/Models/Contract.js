const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    song: {
      type: mongoose.Types.ObjectId,
      ref: "Song",
      required: true,
    },
    // Legal snapshot at signing time
    artistName: { type: String, required: true },
    songName: { type: String, required: true },
    signature: { type: String, required: true }, // typed full name
    agreedToTerms: { type: Boolean, required: true, default: false },

    // Fixed demo terms
    termsVersion: { type: String, default: "v1.0" },
    revenueSplit: {
      artist: { type: Number, default: 70 },
      platform: { type: Number, default: 30 },
    },
    exclusivity: {
      type: String,
      enum: ["exclusive", "non-exclusive"],
      default: "non-exclusive",
    },
    copyrightClause: {
      type: String,
      default:
        "Artist retains full copyright ownership of the recording and composition. MeloVibe is granted a non-transferable license to stream the work on the platform.",
    },

    status: {
      type: String,
      enum: ["active", "terminated"],
      default: "active",
    },
    signedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", ContractSchema);
