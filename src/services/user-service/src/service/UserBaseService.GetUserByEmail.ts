import { injectable, inject } from "tsyringe";
import {IUserBaseRepository} from "../interface/IUserBaseRepository.js";
import {IUserBaseService} from "../interface/IUserBaseService.js";
import {IUser} from "../interface/IUser.js";
@injectable()
export class GetUserByEmailService implements IUserBaseService<string, IUser | null>{
    constructor(@inject("UserBaseRepository") private repository: IUserBaseRepository) {
    }

    execute = async (email: string): Promise<IUser | null> => {
         try {
             return await this.repository.getUserByEmail(email);
         }catch (error) {
             throw new Error("Failed to retrieve user by email");
         }
    }
}