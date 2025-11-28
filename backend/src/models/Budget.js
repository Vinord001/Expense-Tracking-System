import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    budgetType: { type: String, required: true, trim: true }, // frontend sends "budgetType"
    amount: { type: Number, required: true, min: 0 },         // frontend sends "amount"
    notes: { type: String, trim: true, default: "" },         // optional notes
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
