import {IOfficialArtistBaseService} from "../interface/service/IOfficialArtistBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";

export const getOfficialArtistById: IOfficialArtistBaseService['getOfficialArtistById'] = async (id) => {
    try {
        const artistRef = await database.ref(`officialArtists/${id}`).get();

        if (!artistRef.exists()) {
            return null;
        }

        return artistRef.val();
    }catch (e) {
        throw new Error(e.message);
    }
}