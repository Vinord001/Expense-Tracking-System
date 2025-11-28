from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd

# ✔ FIXED IMPORTS
from utils import preprocess_data, calculate_balance
from analysis.prepare_training_data import analyze_expenses, train_expense_model

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return jsonify({"message": "✅ ML Prediction Service is running"})


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json or {}
    expenses = preprocess_data(data.get('expenses', []))
    incomes = preprocess_data(data.get('incomes', []))

    predicted_expense = float(np.mean(expenses)) if expenses else 0
    predicted_income = float(np.mean(incomes)) if incomes else 0
    predicted_balance = predicted_income - predicted_expense

    summary = calculate_balance(incomes, expenses)

    return jsonify({
        "predictedExpense": predicted_expense,
        "predictedIncome": predicted_income,
        "predictedBalance": predicted_balance,
        "summary": summary
    })


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json or {}
    expenses = data.get('expenses', [])
    result = analyze_expenses(expenses)
    return jsonify(result)


# ---------------------------------------------------------
# ✅ NEW TRAINING ENDPOINT (ADDED WITHOUT TOUCHING ANYTHING)
# ---------------------------------------------------------
@app.route('/train', methods=['POST'])
def train():
    data = request.json or {}
    expenses = data.get('expenses', [])

    result = train_expense_model(expenses)

    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
