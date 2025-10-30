export const normalizeString = (str) => {
    return str
        ?.normalize("NFD") // tách dấu khỏi ký tự
        .replace(/[\u0300-\u036f]/g, "") // xoá dấu
        .replace(/đ/g, "d") // thay 'đ' -> 'd'
        .replace(/Đ/g, "D") // thay 'Đ' -> 'D'
        .replace(/\s+/g, "") // xoá khoảng trắng
        .toLowerCase(); // đưa về chữ thường
};
