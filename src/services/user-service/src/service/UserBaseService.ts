import "reflect-metadata"
import { container } from "tsyringe";
import { CreateUserService } from "./UserBaseService.CreateUser.js";
import { GetAllUsersService } from "./UserBaseService.GetAllUsers.js";
import { GetUserByEmailService } from "./UserBaseService.GetUserByEmail.js";
import { UserBaseRepository } from "../repository/UserBaseRepository.js";

container.register("UserBaseRepository", {
    useClass: UserBaseRepository,
});

export const UserBaseService = {
    createUserService: container.resolve(CreateUserService),
    getAllUsersService: container.resolve(GetAllUsersService),
    getUserByEmailService: container.resolve(GetUserByEmailService),
};