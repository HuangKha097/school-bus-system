import mongoose from "mongoose";

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
            content: { type: String, required: true },
            messageType: { type: String },
            sentBy: {
                // ID của Manager đã gửi
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            sentAt: { type: Date, default: Date.now },
            read: { type: Boolean, default: false }, // Trạng thái đã xem hay chưa
        },
    ],

    // --- Nếu là tài xế ---
    driverInfo: {
        driverNumber: { type: String, unique: false, sparse: true },
        licenseNumber: { type: String },
        licenseClass: { type: String },
        licenseExpiry: { type: Date },
        assignedBus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
        status: {
            type: String,
            enum: ["Đang hoạt động", "Nghỉ phép", "Tạm ngưng"],
            default: "Đang hoạt động",
        },
    },

    // --- Nếu là phụ huynh ---
    parentInfo: {
        children: [
            {
                studentNumber: { type: String },
                name: { type: String, required: true },
                age: { type: Number },
                gender: { type: String, enum: ["Nam", "Nữ"] },
                grade: { type: String }, // lớp
                phone: { type: String }, // số điện thoại riêng của học sinh (nếu có)

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
