import {IOfficialArtist} from "../object/IOfficialArtist.js";

export interface IOfficialArtistUserService {
    getAllOfficialArtists(userId: string) : Promise<IOfficialArtist[]>
}