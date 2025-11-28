import Budget from "../models/Budget.js";

// Get all budgets
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Map budgetType -> type for frontend
    const formatted = budgets.map(b => ({
      _id: b._id,
      type: b.budgetType,        // <--- frontend expects 'type'
      amount: b.amount,
      notes: b.notes,
      createdAt: b.createdAt,
      user: b.user
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Get budgets error:", error);
    res.status(500).json({ message: "Server error fetching budgets" });
  }
};

// Add budget
export const addBudget = async (req, res) => {
  try {
    const { budgetType, amount, notes } = req.body;

    if (!budgetType || amount === undefined || isNaN(amount)) {
      return res.status(400).json({ message: "Budget type and valid amount are required" });
    }

    const budget = new Budget({
      budgetType: budgetType.trim(),
      amount: parseFloat(amount),
      notes: typeof notes === "string" ? notes.trim() : "",
      user: req.user._id,
    });

    await budget.save();

    // Send type instead of budgetType to frontend
    res.status(201).json({
      _id: budget._id,
      type: budget.budgetType,
      amount: budget.amount,
      notes: budget.notes,
      createdAt: budget.createdAt,
      user: budget.user
    });
  } catch (error) {
    console.error("Add budget error:", error);
    res.status(500).json({ message: "Server error adding budget" });
  }
};

// Update budget
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    if (budget.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const { budgetType, amount, notes } = req.body;

    if (budgetType) budget.budgetType = budgetType.trim();
    if (amount !== undefined && !isNaN(amount)) budget.amount = parseFloat(amount);
    if (notes) budget.notes = notes.trim();

    await budget.save();

    res.status(200).json({
      _id: budget._id,
      type: budget.budgetType,
      amount: budget.amount,
      notes: budget.notes,
      createdAt: budget.createdAt,
      user: budget.user
    });
  } catch (error) {
    console.error("Update budget error:", error);
    res.status(500).json({ message: "Server error updating budget" });
  }
};

// Delete budget
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    if (budget.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await budget.deleteOne();
    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({ message: "Server error deleting budget" });
  }
};
