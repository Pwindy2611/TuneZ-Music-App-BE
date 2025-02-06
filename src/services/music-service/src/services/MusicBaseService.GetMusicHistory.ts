import { IMusicBaseService } from "../interface/IMusicBaseService.js";
import { fetchHistoryBase } from '../utils/base/HistoryBase.js'

export const getMusicHistory: IMusicBaseService["getMusicHistory"] = async (userId) => {
    try {
        const musicHistory = await fetchHistoryBase(userId, 50);
        
        if(!musicHistory) return null;
        
        return musicHistory;
    } catch (error) {
        console.error("Error fetching music history:", error);
        throw error;
    }
};
