import express from "express";
import { getIncomes, addIncome, updateIncome, deleteIncome } from "../controllers/incomeController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// GET all incomes
router.get("/", protect, getIncomes);

// POST add new income
router.post("/", protect, addIncome);

// PUT update income by ID
router.put("/:id", protect, updateIncome);

// DELETE income by ID
router.delete("/:id", protect, deleteIncome);

export default router;
