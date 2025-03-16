import {IPlaylistStrategy} from "../../../interface/object/IPlaylistStrategy.js";
import {UniquePlaylistStrategy} from "../strategy/history_group/UniquePlaylistStrategy.js";

export class HistoryGroup {
    private strategies: IPlaylistStrategy[];

    constructor() {
        this.strategies = [
            new UniquePlaylistStrategy()
        ];
    }

    async generatePlaylist(userId: string): Promise<any> {
        const playlistPromises = this.strategies.map(strategy => strategy.generate(userId));

        const playlists = await Promise.all(playlistPromises);

        return playlists.filter(playlist => playlist !== null && playlist !== undefined);
    }
}