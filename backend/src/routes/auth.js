import express from "express";
import { signup, login } from "../controllers/authController.js";
import { getProfile, updateProfile, uploadAvatar } from "../controllers/profileController.js";
import authMiddleware from "../middleware/auth.js"; // <-- fixed import
import upload from "../middleware/uploadMiddleware.js"; // for avatar uploads

const router = express.Router();

/* ---------------------------------------
   AUTH ROUTES
---------------------------------------- */

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    await signup(req, res);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (err) {
    next(err);
  }
});

/* ---------------------------------------
   PROFILE ROUTES
---------------------------------------- */

// GET /api/auth/profile - Fetch logged-in user profile
router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    await getProfile(req, res);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile - Update profile details
router.put("/profile", authMiddleware, async (req, res, next) => {
  try {
    await updateProfile(req, res);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile/avatar - Upload or update user avatar
router.put(
  "/profile/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      await uploadAvatar(req, res);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
