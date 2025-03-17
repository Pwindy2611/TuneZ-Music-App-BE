import {IPlaylistGenerateRepository} from "../interface/repository/IPlaylistGenerateRepository.js";
import {auth, database, firestore} from "../config/firebase/FireBaseConfig.js";
import {Timestamp} from "firebase-admin/firestore";

export class PlaylistGenerateRepository implements IPlaylistGenerateRepository{
    async getIdsArtistFollowed(userId: string): Promise<string[]> {
        const followingRef = firestore.collection('users').doc(userId).collection('following');
        const followingSnapshot = await followingRef.where('followType', '==', 'officialArtist').get();

        return followingSnapshot.docs.map(doc => doc.data().followingId);
    }

    async getArtistName(artistId: string): Promise<string> {
        const artistRef = database.ref(`/officialArtists/${artistId}`);
        const snapshot = await artistRef.once('value');

        if (!snapshot.exists()) return Promise.reject('Artist not found');

        return snapshot.val().name;
    }
    async getGenresFromArtist(artistId: string): Promise<string> {
        const artistRef = database.ref(`/officialArtists/${artistId}`);
        const snapshot = await artistRef.once('value');

        if (!snapshot.exists()) return Promise.reject('Artist not found');

        return snapshot.val().profile.genres;
    }

    async isUserExists(userId: string): Promise<boolean> {
        if(!await auth.getUser(userId)) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    async getThrowBackMusicIds(userId: string, historyLimit: number): Promise<string[]> {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - 6);
        const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

        const historySnapshot = await firestore
            .collection(`history`)
            .doc(userId)
            .collection('data')
            .where('listenAt', '<', cutoffTimestamp)
            .orderBy('listenAt', 'desc')
            .limit(historyLimit)
            .get();

        return historySnapshot.docs.map(doc => doc.data().musicId);
    }



}

export const generateRepo = new PlaylistGenerateRepository();