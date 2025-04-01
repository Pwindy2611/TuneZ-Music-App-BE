export interface IPlaylistStrategy {
    generate(userId: string): Promise<any>;
}
