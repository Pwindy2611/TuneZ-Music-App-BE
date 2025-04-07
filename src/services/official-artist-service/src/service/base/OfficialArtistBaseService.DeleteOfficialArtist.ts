import {IOfficialArtistBaseService} from "../../interface/service/IOfficialArtistBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";

export const deleteOfficialArtist: IOfficialArtistBaseService["deleteOfficialArtist"] = async (artistId) => {
    try {
        const artistRef = database.ref(`officialArtists/${artistId}`);
        const snapshot = await artistRef.get();

        if (!snapshot.exists()) {
            throw new Error("Official artist not found");
        }

        await artistRef.remove();
        return artistId;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error deleting official artist: " + error.message);
        }
        throw new Error("Unknown error occurred while deleting official artist.");
    }
} 