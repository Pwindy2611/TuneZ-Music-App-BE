import {IAlbumBaseService} from "../../interface/service/IAlbumBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";
import UploadBase from "../../util/base/UploadBase.js";
import {IAlbum} from "../../interface/object/IAlbum.js";

export const createAlbum: IAlbumBaseService['createAlbum'] = async (album, coverImage) => {
    try {
        const albumRef = database.ref('albums').push();
        const albumId = albumRef.key as string;

        let coverImagePath = '';

        if (coverImage) {
            const uploadImgData = await UploadBase.uploadFile(coverImage, albumId);
            coverImagePath = await UploadBase.getSignedFileUrl(uploadImgData) ?? '';
        }

        const newAlbum: IAlbum = {
            title: album.title,
            officialArtistId: album.officialArtistId,
            type: album.type,
            coverImage: coverImagePath,
            releaseDate: new Date().toISOString(),
        }

        await albumRef.set(newAlbum);
    } catch (error) {
        throw error;
    }
}