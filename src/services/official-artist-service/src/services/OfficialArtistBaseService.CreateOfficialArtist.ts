import {IOfficialArtistBaseService} from "../interface/IOfficialArtistBaseService.js";
import {generateId} from "../utils/helpers/AuthenticationHelper.js";
import {database} from "../config/firebase/FireBaseConfig.js"
export const createOfficialArtist: IOfficialArtistBaseService["createOfficialArtist"] = async (artist) => {
    try{
        artist.offAristId = generateId();
        artist.createdAt = new Date().toISOString();
        artist.updatedAt = new Date().toISOString();
        
        const artistRef = database.ref(`officialArtist/${artist.offAristId}`)
        
        await artistRef.set(artist);
        
        return artist.offAristId;
    }catch (error){
        if (error instanceof Error) {
            throw new Error("Error creating new official artist: " + error.message);
        }
        throw new Error("Unknown error occurred while creating new official artist.");
    }
}