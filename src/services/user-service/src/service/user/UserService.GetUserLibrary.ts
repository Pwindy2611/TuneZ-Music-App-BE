import {inject, injectable} from "tsyringe";
import {UserRepository} from "../../repository/UserRepository.js";
import {IUserService} from "../../interface/service/IUserService.js";
import {IUserRepository} from "../../interface/repository/IUserRepository.js";

@injectable()
export class GetUserLibraryService {
    constructor(@inject(UserRepository) private repository: IUserRepository) {}

    execute: IUserService['getUserLibrary'] = async (userId) => {
        try {
            return await this.repository.getUserLibrary(userId);
        } catch (error) {
            throw error;
        }
    }
}