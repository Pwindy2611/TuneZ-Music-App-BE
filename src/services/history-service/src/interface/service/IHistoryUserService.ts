export interface IHistoryUserService {
    getUserHistory(userId: string): Promise<string[]>;
    getMusicIdsByUserHistory(userId: string, limit:number): Promise<string[]>;
    clearUserHistory(userId: string): Promise<void>;
}