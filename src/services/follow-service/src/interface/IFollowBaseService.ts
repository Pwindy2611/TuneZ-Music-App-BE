import {GetFollowResponseDto} from "../dto/GetFollowResponseDto";
import {FollowUserDto} from "../dto/FollowUserDto";

export interface IFollowBaseService {
    followUser(follow : FollowUserDto): Promise<string>;
    getFollowingCount(userId: string): Promise<number>;
    getFollowersCount(userId: string): Promise<number>;
    getFollowingUsers(userId: string): Promise<GetFollowResponseDto[]>;
    getFollowers(userId: string): Promise<GetFollowResponseDto[]>;
}