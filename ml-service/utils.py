import numpy as np
import pandas as pd

def preprocess_data(data):
    """
    Clean and normalize numeric arrays or lists.
    Converts to numpy array and removes invalid entries.
    """
    if not data:
        return []

    arr = np.array(data, dtype=float)
    arr = np.nan_to_num(arr, nan=0.0, posinf=0.0, neginf=0.0)

    return arr.tolist()


def calculate_balance(incomes, expenses):
    """
    Calculate total income, total expenses, and balance.
    """
    total_income = float(np.sum(incomes))
    total_expense = float(np.sum(expenses))
    balance = total_income - total_expense

    return {
        "totalIncome": total_income,
        "totalExpense": total_expense,
        "balance": balance
    }
