import { IMusicBaseService } from "../interface/IMusicBaseService.js";
import { fetchMusicDetails, fetchMusicIdsFromHistory } from '../utils/base/FetchBase.js'

export const getMusicHistory: IMusicBaseService["getMusicHistory"] = async (userId) => {
    try {
        const musicIds = await fetchMusicIdsFromHistory(userId, 50);
        const uniqueMusicIds = [...new Set(musicIds)];
        const musicHistory = await fetchMusicDetails(uniqueMusicIds);
        
        if(!musicHistory) return null;
        
        return musicHistory;
    } catch (error) {
        console.error("Error fetching music history:", error);
        throw error;
    }
};
