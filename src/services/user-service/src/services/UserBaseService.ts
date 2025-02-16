import { createUserService } from "./UserBaseService.CreateUser.js";
import { loginUserGoogle } from "./UserBaseService.loginUserGoogle.js";
import { getAllUsersService } from "./UserBaseService.GetAllUsers.js";
import { getUserByEmailService } from "./UserBaseService.GetUserByEmail.js";

export const UserBaseService = {
    createUserService,
    loginUserGoogle,
    getAllUsersService,
    getUserByEmailService
}
