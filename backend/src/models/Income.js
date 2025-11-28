import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    // This MUST stay as "source" because your frontend uses source
    source: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // Category shown on your Income page
    category: { 
      type: String, 
      trim: true, 
      default: "Other" 
    },

    amount: { 
      type: Number, 
      required: true, 
      min: 0 
    },

    date: { 
      type: Date, 
      default: Date.now 
    },

    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);
export default Income;
