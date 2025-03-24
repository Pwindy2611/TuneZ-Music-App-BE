import {container} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository.js";
import {GetUserInfoByIdService} from "./UserService.GetUserInfoById.js";
import {UpdateSubscriptionTypeService} from "./UserService.UpdateSubscriptionType.js";

container.register("UserRepository", {
    useClass: UserRepository,
});

export const UserService = {
    getUserInfoById: container.resolve(GetUserInfoByIdService),
    updateSubscriptionType: container.resolve(UpdateSubscriptionTypeService)
}
