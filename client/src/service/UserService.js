import axios from "axios";

export const login = async (data) => {
    try {
        const res = await axios.post(
            "http://localhost:5000/api/user/login",
            data
        );
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

export const getUserByUserId = async (userId) => {
    try {
        const res = await axios.get(
            "http://localhost:5000/api/user/get-user-by-userId",
            { params: { userId } }
        );
        return res.data;
    } catch (error) {
        console.error("Get users error:", error);
        throw error;
    }
};
export const getStudentById = async (userId) => {
    try {
        const res = await axios.get(
            "http://localhost:5000/api/user/get-student-by-userId",
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
            `http://localhost:5000/api/user/find-student-by-studentNumber/${studentNumber}`
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
export const sendMessage = async (messageData) => {
    // messageData { userId, content, messageType }
    try {
        const res = await axios.post(
            "http://localhost:5000/api/user/send-message",
            messageData
        );
        return res.data;
    } catch (error) {
        console.error("Send message error:", error);
        throw error;
    }
};
export const sendMessageToRole = async (messageData) => {
    try {
        const res = await axios.post(
            `http://localhost:5000/api/user/send-message-to-role`,
            messageData
        );
        return res.data;
    } catch (error) {
        console.error("Send message to role error:", error);
        throw error;
    }
};
export const getMessageHistory = async (userId) => {
    try {
        const res = await axios.get(
            `http://localhost:5000/api/user/get-history/${userId}`
        );
        return res.data;
    } catch (error) {
        console.error("Get message history error:", error);
        throw error;
    }
};
