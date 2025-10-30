import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

//  AUTH
export const login = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/login`, data);
        return res.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

//  USER
export const getUserByRole = async (role) => {
    try {
        const res = await axios.get(`${BASE_URL}/get-user-by-role`, {
            params: { role },
        });
        return res.data;
    } catch (error) {
        console.error("Get users error:", error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const res = await axios.get(`${BASE_URL}/get-user-by-id`, {
            params: { userId },
        });
        return res.data;
    } catch (error) {
        console.error("Get user by ID error:", error);
        throw error;
    }
};

//  DRIVER
export const updateDriverInfo = async (userId, driverUpdate) => {
    try {
        const res = await axios.put(`${BASE_URL}/update-driver/${userId}`, {
            driverInfo: driverUpdate,
        });
        return res.data;
    } catch (error) {
        console.error("Update driver error:", error);
        throw error;
    }
};

export const findDriverByDriverNumber = async (driverNumber) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/find-driver-by-driver-number/${driverNumber}`
        );
        return res.data;
    } catch (error) {
        console.error("Find driver by number error:", error);
        throw error;
    }
};

export const findDriverByStatus = async (status) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/find-driver-by-status/${status}`
        );
        return res.data;
    } catch (error) {
        console.error("Find driver by status error:", error);
        throw error;
    }
};

//  STUDENT
export const findStudentsByGrade = async (grade) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/find-students-by-grade/${grade}`
        );
        return res.data;
    } catch (error) {
        console.error("Find students by grade error:", error);
        throw error;
    }
};

export const findStudentsByStudentNumber = async (studentNumber) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/find-students-by-student-number/${studentNumber}`
        );
        return res.data;
    } catch (error) {
        console.error("Find student by student number error:", error);
        throw error;
    }
};

export const getStudentsHaveBusAssigned = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/get-student-have-bus-assigned`
        );
        return res.data;
    } catch (error) {
        console.error("Get students with bus error:", error);
        throw error;
    }
};

export const updateStudent = async ({ parentPhone, parentInfo }) => {
    try {
        const res = await axios.put(
            `${BASE_URL}/update-student/${parentPhone}`,
            { parentInfo }
        );
        return res.data;
    } catch (error) {
        console.error("Update student error:", error);
        throw error;
    }
};

export const updateStudentBus = async (studentId, busId) => {
    try {
        const res = await axios.put(`${BASE_URL}/student/${studentId}/bus`, {
            busId,
        });
        return res.data;
    } catch (error) {
        console.error("Update student bus error:", error);
        throw error;
    }
};

//  MESSAGE
export const sendMessage = async (data) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/send-message/${data.userId}`,
            data
        );
        return res.data;
    } catch (error) {
        console.error("Send message error:", error);
        throw error;
    }
};

export const sendMessageToRole = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/send-message-to-role`, data);
        return res.data;
    } catch (error) {
        console.error("Send message to role error:", error);
        throw error;
    }
};

export const getMessageHistory = async (userId) => {
    try {
        const res = await axios.get(`${BASE_URL}/message-history/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Get message history error:", error);
        throw error;
    }
};

export const deleteMessage = async (userId, messageId) => {
    try {
        const res = await axios.delete(
            `${BASE_URL}/message/${userId}/${messageId}`
        );
        return res.data;
    } catch (error) {
        console.error("Delete message error:", error);
        throw error;
    }
};

//  REPORT
export const sendReport = async (reportData) => {
    try {
        const res = await axios.post(`${BASE_URL}/report`, reportData);
        return res.data;
    } catch (error) {
        console.error("Send report error:", error);
        throw error;
    }
};
