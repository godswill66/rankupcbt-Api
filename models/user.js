const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  location: {
    type: String,
  },
  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
}
});

// 🔥 Prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);