export class GenerateRecentPlaylistQuery{
    constructor(public userId: string,
                public playlistLimit: number,
                public historyLimit: number,) {}
}