import {FollowCreateDto} from "../dto/request/FollowCreateDto";

export interface IFollowBaseService {
    addFollow(follow : FollowCreateDto): Promise<void>;
    unFollow(userId: string, followingId: string): Promise<void>;
}