export interface ILoveUserService {
    getLovedMusic(userid: string): Promise<string[]>;
    getLovedCount(userId: string): Promise<number>;
    isLoved(userId:string, musicId: string): Promise<boolean>;
}