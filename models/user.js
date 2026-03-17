const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false 
  },

  username: {
    type: String,
    unique: true,
    sparse: true 
  },

  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true 
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

  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  institution: { type: String, default: "" },
  bio: { type: String, default: "" },
  
  // FIXED: Changed 'avatar' to 'profilePicture' to match your routes and frontend
  profilePicture: {
    type: String,
    default: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // Or your local default path
  }

}, { timestamps: true });

// This logic prevents model overwrite errors in development
module.exports = mongoose.models.User || mongoose.model("User", userSchema);