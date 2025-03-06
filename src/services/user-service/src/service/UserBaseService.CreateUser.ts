import { injectable, inject } from "tsyringe";
import { IUser } from "../interface/IUser.js";
import { UserRole } from "../enum/UserRole.js";
import { SubscriptionType } from "../enum/SubscriptionType.js";
import dotenv from "dotenv";
import {IUserBaseService} from "../interface/IUserBaseService.js";
import {UserBaseRepository} from "../repository/UserBaseRepository.js";

dotenv.config();

@injectable()
export class CreateUserService {
    constructor(
        @inject("UserBaseRepository") private repository: UserBaseRepository) {}

    execute: IUserBaseService["createUser"] = async (user) => {
        try {
            const role = UserRole.LISTENER;
            const sessionToken = null;
            let profilePictureUrl = process.env.DEFAULT_USER_PROFILE_PATH;

            if (user.profilePictureUrl && user.profilePictureUrl.trim()!== "") {
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
