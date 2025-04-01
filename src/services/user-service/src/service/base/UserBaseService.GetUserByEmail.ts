import { injectable, inject } from "tsyringe";
import {IUserBaseService} from "../../interface/service/IUserBaseService.js";
import {UserBaseRepository} from "../../repository/UserBaseRepository.js";
import {IUserBaseRepository} from "../../interface/repository/IUserBaseRepository.js";
@injectable()
export class GetUserByEmailService{
    constructor(
        @inject(UserBaseRepository) private repository: IUserBaseRepository) {}

    execute: IUserBaseService["getUserByEmail"] = async (email) => {
         try {
             return await this.repository.getUserByEmail(email);
         }catch (error) {
             throw new Error("Failed to retrieve user by email");
         }
    }
}