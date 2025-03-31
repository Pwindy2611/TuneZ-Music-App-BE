import "reflect-metadata"
import { container } from "tsyringe";
import { CreateUserService } from "./UserBaseService.CreateUser.js";
import { GetAllUsersService } from "./UserBaseService.GetAllUsers.js";
import { GetUserByEmailService } from "./UserBaseService.GetUserByEmail.js";
import { GetUserCustomTokenService } from "./UserBaseService.GetUserCustomToken.js";
import {DeleteUserService} from "./UserBaseService.DeleteUser.js";
import {GetUserByIdService} from "./UserBaseService.GetUserById.js";
import {UpdateUserService} from "./UserBaseService.UpdateUser.js";

export const UserBaseService = {
    createUser: container.resolve(CreateUserService),
    deleteUser: container.resolve(DeleteUserService),
    updateUser: container.resolve(UpdateUserService),
    getAllUsers: container.resolve(GetAllUsersService),
    getUserByEmail: container.resolve(GetUserByEmailService),
    getUserCustomToken: container.resolve(GetUserCustomTokenService),
    getUserById: container.resolve(GetUserByIdService),
};