import { IAlbumBaseService } from "../../interface/service/IAlbumBaseService.js";
import { createAlbum } from "./AlbumBaseService.CreateAlbum.js";
import { getAlbumById } from "./AlbumBaseService.GetAlbum.js";
import { getAlbumsByArtistId } from "./AlbumBaseService.GetAlbumsByArtist.js";
import { getAllAlbums } from "./AlbumBaseService.GetAllAlbums.js";
import { updateAlbum } from "./AlbumBaseService.UpdateAlbum.js";
import { deleteAlbum } from "./AlbumBaseService.DeleteAlbum.js";

class AlbumBaseService implements IAlbumBaseService {
    createAlbum = createAlbum;
    getAlbumById = getAlbumById;
    getAlbumsByArtistId = getAlbumsByArtistId;
    getAllAlbums = getAllAlbums;
    updateAlbum = updateAlbum;
    deleteAlbum = deleteAlbum;
}

export const albumBaseService = new AlbumBaseService();
