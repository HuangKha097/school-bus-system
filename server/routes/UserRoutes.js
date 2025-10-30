import express from "express";
import {
    findDriverByDriverNumber,
    getUserByRole,
    login,
    signUp,
    updateDriverInfo,
    findStudentsByGrade,
    updateParentInfo,
    findDriverByStatus,
    getUserById,
    updateStudentBus,
    sendMessage,
    sendMessageToRole,
    getMessageHistory,
    sendReportMessage,
    findStudentsByStudentNumber,
    deleteMessageById,
    getStudentsHaveBusAssigned,
} from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.get("/get-user-by-role", getUserByRole);
userRouter.get("/get-user-by-id", getUserById);
userRouter.put("/update-driver/:userId", updateDriverInfo);
userRouter.get(
    "/find-driver-by-driver-number/:driverNumber",
    findDriverByDriverNumber
);
userRouter.get("/find-driver-by-status/:status", findDriverByStatus);
userRouter.get("/find-students-by-grade/:grade", findStudentsByGrade);
userRouter.get(
    "/find-students-by-student-number/:studentNumber",
    findStudentsByStudentNumber
);
userRouter.get("/get-student-have-bus-assigned", getStudentsHaveBusAssigned);

userRouter.put("/student/:studentId/bus", updateStudentBus);

userRouter.post("/send-message/:userId", sendMessage);
userRouter.post("/send-message-to-role", sendMessageToRole);
userRouter.get("/message-history/:userId", getMessageHistory);
userRouter.delete("/message/:userId/:messageId", deleteMessageById);

userRouter.post("/report", sendReportMessage);
userRouter.put("/update-student/:parentPhone", updateParentInfo);

export default userRouter;
