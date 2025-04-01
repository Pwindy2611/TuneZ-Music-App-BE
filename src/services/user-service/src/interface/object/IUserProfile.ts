export interface IUserProfile {
    id: string;
    name: string;
    email: string;
    profilePicture: string | undefined;
    followerCount: number;
    followingCount: number;
    playlists?: {
        title: string;
        coverImg: string;
        musicCount: number;
    }[];
}