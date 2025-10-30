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

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.json({
                success: false,
                message: "UserId is required",
            });
        }

        const user = await User.find({ _id: userId }).select("-password");
        res.json({
            success: true,
            data: user,
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

// Cập nhật thông tin tài xế
export const updateDriverInfo = async (req, res) => {
    try {
        const { driverInfo, assignedBus } = req.body;
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user || user.role !== "driver") {
            return res.json({
                success: false,
                message: "User is not a driver",
            });
        }

        // Cập nhật các trường trong driverInfo nếu có
        if (driverInfo) {
            user.driverInfo = { ...user.driverInfo, ...driverInfo };
        }

        // Nếu có mảng assignedBus thì thêm vào (push, không ghi đè)
        if (Array.isArray(assignedBus)) {
            user.driverInfo.assignedBus = [
                ...(user.driverInfo.assignedBus || []),
                ...assignedBus,
            ];
        }

        await user.save();

        res.json({
            success: true,
            data: user,
            message: "Driver info updated successfully",
        });
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
        // tìm và cập nhật trực tiếp
        const user = await User.findOneAndUpdate(
            { phone: parentPhone, role: "parent" },
            { $set: { parentInfo } },
            { new: true } // trả về document mới sau khi update
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

// Cập nhật bus cho 1 học sinh
export const updateStudentBus = async (req, res) => {
    try {
        const { studentId } = req.params; // id học sinh trong parentInfo.children
        const { busId } = req.body; // id xe bus (hoặc null)

        if (!studentId) {
            return res.json({
                success: false,
                message: "studentId is required",
            });
        }

        const parent = await User.findOne({
            "parentInfo.children._id": studentId,
        });
        if (!parent) {
            return res.json({
                success: false,
                message: "Không tìm thấy phụ huynh chứa học sinh này",
            });
        }

        await User.updateOne(
            { "parentInfo.children._id": studentId },
            { $set: { "parentInfo.children.$.registeredBus": busId || null } }
        );

        res.json({
            success: true,
            message: "Cập nhật registeredBus thành công",
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
        return res.json({ success: true, message: "Successful", user: [user] });
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

export const findStudentsByStudentNumber = async (req, res) => {
    try {
        const { studentNumber } = req.params;

        if (!studentNumber) {
            return res.json({
                success: false,
                message: "Student number is required",
            });
        }

        const parents = await User.find({
            "parentInfo.children.studentNumber": {
                $regex: `^${studentNumber}$`,
                $options: "i",
            },
        });

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

        if (students.length === 0) {
            return res.json({
                success: false,
                message: "Student does not exist",
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

export const getStudentsHaveBusAssigned = async (req, res) => {
    try {
        //   tất cả phụ huynh có ít nhất 1 học sinh có registeredBus
        const parents = await User.find({
            "parentInfo.children.registeredBus": { $exists: true, $ne: null },
        });

        //gom học sinh có registeredBus thành mảng
        const students = parents.flatMap((parent) =>
            parent.parentInfo.children
                .filter((child) => child.registeredBus)
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

        if (students.length === 0) {
            return res.json({
                success: false,
                message: "Không có học sinh nào được gán bus",
            });
        }

        return res.json({
            success: true,
            message: "Lấy danh sách học sinh có bus thành công",
            students,
        });
    } catch (error) {
        console.error("getStudentsHaveBusAssigned error:", error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

//   GỬI & LẤY TIN NHẮN

//  ửi tin nhắn tới 1 người cụ thể
export const sendMessage = async (req, res) => {
    try {
        const { senderId, content, messageType } = req.body;
        const { userId } = req.params;

        if (!content || !senderId) {
            return res.json({
                success: false,
                message: "Thiếu nội dung hoặc người gửi",
            });
        }

        const recipient = await User.findById(userId);
        if (!recipient) {
            return res.json({
                success: false,
                message: "Không tìm thấy người nhận",
            });
        }

        const sender = await User.findById(senderId);
        const newMessage = {
            senderId,
            senderName: sender?.fullName || "Quản lý",
            senderRole: sender?.role || "manager",
            recipientId: recipient._id,
            recipientName: recipient.fullName,
            recipientRole: recipient.role,
            content,
            messageType: messageType || "general",
            sentAt: new Date(),
        };

        if (!recipient.messageHistory) recipient.messageHistory = [];
        recipient.messageHistory.push(newMessage);
        await recipient.save();

        // Thêm đoạn này
        if (!sender.messageHistory) sender.messageHistory = [];
        sender.messageHistory.push({
            recipientId: recipient._id,
            recipientName: recipient.fullName,
            recipientRole: recipient.role,
            content,
            messageType: messageType || "general",
            sentAt: new Date(),
        });
        await sender.save();

        res.json({
            success: true,
            message: "Gửi tin nhắn thành công !",
            data: newMessage,
        });
    } catch (error) {
        console.error("Send message error:", error);
        res.json({ success: false, message: error.message });
    }
};

//  Gửi tin nhắn đến toàn bộ 1 role
export const sendMessageToRole = async (req, res) => {
    try {
        const { role, senderId, content, messageType } = req.body;

        if (!role || !content || !senderId) {
            return res.json({
                success: false,
                message: "Thiếu dữ liệu bắt buộc",
            });
        }

        const sender = await User.findById(senderId);
        const users = await User.find({ role });
        if (!users || users.length === 0) {
            return res.json({
                success: false,
                message: `Không tìm thấy người dùng role: ${role}`,
            });
        }

        const newMessage = {
            senderId,
            senderName: sender?.fullName || "Quản lý",
            senderRole: sender?.role || "manager",
            recipientRole: role,
            content,
            messageType: messageType || "general",
            sentAt: new Date(),
        };

        await Promise.all(
            users.map(async (u) => {
                if (!u.messageHistory) u.messageHistory = [];
                u.messageHistory.push(newMessage);
                await u.save();
            })
        );
        // Lưu tin nhắn vào lịch sử của người gửi (manager)
        if (!sender.messageHistory) sender.messageHistory = [];
        sender.messageHistory.push({
            recipientRole: role,
            content,
            messageType: messageType || "general",
            sentAt: new Date(),
        });
        await sender.save();
        res.json({
            success: true,
            message: `Đã gửi tin nhắn đến tất cả người dùng role: ${role}`,
        });
    } catch (error) {
        console.error("Send message to role error:", error);
        res.json({ success: false, message: error.message });
    }
};

//   Lấy lịch sử tin nhắn của user
export const getMessageHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select(
            "messageHistory fullName role"
        );

        if (!user) {
            return res.json({
                success: false,
                message: "Không tìm thấy người dùng",
            });
        }

        const sortedMessages = (user.messageHistory || []).sort(
            (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
        );

        res.json({
            success: true,
            data: sortedMessages,
            message: "Lấy lịch sử tin nhắn thành công",
        });
    } catch (error) {
        console.error("Get message history error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const deleteMessageById = async (req, res) => {
    try {
        const { userId, messageId } = req.params;

        if (!userId || !messageId) {
            return res.json({
                success: false,
                message: "Thiếu userId hoặc messageId",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "Không tìm thấy người dùng",
            });
        }

        // Xóa 1 message theo messageId trong mảng messageHistory
        const initialLength = user.messageHistory?.length || 0;
        user.messageHistory = (user.messageHistory || []).filter(
            (msg, index) => msg._id?.toString() !== messageId
        );

        // Nếu không thay đổi độ dài thi messageId không tồn tại
        if (user.messageHistory.length === initialLength) {
            return res.json({
                success: false,
                message: "Không tìm thấy tin nhắn cần xóa",
            });
        }

        await user.save();

        res.json({
            success: true,
            message: "Xóa tin nhắn thành công",
        });
    } catch (error) {
        console.error("Delete message error:", error);
        res.json({ success: false, message: error.message });
    }
};

//  DRIVER SEND MESSAGE
export const sendReportMessage = async (req, res) => {
    try {
        const { senderId, bus, type, note, image } = req.body;

        const sender = await User.findById(senderId);
        if (!sender || sender.role !== "driver") {
            return res.json({
                success: false,
                message: "Không tìm thấy tài xế gửi báo cáo",
            });
        }

        const managerId = "68e4c6bf6f48e0048585b5bc";
        const manager = await User.findById(managerId);
        if (!manager) {
            return res.json({
                success: false,
                message: "Không tìm thấy tài khoản quản lý để nhận báo cáo",
            });
        }

        const newMessage = {
            senderId,
            senderName: sender.fullName,
            senderRole: "driver",
            recipientId: manager._id,
            recipientName: manager.fullName,
            recipientRole: "manager",
            messageType: "report",
            content: `Báo cáo từ tài xế ${sender.fullName} (${bus}): ${note} (${type})`,
            image, // base64 string
            sentAt: new Date(),
        };

        if (!manager.messageHistory) manager.messageHistory = [];
        manager.messageHistory.push(newMessage);
        await manager.save();

        if (!sender.messageHistory) sender.messageHistory = [];
        sender.messageHistory.push(newMessage);
        await sender.save();

        res.json({
            success: true,
            message: "Đã gửi báo cáo và lưu lịch sử cho cả tài xế và quản lý",
            data: newMessage,
        });
    } catch (error) {
        console.error("Send report error:", error);
        res.json({ success: false, message: error.message });
    }
};
