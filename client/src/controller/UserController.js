import * as UserService from "../service/UserService.js";

export const fetchUserByRole = async (role) => {
    try {
        const res = await UserService.getUserByRole(role);
        if (res?.success) return res?.data;
    } catch (error) {
        return error;
    }
};

export const fetchUserById = async (userId) => {
    try {
        const result = await UserService.getUserById(userId);

        console.log(result?.data?.[0]);
        return result?.data?.[0];
    } catch (error) {
        return error;
    }
};

export const updateDriver = async (userId, driverUpdate) => {
    try {
        const res = await UserService.updateDriverInfo(userId, driverUpdate);
        return res;
    } catch (error) {
        return error;
    }
};

export const getDriverData = async (valueFilter, searchValue) => {
    try {
        let res;
        valueFilter
            ? (res = await UserService.findDriverByStatus(searchValue))
            : (res = await UserService.findDriverByDriverNumber(searchValue));
        console.log("res: ", res);

        if (res?.success && res?.user) {
            return res;
        } else {
            return null;
        }
    } catch (error) {
        return error;
    }
};

export const findStudents = async (valueFilter, searchValue) => {
    try {
        let res;
        valueFilter
            ? (res = await UserService.findStudentsByGrade(searchValue))
            : (res = await UserService.findStudentsByStudentNumber(
                  searchValue
              ));

        if (res?.success && res?.students) {
            return res;
        } else {
            return null;
        }
    } catch (error) {
        return error;
    }
};
export const getStudentsHaveBus = async () => {
    try {
        const res = await UserService.getStudentsHaveBusAssigned();
        if (res?.success) {
            return res;
        }
    } catch (error) {
        return error;
    }
};

export const updateStudentInfo = async (studentUpdate) => {
    try {
        const res = await UserService.updateStudent({
            parentPhone: studentUpdate.parentPhone,
            parentInfo: {
                children: [
                    {
                        studentNumber: studentUpdate.studentNumber,
                        name: studentUpdate.fullName,
                        grade: studentUpdate.className,
                        status: studentUpdate.status,
                        registeredBus: studentUpdate.registeredBus || null,
                    },
                ],
            },
        });

        return res;
    } catch (error) {
        return error;
    }
};
export const updateStudentAssignedBus = async (studentId, busId) => {
    try {
        const res = await UserService.updateStudentBus(studentId, busId);
        if (res.success) return res;
    } catch (error) {
        return error;
    }
};
