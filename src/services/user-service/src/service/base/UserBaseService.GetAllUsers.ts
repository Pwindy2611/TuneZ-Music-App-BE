import {IUserBaseService} from "../../interface/service/IUserBaseService.js";
import { injectable, inject } from "tsyringe";
import {UserBaseRepository} from "../../repository/UserBaseRepository.js";
import {IUserBaseRepository} from "../../interface/repository/IUserBaseRepository.js";

@injectable()
export class GetAllUsersService {
    constructor(
        @inject(UserBaseRepository) private repository: IUserBaseRepository) {}
    execute: IUserBaseService["getAllUsers"] = async () => {
        try {
            return await this.repository.getAllUsers();
        }catch (error) {
            throw new Error(`Error while getting all users: ${error.message}`);
        }
    }
}

