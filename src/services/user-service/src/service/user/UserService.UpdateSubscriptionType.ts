import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository.js";
import {IUserService} from "../../interface/service/IUserService.js";

@injectable()
export class UpdateSubscriptionTypeService {
    constructor(@inject("UserRepository") private repository: UserRepository) {}
    execute: IUserService["updateSubscriptionType"] = async (userId) => {
        try {
            return await this.repository.updateSubscriptionType(userId);
        }catch (error) {
            throw error;
        }
    }
}