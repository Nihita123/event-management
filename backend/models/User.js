import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["banker", "assistant", "manager", "marketing"],
      default: "banker",
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
