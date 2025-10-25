import * as UserService from "../service/UserService.js";

export const fetchUserByRole = async (role) => {
  try {
    const res = await UserService.getUserByRole(role);
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserById = async (userId) => {
  try {
    const result = await UserService.getUserById(userId);

    console.log(result?.data?.[0]);
    return result?.data?.[0];
  } catch (error) {
    console.log(error);
  }
};

export const updateDriver = async (userId, driverUpdate) => {
  try {
    const res = await UserService.updateDriverInfo(userId, driverUpdate);
    console.log(res?.data);
  } catch (error) {
    console.error(error);
    toast.error(error);
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
      return res?.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Search driver error:", error);
  }
};

export const findStudents = async (valueFilter = true, searchValue) => {
  try {
    let res;
    valueFilter
      ? (res = await UserService.findStudentsByGrade(searchValue))
      : (res = await UserService.findStudentsByStudentNumber(searchValue));

    if (res?.success && res?.students) {
      return res?.students;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Search student error:", error);
  }
};

export const updateStudentInfo = async (parentPhone, parentInfo) => {
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

    if (res?.success) {
      return studentUpdate;
    }
  } catch (error) {
    console.error(error);
    toast.error("Có lỗi xảy ra khi cập nhật");
  }
};
