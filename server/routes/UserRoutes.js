import express from "express";
import {
    findDriverByDriverNumber,
    getUserByRole,
    getUserById,
    login,
    signUp,
    updateDriverInfo,
    findStudentsByGrade,
    updateParentInfo,
    findDriverByStatus,
    findStudentsByStudentNumber,
    sendMessageToSpecificUser,
    getMessageHistory,
    bulkSignUp,
    sendMessageToRole,
} from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/bulk-signup", bulkSignUp);
userRouter.post("/login", login);
userRouter.get("/get-user-by-role", getUserByRole);
userRouter.get("/get-user-by-userId", getUserById);
userRouter.put("/update-driver/:userId", updateDriverInfo);
userRouter.get(
    "/find-driver-by-driver-number/:driverNumber",
    findDriverByDriverNumber
);
userRouter.get("/find-driver-by-status/:status", findDriverByStatus);
userRouter.get("/find-students-by-grade/:grade", findStudentsByGrade);
userRouter.get(
    "/find-student-by-studentNumber/:studentNumber",
    findStudentsByStudentNumber
);
userRouter.put("/update-student/:parentPhone", updateParentInfo);
userRouter.post("/send-message", sendMessageToSpecificUser);
userRouter.get("/get-history/:userId", getMessageHistory);
userRouter.post("/send-message-to-role", sendMessageToRole);
export default userRouter;
