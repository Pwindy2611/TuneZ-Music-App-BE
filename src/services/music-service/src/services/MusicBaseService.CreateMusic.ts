import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {generateId} from "../utils/helpers/AuthenticationHelper.js";
import {database, auth} from "../config/firebase/FireBaseConfig.js";
import {getSignedFileUrl, uploadFile} from "../utils/base/UploadBase.js";

export const createMusic: IMusicBaseService["createMusic"] = async (music, musicFile, imgFile) => {
    try {
        const musicId = generateId();
        const loveCount = 0;
        const playCount = 0;

        const musicRef = database.ref(`musics/${musicId}`);

        // Upload music file
        const uploadMusicData = await uploadFile(musicFile, musicId);
        const musicPath = await getSignedFileUrl(uploadMusicData?.path as string);

        // Upload image file
        const uploadImgData = await uploadFile(imgFile, musicId);
        const imgPath = await getSignedFileUrl(uploadImgData?.path as string);

        const artistRef = database.ref(`officialArtist/${music.officialArtistId}`);
        const snapshot = await artistRef.once("value");

        if (!snapshot.exists()) {
            return null; // Nếu không tồn tại artistId trong database, trả về null
        }
        
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

