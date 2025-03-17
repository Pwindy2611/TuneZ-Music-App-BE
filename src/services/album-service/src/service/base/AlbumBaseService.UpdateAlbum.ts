import {IAlbumBaseService} from "../../interface/service/IAlbumBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";
import {IAlbum} from "../../interface/object/IAlbum.js";
import UploadBase from "../../util/base/UploadBase.js";

export const updateAlbum: IAlbumBaseService['updateAlbum'] = async (albumId, updatedAlbum, coverImage) => {
    try {
        const albumRef = database.ref(`albums/${albumId}`);
        const snapshot = await albumRef.get();
        
        if (!snapshot.exists()) {
            throw new Error('Album not found');
        }

        let coverImagePath;
        if (coverImage) {
            const uploadImgData = await UploadBase.uploadFile(coverImage, albumId);
            coverImagePath = await UploadBase.getSignedFileUrl(uploadImgData) ?? '';
        }
        
        const albumToUpdate: IAlbum = {
            ...updatedAlbum,
            coverImage: coverImagePath ?? snapshot.val().coverImage
        };
        
        await albumRef.update(albumToUpdate);
        return albumToUpdate;
    } catch (error) {
        throw error;
    }
} 