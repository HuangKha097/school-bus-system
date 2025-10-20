import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import { normalizeString } from "../utils/normalize.js";
import { generateToken } from "../lib/utils.js";

// Tạo tài khoản mới
export const signUp = async (req, res) => {
    const { fullName, email, phone, password, role, parentInfo, driverInfo } =
        req.body;
    try {
        if (!fullName || !phone || !password || !role) {
            return res.json({
                success: false,
                message: "The input is required",
            });
        }

        // Nếu là driver thì phải có driverNumber
        if (role === "driver" && !driverInfo?.driverNumber) {
            return res.json({
                success: false,
                message: "Driver number is required for driver",
            });
        }

        const checkUser = await User.findOne({ phone });
        if (checkUser) {
            return res.json({
                success: false,
                message: "The account already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Nếu là parent thì thêm parentInfo
        // Nếu là driver thì thêm driverInfo
        const newUser = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role,
            parentInfo,
            driverInfo,
        });

        const token = generateToken(newUser);

        const userObj = newUser.toObject();
        const { password: pw, ...userWithoutPassword } = userObj;

        res.json({
            success: true,
            userData: userWithoutPassword,
            token,
            message: "Account created successfully",
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const bulkSignUp = async (req, res) => {
    const usersArray = req.body;

    if (!Array.isArray(usersArray) || usersArray.length === 0) {
        return res.json({
            success: false,
            message: "Body must be an array of users",
        });
    }

    try {
        const createdUsers = [];
        const errors = [];

        for (const userData of usersArray) {
            const { fullName, phone, password, role } = userData;

            if (!fullName || !phone || !password || !role) {
                errors.push(
                    `Skipped user (missing required fields): ${
                        fullName || phone
                    }`
                );
                continue; // Bỏ qua user này
            }

            const checkUser = await User.findOne({ phone: userData.phone });
            if (checkUser) {
                errors.push(`Skipped user (already exists): ${phone}`);
                continue;
            }

            // Bạn PHẢI hash mật khẩu cho từng user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const newUser = new User({
                ...userData,
                password: hashedPassword, // Ghi đè mật khẩu plain text
            });

            const savedUser = await newUser.save();
            createdUsers.push(savedUser);
        }

        res.json({
            success: true,
            message: `Successfully created ${createdUsers.length} users.`,
            created: createdUsers.length,
            errors: errors,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { phone, password } = req.body;
    try {
        if (!phone || !password) {
            return res.json({
                success: false,
                message: "The input is required",
            });
        }

        const userData = await User.findOne({ phone });
        if (!userData) {
            return res.json({
                success: false,
                message: "Account does not exist",
            });
        }

        const passwordCompare = await bcrypt.compare(
            password,
            userData.password
        );
        if (!passwordCompare) {
            return res.json({
                success: false,
                message: "Your password is not correct",
            });
        }

        const token = generateToken(userData);

        const userObj = userData.toObject();
        const { password: pw, ...userWithoutPassword } = userObj;

        res.json({
            success: true,
            userData: userWithoutPassword,
            token,
            message: "Login successfully",
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.json({
                success: false,
                message: "userId is required",
            });
        }

        const users = await User.find({ _id: userId }).select("-password");
        res.json({
            success: true,
            data: users,
            message: "Get users by userId successfully",
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserByRole = async (req, res) => {
    try {
        const { role } = req.query;

        if (!role) {
            return res.json({
                success: false,
                message: "Role is required",
            });
        }

        const users = await User.find({ role: role }).select("-password");
        res.json({
            success: true,
            data: users,
            message: "Get users by role successfully",
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Cập nhật thông tin tài xế
export const updateDriverInfo = async (req, res) => {
    try {
        const { driverInfo } = req.body;
        const userId = req.params.userId;
        console.log("Received driverInfo:", driverInfo);
        console.log("userId:", req.params.userId);

        const user = await User.findById(userId);

        if (!user || user.role !== "driver") {
            return res.json({
                success: false,
                message: "User is not a driver",
            });
        }

        user.driverInfo = { ...user.driverInfo, ...driverInfo };

        await user.save();

        res.json({ success: true, data: user, message: "Driver info updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Cập nhật thông tin phụ huynh/ con
export const updateParentInfo = async (req, res) => {
    const { parentInfo } = req.body;
    const { parentPhone } = req.params;

    try {
        const user = await User.findOneAndUpdate(
            { phone: parentPhone, role: "parent" },
            { $set: { parentInfo } },
            { new: true }
        );

        if (!user) {
            return res.json({ success: false, message: "Parent not found" });
        }

        res.json({
            success: true,
            data: user,
            message: "Parent info updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const findDriverByDriverNumber = async (req, res) => {
    try {
        const { driverNumber } = req.params;
        const user = await User.findOne({
            "driverInfo.driverNumber": {
                $regex: `^${driverNumber}$`,
                $options: "i",
            },
        });
        if (!user) {
            return res.json({
                success: false,
                message: "Driver does not exists",
            });
        }
        return res.json({
            success: true,
            message: "Successful",
            user: [user],
        });
    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const findDriverByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const normalizedStatus = normalizeString(status);

        // Lấy tất cả user trước, rồi lọc bằng JS
        const allUsers = await User.find({
            "driverInfo.status": { $exists: true },
        });

        const matchedUsers = allUsers.filter((user) => {
            const dbStatus = normalizeString(user.driverInfo.status || "");
            return dbStatus === normalizedStatus;
        });

        if (matchedUsers.length === 0) {
            return res.json({
                success: false,
                message: "Driver does not exist",
            });
        }

        return res.json({
            success: true,
            message: "Successful",
            user: matchedUsers,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const findStudentsByGrade = async (req, res) => {
    try {
        const { grade } = req.params;

        if (!grade) {
            return res.json({
                success: false,
                message: "Grade parameter is required",
            });
        }

        const parents = await User.find({
            "parentInfo.children.grade": {
                $regex: `^${grade}$`,
                $options: "i",
            },
        });

        // Gom tất cả học sinh đúng lớp lại
        const students = parents.flatMap((parent) =>
            parent.parentInfo.children
                .filter(
                    (child) =>
                        child.grade?.toLowerCase() === grade?.toLowerCase()
                )
                .map((child) => ({
                    studentNumber: child.studentNumber,
                    _id: child._id,
                    name: child.name,
                    grade: child.grade,
                    status: child.status,
                    parentName: parent.fullName,
                    parentPhone: parent.phone,
                    registeredBus: child.registeredBus,
                }))
        );
        console.log(students);

        if (students.length === 0) {
            return res.json({
                success: false,
                message: "Student dose not exists",
            });
        }
        return res.json({
            success: true,
            message: "Find Successfully",
            students,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const findStudentsByStudentNumber = async (req, res) => {
    try {
        const { studentNumber } = req.params;

        if (!studentNumber) {
            return res.json({
                success: false,
                message: "Student Number  is required",
            });
        }

        const parents = await User.find({
            "parentInfo.children.studentNumber": {
                $regex: `^${studentNumber}$`,
                $options: "i",
            },
        });

        // Gom tất cả học sinh đúng lớp lại
        const students = parents.flatMap((parent) =>
            parent.parentInfo.children
                .filter(
                    (child) =>
                        child.studentNumber?.toLowerCase() ===
                        studentNumber?.toLowerCase()
                )
                .map((child) => ({
                    studentNumber: child.studentNumber,
                    _id: child._id,
                    name: child.name,
                    grade: child.grade,
                    status: child.status,
                    parentName: parent.fullName,
                    parentPhone: parent.phone,
                    registeredBus: child.registeredBus,
                }))
        );
        console.log(students);

        if (students.length === 0) {
            return res.json({
                success: false,
                message: "Student dose not exists",
            });
        }
        return res.json({
            success: true,
            message: "Find Successfully",
            students,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const sendMessageToSpecificUser = async (req, res) => {
    try {
        const { userId, content, messageType, senderId } = req.body;

        if (!userId) {
            return res.json({
                success: false,
                message: "Không tìm thấy User ID (người nhận)",
            });
        }
        if (!content) {
            return res.json({
                success: false,
                message: "Nội dung tin nhắn là bắt buộc",
            });
        }
        if (!senderId) {
            return res.json({
                success: false,
                message: "Không xác định được người gửi (thiếu senderId)",
            });
        }

        const newMessage = {
            content: content,
            messageType: messageType || "general",
            sentBy: senderId,
            sentAt: new Date(),
        };

        const updatedRecipient = await User.findOneAndUpdate(
            { _id: userId }, // Tìm người nhận
            { $push: { messageHistory: newMessage } }, // Thêm tin nhắn
            { new: true }
        );

        if (!updatedRecipient) {
            return res.json({
                success: false,
                message: "Không tìm thấy người nhận với ID này",
            });
        }

        if (userId !== senderId) {
            await User.updateOne(
                { _id: senderId }, // Tìm người gửi
                { $push: { messageHistory: newMessage } } // Thêm tin nhắn
            );
        }

        return res.json({
            success: true,
            message: "Gửi tin nhắn thành công (đã lưu cho cả 2)",
            result: updatedRecipient,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Đã xảy ra lỗi server: " + error.message,
        });
    }
};
export const getMessageHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "Thiếu User ID" });
        }

        const user = await User.findById(userId)
            .select("messageHistory")
            .populate({
                path: "messageHistory.sentBy",
                select: "fullName role",
            });

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy user" });
        }

        const sortedHistory = user.messageHistory.sort(
            (a, b) => b.sentAt - a.sentAt
        );

        res.json({
            success: true,
            data: sortedHistory,
        });
    } catch (error) {
        console.log("Lỗi khi lấy lịch sử tin nhắn:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const sendMessageToRole = async (req, res) => {
    try {
        const { role, content, messageType, senderId } = req.body;

        if (!role || !["parent", "driver"].includes(role)) {
            return res
                .status(400)
                .json({ success: false, message: "Vai trò không hợp lệ" });
        }
        if (!content) {
            return res
                .status(400)
                .json({ success: false, message: "Nội dung là bắt buộc" });
        }
        if (!senderId) {
            return res
                .status(400)
                .json({ success: false, message: "Thiếu ID người gửi" });
        }

        const newMessage = {
            content: content,
            messageType: messageType || "general_announcement",
            sentBy: senderId,
            sentAt: new Date(),
        };

        const updateResult = await User.updateMany(
            { role: role },
            { $push: { messageHistory: newMessage } }
        );

        await User.updateOne(
            { _id: senderId },
            { $push: { messageHistory: newMessage } }
        );

        res.json({
            success: true,
            message: `Gửi thông báo thành công cho ${updateResult.modifiedCount} người.`,
            result: updateResult,
        });
    } catch (error) {
        console.log("Lỗi khi gửi tin nhắn hàng loạt:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
