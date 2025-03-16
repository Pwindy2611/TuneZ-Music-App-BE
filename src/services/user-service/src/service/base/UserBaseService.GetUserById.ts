import { injectable, inject } from "tsyringe";
import {IUserBaseService} from "../../interface/service/IUserBaseService.js";
import {UserBaseRepository} from "../../repository/UserBaseRepository.js";
@injectable()
export class GetUserByIdService{
    constructor(@inject("UserBaseRepository") private repository: UserBaseRepository) {
    }

    execute: IUserBaseService["getUserById"] = async (userId) => {
        try {
            return await this.repository.getUserById(userId);
        }catch (error) {
            throw new Error("Failed to retrieve user by email");
        }
    }
}