export interface IUserPlaylist{
    title: string;
    description?: string;
    coverImage?: string;
    musicIds?: {id: string}[];
    createdAt?: string;
    updatedAt?: string;
 }