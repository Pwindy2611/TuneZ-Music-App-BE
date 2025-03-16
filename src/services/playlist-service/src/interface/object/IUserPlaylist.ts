export interface IUserPlaylist{
    id?: string;
    title: string;
    description?: string;
    coverImage?: string;
    musicIds?: {id: string}[];
    createdAt?: string;
    updatedAt?: string;
 }