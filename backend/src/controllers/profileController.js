import User from "../models/User.js";

// GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER PROFILE (name, email, etc.)
export const updateProfile = async (req, res) => {
  try {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.occupation) updates.occupation = req.body.occupation;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.body.address) updates.address = req.body.address;
    if (req.body.avatar) updates.avatar = req.body.avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPLOAD AVATAR
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // MULTER stores file inside /uploads/avatars/
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarPath },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Avatar uploaded successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
