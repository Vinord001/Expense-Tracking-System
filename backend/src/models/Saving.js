import mongoose from "mongoose";

const savingSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },       // frontend sends "type"
    amount: { type: Number, required: true, min: 0 },         // frontend sends "amount"
    savedAmount: { type: Number, default: 0, min: 0 },        // optional
    deadline: { type: Date, default: null },                  // optional
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Saving = mongoose.model("Saving", savingSchema);
export default Saving;
