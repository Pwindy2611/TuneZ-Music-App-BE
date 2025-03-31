import {IAlbumBaseService} from "../../interface/service/IAlbumBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";
import {IAlbum} from "../../interface/object/IAlbum.js";
import UploadBase from "../../util/base/UploadBase.js";
import { UpdateAlbumDto } from "../../dto/request/UpdateAlbumDto.js";

export const updateAlbum: IAlbumBaseService['updateAlbum'] = async (albumId, updatedAlbum, coverImage) => {
    try {
        const albumRef = database.ref(`albums/${albumId}`);
        const snapshot = await albumRef.get();
        
        if (!snapshot.exists()) {
            throw new Error('Album not found');
        }

        const currentAlbum = snapshot.val() as IAlbum;
        let coverImagePath = currentAlbum.coverImage;

        if (coverImage) {
            const uploadImgData = await UploadBase.uploadFile(coverImage, albumId);
            coverImagePath = await UploadBase.getSignedFileUrl(uploadImgData) ?? currentAlbum.coverImage;
        }
        
        const albumToUpdate: Partial<IAlbum> = {
            ...(updatedAlbum.title && { title: updatedAlbum.title }),
            ...(updatedAlbum.officialArtistId && { officialArtistId: updatedAlbum.officialArtistId }),
            ...(updatedAlbum.type && { type: updatedAlbum.type }),
            ...(updatedAlbum.musicIds && { musicIds: updatedAlbum.musicIds }),
            ...(updatedAlbum.releaseDate && { releaseDate: updatedAlbum.releaseDate }),
            ...(coverImagePath && { coverImage: coverImagePath })
        };
        
        await albumRef.update(albumToUpdate);
        return { ...currentAlbum, ...albumToUpdate };
    } catch (error) {
        throw error;
    }
} 