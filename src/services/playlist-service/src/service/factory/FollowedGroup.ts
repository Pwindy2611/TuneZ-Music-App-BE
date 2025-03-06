import {IPlaylistStrategy} from "../../interface/IPlaylistStrategy.js";
import {FollowedArtistsPlaylistStrategy} from "../strategy/follow_group/FollowedArtistsPlaylistStrategy.js";

export class FollowedGroup {
    private strategies: IPlaylistStrategy[];

    constructor() {
        this.strategies = [
            new FollowedArtistsPlaylistStrategy(),
            new FollowedArtistsPlaylistStrategy(),
        ];
    }

    async generatePlaylist(userId: string): Promise<any> {
        const playlistPromises = this.strategies.map(strategy => strategy.generate(userId));

        const playlists = await Promise.all(playlistPromises);

        return playlists.filter(playlist => playlist !== null && playlist !== undefined);
    }
}