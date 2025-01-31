import {IMusicService} from "../interface/IMusicBaseService.js";
import {generateId} from "../utils/helpers/AuthenticationHelper.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {getSignedFileUrl, uploadFile} from "../utils/base/UploadBase.js";

export const createMusic: IMusicService["createMusic"] = async (music, musicFile) => {
    try {
        const musicId = generateId();
        const musicRef = database.ref(`musics/${musicId}`);
        const loveCount = 0;
        const playCount = 0;

        // Upload file
        const uploadFileData = await uploadFile(musicFile, musicId);
        const music_path = await getSignedFileUrl(uploadFileData?.path as string);

        // Lưu thông tin vào database
        await musicRef.set({
            musicId,
            ...music,
            loveCount,
            playCount,
            music_path,
        });

        return musicId;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error creating new music: " + error.message);
        }
        throw new Error("Unknown error occurred while creating new music.");
    }
};
