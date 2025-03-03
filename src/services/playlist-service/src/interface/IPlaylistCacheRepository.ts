export interface IPlaylistCacheRepository{
    saveToCache(userId: string, cacheId: string, playlistData: any, collectionName: string): Promise<void>;
    getFromCache(userId: string,cacheId: string, collectionName: string): Promise<any>
    cleanExpiredCache(collectionName: string): Promise<void>;
}