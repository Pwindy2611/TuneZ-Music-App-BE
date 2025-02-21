import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import FetchBase from "../util/base/FetchBase.js";

export const getMusicByArtist: IMusicBaseService["getMusicByArtist"] = async (artist) => {
    try {
        const musicRef = database.ref("musics");

        const snapshot = await musicRef.orderByChild("artist").equalTo(artist).get();

        if (!snapshot.exists()) {
            return null
        }

        let musicIds: string[] = [];

        snapshot.forEach(child => {
            if (child.val().songType?.toString() === "official") {
                musicIds.push(child.val().musicId?.toString());
            }
        });

        const musicDetails = await FetchBase.fetchMusicDetails(musicIds);
        return musicDetails.length > 0 ? musicDetails : null;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving music by artist: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by artist.");
    }
};