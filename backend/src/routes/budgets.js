import express from "express";
import { getBudgets, addBudget, updateBudget, deleteBudget } from "../controllers/budgetController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getBudgets);
router.post("/", protect, addBudget);
router.put("/:id", protect, updateBudget);
router.delete("/:id", protect, deleteBudget);

export default router;
