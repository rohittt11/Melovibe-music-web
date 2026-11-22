const jwt = require("jsonwebtoken");

exports = {};

exports.getToken = async (email, user) => {
  const token = jwt.sign(
    { identifier: user._id },
    process.env.JWT_SECRET || "thisKeyIsSupposedToBeSecret",
    { expiresIn: "30d" } // tokens expire in 30 days
  );
  return token;
};

module.exports = exports;
