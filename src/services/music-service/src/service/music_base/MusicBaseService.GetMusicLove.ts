import FetchBase from '../../util/base/FetchBase.js'
import {IMusicBaseService} from "../../interface/IMusicBaseService.js";

export const getMusicLove: IMusicBaseService["getMusicLove"] = async (userId) => {
    try {
        const musicIds = await FetchBase.fetchMusicIdsFromLove(userId, 50);
        const uniqueMusicIds = [...new Set(musicIds)];

        const musicDetails = await FetchBase.fetchMusicDetails(uniqueMusicIds);
        return musicDetails.length > 0 ? musicDetails : null;

    } catch (error) {
        console.error("Error fetching music history:", error);
        throw error;
    }
};