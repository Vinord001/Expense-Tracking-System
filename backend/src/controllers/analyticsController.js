import Expense from "../models/Expense.js";
import Income from "../models/Income.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ user: userId });
    const incomes = await Income.find({ user: userId });

    const totalExpenses = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
    const totalIncome = incomes.reduce((acc, item) => acc + Number(item.amount), 0);

    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
