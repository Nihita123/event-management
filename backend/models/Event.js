import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    title: String,
    date: Date,
    location: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guest" }],
    status: {
      type: String,
      enum: ["draft", "submitted", "approved"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
