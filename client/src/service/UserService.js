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
export const findStudentsByStudentNumber = async (studentNumber) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/user/find-students-by-student-number/${studentNumber}`
    );
    return res.data;
  } catch (error) {
    console.error("Find students by student number error:", error);
    throw error;
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
export const updateStudentBus = async (studentId, busId) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/user/student/${studentId}/bus`,
      { busId }
    );
    return res.data;
  } catch (error) {
    console.error("Update student bus error:", error);
    throw error;
  }
};

export const sendMessage = async (data) => {
  return axios
    .post(`http://localhost:5000/api/user/send-message/${data.userId}`, data)
    .then((res) => res.data);
};

export const sendMessageToRole = async (data) => {
  return axios
    .post("http://localhost:5000/api/user/send-message-to-role", data)
    .then((res) => res.data);
};

export const getMessageHistory = async (userId) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/user/message-history/${userId}`
    );
    return res.data;
  } catch (error) {
    console.error("Get message history error:", error);
    throw error;
  }
};

export const sendReport = async (reportData) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/user/report",
      reportData
    );
    return res.data;
  } catch (error) {
    console.error("Send report error:", error);
    throw error;
  }
};
