import {IPlaylistStrategy} from "../../interface/object/IPlaylistStrategy.js";
import {FollowedArtistsPlaylistStrategy} from "../strategy/follow_group/FollowedArtistsPlaylistStrategy.js";
import {FollowedGenresPlaylistStrategy} from "../strategy/follow_group/FollowedGenresPlaylistStrategy.js";

export class FollowedGroup {
    private strategies: IPlaylistStrategy[];

    constructor() {
        this.strategies = [
            new FollowedArtistsPlaylistStrategy(),
            new FollowedGenresPlaylistStrategy(),
        ];
    }

    async generatePlaylist(userId: string): Promise<any> {
        const playlistPromises = this.strategies.map(strategy => strategy.generate(userId));

        const playlists = await Promise.all(playlistPromises);

        return playlists.filter(playlist => playlist !== null && playlist !== undefined);
    }
}