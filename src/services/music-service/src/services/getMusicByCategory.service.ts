import {IMusicService} from "../interface/music.service.interface.js";
import {database} from "../config/firebase/firebase.config.js";

export const getMusicByCategory: IMusicService["getMusicByCategory"] = async (category) => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("category").equalTo(category).get();

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving music by category: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by category.");
    }
};