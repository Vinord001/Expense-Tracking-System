import Expense from "../models/Expense.js";

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Server error fetching expenses" });
  }
};

// Add expense
export const addExpense = async (req, res) => {
  try {
    const { type, description, amount, date } = req.body;

    if (!type || !description || amount === undefined || isNaN(amount)) {
      return res.status(400).json({ message: "Type, description, and valid amount are required" });
    }

    const expense = new Expense({
      type: type.trim(),
      description: description.trim(),
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
      user: req.user._id,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Server error adding expense" });
  }
};

// Update expense (NEW)
export const updateExpense = async (req, res) => {
  try {
    const { type, description, amount, date } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    expense.type = type?.trim() ?? expense.type;
    expense.description = description?.trim() ?? expense.description;
    expense.amount = amount !== undefined ? parseFloat(amount) : expense.amount;
    if (date) expense.date = new Date(date);

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Server error updating expense" });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Server error deleting expense" });
  }
};
