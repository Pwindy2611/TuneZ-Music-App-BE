import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {generateId} from "../utils/helpers/AuthenticationHelper.js";
import {database, auth} from "../config/firebase/FireBaseConfig.js";
import {getSignedFileUrl, uploadFile} from "../utils/base/UploadBase.js";

export const uploadMusicByUser: IMusicBaseService["uploadMusicByUser"] = async (music, musicFile, imgFile) => {
    try {
        const musicId = generateId();
        const loveCount = 0;
        const playCount = 0;

        const musicRef = database.ref(`musics/${musicId}`);
        
        if(! await auth.getUser(<string>music.userId)){
            return Promise.reject(new Error(("Error creating new music: User is not exist")));
        }
        
        // Upload music file
        const uploadMusicData = await uploadFile(musicFile, musicId);
        const musicPath = await getSignedFileUrl(uploadMusicData);

        // Upload image file
        const uploadImgData = await uploadFile(imgFile, musicId);
        const imgPath = await getSignedFileUrl(uploadImgData);
        
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
            throw new Error("Error uploading user music: " + error.message);
        }
        throw new Error("Unknown error occurred while uploading user music.");
    }
};
