import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true }, // frontend sends "description"
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, trim: true },        // frontend sends "type"
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
