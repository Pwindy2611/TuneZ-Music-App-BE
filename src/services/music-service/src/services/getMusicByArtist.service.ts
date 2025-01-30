import {IMusicService} from "../interface/music.service.interface.js";
import {database} from "../config/firebase/firebase_config.js";

export const getMusicByArtist: IMusicService["getMusicByArtist"] = async (artist) => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("artist").equalTo(artist).get();

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving music by artist: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by artist.");
    }
};