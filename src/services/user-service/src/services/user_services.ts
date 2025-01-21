import { database } from '../config/firebase/firebase_config';


// Thêm người dùng
export const createUserService = async (user: {userId: string; email: string; username: string; authentication: { salt: string; password: string}}) => {
    try {
        // Tạo userId dựa trên timestamp
        const userRef = database.ref(`users/${user.userId}`);
        let sessionToken = null;
        let role = "listener";
        // Lưu thông tin người dùng vào Firebase
        await userRef.set({
            ...user,
            role,
            sessionToken
        });

        return user.userId; // Trả về userId để dùng khi cần
    } catch (error) {
        throw new Error("Error creating new user: " + error.message);
    }
};

// Lấy danh sách tất cả người dùng
export const getAllUsersService = async () => {
    const usersRef = database.ref('users');
    const snapshot = await usersRef.get();
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
};

export const getUserByEmailService = async (email: string) => {
    try{
        const userRef = database.ref('users')
        const snapshot = await userRef.orderByChild('email').equalTo(email).once('value');

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

    