import express from "express";
import {
  findDriverByDriverNumber,
  getUserByRole,
  login,
  signUp,
  updateDriverInfo,
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

export default userRouter;
