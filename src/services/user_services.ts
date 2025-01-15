import { equalTo, get, orderByChild, query, ref, remove, set } from "firebase/database";
import { database } from '../config/firebase/firebase_config';

// Thêm người dùng
export const createUserService = async (user: { email: string; username: string; authentication: { salt: string; password: string}}) => {
    try {
        // Tạo userId dựa trên timestamp
        const userId = `user_${Date.now()}`;
        const userRef = ref(database, `users/${userId}`);
        var sessionToken = null
        // Lưu thông tin người dùng vào Firebase
        await set(userRef, {
            userId,
            ...user,
            sessionToken
        });

        return userId; // Trả về userId để dùng khi cần
    } catch (error) {
        throw new Error("Error creating new user: " + error.message);
    }
};
// Xóa người dùng theo ID
export const deleteUserService = async (userId: string) => {
    const userRef = ref(database, `users/${userId}`);
    await remove(userRef);
};

// Lấy danh sách tất cả người dùng
export const getAllUsersService = async () => {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
};

export const getUserByEmailService = async (email: string) => {
    try{
        const userRef = ref(database, 'users')
        const userQuery = query(userRef, orderByChild("email"), equalTo(email));
        const snapshot = await get(userQuery);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            // Lấy key đầu tiên (userId) và trả về dữ liệu người dùng
            const userId = Object.keys(userData)[0]; // Lấy userId (ví dụ: 'user_1736872537646')
            return userData[userId]; // Trả về dữ liệu của user
        } else {
            return null; // Không tìm thấy người dùng
        }
    } catch (error) {
        throw new Error("Error fetching user by email: " + error.message);
    }
}

