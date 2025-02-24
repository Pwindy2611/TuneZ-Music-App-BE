// UserBaseService.CreateUser.ts
import { injectable, inject } from "tsyringe";
import { IUserBaseRepository } from "../interface/IUserBaseRepository.js";
import { IUser } from "../interface/IUser.js";
import { UserRole } from "../enum/UserRole.js";
import { SubscriptionType } from "../enum/SubscriptionType.js";
import dotenv from "dotenv";
import {IUserBaseService} from "../interface/IUserBaseService.js";

dotenv.config();

@injectable()
export class CreateUserService implements IUserBaseService<IUser, string> {
    constructor(
        @inject("UserBaseRepository") private repository: IUserBaseRepository
    ) {}

    execute = async (user: IUser): Promise<string> => {
        try {
            const role = UserRole.LISTENER;
            const sessionToken = null;
            let profilePictureUrl = process.env.DEFAULT_USER_PROFILE_PATH;

            if (user.profilePictureUrl) {
                profilePictureUrl = user.profilePictureUrl;
            }

            const account = {
                subscriptionType: SubscriptionType.NORMAL,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            };

            const userData: IUser = {
                ...user,
                ...account,
                role,
                profilePictureUrl,
                sessionToken,
            };

            await this.repository.createUser(userData);
            return user._id;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error("Error creating new user: " + error.message);
            } else {
                throw new Error("Error creating new user: Unknown error");
            }
        }
    }
}
