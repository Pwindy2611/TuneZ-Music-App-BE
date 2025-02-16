import {IMusicRecService} from "../interface/IMusicRecService.js";
import {firestore} from '../config/firebase/FireBaseConfig.js'
import { Timestamp } from 'firebase-admin/firestore';
import FetchBase from "../utils/base/FetchBase.js";
import {auth} from "../config/firebase/FireBaseConfig.js";

export const generateThrowBackPlaylist: IMusicRecService ["generateThrowBackPlaylist"] = async (userId: string, playlistLimit: number = 20, historyLimit: number = 100) => {
    try {
        if(! await auth.getUser(<string>userId)){
            return Promise.reject(new Error(("Error creating new music: User is not exist")));
        }
        
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - 6);
        const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

        const historySnapshot = await firestore
            .collection(`history`)
            .doc(userId)
            .collection('data')
            .where('listendAt', '<', cutoffTimestamp)
            .orderBy('listendAt', 'desc')
            .limit(historyLimit)
            .get();

        const musicIds = historySnapshot.docs.map(doc => doc.data().musicId);

        const frequencyMap: Record<string, number> = {};
        musicIds.forEach(id => {
            frequencyMap[id] = (frequencyMap[id] || 0) + 1;
        });

        const sortedIds = Object.entries(frequencyMap)
            .sort((a, b) => b[1] - a[1])
            .map(([id]) => id)
            .slice(0, playlistLimit);

        const musicDetails = await FetchBase.fetchMusicDetails(sortedIds);
        return musicDetails.length > 0 ? musicDetails : null;
    }catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error generating user playlist: " + error.message);
        }
        throw new Error("Unknown error occurred while generating throw back playlist.");
    }
}