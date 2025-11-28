import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },

    password: { type: String, required: true },

    // ⭐ New Profile Fields Below ⭐

    phone: { 
      type: String, 
      default: "" 
    },

    occupation: {   // Added occupation field
      type: String,
      default: ""
    },

    avatar: { 
      type: String, 
      default: ""  // Will store the URL/path to uploaded image
    },

    bio: { 
      type: String, 
      default: "" 
    },

    address: { 
      type: String, 
      default: "" 
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
