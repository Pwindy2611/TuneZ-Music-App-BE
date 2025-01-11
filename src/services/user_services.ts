import { get, ref, remove, set } from "firebase/database";
import { database } from '../config/firebase/firebase_config';

// Thêm người dùng
export const createUserService = async (userId: string, name: string, email: string, password: string) => {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, {
        id: userId,
        name,
        email,
        password,
    });
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

// Xóa người dùng theo ID
export const deleteUserService = async (userId: string) => {
    const userRef = ref(database, `users/${userId}`);
    await remove(userRef);
};