const mongoose = require("mongoose");

const User = mongoose.model("user", {
  email: { type: "string", required: true },
  password: { type: "string", required: true },
  salt: { type: "string", required: true },
});
module.exports = User;

// Example usage
