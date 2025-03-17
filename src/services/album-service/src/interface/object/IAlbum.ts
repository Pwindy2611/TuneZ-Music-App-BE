export interface IAlbum {
    id?: string;
    title: string;
    officialArtistId: string;
    type: string;
    coverImage?: string;
    musicIds?: string[];
    releaseDate?: string;
}