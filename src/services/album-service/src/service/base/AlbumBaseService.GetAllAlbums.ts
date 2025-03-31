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
            const album = childSnapshot.val() as IAlbum;
            album.id = childSnapshot.key;
            albums.push(album);
        });
        
        return albums;
    } catch (error) {
        throw error;
    }
} 