import {IUserRepository} from "../interface/repository/IUserRepository.js";
import {followServiceClient, playlistServiceClient} from "../grpc/client/GrpcClients.js";
import {injectable} from "tsyringe";

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
}