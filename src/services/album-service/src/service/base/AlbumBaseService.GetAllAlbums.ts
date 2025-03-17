import {IAlbumBaseService} from "../../interface/service/IAlbumBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";
import {IAlbum} from "../../interface/object/IAlbum.js";

export const getAllAlbums: IAlbumBaseService['getAllAlbums'] = async () => {
    try {
        const snapshot = await database.ref('albums').get();
        if (!snapshot.exists()) {
            return [];
        }
        
        const albums: IAlbum[] = [];
        snapshot.forEach((childSnapshot) => {
            albums.push(childSnapshot.val() as IAlbum);
        });
        
        return albums;
    } catch (error) {
        throw error;
    }
} 