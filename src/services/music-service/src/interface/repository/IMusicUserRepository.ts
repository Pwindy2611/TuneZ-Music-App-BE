export interface IMusicUserRepository {
    getMusicHistory(userId: string): Promise<any>;
    getMusicLove(userId: string): Promise<any>;
    isUserExist(userId: string): Promise<boolean>;
}