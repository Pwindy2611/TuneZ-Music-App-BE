
export const generateId = () => {
    const timestamp = Date.now(); // Lấy thời gian hiện tại tính bằng milliseconds
    const randomSuffix = Math.floor(Math.random() * 1000); // Thêm một phần ngẫu nhiên để tránh trùng lặp
    return `${timestamp}${randomSuffix}`; // Ghép timestamp với số ngẫu nhiên
}
