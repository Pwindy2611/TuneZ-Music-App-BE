import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {generateId} from "../util/helpers/AuthenticationHelper.js";
import {database, auth} from "../config/firebase/FireBaseConfig.js";
import UploadBase from "../util/base/UploadBase.js";

export const uploadMusicByUser: IMusicBaseService["uploadMusicByUser"] = async (music, musicFile, imgFile) => {
    try {
        const musicId = generateId();
        const loveCount = 0;
        const playCount = 0;

        const musicRef = database.ref(`musics/${musicId}`);
        
        if(! await auth.getUser(<string>music.userId)){
            return Promise.reject(new Error(("Error creating new music: User is not exist")));
        }

        const [musicPath, imgPath] = await Promise.all([
            UploadBase.uploadAndGetUrl(musicFile, musicId),
            UploadBase.uploadAndGetUrl(imgFile, musicId)
        ]);

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
            throw new Error("Error uploading user music: " + error.message);
        }
        throw new Error("Unknown error occurred while uploading user music.");
    }
};
