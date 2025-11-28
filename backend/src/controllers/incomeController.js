import Income from "../models/Income.js";

// Get all incomes
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    console.error("Get incomes error:", error);
    res.status(500).json({ message: "Server error fetching incomes" });
  }
};

// Add income
export const addIncome = async (req, res) => {
  try {
    const { source, category, amount, date } = req.body;

    if (!source || amount === undefined || isNaN(amount)) {
      return res.status(400).json({ message: "Source and valid amount are required" });
    }

    const income = new Income({
      source: source.trim(),
      category: category?.trim() || "Other",
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
      user: req.user._id,
    });

    await income.save();
    res.status(201).json(income);
  } catch (error) {
    console.error("Add income error:", error);
    res.status(500).json({ message: "Server error adding income" });
  }
};

// Update income
export const updateIncome = async (req, res) => {
  try {
    const { source, category, amount, date } = req.body;
    const income = await Income.findById(req.params.id);

    if (!income) return res.status(404).json({ message: "Income not found" });
    if (income.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    income.source = source?.trim() ?? income.source;
    income.category = category?.trim() ?? income.category;
    income.amount = amount !== undefined ? parseFloat(amount) : income.amount;
    if (date) income.date = new Date(date);

    await income.save();
    res.status(200).json(income);
  } catch (error) {
    console.error("Update income error:", error);
    res.status(500).json({ message: "Server error updating income" });
  }
};

// Delete income
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: "Income not found" });
    if (income.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await income.deleteOne();
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Delete income error:", error);
    res.status(500).json({ message: "Server error deleting income" });
  }
};
