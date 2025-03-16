import {IUserBaseService} from "../../interface/service/IUserBaseService.js";
import {inject, injectable} from "tsyringe";
import {UserBaseRepository} from "../../repository/UserBaseRepository.js";
@injectable()
export class DeleteUserService {
    constructor(
        @inject("UserBaseRepository") private repository: UserBaseRepository){}

    execute: IUserBaseService['deleteUser'] = async (userId: string) => {
        try {
            return await this.repository.deleteUser(userId);
        }catch (e) {
            throw e.message;
        }
    }
}