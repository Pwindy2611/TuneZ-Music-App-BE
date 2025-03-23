export interface IMusicBaseRepository {
    createMusic(musicData: any): Promise<string>;
    getAllMusic(): Promise<any>;
    getMusicByArtist(artist: string): Promise<any>;
    getMusicByGenres(genre: string): Promise<any>;
    getMusicById(musicId: string): Promise<any>;
    isOfficialArtistExist(artistId: string): Promise<boolean>;
    incrementLoveCount(musicId: string): Promise<void>

}