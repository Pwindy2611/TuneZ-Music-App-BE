import {container} from "tsyringe";
import {GetUserInfoByIdService} from "./UserService.GetUserInfoById.js";
import {UpdateSubscriptionTypeService} from "./UserService.UpdateSubscriptionType.js";
import {GetUserLibraryService} from "./UserService.GetUserLibrary.js";


export const UserService = {
    getUserInfoById: container.resolve(GetUserInfoByIdService),
    updateSubscriptionType: container.resolve(UpdateSubscriptionTypeService),
    getUserLibrary: container.resolve(GetUserLibraryService),
}
