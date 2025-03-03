import {inject, injectable} from "tsyringe";
import {IUserBaseRepository} from "../interface/IUserBaseRepository.js";
import {UserBaseRepository} from "../repository/UserBaseRepository.js";
@injectable()
export class GetUserCustomTokenService {
    constructor(@inject("UserBaseRepository") private repository: UserBaseRepository) {}

    execute: IUserBaseRepository["getUserCustomToken"] = async (email) => {
        try {
            return await this.repository.getUserCustomToken(email);
        }catch (error) {
            throw new Error("Failed to get user custom token");
        }
    }
}