export interface StreamStateInfo {
    currentMusicId: string;
    userId: string;
    currentTime: number;
    isPlaying: boolean;
}

export interface IStreamState {
    play(): Promise<void>;
    pause(): Promise<void>;
    stop(): Promise<void>;
    getState(): StreamStateInfo;
} 