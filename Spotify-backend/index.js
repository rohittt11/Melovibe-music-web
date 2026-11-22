const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./Models/User");
const authRoutes = require("./Routes/auth");
const songRoutes = require("./Routes/song");
const playlistRoutes = require("./Routes/playlist");
const contractRoutes = require("./Routes/contract");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

// CORS — allow Netlify + localhost during development
const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g. https://your-site.netlify.app
  "http://localhost:3000", // CRA dev
  "http://localhost:5173", // Vite dev (in case)
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Render health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

// MongoDB
mongoose
  .connect(
    `mongodb+srv://rohitttpawar:${process.env.MONGO_PASSWORD}@cluster0.c9jchbi.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Passport JWT strategy
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET || "thisKeyIsSupposedToBeSecret";

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.identifier }, function (err, user) {
      if (err) return done(err, false);
      if (user) return done(null, user);
      return done(null, false);
    });
  })
);

// Health check
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    env: {
      MONGO_PASSWORD: !!process.env.MONGO_PASSWORD,
      JWT_SECRET: !!process.env.JWT_SECRET,
      FRONTEND_URL: process.env.FRONTEND_URL || "(not set)",
    },
  });
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);
app.use("/contract", contractRoutes);

app.listen(port, () => {
  console.log(`✅ App is running on port ${port}`);
});
