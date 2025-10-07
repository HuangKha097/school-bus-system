import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ví dụ: "Route A"
  stops: [
    {
      name: String,
      latitude: Number,
      longitude: Number,
      time: String, // giờ dự kiến
    },
  ],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // liên kết với role = manager
  },
});

export default mongoose.model("Route", routeSchema);
