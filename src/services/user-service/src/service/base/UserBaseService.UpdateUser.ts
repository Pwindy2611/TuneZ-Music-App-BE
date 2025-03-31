import {inject, injectable} from "tsyringe";
import {UserBaseRepository} from "../../repository/UserBaseRepository.js";
import {IUserBaseRepository} from "../../interface/repository/IUserBaseRepository.js";

@injectable()
export class UpdateUserService {
    constructor(
        @inject(UserBaseRepository) private repository: IUserBaseRepository) {}

    execute: IUserBaseRepository['updateUser'] = async (user) => {
        try {
            return await this.repository.updateUser(user);
        }catch (error) {
            console.error("Error updating user:", error);
            throw error
        }
    }
}