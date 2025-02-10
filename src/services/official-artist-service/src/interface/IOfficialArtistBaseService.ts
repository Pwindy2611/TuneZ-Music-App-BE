import {IOfficialArtist} from "./IOfficialArtist.js";

export interface IOfficialArtistBaseService {
    createOfficialArtist(artist: IOfficialArtist) : Promise<string | null>
}