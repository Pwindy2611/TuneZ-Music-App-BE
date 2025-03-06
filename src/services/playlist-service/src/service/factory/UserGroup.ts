import {IPlaylistStrategy} from "../../interface/IPlaylistStrategy.js";
import {UserPreferencePlaylistStrategy} from "../strategy/user_group/UserPreferencePlaylistStrategy.js";

export class UserGroup {
    private strategies: IPlaylistStrategy[];

    constructor() {
        this.strategies = [
            new UserPreferencePlaylistStrategy()
        ];
    }
    async generatePlaylist(userId: string): Promise<any> {
        const playlistPromises = this.strategies.map(strategy => strategy.generate(userId));

        const playlists = await Promise.all(playlistPromises);

        return playlists.filter(playlist => playlist !== null && playlist !== undefined);
    }
}