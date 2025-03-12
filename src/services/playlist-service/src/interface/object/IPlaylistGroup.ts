export interface PlaylistGroup {
    generatePlaylist(userId: string): Promise<any>;
}
