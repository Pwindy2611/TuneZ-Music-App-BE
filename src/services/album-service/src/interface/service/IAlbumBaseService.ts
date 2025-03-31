import { IAlbum } from "../object/IAlbum.js";
import { IFile } from "../object/IFile.js";
import { UpdateAlbumDto } from "../../dto/request/UpdateAlbumDto.js";

export interface IAlbumBaseService {
    createAlbum(album: IAlbum, coverImage: IFile): Promise<void>;
    getAlbumById(albumId: string): Promise<IAlbum>;
    getAlbumsByArtistId(artistId: string): Promise<IAlbum[]>;
    getAllAlbums(): Promise<IAlbum[]>;
    updateAlbum(albumId: string, updatedAlbum: UpdateAlbumDto, coverImage?: IFile): Promise<IAlbum>;
    deleteAlbum(albumId: string): Promise<void>;
}