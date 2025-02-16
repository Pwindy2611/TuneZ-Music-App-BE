import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import FetchBase from "../utils/base/FetchBase.js";

export const getMusicByArtist: IMusicBaseService["getMusicByArtist"] = async (artist) => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("artist").equalTo(artist).get();

        if (!snapshot.exists()) {
            return null
        }
        
        const musicData = snapshot.val()
        const musicIds = Object.keys(musicData);

        return await FetchBase.fetchMusicDetails(musicIds);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving music by artist: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by artist.");
    }
};