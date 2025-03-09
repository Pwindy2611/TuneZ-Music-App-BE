export interface IHistoryUserService {
    getUserHistory(userId: string): Promise<string[]>;
    clearUserHistory(userId: string): Promise<void>;
}