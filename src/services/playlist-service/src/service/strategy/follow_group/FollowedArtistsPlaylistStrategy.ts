import {IPlaylistStrategy} from "../../../interface/object/IPlaylistStrategy.js";
import {
    generateFollowedArtistsPlaylist
} from "../../generate_service/PlaylistGenerateService.GenerateFollowedArtistsPlaylist.js";

export class FollowedArtistsPlaylistStrategy implements IPlaylistStrategy{
    generate(userId: string): Promise<any> {
        return generateFollowedArtistsPlaylist(userId)
    }
}