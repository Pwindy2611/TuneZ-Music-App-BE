import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {generateId} from "../utils/helpers/AuthenticationHelper.js";
import {database, auth} from "../config/firebase/FireBaseConfig.js";
import {getSignedFileUrl, uploadFile} from "../utils/base/UploadBase.js";

export const createMusic: IMusicBaseService["createMusic"] = async (music, musicFile) => {
    try {
        const musicId = generateId();
        const loveCount = 0;
        const playCount = 0;
        
        const musicRef = database.ref(`musics/${musicId}`);
        
        // Upload file
        const uploadFileData = await uploadFile(musicFile, musicId);
        const musicPath = await getSignedFileUrl(uploadFileData?.path as string);
        
        if(!(await auth.getUser(<string>music.officialArtistId))){
            return null;
        }
        // Lưu thông tin vào database
        await musicRef.set({
            musicId,
            ...music,
            loveCount,
            playCount,
            musicPath,
        });

        return musicId;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error creating new music: " + error.message);
        }
        throw new Error("Unknown error occurred while creating new music.");
    }
};
