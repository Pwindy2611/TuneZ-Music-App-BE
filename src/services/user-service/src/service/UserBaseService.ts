import "reflect-metadata"
import { container } from "tsyringe";
import { UserBaseRepository } from "../repository/UserBaseRepository.js";
import { CreateUserService } from "./UserBaseService.CreateUser.js";
import { GetAllUsersService } from "./UserBaseService.GetAllUsers.js";
import { GetUserByEmailService } from "./UserBaseService.GetUserByEmail.js";
import { GetUserCustomTokenService } from "./UserBaseService.GetUserCustomToken.js";

container.register("UserBaseRepository", {
    useClass: UserBaseRepository,
});

export const UserBaseService = {
    createUserService: container.resolve(CreateUserService),
    getAllUsersService: container.resolve(GetAllUsersService),
    getUserByEmailService: container.resolve(GetUserByEmailService),
    getUserCustomToken: container.resolve(GetUserCustomTokenService)
};