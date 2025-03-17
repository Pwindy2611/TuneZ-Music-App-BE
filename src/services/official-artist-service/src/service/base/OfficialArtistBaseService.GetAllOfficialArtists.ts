import {IOfficialArtistBaseService} from "../../interface/service/IOfficialArtistBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";
import {IOfficialArtist} from "../../interface/object/IOfficialArtist.js";

export const getAllOfficialArtists: IOfficialArtistBaseService["getAllOfficialArtists"] = async () => {
    try {
        const artistsRef = database.ref("officialArtists");
        const snapshot = await artistsRef.get();

        if (!snapshot.exists()) {
            return [];
        }

        const artists: IOfficialArtist[] = [];
        snapshot.forEach((childSnapshot) => {
            artists.push({
                ...childSnapshot.val(),
                id: childSnapshot.key
            });
        });

        return artists;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error getting all official artists: " + error.message);
        }
        throw new Error("Unknown error occurred while getting all official artists.");
    }
} 