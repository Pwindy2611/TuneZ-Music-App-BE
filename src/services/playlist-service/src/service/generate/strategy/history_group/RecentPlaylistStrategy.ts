import {IPlaylistStrategy} from "../../../../interface/object/IPlaylistStrategy.js";
import {generateRecentPlaylist} from "../../PlaylistGenerateService.GenerateRecentPlaylist.js";

export class RecentPlaylistStrategy implements IPlaylistStrategy {
    generate(userId: string): Promise<any> {
        return generateRecentPlaylist(userId, 20, 100)
    }

}