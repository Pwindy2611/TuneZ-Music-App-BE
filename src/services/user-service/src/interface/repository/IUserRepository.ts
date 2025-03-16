export interface IUserRepository{
    getFollowerCount(userId: string): Promise<any>;
    getFollowingCount(userId: string): Promise<any>;
    getPlaylist(userId: string): Promise<any>;
}