import axios from "axios";

export const login = async (data) => {
  try {
    const res = await axios.post("http://localhost:5000/api/user/login", data);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getUserByRole = async (role) => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/user/get-user-by-role",
      { params: { role } }
    );
    return res.data;
  } catch (error) {
    console.error("Get users error:", error);
    throw error;
  }
};
export const getUserById = async (userId) => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/user/get-user-by-id",
      { params: { userId } }
    );
    return res.data;
  } catch (error) {
    console.error("Get users error:", error);
    throw error;
  }
};

export const updateDriverInfo = async (userId, driverUpdate) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/user/update-driver/${userId}`,
      { driverInfo: driverUpdate }
    );
    return res.data;
  } catch (error) {
    console.error("Update driver error:", error);
    throw error;
  }
};

export const findDriverByDriverNumber = async (driverNumber) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/user/find-driver-by-driver-number/${driverNumber}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const findDriverByStatus = async (status) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/user/find-driver-by-status/${status}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const findStudentsByGrade = async (grade) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/user/find-students-by-grade/${grade}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const updateStudent = async ({ parentPhone, parentInfo }) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/user/update-student/${parentPhone}`,
      { parentInfo }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
