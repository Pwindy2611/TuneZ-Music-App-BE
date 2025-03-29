import {IUserBaseRepository} from "../interface/repository/IUserBaseRepository.js";
import {IUser} from "../interface/object/IUser.js";
import {UserDto} from "../dto/response/UserDto.js";
import {auth, database, firestore} from "../config/firebase/FireBaseConfig.js";
import {injectable} from "tsyringe";
import {SubscriptionType} from "../enum/SubscriptionType.js";
import {UserRole} from "../enum/UserRole.js";

@injectable()
export class UserBaseRepository implements IUserBaseRepository {
    async createUser(user: IUser): Promise<void> {
        const userData: IUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            role: UserRole.LISTENER,
            profilePictureUrl: user.profilePictureUrl,
            account: {
                subscriptionType: SubscriptionType.NORMAL,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            }
        }
        const userRef = database.ref(`users/${user._id}`);
        await userRef.set(userData);

        const userFirestore = firestore.collection('users').doc(user._id);
        await userFirestore.set({
            followingCount: 0,
            followerCount: 0,
        });
    }

    async deleteUser(userId: string): Promise<void> {
        await auth.deleteUser(userId);

        const userRef = database.ref(`users/${userId}`);
        await userRef.remove();

        const userFirestore = firestore.collection('users').doc(userId);
        await userFirestore.delete();
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

    async getUserById(userId: string): Promise<IUser | null> {
        const userRef = database.ref(`users/${userId}`);
        const snapshot = await userRef.get();
        if (!snapshot.exists()) {
            return null;
        }
        return snapshot.val() as IUser;
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