import { IMusicBaseService } from "../../interface/IMusicBaseService.js";
import FetchBase from '../../util/base/FetchBase.js'

export const getMusicHistory: IMusicBaseService["getMusicHistory"] = async (userId) => {
    try {
        const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, 50);
        const uniqueMusicIds = [...new Set(musicIds)];

        const musicDetails = await FetchBase.fetchMusicDetails(uniqueMusicIds);
        return musicDetails.length > 0 ? musicDetails : null;
    } catch (error) {
        console.error("Error fetching music history:", error);
        throw error;
    }
};
