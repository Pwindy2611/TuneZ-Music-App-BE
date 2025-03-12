import {IPlaylistStrategy} from "../../../interface/object/IPlaylistStrategy.js";
import {
    generateFollowedGenresPlaylist
} from "../../generate_service/PlaylistGenerateService.GenerateFollowedGenresPlaylist.js";

export class FollowedGenresPlaylistStrategy implements IPlaylistStrategy {
    generate(userId: string): Promise<any> {
        return generateFollowedGenresPlaylist(userId);
    }

}