import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {generateId} from "../utils/helpers/AuthenticationHelper.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import UploadBase from "../utils/base/UploadBase.js";

export const createMusic: IMusicBaseService["createMusic"] = async (music, musicFile, imgFile) => {
    try {
        const musicId = generateId();
        const loveCount = 0;
        const playCount = 0;

        const musicRef = database.ref(`musics/${musicId}`);

        const artistRef = database.ref(`officialArtist/${music.officialArtistId}`);
        const snapshot = await artistRef.once("value");

        if (!snapshot.exists()) {
            return Promise.reject(new Error(("Error creating new music: Official Artist is not exist")));
        }

        // Upload music file
        const uploadMusicData = await UploadBase.uploadFile(musicFile, musicId);
        const musicPath = await UploadBase.getSignedFileUrl(uploadMusicData);

        // Upload image file
        const uploadImgData = await UploadBase.uploadFile(imgFile, musicId);
        const imgPath = await UploadBase.getSignedFileUrl(uploadImgData);
        
        // Lưu thông tin vào database
        await musicRef.set({
            musicId,
            ...music,
            loveCount,
            playCount,
            musicPath,
            imgPath,
        });

        return musicId;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error creating new music: " + error.message);
        }
        throw new Error("Unknown error occurred while creating new music.");
    }
};

