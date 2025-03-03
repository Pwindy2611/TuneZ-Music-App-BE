export interface IMusicBaseRepository {
    createMusic(musicData: any): Promise<string>;
    getAllMusic(): Promise<any>;
    getMusicByArtist(artist: string): Promise<any>;
    getMusicByCategory(category: string): Promise<any>;
    getMusicHistory(userId: string): Promise<any>;
    getMusicLove(userId: string): Promise<any>;
    isOfficialArtistExist(artistId: string): Promise<boolean>;
    isUserExist(userId: string): Promise<boolean>;
}