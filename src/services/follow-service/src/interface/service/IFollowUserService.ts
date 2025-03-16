import {FollowResponseDto} from "../../dto/response/FollowResponseDto";

export interface IFollowUserService {
    getFollowingCount(userId: string): Promise<number>;
    getFollowerCount(userId: string): Promise<number>;
    getFollowingUsers(userId: string): Promise<FollowResponseDto[]>;
    getFollowers(userId: string): Promise<FollowResponseDto[]>;
}