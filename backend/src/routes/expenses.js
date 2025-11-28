import express from "express";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "../controllers/expenseController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// GET all expenses
router.get("/", protect, getExpenses);

// POST add new expense
router.post("/", protect, addExpense);

// PUT update expense by ID
router.put("/:id", protect, updateExpense);

// DELETE expense by ID
router.delete("/:id", protect, deleteExpense);

export default router;
