import {IOfficialArtist} from "./IOfficialArtist.js";
import {IFile} from "./IFile.js";

export interface IOfficialArtistBaseService {
    createOfficialArtist(artist: IOfficialArtist, imgFile: IFile) : Promise<string | null>
    updateOfficialArtist(artistId: string, artist: IOfficialArtist, imgFile?: IFile) : Promise<string | null>
    deleteOfficialArtist(artistId: string) : Promise<string | null>
    getAllOfficialArtists() : Promise<IOfficialArtist[]>
    getOfficialArtistById(artistId: string) : Promise<IOfficialArtist | null>
}