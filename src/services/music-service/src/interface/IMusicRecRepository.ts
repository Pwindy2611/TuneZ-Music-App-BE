export interface IMusicRecRepository {
    generateUserPlaylist(userId: string): Promise<any>;
    generateRecentPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<any>;
    generateThrowBackPlaylist(userId: string, playlistLimit: number, historyLimit: number): Promise<any>;
    generateFollowedArtistsPlaylist(userId: string, playlistLimit: number): Promise<any>;
    isUserExist(userId: string): Promise<boolean>;
}
