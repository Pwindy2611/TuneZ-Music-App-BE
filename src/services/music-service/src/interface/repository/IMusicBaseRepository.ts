export interface IMusicBaseRepository {
    createMusic(musicData: any): Promise<string>;
    getAllMusic(): Promise<any>;
    getMusicByArtist(artist: string): Promise<any>;
    getMusicByGenres(genre: string): Promise<any>;
    getMusicUrlById(musicId: string): Promise<string>;
    getMusicDurationById(musicId: string): Promise<number>;
    isOfficialArtistExist(artistId: string): Promise<boolean>;
    incrementLoveCount(musicId: string): Promise<void>

}