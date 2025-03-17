import { IAlbum } from "../object/IAlbum.js";
import {IFile} from "../object/IFile.js";

export interface IAlbumBaseService{
    createAlbum(album: IAlbum, coverImage: IFile): Promise<void>;
    getAlbumById(albumId: string): Promise<IAlbum>;
    getAlbumsByArtistId(artistId: string): Promise<IAlbum[]>;
    getAllAlbums(): Promise<IAlbum[]>;
    updateAlbum(albumId: string, updatedAlbum: IAlbum, coverImage?: IFile): Promise<IAlbum>;
    deleteAlbum(albumId: string): Promise<void>;
}