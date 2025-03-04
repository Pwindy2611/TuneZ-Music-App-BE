import {IUserBaseRepository} from "../interface/IUserBaseRepository.js";
import {IUser} from "../interface/IUser.js";
import {UserDto} from "../dto/UserDto.js";
import {auth, database} from "../config/firebase/FireBaseConfig.js";
import {injectable} from "tsyringe";

@injectable()
export class UserBaseRepository implements IUserBaseRepository {
    async createUser(user: IUser): Promise<void> {
        const userRef = database.ref(`users/${user._id}`);
        return await userRef.set(user);
    }

    async getAllUsers(): Promise<UserDto[] | null> {
        const usersRef = database.ref('users');
        const snapshot = await usersRef.get();
        if (!snapshot.exists()) {
            return null;
        }

        const usersData = snapshot.val();
        return Object.values(usersData).map(user => {
            const typedUser = user as IUser;
            return new UserDto(typedUser);
        });

    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const userRef = database.ref('users');
        const snapshot = await userRef.orderByChild('email').equalTo(email).once('value');

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userId = Object.keys(userData)[0];
            return userData[userId] as IUser;
        } else {
            return null;
        }
    }

    async getUserCustomToken(userIdentifier: string): Promise<string | null> {
        const isEmail = /\S+@\S+\.\S+/.test(userIdentifier);

        if (isEmail) {
            const user = await auth.getUserByEmail(userIdentifier);
            return await auth.createCustomToken(user.uid);
        } else {
            const session = await auth.verifySessionCookie(userIdentifier);
            return await auth.createCustomToken(session?.uid);
        }
    }
}