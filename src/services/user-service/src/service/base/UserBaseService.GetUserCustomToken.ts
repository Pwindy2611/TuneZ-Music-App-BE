import {inject, injectable} from "tsyringe";
import {UserBaseRepository} from "../../repository/UserBaseRepository.js";
import {IUserBaseService} from "../../interface/service/IUserBaseService.js";
import {IUserBaseRepository} from "../../interface/repository/IUserBaseRepository.js";
@injectable()
export class GetUserCustomTokenService {
    constructor(
        @inject(UserBaseRepository) private repository: IUserBaseRepository) {}

    execute: IUserBaseService["getUserCustomToken"] = async (email, cookie) => {
        try {
            const userIdentifier = cookie || email;
            return userIdentifier ? await this.repository.getUserCustomToken(userIdentifier) : null;
        }catch (error) {
            throw new Error(`Failed to get user custom token: ${error.message}`);
        }
    }
}