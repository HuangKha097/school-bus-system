import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roleReceiver: { type: String, enum: ["manager", "parent", "driver"] }, // broadcast cho role
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
