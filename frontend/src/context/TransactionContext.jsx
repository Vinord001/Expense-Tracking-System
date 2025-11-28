import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getExpenses } from "../api/expenseApi";
import { getIncomes } from "../api/incomeApi";
import { getBudgets } from "../api/budgetApi";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { user, getToken } = useContext(AuthContext); // <- use getToken
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const token = getToken();
    if (user && token) {
      fetchTransactions(token);
    }
  }, [user]);

  const fetchTransactions = async (token) => {
    try {
      const expensesData = await getExpenses(token);
      const incomesData = await getIncomes(token);
      const budgetsData = await getBudgets(token);

      setExpenses(expensesData);
      setIncomes(incomesData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <TransactionContext.Provider value={{ expenses, incomes, budgets, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};
