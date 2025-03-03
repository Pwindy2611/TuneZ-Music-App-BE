export class GenerateThrowBackPlaylistQuery {
    constructor(public userId: string,
                public playlistLimit: number,
                public historyLimit: number,) {}
}