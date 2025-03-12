export class GetStreamMusicQuery {
    constructor(public userId:string, public musicId:string, public seekTime?: number) {}
}