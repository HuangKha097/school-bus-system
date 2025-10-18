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
    findStudentsByStudentNumber,
    // findStudentsByStudentNumber,
} from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.get("/get-user-by-role", getUserByRole);
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
export default userRouter;
