import {IOfficialArtistBaseService} from "../interface/IOfficialArtistBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {IOfficialArtist} from "../interface/IOfficialArtist.js";

export const getAllOfficialArtist: IOfficialArtistBaseService["getAllOfficialArtists"] = async () => {
    try {
        const officialRef = database.ref('officialArtist');
        const snapshot = await officialRef.once('value');

        if (!snapshot.exists()) {
            return [];
        }
        return snapshot.val() as IOfficialArtist[];
    }catch (error) {
        throw new Error(`Failed to get all official artists ${error.message}`);
    }
}