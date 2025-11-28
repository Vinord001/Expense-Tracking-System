import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def prepare_training_data(expenses):
    """
    Convert expenses list into a DataFrame for ML processing
    """
    df = pd.DataFrame(expenses)
    
    if df.empty:
        return None

    # Convert date column if exists
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])

    # Basic numeric conversion
    if 'amount' in df.columns:
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce')

    return df


def analyze_expenses(expenses):
    """
    Performs basic expense analysis: total, average, highest, lowest
    """
    df = prepare_training_data(expenses)
    if df is None:
        return {"error": "No data provided"}

    total = df['amount'].sum()
    average = df['amount'].mean()
    highest = df['amount'].max()
    lowest = df['amount'].min()

    return {
        "total": total,
        "average": average,
        "highest": highest,
        "lowest": lowest
    }


# --------------- NEW TRAINING FUNCTION ADDED ---------------- #

def train_expense_model(expenses):
    """
    Train a simple ML model that learns spending patterns.
    Model predicts amount based on date (time-based pattern learning).
    """
    df = prepare_training_data(expenses)
    if df is None or 'date' not in df.columns:
        return {"error": "Training requires valid data with dates"}

    # Prepare features and target
    df['timestamp'] = df['date'].astype(np.int64) // 10**9  # convert date to seconds
    X = df[['timestamp']]
    y = df['amount']

    # Train linear regression model
    model = LinearRegression()
    model.fit(X, y)

    return {
        "message": "Training successful",
        "coef": float(model.coef_[0]),
        "intercept": float(model.intercept_),
        "model": model  # can be used later for predictions
    }
