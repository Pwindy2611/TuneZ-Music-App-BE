import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository.js";
import {IUserService} from "../../interface/service/IUserService.js";

@injectable()
export class GetUserLibraryService {
    constructor(@inject("UserRepository") private repository: UserRepository) {}

    execute: IUserService['getUserLibrary'] = async (userId) => {
        try {
            return await this.repository.getUserLibrary(userId);
        } catch (error) {
            throw error;
        }
    }
}