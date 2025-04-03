export interface IMusicBaseRepository {
    createMusic(musicData: any): Promise<string>;
    getAllMusic(): Promise<any>;
    getMusicByArtist(artist: string): Promise<any>;
    getMusicByGenres(genre: string): Promise<any>;
    getMusicById(musicId: string): Promise<any>;
    isOfficialArtistExist(artistId: string): Promise<boolean>;
    incrementLoveCount(musicId: string): Promise<void>;
    updateMusic(musicId: string, updateData: any): Promise<any>;
    deleteMusic(musicId: string): Promise<void>;

    // Genres methods
    createGenre(name: string, description?: string): Promise<string>;
    getAllGenres(): Promise<any[]>;
    getGenreById(genreId: string): Promise<any>;
    updateGenre(genreId: string, updateData: any): Promise<any>;
    deleteGenre(genreId: string): Promise<void>;
    isGenreExist(genreId: string): Promise<boolean>;
}