import {IOfficialArtist} from "./IOfficialArtist.js";
import {IFile} from "./IFile.js";

export interface IOfficialArtistBaseService {
    createOfficialArtist(artist: IOfficialArtist, imgFile: IFile) : Promise<string | null>
    getAllOfficialArtists() : Promise<IOfficialArtist[]>
}