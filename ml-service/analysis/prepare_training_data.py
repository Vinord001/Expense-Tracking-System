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

    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')

    if 'amount' in df.columns:
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)

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
        "total": float(total),
        "average": float(average),
        "highest": float(highest),
        "lowest": float(lowest)
    }


# ---------------------- NEW TRAINING FUNCTION ---------------------- #

def train_expense_model(expenses):
    """
    Trains a simple ML model that learns spending patterns based on time.
    This model predicts future amounts from past timestamps.
    """
    df = prepare_training_data(expenses)
    if df is None or 'date' not in df.columns:
        return {"error": "Training requires valid expenses with date values"}

    # Convert dates to numeric timestamps
    df['timestamp'] = df['date'].astype(np.int64) // 10**9

    # Features and label
    X = df[['timestamp']]
    y = df['amount']

    # Train model
    model = LinearRegression()
    model.fit(X, y)

    return {
        "message": "Training complete",
        "coef": float(model.coef_[0]),
        "intercept": float(model.intercept_),
        "model": model  # You can use this for future predictions
    }
