export interface ILoveUserService {
    getLovedMusic(userid: string): Promise<string[]>;
    getLovedCount(userId: string): Promise<number>;
    getMusicIdsByUserLove(userId: string, limit: number): Promise<string[]>;
    isLoved(userId:string, musicId: string): Promise<boolean>;
}