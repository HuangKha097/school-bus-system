import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    routeNumber: { type: String, required: true },
    buses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus", // Tham chiếu sang Bus
        },
    ],
    latitude: { type: Number },
    longitude: { type: Number },
    time: { type: String }, // giờ dự kiến
});

export default mongoose.model("Route", routeSchema);
