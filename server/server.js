import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import UserRouter from "./routes/UserRoutes.js";
import BusRouter from "./routes/BusRoutes.js";
import RouteRouter from "./routes/RouteRoutes.js";

// Create express
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
    cors({
        origin: "http://localhost:5173", // domain FE
        credentials: true, // send cookie
    })
);

// Routes setup

app.get("/api/status", (req, res) => {
    res.send("Server is live ");
});

app.use("/api/user", UserRouter);
app.use("/api/bus", BusRouter);
app.use("/api/route", RouteRouter);

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Database Connected");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.error(" MongoDB connection error:", err));
