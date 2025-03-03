import { IPlaylistCacheService } from "../interface/IPlaylistCacheService.js";
import { Timestamp } from "firebase-admin/firestore";
import {cacheRepo} from "../repository/PlaylistCacheRepository.js";

class PlaylistCacheService implements IPlaylistCacheService {
    private readonly COLLECTION_NAME = "playlistCache";
    private readonly EXPIRY_HOURS = 24;

    async cleanExpiredCache(): Promise<void> {
        try {
            await cacheRepo.cleanExpiredCache(this.COLLECTION_NAME);
        } catch (error) {
            console.error(`Error cleaning expired cache: ${error.message}`);
            throw new Error(`Error cleaning expired cache: ${error.message}`);
        }
    }

    getCacheId(userId: string, playlistValue: string, playlistType?: string): string {
        return playlistType ? `${userId}_${playlistValue}_${playlistType}` : `${userId}_${playlistValue}`;
    }

    async getFromCache(userId: string, playlistValue: string, playlistType?: string): Promise<any | null> {
        try {
            const cacheId = this.getCacheId(userId, playlistValue, playlistType);

            const cacheDoc = await cacheRepo.getFromCache(userId, cacheId, this.COLLECTION_NAME);

            if (!cacheDoc.exists) {
                return null;
            }

            const cacheData = cacheDoc.data();
            const expiryTime = cacheData?.expiryTime.toDate();
            const currentTime = new Date();

            if (currentTime > expiryTime) {
                return null;
            }

            return cacheData?.playlistData;
        } catch (error) {
            throw new Error(`Error getting from cache: ${error.message}`);
        }
    }

    async saveToCache(userId: string, playlistValue: string, playlistData: any, playlistType?: string): Promise<void> {
        try {
            const cacheId = this.getCacheId(userId, playlistValue, playlistType);

            const expiryTime = new Date();
            expiryTime.setHours(expiryTime.getHours() + this.EXPIRY_HOURS);
            const plainPlaylistData = JSON.parse(JSON.stringify(playlistData));

            const newCacheData = {
                playlistValue,
                playlistData: plainPlaylistData,
                createdAt: Timestamp.now(),
                expiryTime: Timestamp.fromDate(expiryTime)
            }

            await cacheRepo.saveToCache(userId, cacheId, newCacheData, this.COLLECTION_NAME);
        } catch (error) {
            throw new Error(`Error saving to cache: ${error.message}`);
        }
    }
}

export default new PlaylistCacheService();