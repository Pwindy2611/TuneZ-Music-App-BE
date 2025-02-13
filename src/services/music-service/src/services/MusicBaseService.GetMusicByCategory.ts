import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {fetchMusicDetails} from "../utils/base/FetchBase.js";

export const getMusicByCategory: IMusicBaseService["getMusicByCategory"] = async (category) => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("category").equalTo(category).get();

        if (!snapshot.exists()) {
            return snapshot.val();
        }

        const musicData = snapshot.val()
        const musicIds = Object.keys(musicData);

        return await fetchMusicDetails(musicIds);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving music by category: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by category.");
    }
};