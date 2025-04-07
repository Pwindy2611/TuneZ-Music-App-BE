import {IPlaylistStrategy} from "../../../../interface/object/IPlaylistStrategy.js";
import {generateUserPlaylist} from "../../PlaylistGenerateService.GenerateUserPlaylist.js";

export class UserPreferencePlaylistStrategy implements IPlaylistStrategy {
    generate(userId: string): Promise<any> {
        return generateUserPlaylist(userId);
    }

}