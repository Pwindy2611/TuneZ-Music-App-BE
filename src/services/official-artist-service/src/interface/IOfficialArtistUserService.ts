import {IOfficialArtist} from "./IOfficialArtist.js";

export interface IOfficialArtistUserService {
    getAllOfficialArtists(userId: string) : Promise<IOfficialArtist[]>
}