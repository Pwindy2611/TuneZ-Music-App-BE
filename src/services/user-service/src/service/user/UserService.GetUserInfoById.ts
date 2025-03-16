import { IUserService } from "../../interface/service/IUserService.js";
import { UserBaseService } from "../base/UserBaseService.js";
import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../repository/UserRepository.js";

@injectable()
export class GetUserInfoByIdService {
    constructor(@inject("UserRepository") private repository: UserRepository) {}

    execute: IUserService["getUserInfoById"] = async (userId) => {
        try {
            const user = await UserBaseService.getUserById.execute(userId);
            if (user === null) {
                return Promise.reject(new Error('User not found'));
            }
            const followerCount = await this.repository.getFollowerCount(userId);
            const followingCount = await this.repository.getFollowingCount(userId);
            const playlists = await this.repository.getPlaylist(userId);

            if(!playlists || playlists.length === 0) {
                return {
                    id: user._id,
                    name: user.username,
                    email: user.email,
                    profilePicture: user.profilePictureUrl,
                    followerCount,
                    followingCount
                }
            }

            return {
                id: user._id,
                name: user.username,
                email: user.email,
                profilePicture: user.profilePictureUrl,
                followerCount,
                followingCount,
                playlists: playlists.map((playlist: { title: string; coverImg: string; musicCount: number }) => ({
                    title: playlist.title,
                    coverImg: playlist.coverImg,
                    musicCount: playlist.musicCount
                }))
            };
        } catch (error) {
            throw error;
        }
    }
}