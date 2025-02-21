import {IFollowing} from "./IFollowing";

export interface IFollowBaseService {
    followUser(follow : IFollowing): Promise<string>;
}