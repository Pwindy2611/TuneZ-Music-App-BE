import {container} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository.js";
import {GetUserInfoByIdService} from "./UserService.GetUserInfoById.js";

container.register("UserRepository", {
    useClass: UserRepository,
});

export const UserService = {
    getUserInfoById: container.resolve(GetUserInfoByIdService),
}
