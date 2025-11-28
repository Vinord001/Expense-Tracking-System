import Saving from "../models/Saving.js";

// Get all savings
export const getSavings = async (req, res) => {
  try {
    const savings = await Saving.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(savings);
  } catch (error) {
    console.error("Get savings error:", error);
    res.status(500).json({ message: "Server error fetching savings" });
  }
};

// Add saving
export const addSaving = async (req, res) => {
  try {
    const { type, amount, savedAmount, deadline } = req.body;

    if (!type || amount === undefined || isNaN(amount)) {
      return res.status(400).json({ message: "Type and valid target amount are required" });
    }

    const saving = new Saving({
      type: type.trim(),                     // matches schema
      amount: parseFloat(amount),            // target amount
      savedAmount: savedAmount && !isNaN(savedAmount) ? parseFloat(savedAmount) : 0,
      deadline: deadline ? new Date(deadline) : null,
      user: req.user._id,
    });

    await saving.save();
    res.status(201).json(saving);
  } catch (error) {
    console.error("Add saving error:", error);
    res.status(500).json({ message: "Server error adding saving" });
  }
};

// Update saving
export const updateSaving = async (req, res) => {
  try {
    const saving = await Saving.findById(req.params.id);
    if (!saving) return res.status(404).json({ message: "Saving not found" });
    if (saving.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const { type, amount, savedAmount, deadline } = req.body;

    if (type) saving.type = type.trim();
    if (amount !== undefined && !isNaN(amount)) saving.amount = parseFloat(amount);
    if (savedAmount !== undefined && !isNaN(savedAmount)) saving.savedAmount = parseFloat(savedAmount);
    if (deadline) saving.deadline = new Date(deadline);

    await saving.save();
    res.status(200).json(saving);
  } catch (error) {
    console.error("Update saving error:", error);
    res.status(500).json({ message: "Server error updating saving" });
  }
};

// Delete saving
export const deleteSaving = async (req, res) => {
  try {
    const saving = await Saving.findById(req.params.id);
    if (!saving) return res.status(404).json({ message: "Saving not found" });
    if (saving.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await saving.deleteOne();
    res.status(200).json({ message: "Saving deleted successfully" });
  } catch (error) {
    console.error("Delete saving error:", error);
    res.status(500).json({ message: "Server error deleting saving" });
  }
};
