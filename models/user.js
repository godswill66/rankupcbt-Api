const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    // Set to false so you don't have to provide a full name for the admin account in Atlas
    required: false 
  },

  // Added Username for your Admin Login
  username: {
    type: String,
    unique: true,
    sparse: true // Allows this to be null for regular students
  },

  email: {
    type: String,
    required: false, // Changed from true to support admin-only accounts
    unique: true,
    sparse: true // Allows this to be null for the admin account
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  // ... keep your other fields (phone, location, etc.) as they were ...
  phone: { type: String },
  location: { type: String },
  institution: { type: String },
  bio: { type: String },
  avatar: {
    type: String,
    default: "/assets/default-avatar.png"
  }

}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);