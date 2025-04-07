export interface IOfficialArtist {
    name: string;
    verified: boolean;
    profile: {
        bio: string;
        profileImage?: string;
        genres: string[];
    }
    social? : {
        twitter: string;
        facebook: string;
        instagram: string;
    }
    createdAt?: string;
    updatedAt?: string;
}