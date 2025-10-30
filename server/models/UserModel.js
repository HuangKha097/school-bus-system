import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderRole: {
        type: String,
        enum: ["driver", "manager", "system"],
        required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["manager", "parent", "driver"],
        required: true,
    },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now },

    messageHistory: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            senderName: String,
            senderRole: String,
            recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            recipientName: String,
            recipientRole: String,
            content: String,
            messageType: String,
            image: String,
            sentAt: { type: Date, default: Date.now },
        },
    ],

    driverInfo: {
        driverNumber: { type: String },
        licenseNumber: { type: String },
        licenseClass: { type: String },
        licenseExpiry: { type: Date },
        assignedBus: [
            {
                busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
                busNumber: { type: String },
                busStatus: {
                    type: String,
                    enum: ["Đang chạy", "Bảo trì", "Dừng"],
                },
                students: { type: Array, default: [] },
            },
        ],
        status: {
            type: String,
            enum: ["Đang hoạt động", "Nghỉ phép", "Tạm ngưng"],
            default: "Đang hoạt động",
        },
    },

    parentInfo: {
        children: [
            {
                studentNumber: { type: String },
                name: { type: String },
                age: { type: Number },
                gender: { type: String, enum: ["Nam", "Nữ"] },
                grade: { type: String },
                phone: { type: String },
                registeredBus: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Bus",
                },
                status: {
                    type: String,
                    enum: ["Đang đi học", "Vắng mặt", "Ngừng tham gia"],
                    default: "Đang đi học",
                },
            },
        ],
    },
});

userSchema.pre("save", function (next) {
    if (this.role !== "driver") this.driverInfo = undefined;
    if (this.role !== "parent") this.parentInfo = undefined;
    next();
});

export default mongoose.model("User", userSchema);
