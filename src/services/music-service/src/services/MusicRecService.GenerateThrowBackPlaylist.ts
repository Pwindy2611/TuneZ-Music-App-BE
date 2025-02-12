import {IMusicRecService} from "../interface/IMusicRecService.js";
import {firestore} from '../config/firebase/FireBaseConfig.js'
import { Timestamp } from 'firebase-admin/firestore';
import {fetchMusicDetails} from "../utils/base/FetchBase.js";

export const generateThrowBackPlaylist: IMusicRecService ["generateThrowBackPlaylist"] = async (userId: string, playlistLimit: number = 20, historyLimit: number = 100) => {
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

    const musicDetails = await fetchMusicDetails(sortedIds);
    return musicDetails.length > 0 ? musicDetails : null;
}