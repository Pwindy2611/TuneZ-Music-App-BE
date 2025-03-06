import {IPlaylistStrategy} from "../../../interface/IPlaylistStrategy.js";
import {generateUserPlaylist} from "../../generate_service/PlaylistGenerateService.GenerateUserPlaylist.js";

export class UserPreferencePlaylistStrategy implements IPlaylistStrategy {
    generate(userId: string): Promise<any> {
        return generateUserPlaylist(userId);
    }

}