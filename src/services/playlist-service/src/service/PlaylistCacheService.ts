import { IPlaylistCacheService } from "../interface/IPlaylistCacheService.js";
import { firestore } from "../config/firebase/FireBaseConfig.js";
import { Timestamp } from "firebase-admin/firestore";

class PlaylistCacheService implements IPlaylistCacheService {
    private readonly COLLECTION_NAME = "playlistCache";
    private readonly EXPIRY_HOURS = 24;

    async cleanExpiredCache(): Promise<void> {
        try {
            const currentTime = Timestamp.now();
            const usersSnapshot = await firestore.collection('users').get();

            const batchOperations = [];
            let currentBatch = firestore.batch();
            let operationCount = 0;

            const BATCH_LIMIT = 500;

            for (const userDoc of usersSnapshot.docs) {
                const userId = userDoc.id;

                const expiredCachesSnapshot = await firestore
                    .collection('users')
                    .doc(userId)
                    .collection(this.COLLECTION_NAME)
                    .where('expiryTime', '<', currentTime)
                    .get();

                expiredCachesSnapshot.docs.forEach(cacheDoc => {
                    currentBatch.delete(cacheDoc.ref);
                    operationCount++;

                    if (operationCount >= BATCH_LIMIT) {
                        batchOperations.push(currentBatch.commit());
                        currentBatch = firestore.batch();
                        operationCount = 0;
                    }
                });
            }

            if (operationCount > 0) {
                batchOperations.push(currentBatch.commit());
            }

            if (batchOperations.length > 0) {
                await Promise.all(batchOperations);
                console.log(`Cleaned expired caches from ${batchOperations.length} batches`);
            } else {
                console.log("No expired caches to clean");
            }
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

            const cacheDoc = await firestore
                .collection('users')
                .doc(userId)
                .collection(this.COLLECTION_NAME)
                .doc(cacheId)
                .get();

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

    async saveToCache(userId: string, playlistValue: string, playlistData: any, playlistType?: string): Promise<any | null> {
        try {
            const cacheId = this.getCacheId(userId, playlistValue, playlistType);

            const expiryTime = new Date();
            expiryTime.setHours(expiryTime.getHours() + this.EXPIRY_HOURS);
            const plainPlaylistData = JSON.parse(JSON.stringify(playlistData));
            await firestore
                .collection('users')
                .doc(userId)
                .collection(this.COLLECTION_NAME)
                .doc(cacheId)
                .set({
                    playlistValue,
                    playlistData: plainPlaylistData,
                    createdAt: Timestamp.now(),
                    expiryTime: Timestamp.fromDate(expiryTime)
                });

            return null;
        } catch (error) {
            throw new Error(`Error saving to cache: ${error.message}`);
        }
    }
}

export default new PlaylistCacheService();