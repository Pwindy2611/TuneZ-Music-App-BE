import {IPlaylistStrategy} from "../../interface/IPlaylistStrategy.js";
import {RecentPlaylistStrategy} from "../strategy/history_group/RecentPlaylistStrategy.js";
import {ThrowBackPlaylistStrategy} from "../strategy/history_group/ThrowBackPlaylistStrategy.js";

export class HistoryGroup {
    private strategies: IPlaylistStrategy[];

    constructor() {
        this.strategies = [
            new RecentPlaylistStrategy(),
            new ThrowBackPlaylistStrategy()
        ];
    }

    async generatePlaylist(userId: string): Promise<any> {
        const playlistPromises = this.strategies.map(strategy => strategy.generate(userId));

        const playlists = await Promise.all(playlistPromises);

        return playlists.filter(playlist => playlist !== null && playlist !== undefined);
    }
}