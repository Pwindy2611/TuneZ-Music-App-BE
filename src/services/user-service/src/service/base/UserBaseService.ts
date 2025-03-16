import "reflect-metadata"
import { container } from "tsyringe";
import { UserBaseRepository } from "../../repository/UserBaseRepository.js";
import { CreateUserService } from "./UserBaseService.CreateUser.js";
import { GetAllUsersService } from "./UserBaseService.GetAllUsers.js";
import { GetUserByEmailService } from "./UserBaseService.GetUserByEmail.js";
import { GetUserCustomTokenService } from "./UserBaseService.GetUserCustomToken.js";
import {DeleteUserService} from "./UserBaseService.DeleteUser.js";
import {GetUserByIdService} from "./UserBaseService.GetUserById.js";

container.register("UserBaseRepository", {
    useClass: UserBaseRepository,
});

export const UserBaseService = {
    createUserService: container.resolve(CreateUserService),
    deleteUserService: container.resolve(DeleteUserService),
    getAllUsersService: container.resolve(GetAllUsersService),
    getUserByEmailService: container.resolve(GetUserByEmailService),
    getUserCustomToken: container.resolve(GetUserCustomTokenService),
    getUserById: container.resolve(GetUserByIdService),
};