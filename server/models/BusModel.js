import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true }, // Số xe hoặc mã xe
  licensePlate: { type: String, required: true }, // Biển số
  capacity: { type: Number, default: 40 },
  routeNumber: { type: String },
  busStatus: {
    type: String,
    enum: ["Đang chạy", "Bảo trì", "Dừng"],
    default: "Đang chạy",
  },

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Tham chiếu đến tài xế
  },
  students: [
    {
      parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Tham chiếu đến phụ huynh
      },
      childName: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Bus", busSchema);
