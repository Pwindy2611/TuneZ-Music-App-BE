export interface ISearchBaseService {
    searchMusic(query: string): Promise<any>;
    searchArtist(query: string): Promise<any>;
    searchAlbum(query: string): Promise<any>;
    searchPlaylist(query: string): Promise<any>;
}