import {IUserBaseService} from "../interface/IUserBaseService.js";
import { injectable, inject } from "tsyringe";
import {IUserBaseRepository} from "../interface/IUserBaseRepository.js";
import {UserDto} from "../dto/UserDto.js";

@injectable()
export class GetAllUsersService implements IUserBaseService<void, UserDto[] | null> {
    constructor(
        @inject("UserBaseRepository") private repository: IUserBaseRepository
    ){}
    execute = async (): Promise<UserDto[] | null> => {
        try {
            return await this.repository.getAllUsers();
        }catch (error) {
            throw new Error(`Error while getting all users: ${error.message}`);
        }
    }
}

