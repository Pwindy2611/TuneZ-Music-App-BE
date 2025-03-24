import {IUserRepository} from "../interface/repository/IUserRepository.js";
import {followServiceClient, playlistServiceClient} from "../grpc/client/GrpcClients.js";
import {injectable} from "tsyringe";
import {database} from "../config/firebase/FireBaseConfig.js";
import {SubscriptionType} from "../enum/SubscriptionType.js";

@injectable()
export class UserRepository implements IUserRepository {
    async getFollowerCount(userId: string): Promise<any> {
        return await new Promise<number>((resolve, reject) => {
            followServiceClient.getFollowerCount({ userId }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.count);
            });
        });

    }

    async getFollowingCount(userId: string): Promise<any> {
        return await new Promise<number>((resolve, reject) => {
            followServiceClient.getFollowingCount({ userId }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.count);
            });
        });
    }

    async getPlaylist(userId: string): Promise<any> {
        return await new Promise<any[]>((resolve, reject) => {
            playlistServiceClient.getUserPlaylist({ userId }, (err: any, response: any) => {
                if (err) {
                    reject(new Error(`gRPC error: ${err.message}`));
                    return;
                }
                resolve(response.playlists);
            });
        });
    }

    async updateSubscriptionType(userId: string): Promise<boolean> {
        const userRef = database.ref(`users/${userId}`);
        const userSnapshot = await userRef.get();
        const user = userSnapshot.val();
        user.account.subscriptionType = SubscriptionType.PREMIUM;
        await userRef.update({ account: user.account });
        return true;
    }
}