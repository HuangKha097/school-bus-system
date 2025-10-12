import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  routeNumber: { type: String, required: true },

  latitude: { type: Number },
  longitude: { type: Number },
  time: { type: String }, // giờ dự kiến
});

export default mongoose.model("Route", routeSchema);
