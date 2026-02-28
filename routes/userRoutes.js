const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/user");

// GET current user
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// UPDATE profile
router.put("/me", protect, async (req, res) => {
  const { fullName, phone, location } = req.body;

  const user = await User.findById(req.user._id).select("-password -__v");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } 


  user.fullName = fullName || user.fullName;
  user.phone = phone || user.phone;
  user.location = location || user.location;

  const updatedUser = await user.save();

  res.json(updatedUser);
});

module.exports = router;