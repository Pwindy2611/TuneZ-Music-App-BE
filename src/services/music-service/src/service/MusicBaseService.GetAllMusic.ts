import { database } from "../config/firebase/FireBaseConfig.js";
import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import FetchBase from "../util/base/FetchBase.js";


export const getAllMusic: IMusicBaseService["getAllMusic"] = async () => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.get();

        if (!snapshot.exists()) {
            return snapshot.val();
        }

        const musicData = snapshot.val()
        const musicIds = Object.keys(musicData);

        const musicDetails = await FetchBase.fetchMusicDetails(musicIds);
        return musicDetails.length > 0 ? musicDetails : null;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving all music: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving all music.");
    }
};