import {IAlbumBaseService} from "../../interface/service/IAlbumBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";

export const deleteAlbum: IAlbumBaseService['deleteAlbum'] = async (albumId) => {
    try {
        const albumRef = database.ref(`albums/${albumId}`);
        const snapshot = await albumRef.get();
        
        if (!snapshot.exists()) {

            throw new Error('Album not found');
        }
        
        await albumRef.remove();
    } catch (error) {
        throw error;
    }
} 
