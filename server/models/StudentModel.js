import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  grade: { type: String }, // Lớp học
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // liên kết với role = parent
    required: true,
  },
  assignedBus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
  },
});

export default mongoose.model("Student", studentSchema);
