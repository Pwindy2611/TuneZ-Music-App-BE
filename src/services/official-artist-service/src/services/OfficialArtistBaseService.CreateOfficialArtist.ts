import {IOfficialArtistBaseService} from "../interface/IOfficialArtistBaseService.js";
import {generateId} from "../utils/helpers/AuthenticationHelper.js";
import {database} from "../config/firebase/FireBaseConfig.js"
import UploadBase from "../utils/base/UploadBase.js";
export const createOfficialArtist: IOfficialArtistBaseService["createOfficialArtist"] = async (artist, imgFile) => {
    try{
        
        artist._id = generateId();
        
        const uploadImgData = await UploadBase.uploadFile(imgFile, artist._id);
        const imgPath = await UploadBase.getSignedFileUrl(uploadImgData);

        artist.profile.profileImage = imgPath ?? "";
        artist.createdAt = new Date().toISOString();
        artist.updatedAt = new Date().toISOString();

        
        
        const artistRef = database.ref(`officialArtist/${artist._id}`)
        
        await artistRef.set(artist);
        
        return artist._id;
    }catch (error){
        if (error instanceof Error) {
            throw new Error("Error creating new official artist: " + error.message);
        }
        throw new Error("Unknown error occurred while creating new official artist.");
    }
}