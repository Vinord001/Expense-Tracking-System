import express from "express";
import { getSavings, addSaving, updateSaving, deleteSaving } from "../controllers/savingsController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// GET all savings
router.get("/", protect, getSavings);

// POST add new saving
router.post("/", protect, addSaving);

// PUT update saving by ID
router.put("/:id", protect, updateSaving);

// DELETE saving by ID
router.delete("/:id", protect, deleteSaving);

export default router;
