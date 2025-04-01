import {IAlbumBaseService} from "../../interface/service/IAlbumBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";
import {IAlbum} from "../../interface/object/IAlbum.js";

export const getAlbumById: IAlbumBaseService['getAlbumById'] = async (albumId) => {
    try {
        const snapshot = await database.ref(`albums/${albumId}`).get();
        if (!snapshot.exists()) {
            throw new Error('Album not found');
        }
        return snapshot.val() as IAlbum;
    } catch (error) {
        throw error;
    }
}