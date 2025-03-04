import {GetFollowResponseDto} from "../dto/GetFollowResponseDto";
import {Follow} from "../dto/Follow";

export interface IFollowBaseService {
    addFollow(follow : Follow): Promise<void>;
    getFollowingCount(userId: string): Promise<number>;
    getFollowersCount(userId: string): Promise<number>;
    getFollowingUsers(userId: string): Promise<GetFollowResponseDto[]>;
    getFollowers(userId: string): Promise<GetFollowResponseDto[]>;
}