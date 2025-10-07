// ../lib/utils.js
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      userName: user.fullName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
};
