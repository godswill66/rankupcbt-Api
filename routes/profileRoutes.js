const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");


// ===============================
// GET CURRENT USER PROFILE
// GET /api/users/me
// ===============================
router.get("/me", protect, async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
});



// ===============================
// UPDATE USER PROFILE
// PUT /api/users/profile
// ===============================
router.put("/profile", protect, async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    user.institution = req.body.institution || user.institution;
    user.bio = req.body.bio || user.bio;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      institution: updatedUser.institution,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

module.exports = router;