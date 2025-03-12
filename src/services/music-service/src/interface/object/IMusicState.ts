export interface IMusicState{
    currentMusicId: string | null;
    timestamp: number;
    lastUpdated: number; // Timestamp thực
    isPlaying: boolean
}