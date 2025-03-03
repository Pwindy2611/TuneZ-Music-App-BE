import {IPlaylistCacheRepository} from "../interface/IPlaylistCacheRepository.js";
import {Timestamp} from "firebase-admin/firestore";
import {firestore} from "../config/firebase/FireBaseConfig.js";

export class PlaylistCacheRepository implements IPlaylistCacheRepository{
    async cleanExpiredCache(collectionName: string): Promise<void> {
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
                .collection(collectionName)
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
    }

    async getFromCache(userId: string, cacheId: string, collectionName: string): Promise<any> {
        return await firestore
            .collection('users')
            .doc(userId)
            .collection(collectionName)
            .doc(cacheId)
            .get()
    }

    async saveToCache(userId: string, cacheId: string, playlistData: any, collectionName: string): Promise<void> {
        await firestore
            .collection('users')
            .doc(userId)
            .collection(collectionName)
            .doc(cacheId)
            .set({
                playlistData
            });
    }
}

export const cacheRepo = new PlaylistCacheRepository();