export interface OfficialArtistInfo {
    id: string;
    name: string;
    profileImageUrl?: string;
    bio?: string;
    genres?: string[];
    followersCount?: number;
    albumCount?: number;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
        [key: string]: string | undefined;
    };
    topSongs?: Array<{
        songId: string;
        title: string;
        duration: number;
        coverImageUrl?: string;
    }>;
    albums?: Array<{
        albumId: string;
        title: string;
        releaseDate?: string;
        coverImageUrl?: string;
    }>;
}
