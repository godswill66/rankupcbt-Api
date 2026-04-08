const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    institution: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
