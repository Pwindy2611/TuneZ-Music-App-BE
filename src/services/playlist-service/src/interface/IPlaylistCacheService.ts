export interface IPlaylistCacheService {
    getFromCache(userId: string, playlistValue: string, playlistType?: string): Promise<any | null>;
    saveToCache(userId: string, playlistValue: string, playlistData:any, playlistType?: string): Promise<void>
    getCacheId(userId: string, playlistValue: string, playlistType?: string): string;
    cleanExpiredCache(): Promise<void>;
}