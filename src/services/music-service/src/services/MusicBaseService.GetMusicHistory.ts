import { IMusicBaseService } from "../interface/IMusicBaseService.js";
import FetchBase from '../utils/base/FetchBase.js'

export const getMusicHistory: IMusicBaseService["getMusicHistory"] = async (userId) => {
    try {
        const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, 50);
        const uniqueMusicIds = [...new Set(musicIds)];
        const musicHistory = await FetchBase.fetchMusicDetails(uniqueMusicIds);
        
        if(!musicHistory) return null;
        
        return musicHistory;
    } catch (error) {
        console.error("Error fetching music history:", error);
        throw error;
    }
};
