import {IOfficialArtistBaseService} from "../../interface/service/IOfficialArtistBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";
import UploadBase from "../../util/base/UploadBase.js";
import {IOfficialArtist} from "../../interface/object/IOfficialArtist.js";

export const updateOfficialArtist: IOfficialArtistBaseService["updateOfficialArtist"] = async (artistId, artist, imgFile) => {
    try {
        const artistRef = database.ref(`officialArtists/${artistId}`);
        const snapshot = await artistRef.get();

        if (!snapshot.exists()) {
            throw new Error("Official artist not found");
        }

        let imgPath = snapshot.val().profile.profileImage;
        if (imgFile) {
            const uploadImgData = await UploadBase.uploadFile(imgFile, artistId);
            imgPath = await UploadBase.getSignedFileUrl(uploadImgData) ?? imgPath;
        }

        const updatedArtist: IOfficialArtist = {
            name: artist.name,
            verified: artist.verified ?? false,
            profile: {
                bio: artist.profile.bio ?? "",
                profileImage: imgPath,
                genres: artist.profile.genres ?? []
            },
            updatedAt: new Date().toISOString()
        };

        await artistRef.update(updatedArtist);
        return artistId;
    } catch (error) {
        throw error;
    }
} 