import {createOfficialArtist} from "./OfficialArtistBaseService.CreateOfficialArtist.js"
import {updateOfficialArtist} from "./OfficialArtistBaseService.UpdateOfficialArtist.js"
import {deleteOfficialArtist} from "./OfficialArtistBaseService.DeleteOfficialArtist.js"
import {getOfficialArtistById} from "./OfficialArtistBaseService.GetOfficialArtistById.js"
import {getOfficialArtistInfo} from "./OfficialArtistBaseService.GetOfficialArtistInfo.js"

export const OfficialArtistBaseService = {
    createOfficialArtist,
    updateOfficialArtist,
    deleteOfficialArtist,
    getOfficialArtistById,
    getOfficialArtistInfo
}