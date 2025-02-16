import { supabase } from "../config/supabase/SupbaBaseClient.js";
import { UserDto } from "../dto/UserDto.js";
import {IUserBaseService} from "../interface/IUserBaseService.js";

/**
 * Đăng nhập bằng Google với Supabase
 * @param idToken ID Token từ Google
 * @returns UserDto hoặc lỗi nếu không thành công
 */

export const loginUserGoogle : IUserBaseService["loginUserGoogle"]= async (idToken: string): Promise<UserDto> => {
    if (!idToken) {
        throw new Error("Thiếu idToken");
    }

    try {
        // Xác thực với Google bằng Supabase
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: idToken,
        });

        if (error) {
            return Promise.reject(new Error("Lỗi xác thực với Supabase: " + error.message));
        }

        const user = data?.user;
        if (!user) {
            return Promise.reject(new Error("Không tìm thấy thông tin người dùng."));
        }

        // Tạo đối tượng UserDto
        return new UserDto(
            user.id,
            user.email || "",
            user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown",
            user.role || "user",
            data.session?.access_token || null
        );
    } catch (error: any) {
        throw new Error("Lỗi khi đăng nhập Google: " + error.message);
    }
};
