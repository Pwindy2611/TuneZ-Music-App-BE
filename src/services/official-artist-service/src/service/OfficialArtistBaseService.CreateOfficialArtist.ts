import {IOfficialArtistBaseService} from "../interface/service/IOfficialArtistBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js"
import UploadBase from "../util/base/UploadBase.js";
import {IOfficialArtist} from "../interface/object/IOfficialArtist.js";
export const createOfficialArtist: IOfficialArtistBaseService["createOfficialArtist"] = async (artist, imgFile) => {
    try {
        const artistRef = database.ref("officialArtists").push();
        const artistId = artistRef.key as string;

        let imgPath = "";
        if (imgFile) {
            const uploadImgData = await UploadBase.uploadFile(imgFile, artistId);
            imgPath = await UploadBase.getSignedFileUrl(uploadImgData) ?? "";
        }

        const newArtist: IOfficialArtist = {
            name: artist.name,
            verified: artist.verified ?? false,
            profile: {
                bio: artist.profile.bio ?? "",
                profileImage: imgPath, // Ảnh sau khi upload
                genres: artist.profile.genres ?? []
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };


        await artistRef.set(newArtist);

        return artistId;
    }catch (error){
        if (error instanceof Error) {
            throw new Error("Error creating new official artist: " + error.message);
        }
        throw new Error("Unknown error occurred while creating new official artist.");
    }
}