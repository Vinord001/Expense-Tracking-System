import express from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar
} from "../controllers/profileController.js";

import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET USER PROFILE
// GET /api/profile
router.get("/", authMiddleware, getProfile);

// UPDATE USER PROFILE (name, email, phone, occupation, bio, address, avatar)
// PUT /api/profile
router.put("/", authMiddleware, updateProfile);

// UPLOAD AVATAR
// POST /api/profile/avatar
router.post("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);

export default router;
