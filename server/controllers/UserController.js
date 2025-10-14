import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

import { generateToken } from "../lib/utils.js";

// Tạo tài khoản mới
export const signUp = async (req, res) => {
  const { fullName, email, phone, password, role, parentInfo, driverInfo } =
    req.body;
  try {
    if (!fullName || !phone || !password || !role) {
      return res.json({ success: false, message: "The input is required" });
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
      return res.json({ success: false, message: "The input is required" });
    }

    const userData = await User.findOne({ phone });
    if (!userData) {
      return res.json({ success: false, message: "Account does not exist" });
    }

    const passwordCompare = await bcrypt.compare(password, userData.password);
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

// Cập nhật thông tin tài xế
export const updateDriverInfo = async (req, res) => {
  try {
    const { driverInfo } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user || user.role !== "driver") {
      return res.json({ success: false, message: "User is not a driver" });
    }

    // ép kiểu ObjectId
    if (driverInfo.assignedBus) {
      driverInfo.assignedBus = new mongoose.Types.ObjectId(
        driverInfo.assignedBus
      );
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

export const findDriverByDriverNumber = async (req, res) => {
  try {
    const { driverNumber } = req.params;
    const user = await User.findOne({
      "driverInfo.driverNumber": { $regex: `^${driverNumber}$`, $options: "i" },
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
      user,
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
      "parentInfo.children.grade": { $regex: `^${grade}$`, $options: "i" },
    });

    // Gom tất cả học sinh đúng lớp lại
    const students = parents.flatMap((parent) =>
      parent.parentInfo.children
        .filter((child) => child.grade?.toLowerCase() === grade?.toLowerCase())
        .map((child) => ({
          _id: child._id,
          name: child.name,
          grade: child.grade,
          status: child.status,
          parentName: parent.fullName,
          parentPhone: parent.phone,
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
