import FetchBase from '../utils/base/FetchBase.js'
import {IMusicBaseService} from "../interface/IMusicBaseService.js";

export const getMusicLove: IMusicBaseService["getMusicLove"] = async (userId) => {
    try {
        const musicIds = await FetchBase.fetchMusicIdsFromLove(userId, 50);
        const uniqueMusicIds = [...new Set(musicIds)];
        const musicLove = await FetchBase.fetchMusicDetails(uniqueMusicIds);

        if(!musicLove) return null;

        return musicLove;
    } catch (error) {
        console.error("Error fetching music history:", error);
        throw error;
    }
};